import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    dataPrevista: "",
    status: "Pendente",
  });

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");

    if (tarefasSalvas) {
      setTarefas(JSON.parse(tarefasSalvas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  function alterarCampo(evento) {
    setForm({
      ...form,
      [evento.target.name]: evento.target.value,
    });
  }

  function validarFormulario() {
    if (form.titulo.trim() === "") {
      alert("O título da tarefa é obrigatório.");
      return false;
    }

    if (!form.dataPrevista) {
      alert("A data prevista deve ser válida.");
      return false;
    }

    return true;
  }

  function salvarTarefa(evento) {
    evento.preventDefault();

    if (!validarFormulario()) return;

    if (editandoId !== null) {
      const tarefasAtualizadas = tarefas.map((tarefa) =>
          tarefa.id === editandoId ? { id: editandoId, ...form } : tarefa
      );

      setTarefas(tarefasAtualizadas);
      setEditandoId(null);
    } else {
      const novaTarefa = {
        id: Date.now(),
        ...form,
      };

      setTarefas([...tarefas, novaTarefa]);
    }

    setForm({
      titulo: "",
      descricao: "",
      dataPrevista: "",
      status: "Pendente",
    });
  }

  function editarTarefa(tarefa) {
    setForm({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      dataPrevista: tarefa.dataPrevista,
      status: tarefa.status,
    });

    setEditandoId(tarefa.id);
  }

  function excluirTarefa(id) {
    const confirmar = confirm("Deseja realmente excluir esta tarefa?");

    if (confirmar) {
      setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
    }
  }

  const tarefasPesquisadas = tarefas.filter((tarefa) =>
      tarefa.titulo.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
      <div className="container">
        <h1>To-do List</h1>
        <p className="subtitulo">Desafio Técnico - Estágio Programação</p>

        <form className="formulario" onSubmit={salvarTarefa}>
          <input
              type="text"
              name="titulo"
              placeholder="Título da tarefa"
              value={form.titulo}
              onChange={alterarCampo}
          />

          <textarea
              name="descricao"
              placeholder="Descrição da tarefa"
              value={form.descricao}
              onChange={alterarCampo}
          />

          <input
              type="date"
              name="dataPrevista"
              value={form.dataPrevista}
              onChange={alterarCampo}
          />

          <select name="status" value={form.status} onChange={alterarCampo}>
            <option value="Pendente">Pendente</option>
            <option value="Concluída">Concluída</option>
          </select>

          <button type="submit">
            {editandoId !== null ? "Atualizar tarefa" : "Adicionar tarefa"}
          </button>
        </form>

        <input
            className="pesquisa"
            type="text"
            placeholder="Pesquisar tarefas..."
            value={pesquisa}
            onChange={(evento) => setPesquisa(evento.target.value)}
        />

        <div className="lista">
          {tarefasPesquisadas.length === 0 ? (
              <p className="mensagem">Nenhuma tarefa encontrada.</p>
          ) : (
              tarefasPesquisadas.map((tarefa) => (
                  <div className="card" key={tarefa.id}>
                    <h2>{tarefa.titulo}</h2>
                    <p>{tarefa.descricao}</p>

                    <p>
                      <strong>Data prevista:</strong> {tarefa.dataPrevista}
                    </p>

                    <p>
                      <strong>Status:</strong> {tarefa.status}
                    </p>

                    <div className="acoes">
                      <button onClick={() => editarTarefa(tarefa)}>Editar</button>

                      <button
                          className="excluir"
                          onClick={() => excluirTarefa(tarefa.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );
}

export default App;