![NLW](https://github.com/castelogui/polls/blob/main/assets/nlw.png)

<p align="center">
	
# Polls - NLW Expert Trilha Node.js

</p>

Backend desenvolvido na NLW Expert trilha de Node.js.
Desenvolvi o fronend [WebPolls](https://github.com/castelogui/webpolls)

![Apresentação](https://github.com/castelogui/polls/blob/main/assets/exemple.gif)

----

## Routes

Rota para criar uma poll

PUSH: http://localhost:3333/polls

```bash
# Body
{
	"title": "Qual a melhor linguagem de programação?",
	"options": ["JS", "PYTHON", "C", "JAVA", "DELPHI", "RUBY", "DART"]
}
```

Rota para atualizar uma poll

PUSH: http://localhost:3333/polls/:pollId

```bash
# Body
{
	"title": "Qual a melhor linguagem de programação?",
	"options": [
		{
			id: "a5d8c1d9a21d-237bah32-dadbdsdh2",
		  title: "JS"
		},
		{
			id: "8d1c5d8wdd5c-32u662d9-3246h6dsa",
			title: "PYTHON"
		},
		{
			id: "89fsnhfg5448-90u23f23-sf3489hg0",
			title: "C"
		}
	]
}
```

Rota para obter as informações da poll

GET: http://localhost:3333/polls/:pollId

Rota para obter deletar uma poll

DELETE: http://localhost:3333/polls/:pollId

Rota post para votar

PUSH: http://localhost:3333/polls/:pollId/votes

```bash
{
	"pollOptionId": ":pollOptionId"
}
```

Rota websocket para obter as informações de uma votação

WebSocket: ws://localhost:3333/polls/:pollId/results

----

## Setup

### Rodando com Docker

Suba os contêineres com o docker-compose

```bash
docker-compose up -d
```
ou

```bash
docker-compose up --build
```
----

### Rodando local

Instale as dependências utilizando:

```bash
npm install
```

Alterar o arquivo `.env` e adicione as variáveis de ambiente.

```bash
DATABASE_URL=link_your_database
REDIS_URL=link_your_redis
PORT=port_number
```

Altere o provider do prisma no arquivo `prisma/schema.prisma` para banco de dados de sua preferencia.

```bash
#Exemplo
provider = "postgresql"
```

Crie o banco de dados e rode as migrations

```bash
npx prisma migrate dev
```

Inicie o servidor de desenvolvimento com o seguinte comando:

```bash
npm run dev
```

Ou faça o build e inicie o servidor com:

```bash
npm run start
```
O servidor estará disponível em `http://localhost:3333`.