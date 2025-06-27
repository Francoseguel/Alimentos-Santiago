# Usa Node oficial
FROM node:20

# Crea carpeta de trabajo
WORKDIR /app

# Copia todo el proyecto
COPY . .

# Entra a backend e instala dependencias
WORKDIR /app/backend
RUN npm install

# Expone el puerto que Render asigna (usualmente process.env.PORT)
EXPOSE 10000

# Comando para arrancar tu backend
CMD ["node", "server.js"]
