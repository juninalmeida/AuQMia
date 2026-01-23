# Projeto: AuQMia Agenda

## Stack

- npm + Webpack + Babel
- json-server (a definir)

## Onde paramos

- Bloco atual: 7 — Calendário (CSS)
- Status: Validado

## O que já foi validado (resumo por blocos)

 - [x] Bloco 7 — Calendário (CSS: grid 7 colunas + estados + legenda)

## Estado (Fonte da Verdade)

- state.ui.modals controla visibilidade; DOM reflete via hidden/aria/data-open

## Arquivos principais tocados (no bloco atual)

- src/styles/app.css — import calendar.css
- src/styles/sections/calendar.css — estilos do calendário

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

- feat: estilos do calendario (grid + estados + legenda)
