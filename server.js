const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes'); // Importando as rotas de autenticação

const app = express();
const PORT = 3001;

// Habilitando o CORS para todas as origens
app.use(cors());

// Middleware para tratar requisições com JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.send('O servidor está rodando!');
});

// Rotas de autenticação
app.use('/auth', authRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`[eletConnect]: O servidor node está ligado e está rodando na porta ${PORT}`);
});
