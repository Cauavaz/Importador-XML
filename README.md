# 📦 Sistema de Importação XML NF-e

Sistema completo para importação e gerenciamento de Notas Fiscais Eletrônicas (NF-e) através de arquivos XML.

## 🏗️ Estrutura do Projeto

```
Importador-XML/
├── backend/          # API NestJS + Prisma + SQLite
└── frontend/         # Interface Angular
```

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM para SQLite
- **JWT** - Autenticação
- **TypeScript** - Linguagem
- **SQLite** - Banco de dados
- **xml2js** - Parser de XML
- **better-sqlite3** - Queries otimizadas

### Frontend
- **Angular 19** - Framework frontend
- **TypeScript** - Linguagem
- **SCSS** - Estilização
- **ngx-toastr** - Notificações
- **Standalone Components** - Arquitetura moderna

## 📦 Instalação

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

O backend estará rodando em: `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
ng serve
```

O frontend estará rodando em: `http://localhost:4200`

## ✅ Funcionalidades

### 🔐 Autenticação
- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Proteção de rotas

### 📤 Upload de XML
- ✅ Upload de um ou múltiplos arquivos XML
- ✅ Drag and drop
- ✅ Validação de formato
- ✅ Parser robusto de NF-e
- ✅ Detecção automática de duplicidade

### 📊 Gerenciamento de NF-es
- ✅ Listagem com paginação (50 por página)
- ✅ Busca e filtros
- ✅ Visualização de detalhes
- ✅ Listagem de itens/produtos
- ✅ Exclusão de NF-es

### 💾 Dados Salvos

**NF-e:**
- Chave da NF-e
- Número e série
- Data de emissão
- Emitente (nome e CNPJ)
- Destinatário (nome e CNPJ)
- Valor total

**Itens:**
- Código do produto
- Descrição
- NCM
- CFOP
- Quantidade
- Valor unitário
- Valor total

## 🔑 API Endpoints

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Fazer login

### NF-e
- `POST /nfe/upload` - Upload de XML
- `GET /nfe?page=1&limit=50` - Listar NF-es
- `GET /nfe/:id` - Detalhes da NF-e
- `DELETE /nfe/:id` - Excluir NF-e

## 🎯 Como Usar

1. **Iniciar o backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Iniciar o frontend:**
   ```bash
   cd frontend
   ng serve
   ```

3. **Acessar o sistema:**
   - Abrir navegador em `http://localhost:4200`
   - Fazer registro/login
   - Ir para "Upload de XML"
   - Arrastar e soltar arquivos XML
   - Ver resultados em "Notas de Entrada"

## 📁 Estrutura de Pastas

### Backend
```
backend/
├── src/
│   ├── auth/              # Autenticação JWT
│   ├── users/             # Gerenciamento de usuários
│   ├── nfe/               # Importação e gestão de NF-es
│   ├── database/          # Queries otimizadas
│   └── prisma/            # ORM
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── migrations/        # Migrações
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── pages/         # Páginas (login, upload, listagem)
│   │   ├── services/      # Serviços HTTP
│   │   ├── guards/        # Guards de autenticação
│   │   └── components/    # Componentes reutilizáveis
│   └── styles/            # Estilos globais
└── package.json
```

## 🔧 Variáveis de Ambiente

### Backend (.env)
```env
PORT=3000
SECRET_KEY=sua_chave_secreta_aqui
DATABASE_URL="file:./database.sqlite"
```

## 🎨 Screenshots

### Tela de Upload
- Drag and drop de arquivos XML
- Feedback visual de sucesso/erro
- Detecção de duplicidade

### Listagem de NF-es
- Paginação
- Informações principais
- Acesso rápido aos detalhes

### Detalhes da NF-e
- Informações completas
- Lista de todos os itens/produtos
- Valores detalhados

## 🐛 Solução de Problemas

### Erro: "XML já importado"
- **Causa:** O XML que você está tentando importar já existe no banco
- **Solução:** Verifique a lista de NF-es ou importe um XML diferente

### Erro: "Porta 3000 em uso"
- **Causa:** Outro processo está usando a porta
- **Solução:** `taskkill /F /IM node.exe` (Windows) ou mude a porta no `.env`

### Erro: "Database locked"
- **Causa:** Múltiplas conexões simultâneas ao SQLite
- **Solução:** Feche outras conexões ou aguarde alguns segundos

## 👨‍💻 Desenvolvedor

Desenvolvido por Cauavaz

## 🔗 Links

- **Repositório:** https://github.com/Cauavaz/Importador-XML
- **Backend:** NestJS + Prisma
- **Frontend:** Angular 19

---

**⚡ Sistema 100% funcional e pronto para uso!**
