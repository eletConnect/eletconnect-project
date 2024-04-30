require('dotenv').config();
const nodemailer = require('nodemailer');
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.login = async (request, response) => {
    try {
        const { email, senha } = request.body;
        const { data: login } = await supabase
            .from('usuarios')
            .select('id, senha, email_confirmed_at, nome')
            .eq('email', email)
            .single();

        if (!login) {
            return response.status(401).json({ mensagem: 'As credenciais inseridas estão incorretas. Verifique seu e-mail e senha.' });
        }

        if (login.senha !== senha) {
            return response.status(401).json({ mensagem: 'As credenciais inseridas estão incorretas. Verifique seu e-mail e senha.' });
        }

        if (!login.email_confirmed_at) {
            const loginE = nodemailer.createTransport({
                host: 'smtp-mail.outlook.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const optionLogin = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "eletConnect - Confirmação de conta",
                text: `Olá ${login.nome}!\n\nParece que você esqueceu de verificar sua conta. Sem problemas!\nClique no link a seguir para verificar sua conta: http://localhost:5173/confirm-registration?id=${login.id}\n\nSe você não solicitou esta verificação, por favor ignore esta mensagem.\nObrigado!`
            };

            loginE.sendMail(optionLogin, function (erro) {
                if (erro) {
                    return response.status(500).json({ mensagem: 'Houve um erro ao tentar enviar o e-mail de verificação de conta. Por favor, tente novamente mais tarde.', erro });
                } else {
                    return response.status(400).json({ mensagem: 'Um e-mail com instruções para verificar sua conta foi enviado para o seu endereço de e-mail.' });
                }
            });

            return;
        }

        response.status(200).json({ mensagem: 'Login efetuado com sucesso! Você está conectado.', userID: login.id });
    } catch (error) {
        console.error('[Auth: login]', error.message);
        response.status(500).json({ mensagem: 'Erro ao realizar login. Por favor, tente novamente mais tarde.' });
    }
}

exports.register = async (request, response) => {
    try {
        const { cnpj, nome, email, senha } = request.body;
        const { data: cnpjExistente } = await supabase
            .from('usuarios')
            .select('id')
            .eq('cnpj', cnpj)
            .single();

        if (cnpjExistente) {
            return response.status(400).json({ mensagem: 'Este CNPJ já está cadastrado em nossa plataforma.' });
        }

        const { data: emailExistente } = await supabase
            .from('usuarios')
            .select('id')
            .eq('email', email)
            .single();

        if (emailExistente) {
            return response.status(400).json({ mensagem: 'Este e-mail já está cadastrado em nossa plataforma.' });
        }

        if (senha.length < 6) {
            return response.status(400).json({ mensagem: 'A senha inserida é muito curta. Use pelo menos 6 caracteres.' });
        }

        const { error: erroCadastro } = await supabase
            .from('usuarios')
            .insert([{ cnpj, nome, email, senha }]);

        if (erroCadastro) {
            return response.status(500).json({ mensagem: 'Houve um problema ao tentar criar sua conta. Por favor, tente novamente mais tarde.' });
        }

        const { data: verificar } = await supabase
            .from('usuarios')
            .select('id, email, nome')
            .eq('email', email)
            .single();

        const createAccount = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const optionCreate = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "eletConnect - Confirmação de conta",
            text: `Olá ${verificar.nome}!\n\nPara acessar sua conta, precisamos confirmar seu endereço de e-mail.\nPor favor, clique no link abaixo para concluir o processo de verificação: http://localhost:5173/confirm-registration?id=${verificar.id}\n\nSe você não solicitou esta verificação, por favor ignore esta mensagem.\nObrigado!`
        };

        createAccount.sendMail(optionCreate, function (error) {
            if (error) {
                return response.status(500).json({ mensagem: 'Houve um erro ao tentar enviar o e-mail de verificação de conta. Por favor, tente novamente mais tarde.' });
            } else {
                return response.status(200).json({ mensagem: 'Um e-mail com instruções para verificar sua conta foi enviado para o seu endereço de e-mail.' });
            }
        });
    } catch (error) {
        console.error('[Auth: register]', error.message);
        return response.status(500).json({ mensagem: 'Erro ao realizar cadastro. Por favor, tente novamente mais tarde.' });
    }
}

