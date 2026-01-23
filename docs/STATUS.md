# Projeto: AuQMia Agenda

## Stack

- npm + Webpack + Babel
- json-server (a definir)

## Onde paramos

- Bloco atual: 4 — Modais (CSS)
- Status: Validado

## O que já foi validado (resumo por blocos)

 - [x] Bloco 4 — Modais (CSS: overlay + backdrop + dialog responsivo)

## Estado (Fonte da Verdade)

- Shape do estado (resumo):
  - state = { ui: { modals: { newAppointmentOpen, calendarOpen }, selectedDateISO }, data: { appointments: [] } }
- Regras importantes:
  - DOM só reflete state; handlers só leem inputs e atualizam state.
  - data-id no DOM apenas como ponte para itens em state.

## Arquivos principais tocados (no bloco atual)

- src/styles/app.css — import modals.css
- src/styles/sections/modals.css — estilos dos modais

## Decisões (as 3 mais importantes)

- 1. CSS sem frameworks; tokens em :root; unidades em rem/clamp.
- 2. Webpack como pipeline padrão (dev/prod).
- 3. Estrutura modular por responsabilidade (state/render/events/api).

## Próximos passos (3 itens)

- 1. Bloco 1 — Header (HTML sem Tailwind)
- 2. Bloco 2 — Header (CSS)
- 3. Bloco 3 — Header (JS) com state

## Bugs / Pendências

- Console: resolvido parse error import/export (webpack ESM + .babelrc)
- Comportamento: -

## Smoke test (manual)

- Abrir app no dev server (OK/FAIL)
- Build de produção gera dist/ (OK/FAIL)

## Último commit

- feat: header css (mobile centralizado + calendário por breakpoint)
