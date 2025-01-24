FROM ubuntu:latest

# Atualizar pacotes, instalar o Node.js e dependências
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos do projeto para a pasta app
COPY . /app

# Instalar as dependências do projeto
RUN npm install

# Expor a porta 3333
EXPOSE 3333

# Rodar a aplicação
CMD ["npm", "run", "start"]
