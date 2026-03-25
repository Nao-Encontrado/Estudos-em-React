import { useState } from "react"

function App() {
  const [tarefa, setTarefa] = useState("")
  const [tarefas, setTarefas] = useState([])
  const [contador, setContador] = useState(0)

  function adicionarTarefa() {
    if (tarefa === "") return
    setTarefas([...tarefas, tarefa])
    setTarefa("")
  }

  function AddContador() {
    if (contador === 10) {
      return
    }
    setContador(contador + 1)
  }

  function SubContador() {
    if (contador === 0) {
      return
    }
    setContador(contador - 1)
  }

  return (
    <div>
      <h2>Digite uma tarefa:</h2>
      <input
        value={tarefa}
        onChange={(e) => setTarefa(e.target.value)}
      />
      <button onClick={adicionarTarefa}>
        Adicionar
      </button>

      <ul>
        {tarefas.map((t, index) => (
          <li key={index}>{t}</li>
        ))}
      </ul>

      <div>
        <h2>{contador}</h2>
        <button onClick={SubContador}>-</button>
        <button onClick={AddContador}>+</button>
      </div>
    </div>
  )
}

export default App