# Usa Node oficial
FROM node:20

# Crea carpeta de trabajo
WORKDIR /app

# Copia solo package.json y package-lock.json para instalar deps
COPY backend/package*.json ./backend/

# Entra a backend y corre npm install (dentro del contenedor Linux)
WORKDIR /app/backend
RUN npm install

# Volver a la raíz
WORKDIR /app

# Copia TODO el resto del proyecto (pero NO copies node_modules de Windows)
COPY . .

# Expone el puerto
EXPOSE 10000

# Arranca el servidor
CMD ["node", "backend/server.js"]
