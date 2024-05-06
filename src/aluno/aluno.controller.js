require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");
const e = require('express');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.listarAlunos = async (req, res) => {
    const { escola } = req.body;
    try {
        const { data, error } = await supabase
            .from('alunos')
            .select('matricula, nome');

            console.log(data);
        if (error) {
            return res.status(500).json({ error: 'Erro ao listar alunos' });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
        return res.status(500).json({ error: 'Erro ao listar alunos' });
    }
};