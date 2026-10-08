import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Linking
} from 'react-native';
import * as SeletorImagem from 'expo-image-picker';
import {
  carregarMemoriasDiario,
  persistirMemoriasDiario
} from '../servicos/servicoArmazenamento';

export default function TelaCofre({ aoNavegarConfiguracoes, aoTrancarCofre }) {
  const [registros, setRegistros] = useState([]);
  const [tituloRegistro, setTituloRegistro] = useState('');
  const [textoRegistro, setTextoRegistro] = useState('');
  const [dataRegistro, setDataRegistro] = useState('');
  const [linkComplementar, setLinkComplementar] = useState('');
  const [imagemAnexoUri, setImagemAnexoUri] = useState(null);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    const dadosLocais = await carregarMemoriasDiario();
    setRegistros(dadosLocais);
  };

  // Solicita permissão e abre a galeria do smartphone
  const selecionarImagemGaleria = async () => {
    const permissao = await SeletorImagem.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        'Autorização Recusada',
        'O aplicativo requer acesso à galeria para anexar imagens.'
      );
      return;
    }

    const resultadoGaleria = await SeletorImagem.launchImageLibraryAsync({
      mediaTypes: SeletorImagem.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
    });

    if (!resultadoGaleria.canceled && resultadoGaleria.assets.length > 0) {
      setImagemAnexoUri(resultadoGaleria.assets[0].uri);
    }
  };

  // Salva nova memória no cofre
  const gravarRegistroNoDiario = async () => {
    if (!tituloRegistro.trim() || !textoRegistro.trim()) {
      Alert.alert('Incompletude', 'Informe ao menos o título e o relato confidencial.');
      return;
    }

    const novoItemDiario = {
      identificador: Date.now().toString(),
      data: dataRegistro.trim() || new Date().toLocaleDateString('pt-BR'),
      titulo: tituloRegistro.trim(),
      texto: textoRegistro.trim(),
      link: linkComplementar.trim(),
      imagem: imagemAnexoUri,
    };

    const listaAtualizada = [novoItemDiario, ...registros];
    const salvouComSucesso = await persistirMemoriasDiario(listaAtualizada);

    if (salvouComSucesso) {
      setRegistros(listaAtualizada);
      setTituloRegistro('');
      setTextoRegistro('');
      setDataRegistro('');
      setLinkComplementar('');
      setImagemAnexoUri(null);
      Alert.alert('Sucesso', 'Registro arquivado com segurança.');
    }
  };

  const abrirEnderecoExterno = (endereco) => {
    if (!endereco) return;
    const urlValidada = endereco.startsWith('http') ? endereco : `https://${endereco}`;
    Linking.openURL(urlValidada).catch(() => {
      Alert.alert('Falha', 'Não foi possível carregar a URL indicada.');
    });
  };

  return (
    <View style={estilos.painelCofre}>
      <View style={estilos.barraSuperiorNavegacao}>
        <Text style={estilos.logotipoTexto}>Cofre de Registros</Text>
        <View style={estilos.grupoBotoesCabecalho}>
          <TouchableOpacity
            style={estilos.botaoPainelSecundario}
            onPress={aoNavegarConfiguracoes}
          >
            <Text style={estilos.textoAcaoSecundaria}>Ajustes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={estilos.botaoBloqueioImediato}
            onPress={aoTrancarCofre}
          >
            <Text style={estilos.textoAcaoSecundaria}>Trancar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={registros}
        keyExtractor={(item) => item.identificador}
        ListHeaderComponent={
          <View style={estilos.formularioAdicao}>
            <Text style={estilos.rotuloSecao}>Nova Memória Confidencial</Text>

            <TextInput
              style={estilos.campoEntrada}
              placeholder="Título"
              placeholderTextColor="#64748b"
              value={tituloRegistro}
              onChangeText={setTituloRegistro}
            />

            <TextInput
              style={estilos.campoEntrada}
              placeholder="Data (opcional)"
              placeholderTextColor="#64748b"
              value={dataRegistro}
              onChangeText={setDataRegistro}
            />

            <TextInput
              style={[estilos.campoEntrada, estilos.campoAreaMaior]}
              placeholder="Relato confidencial"
              placeholderTextColor="#64748b"
              multiline
              value={textoRegistro}
              onChangeText={setTextoRegistro}
            />

            <TextInput
              style={estilos.campoEntrada}
              placeholder="Link complementar (opcional)"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              value={linkComplementar}
              onChangeText={setLinkComplementar}
            />

            <TouchableOpacity
              style={estilos.botaoAnexarMidia}
              onPress={selecionarImagemGaleria}
            >
              <Text style={estilos.textoBotaoAnexo}>
                {imagemAnexoUri ? 'Modificar Foto Anexa' : 'Anexar Foto da Galeria'}
              </Text>
            </TouchableOpacity>

            {imagemAnexoUri && (
              <Image
                source={{ uri: imagemAnexoUri }}
                style={estilos.previsualizacaoImagem}
              />
            )}

            <TouchableOpacity
              style={estilos.botaoSalvarMemoria}
              onPress={gravarRegistroNoDiario}
            >
              <Text style={estilos.rotuloSalvar}>Salvar no Cofre</Text>
            </TouchableOpacity>

            <Text style={estilos.rotuloSecao}>Memórias Gravadas no Cofre</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={estilos.blocoCartaoRegistro}>
            <View style={estilos.linhaCabecalhoCartao}>
              <Text style={estilos.tituloCartao}>{item.titulo}</Text>
              <Text style={estilos.dataCartao}>{item.data}</Text>
            </View>
            <Text style={estilos.corpoTextoCartao}>{item.texto}</Text>
            {item.link ? (
              <TouchableOpacity onPress={() => abrirEnderecoExterno(item.link)}>
                <Text style={estilos.linkCartao}>Abrir hiperlink associado</Text>
              </TouchableOpacity>
            ) : null}
            {item.imagem && (
              <Image
                source={{ uri: item.imagem }}
                style={estilos.imagemCardPersistida}
              />
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={estilos.avisoVazio}>
            Nenhum registro confidencial catalogado.
          </Text>
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  painelCofre: {
    flex: 1,
    backgroundColor: '#090d16',
    paddingHorizontal: 16,
    paddingTop: 46,
  },
  barraSuperiorNavegacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  logotipoTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  grupoBotoesCabecalho: {
    flexDirection: 'row',
  },
  botaoPainelSecundario: {
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  botaoBloqueioImediato: {
    backgroundColor: '#dc2626',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  textoAcaoSecundaria: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  formularioAdicao: {
    marginVertical: 14,
  },
  rotuloSecao: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginVertical: 10,
  },
  campoEntrada: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    marginBottom: 10,
  },
  campoAreaMaior: {
    minHeight: 85,
    textAlignVertical: 'top',
  },
  botaoAnexarMidia: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBotaoAnexo: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  previsualizacaoImagem: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  botaoSalvarMemoria: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 14,
  },
  rotuloSalvar: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  blocoCartaoRegistro: {
    backgroundColor: '#131b2e',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  linhaCabecalhoCartao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tituloCartao: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  dataCartao: {
    color: '#64748b',
    fontSize: 11,
  },
  corpoTextoCartao: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  linkCartao: {
    color: '#38bdf8',
    fontSize: 12,
    textDecorationLine: 'underline',
    marginBottom: 6,
  },
  imagemCardPersistida: {
    width: '100%',
    height: 190,
    borderRadius: 6,
    marginTop: 6,
  },
  avisoVazio: {
    color: '#64748b',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 12,
  },
});
