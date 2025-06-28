# Usa Node oficial
FROM node:20

# Crea carpeta de trabajo
WORKDIR /app

# Copia solo package.json primero para instalar deps
COPY backend/package*.json ./backend/

# Entra a backend y corre npm install (en Linux)
WORKDIR /app/backend
RUN npm install

# Copia el resto del proyecto
WORKDIR /app
COPY . .

# Expone el puerto que Render usará
EXPOSE 10000

# Arranca backend
CMD ["node", "backend/server.js"]
