# Use a imagem base oficial do Node.js
FROM node:20-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
# COPY . .

# Exponha a porta que o Next.js usará
EXPOSE 3000

# Comando para iniciar a aplicação Next.js
CMD ["npm", "run", "dev-db"]
