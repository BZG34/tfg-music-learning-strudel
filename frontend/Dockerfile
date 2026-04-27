# 1: Construcción (Build)
FROM node:20-slim AS build-stage

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos las librerías incluyendo Strudel
RUN npm install

# Copiamos el resto del código y generamos los archivos estáticos
COPY . .
RUN npm run build

# 2: Producción (Servidor)
# Usamos Nginx para servir los archivos, que es mucho más ligero que Node.js
FROM nginx:stable-alpine

# Copiamos los archivos construidos desde la etapa anterior a la carpeta de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]