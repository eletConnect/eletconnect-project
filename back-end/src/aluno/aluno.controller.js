const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Função para listar os alunos cadastrados
exports.listarAlunos = async (request, response) => {
    const { instituicao } = request.body;    

    try {
        const { data: alunosData, error: alunosError } = await supabase
            .from('alunos')
            .select('matricula, nome')
            .eq('instituicao', instituicao);

        if (alunosError) {
            return response.status(500).json({ mensagem: 'Erro ao listar os alunos', detalhe: alunosError.message });
        }

        if (!alunosData) {
            return response.status(404).json({ mensagem: 'Nenhum aluno encontrado' });
        }

        return response.status(200).json({ alunosData });
    } catch (error) {
        return response.status(500).json({ mensagem: 'Erro ao listar os alunos', detalhe: error.message });
    }
};