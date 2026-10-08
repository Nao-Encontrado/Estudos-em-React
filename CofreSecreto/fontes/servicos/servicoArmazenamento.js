import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes de identificação de armazenamento local
const CHAVE_ARMAZENAMENTO_DIARIO = '@cofre_registros_secretos';
const CHAVE_ARMAZENAMENTO_SENHA = '@cofre_credencial_mestra';
const SENHA_PADRAO_SISTEMA = '1234';

// Recupera a senha mestra salva ou define a senha padrão no primeiro acesso
export const buscarSenhaMestra = async () => {
  try {
    const credencialSalva = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO_SENHA);
    return credencialSalva !== null ? credencialSalva : SENHA_PADRAO_SISTEMA;
  } catch (falha) {
    console.error('Falha ao consultar credencial local:', falha);
    return SENHA_PADRAO_SISTEMA;
  }
};

// Grava uma nova senha numérica definida pelo operador
export const salvarNovaSenhaMestra = async (novaCredencial) => {
  try {
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO_SENHA, novaCredencial);
    return true;
  } catch (falha) {
    console.error('Falha ao atualizar credencial mestra:', falha);
    return false;
  }
};

// Retorna todas as memórias confidenciais registradas
export const carregarMemoriasDiario = async () => {
  try {
    const dadosSerializados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO_DIARIO);
    return dadosSerializados ? JSON.parse(dadosSerializados) : [];
  } catch (falha) {
    console.error('Falha ao obter registros do diário:', falha);
    return [];
  }
};

// Atualiza a base de registros confidenciais com a nova coleção
export const persistirMemoriasDiario = async (listaAtualizada) => {
  try {
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO_DIARIO, JSON.stringify(listaAtualizada));
    return true;
  } catch (falha) {
    console.error('Falha ao persistir registros do diário:', falha);
    return false;
  }
};
