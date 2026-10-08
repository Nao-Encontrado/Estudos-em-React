import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import * as AutenticacaoLocal from 'expo-local-authentication';
import { buscarSenhaMestra } from '../servicos/servicoArmazenamento';

export default function TelaAcesso({ aoConfirmarAcesso }) {
  const [senhaDigitada, setSenhaDigitada] = useState('');
  const [suporteBiometrico, setSuporteBiometrico] = useState(false);

  useEffect(() => {
    inicializarAutenticacaoBiometrica();
  }, []);

  // Avalia o hardware biométrico e executa a verificação física
  const inicializarAutenticacaoBiometrica = async () => {
    try {
      const possuiHardware = await AutenticacaoLocal.hasHardwareAsync();
      const possuiCadastro = await AutenticacaoLocal.isEnrolledAsync();
      setSuporteBiometrico(possuiHardware && possuiCadastro);

      if (possuiHardware && possuiCadastro) {
        const resultado = await AutenticacaoLocal.authenticateAsync({
          promptMessage: 'Identificação Biométrica - Cofre Secreto',
          cancelLabel: 'Inserir Senha Numérica',
          disableDeviceFallback: true,
        });

        if (resultado.success) {
          aoConfirmarAcesso();
        }
      }
    } catch (falha) {
      console.error('Erro na chamada biométrica:', falha);
    }
  };

  // Validação manual alternativa da senha numérica
  const executarValidacaoManual = async () => {
    const credencialCadastrada = await buscarSenhaMestra();
    if (senhaDigitada === credencialCadastrada) {
      setSenhaDigitada('');
      aoConfirmarAcesso();
    } else {
      Alert.alert('Autenticação Recusada', 'A senha digitada está incorreta.');
      setSenhaDigitada('');
    }
  };

  return (
    <View style={estilos.areaPrincipal}>
      <Text style={estilos.tituloPrincipal}>Cofre Confidencial</Text>
      <Text style={estilos.descricaoSeguranca}>
        Acesso Exclusivo por Identificação Segura
      </Text>

      {suporteBiometrico && (
        <TouchableOpacity
          style={estilos.botaoAcaoBiometria}
          onPress={inicializarAutenticacaoBiometrica}
        >
          <Text style={estilos.rotuloBotaoDestaque}>Autenticar por Biometria</Text>
        </TouchableOpacity>
      )}

      <View style={estilos.divisorHorizontal}>
        <View style={estilos.linhaDivisora} />
        <Text style={estilos.textoDivisao}>ou utilize a credencial numérica</Text>
        <View style={estilos.linhaDivisora} />
      </View>

      <TextInput
        style={estilos.campoEntradaTexto}
        placeholder="Digite a senha de 4 dígitos"
        placeholderTextColor="#64748b"
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
        value={senhaDigitada}
        onChangeText={setSenhaDigitada}
      />

      <TouchableOpacity
        style={estilos.botaoConfirmarSenha}
        onPress={executarValidacaoManual}
      >
        <Text style={estilos.rotuloBotaoDestaque}>Destravar Cofre</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  areaPrincipal: {
    flex: 1,
    backgroundColor: '#090d16',
    justifyContent: 'center',
    padding: 24,
  },
  tituloPrincipal: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
  },
  descricaoSeguranca: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 6,
  },
  campoEntradaTexto: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  botaoAcaoBiometria: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  botaoConfirmarSenha: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  rotuloBotaoDestaque: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  divisorHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  linhaDivisora: {
    flex: 1,
    height: 1,
    backgroundColor: '#1e293b',
  },
  textoDivisao: {
    color: '#64748b',
    paddingHorizontal: 8,
    fontSize: 11,
  },
});
