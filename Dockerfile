# Use a imagem base oficial do Node.js
FROM node:20-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o restante do código da aplicação
ADD . .

# Copie package.json e package-lock.json
ADD package*.json ./

# Instale as dependências
RUN npm install

# Exponha a porta que o Next.js usará
EXPOSE 3000

# Comando para iniciar a aplicação Next.js
ENTRYPOINT ["npm", "run", "dev"]
