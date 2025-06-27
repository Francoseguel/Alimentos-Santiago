# Usa Node oficial
FROM node:20

# Crea carpeta de trabajo
WORKDIR /app

# Copia solo package.json primero para cache
COPY backend/package*.json ./backend/

# Instala dependencias
WORKDIR /app/backend
RUN npm install

# Copia el resto del código
WORKDIR /app
COPY . .

# Expone puerto
EXPOSE 10000

# Comando para arrancar backend
CMD ["node", "backend/server.js"]
