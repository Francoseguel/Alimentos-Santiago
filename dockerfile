# Usa Node oficial
FROM node:20

# Crea carpeta de trabajo
WORKDIR /app

# Copia solo package.json y package-lock.json primero para instalar deps
COPY backend/package*.json ./backend/

# Instala dependencias dentro del contenedor
WORKDIR /app/backend
RUN npm install

# Vuelve a carpeta raíz
WORKDIR /app

# Copia todo el resto del proyecto (incluye frontend, backend y data/)
COPY . .

# Expone el puerto que Render usará
EXPOSE 10000

# Comando para arrancar backend
CMD ["node", "backend/server.js"]
