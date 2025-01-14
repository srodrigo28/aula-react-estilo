import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Pessoa {
  id?: number;
  nome: string;
  sexo: string;
  telefone: string;
  salario: number;
}

const App: React.FC = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [busca, setBusca] = useState('');
  const [formData, setFormData] = useState<Pessoa>({ nome: '', sexo: '', telefone: '', salario: 0 });
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
  const [totalPaginas, setTotalPaginas] = useState(1); // Total de páginas

  const API_URL = 'http://localhost:3001/pessoas';
  const LIMITE_POR_PAGINA = 5; // Número de registros por página

  // Carregar dados da API com paginação
  useEffect(() => {
    axios
      .get(`${API_URL}?_page=${paginaAtual}&_limit=${LIMITE_POR_PAGINA}`)
      .then((response) => {
        setPessoas(response.data);
        const totalItens = Number(response.headers['x-total-count']); // Cabeçalho com total de registros
        setTotalPaginas(Math.ceil(totalItens / LIMITE_POR_PAGINA));
      });
  }, [paginaAtual]);

  // Adicionar ou editar pessoa
  const salvarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      await axios.put(`${API_URL}/${formData.id}`, formData);
    } else {
      await axios.post(API_URL, formData);
    }
    setFormData({ nome: '', sexo: '', telefone: '', salario: 0 });
    carregarDados();
  };

  // Carregar dados novamente
  const carregarDados = () => {
    axios
      .get(`${API_URL}?_page=${paginaAtual}&_limit=${LIMITE_POR_PAGINA}`)
      .then((response) => setPessoas(response.data));
  };

  // Excluir pessoa
  const excluirPessoa = async (id: number | undefined) => {
    await axios.delete(`${API_URL}/${id}`);
    carregarDados();
  };

  // Navegar entre páginas
  const irParaPagina = (pagina: number) => {
    if (pagina > 0 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  };

  return (
    <div>
      <h1>CRUD de Pessoas com Paginação</h1>

      {/* Formulário */}
      <form onSubmit={salvarPessoa} >
        <div >
          <input
            type="text"
            placeholder="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
           
          />
          <input
            type="text"
            placeholder="Sexo"
            value={formData.sexo}
            onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
           
          />
          <input
            type="text"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
           
          />
          <input
            type="number"
            placeholder="Salário"
            value={formData.salario}
            onChange={(e) => setFormData({ ...formData, salario: Number(e.target.value) })}
           
          />
        </div>
        <button
          type="submit"
          
        >
          {formData.id ? 'Editar' : 'Adicionar'}
        </button>
      </form>

      {/* Campo de Busca */}
      <input
        type="text"
        placeholder="Buscar por nome..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        
      />

      {/* Tabela de Dados */}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sexo</th>
            <th>Telefone</th>
            <th>Salário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas
            .filter((pessoa) =>
              pessoa.nome.toLowerCase().includes(busca.toLowerCase())
            )
            .map((pessoa) => (
              <tr key={pessoa.id}>
                <td>{pessoa.nome}</td>
                <td>{pessoa.sexo}</td>
                <td>{pessoa.telefone}</td>
                <td>R$ {pessoa.salario.toFixed(2)}</td>
                <td>
                  <button onClick={() => setFormData(pessoa)}>
                    Editar
                  </button>
                  <button onClick={() => excluirPessoa(pessoa.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div>
        <button onClick={() => irParaPagina(paginaAtual - 1)}>
          Anterior
        </button>
        <span> {`Página ${paginaAtual} de ${totalPaginas}`} </span>
        <button onClick={() => irParaPagina(paginaAtual + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
};

export default App;
