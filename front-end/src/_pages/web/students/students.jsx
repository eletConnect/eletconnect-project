import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../_components/Header';
import Table from './components/Table';

const App = () => {
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [data, setData] = useState([]);
    const escola = JSON.parse(sessionStorage.getItem('escola'));

    useEffect(() => {
        if (!escola) return window.location.href = '/verification';
        listarAlunos();
    }, []);

    const listarAlunos = async () => {
        try {
            const response = await axios.post('http://localhost:3001/aluno/listar', { instituicao: escola.cnpj });
            if (response.status === 200) {
                setData(response.data.alunosData.map((aluno) => ({
                    matricula: aluno.matricula,
                    nome: aluno.nome,
                })));
            }
        } catch (error) {
            console.error('Erro ao listar alunos:', error);
        }
    };

    const handleInputChange = (e) => {
        setFilterText(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = data.filter((item) =>
        item.nome.toLowerCase().includes(filterText.toLowerCase())
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Header />
            <section id='section'>
                <div className="box">
                    <div className="title d-flex justify-content-between align-items-center">
                        <h3 className='m-0'>Alunos</h3>
                        <button className='btn btn-outline-secondary' data-bs-toggle="modal" data-bs-target="#cadastrarAluno">
                            <i className="bi bi-person-add me-2"></i>Cadastrar
                        </button>
                    </div>
                    <div className="p-4">
                        <div className="d-flex justify-content-between">
                            <span></span>
                            <form className="position-relative">
                                <input type="text" className="form-control" placeholder="Filtrar alunos..." onChange={handleInputChange} />
                                <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                            </form>
                        </div>
                        <Table data={filteredData} currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
                    </div>
                </div>
            </section>

            {/* Modal para cadastrar aluno */}
            <div className="modal fade" id="cadastrarAluno" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Cadastrar Aluno</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Conteúdo do modal para cadastro de aluno */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" className="btn btn-primary">Salvar alterações</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para redefinir a senha */}
            <div className="modal fade" id="resetarAluno" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Redefinir Senha do Aluno</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Restante do conteúdo do modal */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" className="btn btn-primary">Salvar alterações</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para editar os dados do aluno */}
            <div className="modal fade" id="alterarAluno" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Editar Dados do Aluno</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Restante do conteúdo do modal */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" className="btn btn-primary">Salvar alterações</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para excluir o aluno */}
            <div className="modal fade" id="excluirAluno" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Excluir Aluno</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Restante do conteúdo do modal */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" className="btn btn-primary">Salvar alterações</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;
