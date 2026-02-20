# Backend NestJS + Prisma - Sistema de Importação XML

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para SQLite
- **JWT** - Autenticação
- **TypeScript** - Linguagem
- **SQLite** - Banco de dados
- **Swagger** - Documentação da API

## 📦 Instalação

```bash
npm install
```

## 🗄️ Configurar Banco de Dados

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar migração
npm run prisma:migrate

# Abrir Prisma Studio (visualizar dados)
npm run prisma:studio
```

## ▶️ Rodar Aplicação

### Desenvolvimento (com ts-node)
```bash
npm run start:dev
```

### Produção
```bash
# Build
npm run build

# Start
npm start
```

## 📚 Documentação da API (Swagger)

Após iniciar o servidor, a documentação interativa da API estará disponível em:

**🔗 http://localhost:3000/api**

O Swagger UI permite:
- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente pela interface
- Ver exemplos de request/response
- Autenticar com JWT Bearer token

## 📊 Estrutura do Banco

### Tabela: users
- id (Int)
- username (String - único)
- password (String - hash)
- salt (String)
- role (String - "user" ou "admin")
- tokenCreatedAt (DateTime)
- createdAt (DateTime)
- updatedAt (DateTime)

### Tabela: nfes
- id (Int)
- chaveNFe (String - único)
- numero (String)
- serie (String)
- dataEmissao (DateTime)
- emitenteNome (String)
- emitenteCNPJ (String)
- destNome (String)
- destCNPJ (String)
- valorTotal (Float)
- userId (Int)
- createdAt (DateTime)
- updatedAt (DateTime)

### Tabela: nfe_items
- id (Int)
- nfeId (Int)
- codigo (String)
- descricao (String)
- ncm (String)
- cfop (String)
- quantidade (Float)
- valorUnitario (Float)
- valorTotal (Float)
- createdAt (DateTime)
- updatedAt (DateTime)

## 🔧 Variáveis de Ambiente (.env)

```
PORT=3000
SECRET_KEY=your-secret-key-here
DATABASE_URL="file:./prisma/dev.db"
CLEAR_NFES_ON_BOOT=false
```

- **PORT**: Porta onde o servidor irá rodar (padrão: 3000)
- **SECRET_KEY**: Chave secreta para geração de tokens JWT
- **DATABASE_URL**: URL de conexão com o banco de dados SQLite
- **CLEAR_NFES_ON_BOOT**: Se true, limpa todas as NF-es ao iniciar o servidor (padrão: false)

## 📁 Estrutura de Pastas

```
src/
├── auth/              # Módulo de autenticação
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── users/             # Módulo de usuários
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── nfe/               # Módulo de NF-e
│   ├── nfe.controller.ts
│   ├── nfe.service.ts
│   └── nfe.module.ts
├── database/          # Módulo de banco de dados
│   ├── database.service.ts
│   └── database.module.ts
├── prisma/            # Módulo do Prisma
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.module.ts      # Módulo principal
└── main.ts            # Entrada da aplicação

prisma/
├── schema.prisma      # Schema do banco
├── migrations/        # Migrações
└── dev.db             # Banco de dados SQLite
```

## 📤 Endpoints da API

### Autenticação

#### Login
**POST** `/auth/login`
- Body: `{ "username": "string", "password": "string" }`
- Response: `{ "access_token": "string", "user": {...} }`

#### Registrar
**POST** `/auth/register`
- Body: `{ "username": "string", "password": "string", "role": "user" }`
- Response: `{ "access_token": "string", "user": {...} }`

### Usuários

#### Criar Usuário
**POST** `/users/register`
- Body: `{ "username": "string", "password": "string", "role": "user" }`
- Response: `{ "message": "string", "userId": number }`

### NF-e

### Upload de XML
**POST** `/nfe/upload`
- Headers: `Authorization: Bearer {token}`
- Body: `multipart/form-data` com campo `file`

### Listar NF-es
**GET** `/nfe?page=1&limit=50`
- Headers: `Authorization: Bearer {token}`
- Query params: `page` (opcional), `limit` (opcional)

### Detalhes da NF-e
**GET** `/nfe/:id`
- Headers: `Authorization: Bearer {token}`

### Excluir NF-e
**DELETE** `/nfe/:id`
- Headers: `Authorization: Bearer {token}`

## ✅ Funcionalidades Implementadas

- ✅ Autenticação JWT com Passport
- ✅ Registro e login de usuários
- ✅ Hash de senhas com bcrypt
- ✅ Upload de arquivos XML
- ✅ Parser de XML NF-e (xml2js)
- ✅ Importação de NF-e com múltiplos itens
- ✅ Detecção de duplicidade por chave NF-e
- ✅ Listagem com paginação
- ✅ Detalhes da NF-e com itens relacionados
- ✅ Queries otimizadas (better-sqlite3)
- ✅ Documentação Swagger completa
- ✅ CORS configurado para frontend Angular
- ✅ Validação de dados com class-validator

## 🎯 Como Usar

1. Instalar dependências: `npm install`
2. Copiar arquivo de ambiente: `cp .env-example .env`
3. Configurar variáveis no `.env`
4. Gerar Prisma Client: `npm run prisma:generate`
5. Criar banco de dados: `npm run prisma:migrate`
6. Iniciar servidor: `npm run start:dev`
7. Acessar API: `http://localhost:3000`
8. Acessar Swagger: `http://localhost:3000/api`


