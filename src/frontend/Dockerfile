# =========================================================
# Etapa 1: Build (Construcción) - Usando Node.js para compilar React
# =========================================================
FROM node:20-alpine AS build
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package.json .
COPY package-lock.json .

# Instala las dependencias de Node
RUN npm install

# Copia el código fuente
COPY . .

# Compila la aplicación React (crea la carpeta 'build' o 'dist')
RUN npm run build
# NOTA: Asegúrate de que tu script 'build' de package.json esté configurado correctamente.

# =========================================================
# Etapa 2: Final (Ejecución) - Usando Nginx para servir archivos estáticos
# =========================================================
FROM nginx:alpine AS final

# Copia la configuración de Nginx personalizada (opcional, pero recomendable)
# Si no tienes un archivo 'nginx.conf' personalizado, esta línea fallará, 
# pero la siguiente copia de archivos estáticos seguirá funcionando.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos compilados desde la etapa 'build'
# El directorio 'build' es el predeterminado para Create React App
COPY --from=build /app/build /usr/share/nginx/html

# Nginx expone el puerto 80 por defecto
EXPOSE 80

# El ENTRYPOINT por defecto de Nginx arranca el servidor
CMD ["nginx", "-g", "daemon off;"]