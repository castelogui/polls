# Polls

Backend desenvolvido na NLW Expert trilha de Node.js.

Rota para criar uma poll
http://localhost:3333/polls

{
	"title": "Qual a melhor linguagem de programação?",
	"options": ["JS", "PYTHON", "C", "JAVA", "DELPHI", "RUBY", "DART"]
}


{
	"title": "Melhor editar",
	"options": ["VS CODE", "NOTEPAD"]
}


Rota para obter as informações da poll

http://localhost:3333/polls/:pollId



Rota post para votar
http://localhost:3333/polls/:pollId/votes


{
	"pollOptionId": ":pollOptionId"
}


Rota websocket para obter as informações de uma votação

ws://localhost:3333/polls/:pollId/results

## Setup

Instale as dependências utilizando:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Inicie o servidor de desenvolvimento em `http://localhost:3000` com o seguinte comando:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```