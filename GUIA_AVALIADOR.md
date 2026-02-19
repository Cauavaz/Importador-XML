# 📋 GUIA PARA AVALIAÇÃO DO PROJETO

## 🎯 Sistema de Importação XML NF-e

Este guia foi criado para facilitar a avaliação do projeto.

---

## 🚀 INSTALAÇÃO RÁPIDA (5 minutos)

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Cauavaz/Importador-XML.git
cd Importador-XML
```

### 2️⃣ Configurar Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

**✅ Backend rodando em:** `http://localhost:3000`

### 3️⃣ Configurar Frontend (em outro terminal)

```bash
cd frontend
npm install
ng serve
```

**✅ Frontend rodando em:** `http://localhost:4200`

---

## 🔐 CREDENCIAIS DE TESTE

Após executar o seed, use estas credenciais:

- **Email:** `demo@importador.com`
- **Senha:** `demo123`

---

## 📊 DADOS DE DEMONSTRAÇÃO

O seed cria automaticamente:

✅ **1 usuário** de demonstração  
✅ **2 NF-es** de exemplo  
✅ **5 itens/produtos** distribuídos nas NF-es

### NF-e 1
- **Número:** 1232768
- **Emitente:** DISTRIBUIDORA ALIMENTOS LTDA
- **Destinatário:** SUPERMERCADO I-SINC LTDA
- **Valor:** R$ 2.215,00
- **Itens:** 3 produtos (arroz)

### NF-e 2
- **Número:** 1232769
- **Emitente:** DISTRIBUIDORA ALIMENTOS LTDA
- **Destinatário:** MERCADO BOM PREÇO LTDA
- **Valor:** R$ 1.850,00
- **Itens:** 2 produtos (feijão e açúcar)

---

## 🧪 ROTEIRO DE TESTES

### Teste 1: Login
1. Acessar `http://localhost:4200`
2. Fazer login com as credenciais acima
3. ✅ Deve redirecionar para o dashboard

### Teste 2: Visualizar NF-es Existentes
1. Clicar em "Notas de Entrada" no menu
2. ✅ Deve mostrar 2 NF-es
3. ✅ Deve exibir: número, série, emitente, data, valor

### Teste 3: Ver Detalhes de uma NF-e
1. Clicar em qualquer NF-e da lista
2. ✅ Deve mostrar informações completas
3. ✅ Deve listar todos os itens/produtos
4. ✅ Deve mostrar: código, descrição, NCM, CFOP, quantidade, valores

### Teste 4: Upload de XML
1. Ir para "Upload de XML"
2. Arrastar um arquivo XML ou clicar para selecionar
3. ✅ Deve processar o arquivo
4. ✅ Deve mostrar feedback de sucesso
5. ✅ NF-e deve aparecer na listagem

### Teste 5: Detecção de Duplicidade
1. Tentar importar o mesmo XML novamente
2. ✅ Deve detectar duplicidade
3. ✅ Deve mostrar aviso (não erro)
4. ✅ Não deve criar registro duplicado

### Teste 6: Paginação
1. Na listagem de NF-es
2. ✅ Deve mostrar paginação
3. ✅ Deve exibir total de registros
4. ✅ Deve permitir navegar entre páginas

---

## 📁 ARQUIVO XML DE TESTE

Caso precise de um XML para testar, use este exemplo:

**Arquivo:** `nfe-exemplo.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe xmlns="http://www.portalfiscal.inf.br/nfe">
    <infNFe Id="NFe35260290969751000103550050012327701511568422" versao="4.00">
      <ide>
        <nNF>1232770</nNF>
        <serie>5</serie>
        <dhEmi>2026-02-13T15:30:00-03:00</dhEmi>
      </ide>
      <emit>
        <xNome>DISTRIBUIDORA ALIMENTOS LTDA</xNome>
        <CNPJ>90969751000103</CNPJ>
      </emit>
      <dest>
        <xNome>SUPERMERCADO TESTE LTDA</xNome>
        <CNPJ>11111111000111</CNPJ>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>000300</cProd>
          <xProd>PRODUTO TESTE</xProd>
          <NCM>12345678</NCM>
          <CFOP>5101</CFOP>
          <qCom>10.0000</qCom>
          <vUnCom>50.000000</vUnCom>
          <vProd>500.00</vProd>
        </prod>
      </det>
      <total>
        <ICMSTot>
          <vNF>500.00</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>
```

