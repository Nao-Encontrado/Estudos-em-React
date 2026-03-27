const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express()
app.use(cors())
app.use(express.json())

const arquivo = "./dados.json"

// GET para retornar as transações do usuário
app.get("/transacoes", (req, res) => {
    const dados = JSON.parse(fs.readFileSync(arquivo))
    res.json(dados.transacoes)
})

// POST para adicionar uma nova transação
app.post("/transacoes", (req, res) => {
    const dados = JSON.parse(fs.readFileSync(arquivo))
    const novaTransacao = req.body
    dados.transacoes.push(novaTransacao)
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2))
    res.json(novaTransacao)
})

// DELETE para limpar o saldo do JSON
app.delete("/transacoes/limpar", (req, res) => {
    fs.writeFileSync(arquivo, JSON.stringify({ "transacoes": [] }, null, 2))
    res.json({ mensagem: "Dados apagados com sucesso!!!"})
})

if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(arquivo, JSON.stringify({ transacoes: []}, null, 2))
    console.log("arquivo criado com sucesso!!!")
}

app.listen(3001, () => console.log("servidor rodando na porta 3001"))
