# WAR_ROOM_PLAN

## Objetivo

Homologar a Landing Page ALIENXIP em `warroom.alienxip.com` antes da promoção para produção.

## Entrada

- Branch `staging`.
- Railway Staging ativo.
- Cloudflare DNS/SSL ativo para `warroom.alienxip.com`.
- CI verde.

## Checklist War Room

### Infra

- [ ] Railway Staging deployou o commit correto.
- [ ] `warroom.alienxip.com` resolve para Staging.
- [ ] SSL ativo.
- [ ] Logs Railway sem erro crítico.
- [ ] Cloudflare sem redirect indevido.

### Funcional

- [ ] Landing abre.
- [ ] Hero carrega.
- [ ] CTA principal rola para diagnóstico.
- [ ] CTA final abre diagnóstico.
- [ ] Modal diagnóstico abre.
- [ ] Botão de abortar missão fecha o diagnóstico.

### Mobile

- [ ] Sem scroll horizontal.
- [ ] CTA visível.
- [ ] Hero legível.
- [ ] Navegação/scroll funcional.
- [ ] Diagnóstico abre em touch.

### Desktop

- [ ] Hero renderiza.
- [ ] Missões renderizam.
- [ ] Cards/cases renderizam.
- [ ] Animações não travam o fluxo.
- [ ] Console sem erro crítico.

### Performance

- [ ] Primeira tela carrega em tempo aceitável.
- [ ] Assets pesados não bloqueiam interação principal.
- [ ] Vídeos/imagens carregam sem quebrar layout.

## Saída

- Aprovado para produção.
- Aprovado com ressalvas.
- Bloqueado.

## Critério de Bloqueio

- Erro de build.
- CI vermelho.
- Domínio/SSL indisponível.
- CTA diagnóstico quebrado.
- Mobile com layout crítico quebrado.
- Console com erro crítico de app.
