# Projeto: AuQMia Agenda

## Stack

- npm + Webpack + Babel
- json-server (a definir)

## Onde paramos

- Bloco atual: 5 — Modais (JS)
- Status: Validado

## O que já foi validado (resumo por blocos)

 - [x] Bloco 5 — Modais (JS: state → render; open/close/esc/backdrop)

## Estado (Fonte da Verdade)

- state.ui.modals controla visibilidade; DOM reflete via hidden/aria/data-open

## Arquivos principais tocados (no bloco atual)

- src/js/state/store.js — store mínimo
- src/js/features/modals/modals.js — reducer + render + eventos
- src/styles/sections/modals.css — overlay inert quando fechado + [hidden]

## Decisões (as 3 mais importantes)

- 1. CSS sem frameworks; tokens em :root; unidades em rem/clamp.
- 2. Webpack como pipeline padrão (dev/prod).
- 3. Estrutura modular por responsabilidade (state/render/events/api).

## Próximos passos (3 itens)

- 1.
- 2. 
- 3. 
- 4.
- 5.
- 6.
## Bugs / Pendências

- Console: resolvido parse error import/export (webpack ESM + .babelrc)
- Comportamento: -

## Smoke test (manual)

- Abrir app no dev server (OK/FAIL)
- Build de produção gera dist/ (OK/FAIL)

## Último commit

- feat: modais via estado (open/close + esc + backdrop)
