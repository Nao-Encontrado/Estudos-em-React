import { useEffect, useState } from "react";
import "./App.css"

function App() {
  const [transacoes, setTransacoes] = useState([])
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [tipo, setTipo] = useState("receita")

  // 1. busca as transações do servidor ao carregar
  useEffect(() => {
    fetch("http://localhost:3001/transacoes")
      .then((res) => res.json())
      .then((dados) => setTransacoes(dados))
  }, [])

  // 2. atualiza a função AddTransacao para enviar para o servidor
  function AddTransacao() {
    // 1. se descricao ou valor estiverem vazios, return
    if (descricao == "" || valor == "") return

    // 2. cria um objeto nova transação com id, descricao, valor e tipo
    const novaTransacao = {
      id: Date.now(),
      descricao: descricao,
      valor: valor,
      tipo: tipo
    }

    fetch("http://localhost:3001/transacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaTransacao)
    })
      .then((res) => res.json())
      .then((dados) => {
        setTransacoes([...transacoes, dados])
        setDescricao("")
        setValor("")
      })
  }

  const saldo = transacoes.reduce((total, t) => {
    if (t.tipo === "receita") return total + Number(t.valor)
    if (t.tipo === "despesa") return total - Number(t.valor)
    return total
  }, 0)

  function LimparDados() {
    fetch("http://localhost:3001/transacoes/limpar", {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then((resposta) => {setTransacoes([])
      console.log(resposta.mensagem)
      })
  }

  return (
    <div className="mainContainer">
      <h1>Finance</h1>
    
      <div className="mainForm">
        <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} type="text" />
        <input placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} type="text" />
        
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <button onClick={AddTransacao}>Adicionar</button>
      </div>
      <ul>
        {transacoes.map((t => (
          <li key={t.id}>
            <span>{t.descricao}</span>
            <span>{t.tipo === "receita" ? " + " : " - "} R$ {t.valor}</span>
          </li>
        )))}
      </ul>
      <h2>Saldo: R$ {saldo}</h2>
      <button onClick={LimparDados}>Zerar saldo</button>
    </div>
  )
}

export default App