# Usa Node oficial
FROM node:20

# Crea carpeta de trabajo
WORKDIR /app

# Copia solo package.json y package-lock.json primero (si tienes)
COPY backend/package*.json ./backend/

# Instala dependencias dentro del contenedor
WORKDIR /app/backend
RUN npm install

# Copia el resto del código
WORKDIR /app
COPY . .

# Expone el puerto (Render asigna process.env.PORT)
EXPOSE 10000

# Arranca el backend
CMD ["node", "backend/server.js"]
