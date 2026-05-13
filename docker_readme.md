# Levantar en background

docker compose up -d

# Ver que están corriendo

docker compose ps

# Ver logs

docker compose logs -f

# Build 
docker build -f api-gateway.Dockerfile -t api-gateway .