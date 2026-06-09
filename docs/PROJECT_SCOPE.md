# PROJECT_SCOPE

## Projeto

Landing Page ALIENXIP.

## Objetivo

Publicar uma landing institucional e comercial da ALIENXIP com fluxo de diagnóstico estratégico, preparada para homologação em War Room e posterior promoção para produção.

## Escopo

- Frontend Vite/React.
- Landing pública.
- Fluxo hero -> missões -> diagnóstico.
- Build estático servido por Railway.
- DNS, SSL e proteção via Cloudflare.
- CI/CD via GitHub Actions.

## Fora de Escopo

- Redesign visual.
- Alteração de copy principal.
- Alteração de UX/animações.
- Backend real de integração do formulário.
- Banco de dados/Supabase.
- Autenticação.

## Stakeholders

- ALIENXIP operação.
- ALIENXIP marketing/comercial.
- Responsável técnico por GitHub/Railway/Cloudflare.

## Critérios de Aceite

- `npm run lint` passa.
- `npm run typecheck` passa.
- `npm run verify:env` passa.
- `npm run build` passa.
- `npm run test:e2e` passa em desktop e mobile.
- Branches `main` e `staging` existem.
- GitHub Actions configurado.
- Railway com ambientes Staging e Production.
- Cloudflare com `warroom.alienxip.com` e `app.alienxip.com`.
- War Room aprovado antes de produção.
