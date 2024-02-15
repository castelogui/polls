# Use uma imagem base do Ubuntu
FROM ubuntu:latest

# Atualizar os pacotes e instalar o Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

RUN npm install -g npm@10.4.0

# Definir o diretório de trabalho como /app
WORKDIR /app

# Copiar todo o conteúdo da pasta raiz do projeto "polls" para o diretório /app dentro do contêiner
COPY ./dist ./app

# Expor a porta 3333
EXPOSE 3333

# Iniciar o aplicativo
CMD ["node", "app/http/server.js"]
