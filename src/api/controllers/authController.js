const usuarios = [
    { email: 'usuario1@example.com', senha: 'senha123' },
    { email: 'usuario2@example.com', senha: 'senha456' },
    { email: 'a', senha: 'a' },
];

exports.login = (req, res) => {
    const { email, senha } = req.body;

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    return res.status(200).json({ mensagem: 'Login bem-sucedido' });
};

// auth.js

exports.register = (req, res) => {
    const { email, senha } = req.body;

    // Verifique se o email já está cadastrado
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        return res.status(400).json({ mensagem: 'O email já está cadastrado' });
    }

    // Crie um novo usuário
    const novoUsuario = { email, senha };
    usuarios.push(novoUsuario);

    // Envie uma resposta de sucesso
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
};

