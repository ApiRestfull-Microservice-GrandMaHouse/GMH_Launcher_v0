npx nx show projects

npx nx serve <nombre-del-proyecto>
npx nx show project <nombre-del-proyecto>

npx nx g @nx/nest:module --project=@gmh-launcher-v0/api-gateway --name=nombre-modulo

# Módulo

npx nx g @nx/nest:module --project=@gmh-launcher-v0/api-gateway --name=users

# Controlador

npx nx g @nx/nest:controller --project=@gmh-launcher-v0/api-gateway --name=users

# Servicio

npx nx g @nx/nest:service --project=@gmh-launcher-v0/api-gateway --name=users

# Guard

npx nx g @nx/nest:guard --project=@gmh-launcher-v0/api-gateway --name=auth

# Interceptor

npx nx g @nx/nest:interceptor --project=@gmh-launcher-v0/api-gateway --name=logging

# Middleware

npx nx g @nx/nest:middleware --project=@gmh-launcher-v0/api-gateway --name=logger

# Pipe

npx nx g @nx/nest:pipe --project=@gmh-launcher-v0/api-gateway --name=validation

# Filter (exception filter)

npx nx g @nx/nest:filter --project=@gmh-launcher-v0/api-gateway --name=http-exception
