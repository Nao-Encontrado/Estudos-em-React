import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, Modal, Flatlist, ScrollView } from "react-native";

export default function jogoAdivinhacao() {
  //Estado que define o número aleatoriamente de 0 a 100
  const [numeroSorteado, setNumeroSorteado] = useState(Math.floor(Math.random() * 101));

  //Estado que mantêm o número de tentativas feitas pelo usuário
  const [palpite, setPalpite] = useState("");

  //Estado que exibe mensagem de feedback ao usuário
  const [tentativas, setTentativas] = useState("Adivinhe o número!");

  //Estado que exibe o ranking com os 10 melhores resultados
  const [ranking, setRanking] = useState(Array(10).fill({nome: "-", tentativas: Infinity}));

  //Estado que armazena o nome do jogador que deve ser adicionado ao ranking
  const [nomeJogador, setNomeJogador] = useState("");

  //Função chamada ao jogador definir o palpite
  const chutar = () => {
    const palpiteConvertido = parseInt(palpite);

    // validação: verifica se o valor digitado é um número válido
    if(isNaN(palpiteConvertido)) {
      setMensagem("Digite um número válido!");
      return
    }

    // Incrementa o número de tentativas
    setTentativas(tentativas + 1);

    // Verifica se o palpite está correto
    if(palpiteConvertido === numeroSorteado) {
      setMensagem(`Parabéns, você acertou depois de ${tentativas + 1} tentativas. O número era ${numeroSorteado}.`)
      
      // Chama a função para verificar se o jogador entra no ranking
      verificarRanking(tentativas + 1);
    } else if (palpiteConvertido < numeroSorteado) {
      // Palpite abaixo do número sorteado
      setMensagem("Você errou, o número sorteado é MAIOR!!!")
    } else (
      // Palpite acima do número sorteado
      setMensagem("Você errou, o número sorteado é MENOR!!!")
    )

    //Limpa o campo de input para uma nova tentativa
    setPalpite("");
  }

  // Função que verifica se o jogador entra nos 10 melhores
  const verificarRanking = (tentativasAtual) => {
    // Cria uma cópia do ranking para análise
    const novoRanking = [...ranking];
    const indice = novoRanking.findIndex((entry) => tentativasAtual < entry.tentativas);

    // Se o jogador tem desempenho melhor que outro, exibe o modal
    if (indice !== -1) {
      setMostrarModal(true);
    }
  };

  // Função que salva o jogador no ranking
  const salvarNoRanking = () => {
    const novoRanking = [...ranking];

    // Adiciona o novo jogador ao ranking
    novoRanking.push({ nome: nomeJogador, tentativas: tentativas});

    // Ordena o ranking pelo número de tentativas
    novoRanking.sort((a, b) => a.tentativas - b.tentativas);

    // Mantém apenas os 10 melhores jogadores
    setRanking(novoRanking.slice(0, 10));

    // Fecha o modal e limpa o campo de nome
    setMostrarModal(false);
    setNomeJogador("");
  }

  // Função que reinicia o jogo
  const recomecarJogo = () => {
    // Gera um novo número aleatório
    setNumeroSorteado(Math.floor(Math.random() * 101));

    // Reseta os estados para o início do jogo
    setPalpite("");
    setTentativas("");
    setMensagem("Adivinhe o número!");
  };

  return (
    <ScrollView style = {estilos.scroll}>
      <View style = {estilo.container}>
        {/* Exibe o logo e o título do jogo */}
        <Image source={require("./assets/adivinha.png")} style = {estilos.logo} />
        <Text style = {estilos.titulo}>Qual é o número?</Text>
        <Text style = {estilo.txt}>Tente adivinhar o número que o sistema sorteou entre 1 e 100</Text>
        <Text style = {estilo.mensagem}>{mensagem}</Text>
      </View>
    </ScrollView>
  )
};