exports.forgotPassword = async (request, response) => {
    try {
        const { email } = request.body;
        const { data: usuario } = await supabase
            .from('usuarios')
            .select('id, nome')
            .eq('email', email)
            .single();

        if (!usuario) {
            return response.status(404).json({ mensagem: 'Ops! Parece que o usuário especificado não existe em nossa base de dados.' });
        }

        const transporte = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const opcoesEmail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "eletConnect - Redefinição de Senha",
            text: `Olá ${usuario.nome}!\n\nParece que você esqueceu sua senha. Sem problemas!\nClique no link a seguir para redefinir sua senha: http://localhost:5173/reset-password?id=${usuario.id}\n\nSe você não solicitou esta verificação, por favor ignore esta mensagem.\nObrigado!`
        };

        transporte.sendMail(opcoesEmail, function (erro) {
            if (erro) {
                return response.status(500).json({ mensagem: 'Houve um erro ao tentar enviar o e-mail de redefinição de senha. Por favor, tente novamente mais tarde.' });
            } else {
                return response.status(200).json({ mensagem: 'Um e-mail com instruções para redefinir sua senha foi enviado para o seu endereço de e-mail.' });
            }
        });
    } catch (error) {
        console.error('[Auth: forgot]', error);
        response.status(500).json({ mensagem: 'Erro ao enviar e-mail de redefinição de senha. Por favor, tente novamente mais tarde.' });
    }
};

exports.resetPassword = async (request, response) => {
    try {
        const { id, senha } = request.body;
        const { data: reset } = await supabase
            .from('usuarios')
            .select('senha')
            .eq('id', id)
            .single();

        if (!reset) {
            return response.status(404).json({ mensagem: 'Ops! Parece que o usuário especificado não existe em nossa base de dados.' });
        }

        if (senha.length < 6) {
            return response.status(400).json({ mensagem: 'A senha inserida é muito curta. Use pelo menos 6 caracteres.' });
        }

        if (reset.senha === senha) {
            return response.status(400).json({ mensagem: 'A senha inserida é a mesma que a senha atual. Por favor, insira uma nova senha.' });
        }

        const { error: erroAtualizacao } = await supabase
            .from('usuarios')
            .update({ senha })
            .eq('id', id);

        if (erroAtualizacao) {
            return response.status(500).json({ mensagem: 'Houve um erro ao tentar redefinir sua senha. Por favor, tente novamente mais tarde.' });
        }

        return response.status(200).json({ mensagem: 'Sua senha foi redefinida com sucesso! Você já pode fazer login na plataforma.' });
    } catch (error) {
        console.error('[Auth: reset]', error);
        response.status(500).json({ mensagem: 'Erro ao redefinir senha. Por favor, tente novamente mais tarde.' });
    }
};

exports.confirmRegistration = async (request, response) => {
    try {
        const { id } = request.body;
        const { data: confirmar } = await supabase
            .from('usuarios')
            .select('email_confirmed_at')
            .eq('id', id)
            .single();

        if (!confirmar) {
            return response.status(404).json({ mensagem: 'Ops! Parece que o usuário especificado não existe em nossa base de dados.' });
        }

        if (confirmar.email_confirmed_at) {
            return response.status(400).json({ mensagem: 'Seu e-mail já foi confirmado anteriormente. Você já pode fazer login na plataforma.' });
        }

        const { error: erroConfirmacao } = await supabase
            .from('usuarios')
            .update({ email_confirmed_at: new Date() })
            .eq('id', id)
            .single();

        if (erroConfirmacao) {
            return response.status(500).json({ mensagem: 'Houve um erro ao tentar confirmar seu e-mail. Por favor, tente novamente mais tarde.' });
        }

        return response.status(200).json({ mensagem: 'Seu e-mail foi confirmado com sucesso! Você já pode fazer login na plataforma.' });
    } catch (error) {
        console.error('[Auth: confirm]', error);
        response.status(500).json({ mensagem: 'Erro ao confirmar e-mail. Por favor, tente novamente mais tarde.' });
    }
};
