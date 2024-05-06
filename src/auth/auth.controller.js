require('dotenv').config();
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Função para enviar e-mail
async function sendEmail(email, subject, text) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text
        });

        return true;
    } catch (error) {
        console.error('[Auth: e-mail]:', error);
        return false;
    }
}

// Função para criar um token
function createToken() {
    const agoraNoBrasil = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
    const agoraISOBrasil = new Date(agoraNoBrasil).toISOString();
    return `${uuidv4()}tt:${agoraISOBrasil}`;
}

// Função para verificar se o token é válido e não expirou
async function verifyToken(token) {
    if (!token) {
        return { valido: false, mensagem: 'Token inválido ou ausente na requisição.' };
    }

    const partesToken = token.split('tt:');
    if (partesToken.length !== 2) {
        return { valido: false, mensagem: 'Formato de token inválido.' };
    }

    const expiracaoTokenISO = partesToken[1];
    const expiracaoToken = new Date(expiracaoTokenISO);

    const timeZone = 'America/Sao_Paulo';
    const agoraNoBrasil = new Date().toLocaleString('en-US', { timeZone });
    const agoraNoBrasilDate = new Date(agoraNoBrasil);

    expiracaoToken.setTime(expiracaoToken.getTime() + expiracaoToken.getTimezoneOffset() * 60000);

    const umHoraEmMillis = 60 * 60 * 1000;

    if (agoraNoBrasilDate > expiracaoToken.getTime() + umHoraEmMillis) {
        return { mensagem: 'O token expirou. Por favor, solicite um novo link de redefinição de senha.' };
    }

    return { mensagem: 'Token válido.' };
}

//--------------------------------------------
// Função para fazer login do usuário
exports.login = async (require, response) => {
    const { email, senha } = require.body;

    try {
        const { data: user } = await supabase
            .from('usuario')
            .select('id, nome, confirmated_at, senha')
            .eq('email', email)
            .single();

        if (!user || !(await bcrypt.compare(senha, user.senha))) return response.status(401).json({ mensagem: 'A combinação de e-mail e senha fornecida não é válida. Por favor, revise suas credenciais e tente novamente.' });

        if (!user.confirmated_at) return response.status(406).json({ mensagem: 'Seu e-mail ainda não foi verificado. Por favor, verifique seu e-mail antes de fazer login.' });

        require.session.user = { id: user.id, username: user.nome, email };
        response.status(200).json({ mensagem: 'Login efetuado com sucesso!' });
    } catch (error) {
        console.error('[Auth: login]', error.message);
        response.status(500).json({ mensagem: 'Houve um problema ao fazer login. Tente novamente mais tarde.' });
    }
};

// Função para registrar um novo usuário
exports.register = async (require, response) => {
    const { nome, email, senha } = require.body;

    try {
        const { data: verificarEMAIL } = await supabase
            .from('usuario')
            .select('email')
            .eq('email', email)
            .single();

        if (verificarEMAIL) return response.status(401).json({ mensagem: 'Este E-mail já está associado a uma conta.' });

        if (senha.length < 6) return response.status(401).json({ mensagem: 'A senha inserida é muito curta. Use pelo menos 6 caracteres.' });

        const token = createToken();

        if (!token) return response.status(500).json({ mensagem: 'Houve um problema ao criar sua conta. Tente novamente mais tarde.' });

        const { error: insertError } = await supabase
            .from('usuario')
            .insert([{ nome, email, senha: await bcrypt.hash(senha, 10), token }]);

        if (insertError) return response.status(500).json({ mensagem: 'Houve um problema ao criar sua conta. Tente novamente mais tarde.' });

        await sendEmail(email, 'Agora só falta verificar sua conta!', `Olá!\n\nPara finalizar o seu cadastro falta apenas verificar a sua conta.\nBasta clicar no link a seguir: http://localhost:5173/confirm-registration?tkn=${token}\n\nSe você não solicitou o cadastro, por favor, ignore este e-mail.\n\nAtenciosamente,\nEquipe eletConnect.`);

        return response.status(200).json({ mensagem: 'Conta criada! Um e-mail com instruções para verificar sua conta foi enviado para o seu endereço de e-mail.' });
    } catch (error) {
        console.error('[Auth: register]', error.message);
        response.status(500).json({ mensagem: 'Houve um problema ao criar sua conta. Tente novamente mais tarde.' });
    }
};

