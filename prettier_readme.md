# Primero lint para ver problemas

npx nx lint users-service

npx nx run-many --target=lint --all

# Luego format para corregir estilo

npx nx format:write
