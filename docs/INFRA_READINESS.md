# INFRA_READINESS

## GitHub

Status local:

- Repositório Git local deve existir.
- Branch `main` deve existir.
- Branch `staging` deve existir.
- Remote GitHub ainda depende de ação humana.

Configuração necessária no GitHub:

- Repositório privado ou organizacional.
- Branch protection em `main`.
- Branch protection em `staging`.
- Required checks:
  - `Deploy / build`
  - `Playwright / test`
- Pull request obrigatório.
- Force push bloqueado.
- Environments:
  - `staging`
  - `production`

## Railway

Arquivos prontos:

- `railway.json`
- `package.json` com `start:railway`

Configuração esperada:

- Environment `Staging` conectado à branch `staging`.
- Environment `Production` conectado à branch `main`.
- Build command: `npm ci && npm run build`.
- Start command: `npm run start:railway`.
- Healthcheck: abrir `/`.
- Logs habilitados.
- Rollback via deployment anterior.

## Cloudflare

Domínios esperados:

- `warroom.alienxip.com` -> Railway Staging.
- `app.alienxip.com` -> Railway Production.

Configuração esperada:

- SSL/TLS ativo.
- Proxy Cloudflare conforme política da conta.
- Cache sem quebrar assets versionados do Vite.
- Redirects documentados se houver.

## Readiness Local

Comandos obrigatórios:

```bash
npm run lint
npm run typecheck
npm run verify:env
npm run build
npm run test:e2e
npm audit --audit-level=moderate
```