// Função para confirmar o registro do usuário
exports.confirmRegistration = async (require, response) => {
    const { token } = require.body;

    const { mensagem } = await verifyToken(token);
    if (mensagem !== 'Token válido.') {
        return response.status(401).json({ mensagem });
    }

    try {
        const { data: user } = await supabase
            .from('usuario')
            .select('confirmated_at, id')
            .eq('token', token)
            .single();

        if (!user) return response.status(401).json({ mensagem: 'Token inválido ou ausente na requisição.' });

        if (user.confirmated_at) return response.status(401).json({ mensagem: 'Seu e-mail já foi verificado anteriormente.' });

        await supabase
            .from('usuario')
            .update({ confirmated_at: new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }) })
            .eq('id', user.id);

        return response.status(200).json({ mensagem: 'E-mail verificado com sucesso!' });
    } catch (error) {
        console.error('[Auth: confirm]', error.message);
        response.status(500).json({ mensagem: 'Houve um problema ao tentar verificar seu e-mail. Por favor, tente novamente mais tarde.' });
    }
};

// Função para enviar e-mail de redefinição de senha
exports.forgotPassword = async (require, response) => {
    const { email } = require.body;

    try {
        const { data: user } = await supabase
            .from('usuario')
            .select('id')
            .eq('email', email)
            .single();

        if (!user) return response.status(401).json({ mensagem: 'O e-mail inserido não está associado a nenhuma conta. Por favor, revise o e-mail e tente novamente.' });

        const token = createToken();
        if (!token) return response.status(401).json({ mensagem: 'Houve um erro ao tentar redefinir sua senha. Por favor, tente novamente mais tarde.' });

        const { error: insertError } = await supabase
            .from('usuario')
            .update({ token: token })
            .eq('id', user.id)
            .select()

        if (insertError) return response.status(401).json({ mensagem: 'Houve um erro ao tentar redefinir sua senha. Por favor, tente novamente mais tarde.' });

        await sendEmail(email, 'Vish! Parece que você esqueceu sua senha.', `Olá!\n\nPelo visto você esqueceu sua senha, né? Mas não se preocupe, é bem simples redefinir a senha. Basta clicar no link a seguir para redefini-la:\n\nhttp://localhost:5173/reset-password?tkn=${token}\n\nSe você não solicitou a redefinição, por favor, ignore este e-mail.\n\nAtenciosamente,\nEquipe eletConnect.`);

        return response.status(200).json({ mensagem: 'E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.' });
    } catch (error) {
        console.error('[Auth: forgot]', error.message);
        response.status(500).json({ mensagem: 'Houve um erro ao tentar redefinir sua senha. Por favor, tente novamente mais tarde.' });
    }
};

// Função para redefinir a senha do usuário
exports.resetPassword = async (require, response) => {
    const { senha, token } = require.body;

    const { mensagem } = await verifyToken(token);
    if (mensagem !== 'Token válido.') {
        return response.status(401).json({ mensagem });
    }

    try {
        const { data: user } = await supabase
            .from('usuario')
            .select('id, senha')
            .eq('token', token)
            .single();

        if (!user) return response.status(401).json({ mensagem: 'Token inválido ou ausente na requisição.' });

        if (senha.length < 6) return response.status(401).json({ mensagem: 'A senha inserida é muito curta. Use pelo menos 6 caracteres.' });

        if (await bcrypt.compare(senha, user.senha)) return response.status(401).json({ mensagem: 'A nova senha não pode ser igual à senha antiga.' });

        const { error } = await supabase
            .from('usuario')
            .update({ senha: await bcrypt.hash(senha, 10) })
            .eq('id', user.id)
            .select();

        if (error) return response.status(500).json({ mensagem: 'Houve um erro ao tentar redefinir sua senha. Por favor, tente novamente mais tarde.' });

        return response.status(200).json({ mensagem: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error('[Auth: reset]', error.message);
        response.status(500).json({ mensagem: 'Houve um erro ao tentar redefinir sua senha. Por favor, tente novamente mais tarde.' });
    }
}

// Função para fazer o usuário fazer logout
exports.logout = async (require, response) => {
    try {
        require.session.destroy((error) => {
            if (error) {
                return response.status(500).json({ mensagem: 'Houve um erro ao tentar fazer logout. Por favor, tente novamente mais tarde.' });
            }

            return response.status(200).json({ mensagem: 'Logout efetuado com sucesso!' });
        });
    } catch (error) {
        console.error('[Auth: logout]', error.message);
        response.status(500).json({ mensagem: 'Houve um erro ao tentar fazer logout. Por favor, tente novamente mais tarde.' });
    }
};

// Função para verificar a sessão do usuário
exports.checkSession = async (require, response) => {
    try {
        if (require.session.user) {
            response.status(200).json({ id: require.session.user.id, username: require.session.user.username, email: require.session.user.email });
        } else {
            response.status(401).json({ mensagem: 'Sessão não encontrada. Por favor, faça login.' });
        }
    } catch (error) {
        console.error('[Auth: check]', error.message);
        response.status(500).json({ mensagem: 'Houve um erro ao tentar verificar a sessão. Por favor, tente novamente mais tarde.' });
    }
};