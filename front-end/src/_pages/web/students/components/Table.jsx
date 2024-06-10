import React, { useState } from 'react';

const Tabela = ({ data, currentPage, itemsPerPage, onPageChange }) => {
  const [sortBy, setSortBy] = useState({ column: 'nome', asc: true });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  // Função para alternar a ordenação da tabela
  const toggleSort = (coluna) => {
    if (sortBy.column === coluna) {
      setSortBy({ ...sortBy, asc: !sortBy.asc });
    } else {
      setSortBy({ column: coluna, asc: true });
    }
  };

  // Ordenar os dados com base na coluna selecionada e na direção de ordenação
  const sortedData = data.slice().sort((a, b) => {
    const comparacao = sortBy.asc ? 1 : -1;
    return a[sortBy.column].localeCompare(b[sortBy.column]) * comparacao;
  });

  // Paginar os dados ordenados
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Funções para abrir os modais de redefinir senha, alterar aluno e excluir aluno
  const abrirModalRedefinirSenha = (matricula) => {
    console.log("Redefinir senha do aluno com matrícula:", matricula);
  };

  const abrirModalAlterarAluno = (matricula) => {
    console.log("Alterar dados do aluno com matrícula:", matricula);
  };

  const abrirModalExcluirAluno = (matricula) => {
    console.log("Excluir aluno com matrícula:", matricula);
  };

  return (
    <div className='table-responsive'>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th onClick={() => toggleSort('nome')} style={{ cursor: 'pointer' }}>
              <span className='d-flex justify-content-between align-items-center'>
                <p className='m-0'>Nome</p>
                <i className="bi bi-arrow-down-up"></i>
              </span>
            </th>
            <th colSpan="2">Eletivas</th>
            <th></th>
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>
                <p className='m-0'>{item.matricula}</p>
              </td>
              <td>
                <p className='m-0'>{item.nome}</p>
              </td>
              <td colSpan="2">
                {Array.isArray(item.eletivas) ? (
                  item.eletivas.map((eletiva, eletivaIndex) => (
                    <p key={eletivaIndex} className="badge bg-secondary m-0 me-2 fw-normal">{eletiva}</p>
                  ))
                ) : null}
              </td>
              <td>
                <span className='d-flex gap-2'>
                  <i className="bi bi-arrow-clockwise" data-bs-toggle="modal" data-bs-target="#resetarAluno" onClick={() => abrirModalRedefinirSenha(item.matricula)}></i>
                  <i className="bi bi-pencil-square" data-bs-toggle="modal" data-bs-target="#alterarAluno" onClick={() => abrirModalAlterarAluno(item.matricula)}></i>
                  <i className="bi bi-trash3" data-bs-toggle="modal" data-bs-target="#excluirAluno" onClick={() => abrirModalExcluirAluno(item.matricula)}></i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center">
        <p className='m-0'>Mostrando {startIndex + 1} a {endIndex} de {data.length} alunos cadastrados.</p>
        <nav aria-label="Navegação de página">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>Anterior</button>
            </li>
            {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map((pageNumber) => (
              <li key={pageNumber} className={`page-item ${currentPage === pageNumber + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(pageNumber + 1)}>{pageNumber + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === Math.ceil(data.length / itemsPerPage) ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>Próxima</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Tabela;
