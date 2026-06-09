# SECURITY

## Secrets

Não há secrets necessários para o frontend atual.

## Regras

- Não commitar `.env`.
- Não expor `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `WEBHOOK_SECRET`, `CLIENT_SECRET` ou `PRIVATE_KEY` no frontend.
- Variáveis públicas devem usar prefixo compatível com Vite quando necessário: `VITE_*`.
- Dados de formulário não devem ser logados em produção.

## Validação

O comando `npm run verify:env` falha se variáveis privadas conhecidas estiverem presentes no contrato de runtime frontend.

## Locais Permitidos Para Secrets

- GitHub Actions Secrets.
- Railway Variables.
- Cloudflare Dashboard.
- Gerenciador seguro aprovado.

## Incidente

Se uma chave for exposta:

1. Revogar/rotacionar imediatamente.
2. Remover do código/log.
3. Reexecutar CI.
4. Registrar incidente e prevenção.
