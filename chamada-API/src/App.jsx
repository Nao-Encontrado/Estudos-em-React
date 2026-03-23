import { useState, useEffect } from "react"

function App() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setUsuarios(dados)
        setCarregando(false)
      })
  }, [])

  return <div>
    <p>{carregando ? "carregando..." : "Aqui estão os usuários!"}</p>
    <ul>
      {usuarios.map((user, index) => (
        <li key={index}> {user.name} </li>
      ))}
    </ul>
  </div>
}

export default App