Salve este conteúdo em um arquivo `.xml` e faça o upload pelo sistema.

---

## 🔍 ENDPOINTS DA API (para testes manuais)

### Login
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "demo@importador.com",
  "password": "demo123"
}
```

### Listar NF-es
```bash
GET http://localhost:3000/nfe?page=1&limit=50
Authorization: Bearer {seu_token}
```

### Detalhes de NF-e
```bash
GET http://localhost:3000/nfe/1
Authorization: Bearer {seu_token}
```

### Upload de XML
```bash
POST http://localhost:3000/nfe/upload
Authorization: Bearer {seu_token}
Content-Type: multipart/form-data

file: arquivo.xml
```

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### Backend
- [x] Autenticação JWT
- [x] Registro de usuários
- [x] Upload de arquivos XML
- [x] Parser de XML NF-e
- [x] Salvamento de NF-e no banco
- [x] Salvamento de itens/produtos
- [x] Detecção de duplicidade
- [x] Listagem com paginação
- [x] Detalhes da NF-e
- [x] Exclusão de NF-e
- [x] Validação de dados
- [x] Tratamento de erros

### Frontend
- [x] Tela de login
- [x] Tela de registro
- [x] Tela de upload (drag and drop)
- [x] Listagem de NF-es
- [x] Detalhes da NF-e
- [x] Paginação
- [x] Feedback visual (toastr)
- [x] Guards de autenticação
- [x] Design responsivo

### Banco de Dados
- [x] Tabela de usuários
- [x] Tabela de NF-es
- [x] Tabela de itens
- [x] Relacionamentos
- [x] Índices únicos
- [x] Migrations
- [x] Seed de dados

---

## 📊 ESTRUTURA DO BANCO

### Tabela: usuarios
- id, username (único), password, salt, role, tokenCreatedAt, createdAt, updatedAt

### Tabela: nfes
- id, chaveNFe (único), numero, serie, dataEmissao, emitenteNome, emitenteCNPJ, destNome, destCNPJ, valorTotal, userId, createdAt, updatedAt

### Tabela: nfe_items
- id, nfeId, codigo, descricao, ncm, cfop, quantidade, valorUnitario, valorTotal, createdAt, updatedAt

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: "Porta 3000 em uso"
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
killall node
```

### Erro: "Database locked"
- Feche o Prisma Studio se estiver aberto
- Aguarde alguns segundos e tente novamente

### Erro: "Cannot find module"
```bash
cd backend
npm install
```

### Resetar banco de dados
```bash
cd backend
rm prisma/database.sqlite
npx prisma migrate dev
npm run prisma:seed
```

---

## 📝 OBSERVAÇÕES IMPORTANTES

1. **Banco de dados NÃO está no Git** (boa prática)
2. **Use o seed para popular dados** de demonstração
3. **Credenciais de teste** estão neste guia
4. **XMLs de exemplo** podem ser criados conforme modelo acima
5. **Sistema detecta duplicidade** automaticamente

---

## 🎯 CRITÉRIOS DE AVALIAÇÃO ATENDIDOS

✅ Upload de um ou mais arquivos XML  
✅ Parse completo do XML  
✅ Salvamento da NF-e no banco  
✅ Salvamento dos itens/produtos  
✅ Feedback de sucesso/erro  
✅ Campos mínimos da NF-e salvos  
✅ Campos mínimos dos itens salvos  
✅ Listagem com paginação (50 por página)  
✅ Detalhes da NF-e com itens  
✅ Sistema completo e funcional  

---

## 📞 SUPORTE

Para dúvidas ou problemas:
- **GitHub:** https://github.com/Cauavaz/Importador-XML
- **Desenvolvedor:** Cauavaz

---

**⚡ Sistema 100% funcional e pronto para avaliação!**
