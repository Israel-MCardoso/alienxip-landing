# PRODUCTION_PROMOTION_PLAN

## Objetivo

Promover a landing homologada no War Room para `app.alienxip.com`.

## Pré-Condições

- War Room aprovado.
- PR `staging` -> `main` aberto.
- CI verde.
- Railway Production conectado à branch `main`.
- Cloudflare pronto para `app.alienxip.com`.
- Rollback conhecido.

## Ordem Exata

1. Congelar novas alterações na branch `staging`.
2. Confirmar commit homologado no War Room.
3. Abrir PR `staging` -> `main`.
4. Preencher PR com objetivo, risco, teste, impacto e rollback.
5. Aguardar `deploy.yml`.
6. Aguardar `playwright.yml`.
7. Revisar branch protection.
8. Fazer merge para `main`.
9. Aguardar Railway Production.
10. Abrir `app.alienxip.com`.
11. Validar hero, CTA e diagnóstico.
12. Revisar logs Railway.
13. Revisar SSL/DNS/Cache Cloudflare.
14. Registrar deploy log.

## Checklist Produção

- [ ] CI passou.
- [ ] War Room aprovado.
- [ ] Branch `main` recebeu apenas merge aprovado.
- [ ] Production deployou commit correto.
- [ ] `app.alienxip.com` abre.
- [ ] SSL válido.
- [ ] CTA principal funcional.
- [ ] Diagnóstico funcional.
- [ ] Mobile funcional.
- [ ] Logs sem erro crítico.
- [ ] Rollback documentado.

## Riscos

- Cache Cloudflare servir versão antiga.
- Railway Production com start command incorreto.
- Assets grandes impactarem mobile.
- Formulário ainda não ter backend real.

## Rollback

1. Railway: redeploy do deployment anterior.
2. GitHub: revert do merge em `main`.
3. Cloudflare: limpar cache ou ajustar DNS se necessário.
