// Bibliotecas
import { useState } from "react"

// 1. Defina o componente CartaoUsuario aqui em cima
function CartaoUsuario({ nome, email, cargo }) {
  const [curtidas, setCurtidas] = useState(0)

  return (
    <div>
      <h2>{nome}</h2>
      <p>{email}</p>
      <p>{cargo}</p>
      <p>Curitdas: {curtidas}</p>
      <button onClick={() => setCurtidas(curtidas + 1)}>
        Curtir
      </button>
    </div>
  )
}

// 2. No App, use o componente três vezes
function App() {
  return (
    <div>
      <CartaoUsuario nome="Ana" email="Anafarias@gmail.com" cargo="Desenvolvedora" />
      <CartaoUsuario nome="Rodrigo" email="Rodrigoborges@gmail.com" cargo="Analista de Qualidade" />
      <CartaoUsuario nome="Zion" email="z10nk41m@gmail.com" cargo="Desenvolverdor" />
    </div>
  )
}

export default App