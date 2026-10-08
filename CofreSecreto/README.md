# Cofre Secreto — Biometria + Fallback por Senha

Aplicativo React Native (Expo) para armazenar notas confidenciais protegidas por
autenticação biométrica, com fallback de senha numérica de 4 dígitos (padrão: `1234`).

## Instalação

```bash
npx create-expo-app cofre-secreto --template blank
cd cofre-secreto
npx expo install expo-local-authentication @react-native-async-storage/async-storage expo-image-picker
```

Depois, substitua os arquivos gerados pelos deste projeto (App.js, app.json,
package.json e a pasta `fontes/`).

## Execução

1. Conecte o smartphone à mesma rede Wi-Fi do computador (ou use um cabo USB com depuração ativada).
2. Rode `npx expo start` no terminal.
3. Abra o app Expo Go e escaneie o QR code exibido.
4. No primeiro acesso, confirme a biometria (se cadastrada) ou use a senha padrão `1234`.
5. Cadastre notas com título, texto, data, link e foto da galeria.
6. Em "Ajustes", teste a alteração da senha mestra.

## Estrutura

```
cofre-secreto/
├── App.js
├── app.json
├── package.json
└── fontes/
    ├── telas/
    │   ├── TelaAcesso.js
    │   ├── TelaCofre.js
    │   └── TelaConfiguracoes.js
    └── servicos/
        └── servicoArmazenamento.js
```
