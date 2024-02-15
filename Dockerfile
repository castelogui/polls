# Use uma imagem base do Ubuntu
FROM ubuntu:latest

# Atualizar os pacotes e instalar o Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Instalar o gerenciador de pacotes pnpm
RUN npm install -g pnpm

# Definir o diretório de trabalho como /app
WORKDIR .

# Copiar todo o conteúdo da pasta raiz do projeto "polls" para o diretório /app dentro do contêiner
COPY . .

# Expor a porta 3333
EXPOSE 3333

# Iniciar o aplicativo
CMD ["pnpm", "run", "start"]
