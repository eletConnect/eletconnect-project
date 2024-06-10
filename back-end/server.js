require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'Eu tenho segredos?',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

const authRoute = require('./src/auth/auth.route');
app.use('/auth', authRoute);

const instituicaoRoute = require('./src/instituicao/instituicao.route');
app.use('/instituicao', instituicaoRoute);

const alunoRoute = require('./src/aluno/aluno.route');
app.use('/aluno', alunoRoute);

// Error handler
app.use((err, res) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
