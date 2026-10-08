import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import TelaAcesso from './fontes/telas/TelaAcesso';
import TelaCofre from './fontes/telas/TelaCofre';
import TelaConfiguracoes from './fontes/telas/TelaConfiguracoes';

export default function App() {
  // Controle de estados principais de sessão e tela visível
  const [sessaoAutenticada, setSessaoAutenticada] = useState(false);
  const [telaAtiva, setTelaAtiva] = useState('cofre'); // 'cofre' ou 'configuracoes'

  // Procedimento de encerramento da sessão ativa e retorno ao bloqueio
  const encerrarSessao = () => {
    setSessaoAutenticada(false);
    setTelaAtiva('cofre');
  };

  return (
    <SafeAreaView style={estilos.conteinerRaiz}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      {!sessaoAutenticada ? (
        <TelaAcesso aoConfirmarAcesso={() => setSessaoAutenticada(true)} />
      ) : telaAtiva === 'cofre' ? (
        <TelaCofre
          aoNavegarConfiguracoes={() => setTelaAtiva('configuracoes')}
          aoTrancarCofre={encerrarSessao}
        />
      ) : (
        <TelaConfiguracoes aoRetornarAoCofre={() => setTelaAtiva('cofre')} />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  conteinerRaiz: {
    flex: 1,
    backgroundColor: '#090d16',
  },
});
