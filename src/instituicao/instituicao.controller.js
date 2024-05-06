const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.verificarEscola = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'ID não informado' });
    }

    try {
        const { data, error } = await supabase
            .from('usuario')
            .select('instituicao')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[Instituição]:', error);
            return res.status(500).json({ error: 'Erro ao verificar instituição' });
        }

        if (!data) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json(data.instituicao);
    } catch (error) {
        console.error('[Instituição]:', error);
        return res.status(500).json({ error: 'Erro ao verificar instituição' });
    }
};

exports.cadastrarInstituicao = async (require, response) => {
    const { id, cnpj, nome, avatar } = require.body;
    console.log(require.body);

    try {
        const { data: verificarCNPJ } = await supabase
            .from('instituicao')
            .select('cnpj')
            .eq('cnpj', cnpj)
            .single();

        if (verificarCNPJ) return response.status(400).json({ error: 'Este CNPJ já está associado a uma instituição.' });

        const { error } = await supabase
            .from('instituicao')
            .insert({ cnpj, nome, avatar });

        if (error) return response.status(500).json({ error: 'Houve um erro ao cadastrar a instituição de ensino. Tente novamente mais tarde.' });

        const { error: addEscolaUser } = await supabase
            .from('usuario')
            .update({ instituicao: cnpj })
            .eq('id', id);

        if (addEscolaUser) return response.status(500).json({ error: 'Erro ao associar a instituição de ensino ao usuário' });

        return response.status(200).json({ mensagem: 'Instituição de ensino cadastrada com sucesso!', cnpj, nome, avatar });
    } catch (error) {
        console.error('[Instituição] cadastrar:', error);
        return response.status(500).json({ error: 'Erro ao cadastrar instituição' });
    }
}