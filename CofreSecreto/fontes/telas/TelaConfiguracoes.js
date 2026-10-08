import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  buscarSenhaMestra,
  salvarNovaSenhaMestra
} from '../servicos/servicoArmazenamento';

export default function TelaConfiguracoes({ aoRetornarAoCofre }) {
  const [senhaVigente, setSenhaVigente] = useState('');
  const [senhaProposta, setSenhaProposta] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');

  const processarRedefinicaoSenha = async () => {
    const senhaGravada = await buscarSenhaMestra();

    if (senhaVigente !== senhaGravada) {
      Alert.alert('Validação Negada', 'A senha atual informada está incorreta.');
      return;
    }

    if (senhaProposta.length < 4) {
      Alert.alert('Critério de Segurança', 'A nova senha precisa ter ao menos 4 números.');
      return;
    }

    if (senhaProposta !== confirmacaoSenha) {
      Alert.alert('Inconsistência', 'A nova senha e a sua confirmação não coincidem.');
      return;
    }

    const gravadoComSucesso = await salvarNovaSenhaMestra(senhaProposta);

    if (gravadoComSucesso) {
      Alert.alert('Sucesso', 'Senha mestra alterada com sucesso.');
      aoRetornarAoCofre();
    } else {
      Alert.alert('Erro', 'Houve uma falha ao persistir a nova senha.');
    }
  };

  return (
    <View style={estilos.areaConfiguracao}>
      <Text style={estilos.tituloConfiguracao}>Redefinir Credencial</Text>
      <Text style={estilos.subtituloConfiguracao}>
        Altere a senha de contingência do cofre
      </Text>

      <TextInput
        style={estilos.campoSenha}
        placeholder="Senha atual"
        placeholderTextColor="#64748b"
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        value={senhaVigente}
        onChangeText={setSenhaVigente}
      />

      <TextInput
        style={estilos.campoSenha}
        placeholder="Nova senha"
        placeholderTextColor="#64748b"
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        value={senhaProposta}
        onChangeText={setSenhaProposta}
      />

      <TextInput
        style={estilos.campoSenha}
        placeholder="Confirme a nova senha"
        placeholderTextColor="#64748b"
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        value={confirmacaoSenha}
        onChangeText={setConfirmacaoSenha}
      />

      <TouchableOpacity
        style={estilos.botaoSalvarNovaSenha}
        onPress={processarRedefinicaoSenha}
      >
        <Text style={estilos.rotuloSalvarNovaSenha}>Salvar Nova Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={estilos.botaoVoltar} onPress={aoRetornarAoCofre}>
        <Text style={estilos.rotuloVoltar}>Retornar ao Cofre</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  areaConfiguracao: {
    flex: 1,
    backgroundColor: '#090d16',
    justifyContent: 'center',
    padding: 24,
  },
  tituloConfiguracao: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
  },
  subtituloConfiguracao: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 26,
    marginTop: 4,
  },
  campoSenha: {
    backgroundColor: '#131b2e',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 8,
    padding: 14,
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 12,
  },
  botaoSalvarNovaSenha: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  botaoVoltar: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  rotuloSalvarNovaSenha: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  rotuloVoltar: {
    color: '#94a3b8',
    fontSize: 13,
  },
});
