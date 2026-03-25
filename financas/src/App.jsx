import { useState } from "react";

function App() {
  const [transacoes, setTransacoes] = useState([])
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [tipo, setTipo] = useState("")

  function AddTransacao() {
    // 1. se descricao ou valor estiverem vazios, return
    if (descricao == "" || valor == "") return
    // 2. cria um objeto nova transação com id, descricao, valor e tipo

    // 3. adiciona ao array de transacoes
    // 4. limpa os campos
  }

  return (
    <div>
      <h1>Finance</h1>
    
      <input placeholder="Descrição" value={descricao} onChange={setDescricao} type="text" />
      <input placeholder="Valor" value={valor} onChange={setValor} type="text" />
      
      <select value={tipo} onChange={setTipo}>
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>

      <button onClick={AddTransacao}>Adicionar</button>
      
    </div>
  )
}

export default App