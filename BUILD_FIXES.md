# Fixes de Build — NestJS + Nx Monorepo

## Contexto

Al generar un workspace de Nx con `@nx/nest` en versiones recientes (Nx 20+), varios archivos de configuración se autogeneran con valores que funcionan en desarrollo local pero **rompen el build de producción**. Este documento explica qué se cambió, por qué falló y por qué el fix es correcto.

---

## Fix 1 — `tsconfig.app.json`: eliminar `rootDir`

### Qué se cambió

```json
// ANTES (autogenerado)
{
  "compilerOptions": {
    "rootDir": "src",
    ...
  }
}

// DESPUÉS (corregido)
{
  "compilerOptions": {
    // rootDir eliminado
    ...
  }
}
```

### Por qué falló

El generador de Nx pone `"rootDir": "src"` en el `tsconfig.app.json` de cada app. Esto le dice a TypeScript que **todos los archivos fuente deben estar dentro de `src/`**.

El problema aparece cuando la app importa código de una librería interna del monorepo (por ejemplo `@mi-app/shared`). Cuando webpack resuelve ese import, accede a `shared/dist/index.js` — que está en la raíz del workspace, **fuera** de `apps/users-service/src/`. TypeScript entonces lanza:

```
TS6059: File 'shared/dist/index.js' is not under 'rootDir' 'apps/users-service/src'
```

### Por qué el fix es correcto

Al eliminar `rootDir`, TypeScript infiere el directorio raíz automáticamente basándose en todos los archivos incluidos en la compilación, incluyendo los de `shared/dist/`. Webpack puede entonces resolver las dependencias internas sin conflicto. La restricción de `rootDir` tiene sentido para librerías publicadas, pero no para apps dentro de un monorepo que consumen otras libs internas.

---

## Fix 2 — `webpack.config.js`: `externalDependencies` como array

### Qué se cambió

```js
// ANTES (autogenerado)
new NxAppWebpackPlugin({
  target: 'node',
  compiler: 'tsc',
  main: './src/main.ts',
  tsConfig: './tsconfig.app.json',
  assets: ['./src/assets'],
  optimization: false,
  outputHashing: 'none',
  generatePackageJson: false,
  sourceMap: true,
  // Sin externalDependencies — webpack decide por su cuenta
})

// DESPUÉS (corregido)
new NxAppWebpackPlugin({
  target: 'node',
  compiler: 'tsc',
  main: './src/main.ts',
  tsConfig: './tsconfig.app.json',
  assets: ['./src/assets'],
  optimization: false,
  outputHashing: 'none',
  generatePackageJson: false,
  sourceMap: false,
  externalDependencies: [
    'kafkajs',
    'mqtt',
    'ioredis',
    'amqplib',
    'amqp-connection-manager',
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    '@nestjs/websockets',
    '@nestjs/websockets/socket-module',
  ],
})
```

### Por qué falló

`@nestjs/microservices` incluye adaptadores para **todos** los transportes disponibles: NATS, Kafka, RabbitMQ, Redis, MQTT, gRPC y WebSockets. Cada adaptador importa su paquete correspondiente (`kafkajs`, `amqplib`, etc.) pero estos paquetes son **peer dependencies opcionales** — solo se instalan si realmente los usas.

Al no especificar `externalDependencies`, webpack intentó incluir absolutamente todo en el bundle, incluyendo los adaptadores de transportes que no instalamos, y falló con:

```
Module not found: Error: Can't resolve 'kafkajs'
Module not found: Error: Can't resolve 'amqplib'
...
```

### Por qué el fix es correcto

`externalDependencies` como array le dice a webpack exactamente qué paquetes **no debe intentar bundlear** — los deja como `require()` externos. Como estos transportes nunca se usan en runtime (solo usamos NATS), dejarlos como externos es seguro: si en algún momento se intentara usar uno de ellos en producción, Node fallaría con un error claro de "módulo no encontrado" en lugar de un error silencioso de webpack en build time.

El paquete `nats` sí se instala y se bundlea normalmente porque es el transporte que sí usamos.

### Por qué `sourceMap: false`

El generador pone `sourceMap: true` por defecto. En build de producción esto causa cientos de warnings porque varios paquetes de npm (`iterare`, `nats`) referencian archivos `.ts` en sus source maps que no existen en `node_modules` (solo incluyen el `.js` compilado). Desactivar los source maps en producción elimina todos esos warnings y reduce el tamaño del bundle.

---

## Fix 3 — `shared/src/lib/shared.ts`: error en el código de ejemplo

### Qué se cambió

```ts
// ANTES (autogenerado — tiene un bug de TypeScript)
export async function shared(): Promise<{ message: string }> {
  return { message: 'shared' }; // TS2353: 'message' does not exist in type Promise<...>
}

// DESPUÉS (corregido)
export function hello(): string {
  return 'shared library ready';
}
```

### Por qué falló

El generador de `@nx/node:library` produce una función de ejemplo con `async` que retorna un objeto, pero el tipo de retorno declarado y el valor real no coinciden según las reglas estrictas del `tsconfig.base.json` (`"strict": true`). Es un bug en el código de plantilla del generador que solo aparece cuando se compila con strict mode activado.

---

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `apps/users-service/tsconfig.app.json` | Eliminado `rootDir` |
| `apps/api-gateway/tsconfig.app.json` | Eliminado `rootDir` |
| `apps/users-service/webpack.config.js` | Agregado `externalDependencies`, `sourceMap: false` |
| `apps/api-gateway/webpack.config.js` | Agregado `externalDependencies`, `sourceMap: false` |
| `shared/src/lib/shared.ts` | Reemplazado código de ejemplo con bug |

---

## Aplicar a nuevos servicios

Cada vez que generes un nuevo microservicio con `npx nx g @nx/nest:app nombre-servicio`, aplica estos dos cambios antes de buildear:

**1. `apps/nombre-servicio/tsconfig.app.json`** — eliminar la línea `"rootDir": "src"`

**2. `apps/nombre-servicio/webpack.config.js`** — agregar dentro de `NxAppWebpackPlugin`:
```js
sourceMap: false,
externalDependencies: [
  'kafkajs',
  'mqtt',
  'ioredis',
  'amqplib',
  'amqp-connection-manager',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  '@nestjs/websockets',
  '@nestjs/websockets/socket-module',
],
```
