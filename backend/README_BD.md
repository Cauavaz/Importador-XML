# Como Acessar o Banco de Dados SQLite

## Opção 1: Navegador de Banco de Dados (Recomendado)

### Usando DB Browser for SQLite
1. **Baixe o DB Browser for SQLite**
   - Acesse: https://sqlitebrowser.org/
   - Baixe e instale o programa

2. **Abra o banco de dados**
   - Abra o DB Browser
   - Clique em "Open Database"
   - Navegue até: `c:\PROJETO XML\IMPORTACAO XML NODE\database.sqlite`
   - Selecione o arquivo

3. **Explore os dados**
   - Vá para a aba "Browse Data"
   - Selecione a tabela "usuarios"
   - Você verá todos os usuários cadastrados

## Opção 2: Linha de Comando

### Via Terminal PowerShell
```powershell
# Navegue até a pasta do projeto
cd "c:\PROJETO XML\IMPORTACAO XML NODE"

# Instale sqlite3 globalmente (se ainda não tiver)
npm install -g sqlite3

# Abra o banco de dados
sqlite3 database.sqlite

# Comandos SQL básicos:
.tables                    # Ver tabelas
.schema usuarios           # Ver estrutura da tabela
SELECT * FROM usuarios;    # Ver todos os dados
SELECT username, Cargo FROM usuarios; # Ver usuários e cargos
.quit                      # Sair
```

## Opção 3: Extensão VS Code

### Usando Extensão SQLite
1. **Instale a extensão**
   - Abra o VS Code
   - Vá para Extensions (Ctrl+Shift+X)
   - Procure por "SQLite" 
   - Instale a extensão "SQLite" por alexcvzz

2. **Abra o banco**
   - No VS Code, abra o arquivo `database.sqlite`
   - Clique com o botão direito no arquivo
   - Selecione "Open Database"
   - Explore as tabelas no painel lateral

## Estrutura da Tabela `usuarios`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | ID único (auto incremento) |
| username | TEXT | Email do usuário |
| SenhaHash | TEXT | Hash da senha |
| SenhaSalt | TEXT | Salt da senha |
| Cargo | TEXT | Papel do usuário (admin/user) |
| TokenDataCriacao | DATETIME | Data de criação do token |
| createdAt | DATETIME | Data de criação do registro |
| updatedAt | DATETIME | Data de atualização |

## Consultas Úteis

```sql
-- Ver todos os usuários
SELECT id, username, Cargo, TokenDataCriacao FROM usuarios;

-- Ver usuário admin
SELECT * FROM usuarios WHERE Cargo = 'admin';

-- Ver usuários criados recentemente
SELECT * FROM usuarios WHERE createdAt > datetime('now', '-1 day');

-- Contar usuários por cargo
SELECT Cargo, COUNT(*) as total FROM usuarios GROUP BY Cargo;
```

## Dados Iniciais

O banco já vem com dois usuários:
- **Admin**: cauavaz1@gmail.com
- **User**: felipe

Ambos com senha "12345678" (armazenada com hash e salt)
