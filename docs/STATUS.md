# Projeto: AuQMia Agenda

## Stack

- npm + Webpack + Babel
- json-server (a definir)

## Onde paramos

- Bloco atual: 8 — Calendário (JS)
- Status: Validado

## O que já foi validado (resumo por blocos)

- [x] Bloco 8 — Calendário (JS: month grid via state + prev/next + select)

## Estado (Fonte da Verdade)

- state.ui.calendar = { year, month, selectedDateISO }

## Arquivos principais tocados (no bloco atual)

- src/utils/calendar.js — cálculo puro do grid
- src/js/features/calendar/calendar.js — reducer/render/eventos
- src/js/state/state.js — calendar no estado inicial
- src/js/main.js — initCalendar

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

- feat: calendario via estado (render mes + navegar + selecionar)
