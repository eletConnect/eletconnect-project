import React, { useState } from 'react';
import Header from "../../../_components/Header";
import "./courses.css";
import { eletivas, trilhas } from './components/dados';

export default function Course() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [showEletivas, setShowEletivas] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredItems = searchText
        ? (showEletivas ? eletivas : trilhas).filter(item => item.descricao.toLowerCase().includes(searchText.toLowerCase()))
        : showEletivas ? eletivas : trilhas;

    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };
    // Função para abrir e fechar o modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <Header />
            <section id="section">
                <div className='box scrollable-section text-center'>
                    <div className="d-flex justify-content-center">
                        <div className="container-fluid mt-5">
                            <h2 className="mb-4">{showEletivas ? 'Matérias Eletivas' : 'Trilhas'}</h2>
                            <div className="mb-4 d-flex justify-content-between align-items-center">
                                <div className="w-20 mr-3 position-relative">
                                    <input
                                        className="form-control"
                                        style={{ width: "180px" }}
                                        list="datalistOptions"
                                        id="exampleDataList"
                                        placeholder="Pesquisar eletiva..."
                                        value={searchText}
                                        onChange={handleSearchChange}
                                    />
                                    <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-2"></i>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button
                                        className={`btn ${showEletivas ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setShowEletivas(true)}
                                        style={{ marginRight: "100px" }}
                                    >
                                        Eletivas
                                    </button>
                                    <button
                                        className={`btn ${showEletivas ? 'btn-secondary' : 'btn-primary'}`}
                                        onClick={() => setShowEletivas(false)}
                                        style={{ marginRight: "80px" }}
                                    >
                                        Trilhas
                                    </button>
                                </div>
                                <button className="btn btn-primary" onClick={toggleModal}>Criar Novo</button>
                            </div>
                            {filteredItems.length > 0 ? (
                                <table className="table table-striped table-hover custom-table">
                                    <thead className="table">
                                        <tr>
                                            <th className='text-center'>Nome</th>
                                            <th className='text-center'>Horários</th>
                                            <th className='text-center'>Turma</th>
                                            <th className='text-center'>Vagas Disponíveis</th>
                                            <th className='text-center'>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((item, index) => (
                                            <tr key={index}>
                                                <td className='text-center'>{item.descricao}</td>
                                                <td className='text-center'>{item.horarios}</td>
                                                <td className='text-center'>{item.turma}</td>
                                                <td className='text-center'>{item.vagas}</td>
                                                <td className='d-flex justify-content-center gap-3'>

                                                    <i class="bi bi-pencil-square"></i>
                                                    <i class="bi bi-trash3"></i>


                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p> Não há nenhum item com esse nome</p>
                            )
                            }
                            {/* Paginação */}
                            <nav aria-label="Page navigation example" className="custom-pagination">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
                                    </li>
                                    {[...Array(Math.ceil(filteredItems.length / itemsPerPage)).keys()].map((number) => (
                                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(number + 1)}>{number + 1}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === Math.ceil(filteredItems.length / itemsPerPage) ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}>Próximo</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
            {/* Modal */}
            {isModalOpen && (
                <div class="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Título do Modal</h5>
                            <button type="button" className="btn-close" onClick={toggleModal}></button>
                        </div>
                        <div className="modal-body">
                            <p>Este é um exemplo de conteúdo dentro do modal. Você pode adicionar texto, formulários ou qualquer outro elemento aqui.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={toggleModal}>Fechar</button>
                            <button type="button" className="btn btn-primary">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}