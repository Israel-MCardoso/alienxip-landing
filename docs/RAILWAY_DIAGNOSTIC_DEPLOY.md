# Diagnostico no Railway

Este projeto usa Vite + React no front-end e um servidor Node simples em `server/railway-server.mjs` para servir o build e expor a API segura do relatorio.

## Build e start

Configure o Railway para executar:

```bash
npm run build
npm run start:railway
```

O script `start:railway` usa `process.env.PORT`, que e fornecido automaticamente pelo Railway.

## Variaveis obrigatorias

Crie estas variaveis no Railway:

```bash
RESEND_API_KEY=sua_chave_aqui
REPORT_RECIPIENT_EMAIL=comercial@alienxip.com.br
RESEND_FROM_EMAIL=Diagnostico <diagnostico@alienxip.com.br>
NEXT_PUBLIC_DIAGNOSTIC_URL=https://diagnostico.alienxip.com.br
```

`RESEND_API_KEY` nunca deve ser exposta no front-end. A landing chama apenas `/api/send-diagnostic-report`, e o servidor Railway envia o e-mail via Resend.

## Subdominio do diagnostico

1. Adicione o dominio principal no Railway, por exemplo `alienxip.com.br`.
2. Adicione tambem o subdominio `diagnostico.alienxip.com.br` no mesmo servico Railway.
3. Aponte o DNS conforme as instrucoes do Railway.
4. Defina `NEXT_PUBLIC_DIAGNOSTIC_URL=https://diagnostico.alienxip.com.br`.

O app detecta automaticamente hosts que comecam com `diagnostico.` e abre a experiencia de diagnostico diretamente. Em ambiente local, o fallback e `/diagnostico`.

## Rotas

- `/` exibe a landing principal.
- `/diagnostico` exibe apenas o fluxo de diagnostico.
- `diagnostico.alienxip.com.br` tambem abre diretamente o diagnostico.
- `/api/send-diagnostic-report` recebe o payload validado e envia o e-mail via Resend.
