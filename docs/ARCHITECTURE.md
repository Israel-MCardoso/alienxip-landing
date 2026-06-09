# ARCHITECTURE

## Visão Geral

A landing é uma aplicação frontend Vite/React com assets locais, animações GSAP/Framer Motion e efeitos WebGL/Three.js carregados no browser. O build de produção gera arquivos em `dist/`.

## Runtime

- Node.js em CI e Railway.
- Vite build para produção.
- `vite preview` como servidor estático no Railway.

## Deploy

```text
feature/* -> PR -> staging -> Railway Staging -> warroom.alienxip.com -> main -> Railway Production -> app.alienxip.com
```

## CI/CD

- `.github/workflows/deploy.yml`: typecheck, env contract, lint e build.
- `.github/workflows/playwright.yml`: build e smoke test desktop/mobile.

## Ambientes

- Staging: Railway service conectado à branch `staging`.
- Production: Railway service conectado à branch `main`.

## DNS

- `warroom.alienxip.com`: aponta para Railway Staging.
- `app.alienxip.com`: aponta para Railway Production.

## Dados

Não há banco de dados no escopo atual. O diagnóstico usa armazenamento local no browser como buffer demonstrativo.

## Riscos Técnicos

- Assets de mídia pesados impactam performance mobile.
- WebGL/Three.js pode variar por GPU/browser.
- Formulário ainda não envia para backend real.
- Railway com `vite preview` é aceitável para landing estática simples, mas CDN/static hosting dedicado pode ser melhor em escala.
