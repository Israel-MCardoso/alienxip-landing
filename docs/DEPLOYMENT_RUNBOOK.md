# DEPLOYMENT_RUNBOOK

## Fluxo Oficial

```text
feature/* -> PR -> staging -> War Room -> main -> Production
```

## Pré-Requisitos

- GitHub remote configurado.
- Branches `main` e `staging` publicadas.
- Branch protections ativas.
- Railway Staging conectado à branch `staging`.
- Railway Production conectado à branch `main`.
- Cloudflare configurado.

## Deploy Para War Room

1. Criar branch `feature/infra-war-room-readiness`.
2. Commitar alterações.
3. Push da feature para GitHub.
4. Abrir PR para `staging`.
5. Aguardar GitHub Actions.
6. Revisar diff e checklist de risco.
7. Merge para `staging`.
8. Railway Staging faz deploy.
9. Validar `warroom.alienxip.com`.
10. Registrar resultado do War Room.

## Deploy Para Produção

1. Confirmar War Room aprovado.
2. Abrir PR `staging` -> `main`.
3. Aguardar GitHub Actions.
4. Confirmar rollback conhecido.
5. Merge para `main`.
6. Railway Production faz deploy.
7. Validar `app.alienxip.com`.
8. Revisar logs Railway.
9. Revisar Cloudflare DNS/SSL/cache.
10. Atualizar deploy log.

## Rollback

- Railway: redeploy do deployment anterior.
- GitHub: revert commit/merge.
- Cloudflare: apontar DNS para último destino estável quando aplicável.

## Evidência Mínima

- URL validada.
- Commit/PR registrado.
- Checks verdes.
- Screenshot desktop.
- Screenshot mobile.
- Logs sem erro crítico.
