import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize, User } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// Inicializar banco de dados
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado');
});

// Endpoint de registro
app.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }
    
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }
    
    const user = await User.create({
      username,
      passwordHash: password, // Será hasheado automaticamente
      role
    });
    
    res.status(201).json({ 
      message: 'Usuário criado com sucesso',
      userId: user.id
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

//Router para realizar a autenticação do usuário e gerar o token
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }
    
    const user = await User.findOne({ where: { username } });
    
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    
    // Atualizar data de criação do token
    await user.update({ tokenDataCriacao: new Date() });
    
    res.status(200).json({ 
      token: token,
      name: user.username,
      role: user.role
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

//Middleware para verificar o token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if(!token)return res.status(403).json({ message: 'Token não fornecido' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
}

// Rota protegida
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Acesso autorizado à rota protegida'
    });
});


//Rota autentiaca e privada para o usuario admin
app.get('/admin', authenticateToken, (req, res) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
    }
    res.status(200).json({message: 'Bem vindo à área de administração'})
})


app.listen(PORT, () => {
    console.log('Servidor online na porta', PORT);
    console.log('Pressione Ctrl+C para parar o servidor');
});


process.stdin.resume();