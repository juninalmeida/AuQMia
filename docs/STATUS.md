# Projeto: AuQMia Agenda

## Stack

- npm + Webpack + Babel
- json-server (a definir)

## Onde paramos

- Bloco atual: 9 — Grid Diário (HTML)
- Status: Validado

## O que já foi validado (resumo por blocos)

- [x] Bloco 9 — Grid Diário (HTML: manhã/tarde/noite + data-slot)

## Estado (Fonte da Verdade)

- state.ui.calendar = { year, month, selectedDateISO }

## Arquivos principais tocados (no bloco atual)

- src/index.html — estrutura do grid diário

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
- 7.
- 8.
- 9.
- Bloco 10 — Grid Diário (CSS)
- Bloco 11 — Agendamentos (JS: form → state → render cards + dots)

## Bugs / Pendências

- Console: resolvido parse error import/export (webpack ESM + .babelrc)
- Comportamento: -

## Smoke test (manual)

- Abrir app no dev server (OK/FAIL)
- Build de produção gera dist/ (OK/FAIL)

## Último commit

- feat: calendario via estado (render mes + navegar + selecionar)
