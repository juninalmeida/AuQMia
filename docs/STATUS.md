# Projeto: AuQMia Agenda

## Stack
- npm + Webpack + Babel
- json-server (a definir)

## Onde paramos
- Bloco atual: 11 — Agendamentos (JS)
- Status: em andamento

## O que já foi validado (resumo por blocos)
- [x] Bloco 0 — Setup (npm + Webpack/Babel ESM) + tokens globais + .gitignore
- [x] Bloco 1 — Header (HTML semântico + hooks data-action)
- [x] Bloco 2 — Header (CSS responsivo + calendário por breakpoint)
- [x] Bloco 3 — Modais (HTML: overlay + dialogs acessíveis)
- [x] Bloco 4 — Modais (CSS: overlay/backdrop + glass + responsivo)
- [x] Bloco 5 — Modais (JS: state → render; open/close/esc/backdrop)
- [x] Bloco 6 — Calendário (HTML: toolbar + grid + legenda)
- [x] Bloco 7 — Calendário (CSS: grid 7 colunas + estados + legenda)
- [x] Bloco 8 — Calendário (JS: render mês via state + prev/next + select)
- [x] Bloco 9 — Grid Diário (HTML: manhã/tarde/noite + data-slot)
- [x] Bloco 10 — Grid Diário (CSS: layout responsivo + headers)

## Estado (Fonte da Verdade)
- Shape do estado (resumo):
  - state = {
      ui: {
        modals: { calendarOpen: boolean, newAppointmentOpen: boolean },
        calendar: { year: number, month: number, selectedDateISO: string }
      },
      data: {
        appointments: Array<{
          id: string,
          petType: "dog" | "cat",
          petName: string,
          tutorName: string,
          service: string,
          dateISO: string,
          time: string
        }>
      }
    }
- Regras importantes:
  - DOM é saída: UI sempre reflete o state (hidden/aria/data-open etc.)
  - Nunca usar DOM como fonte de verdade (nada de contar/ler texto/classes pra regra)
  - Nunca dois modais abertos ao mesmo tempo

## Arquivos principais tocados (no bloco atual)
- src/js/features/appointments/appointments.js — reducer + render do grid diário + handlers do form
- src/utils/validators.js — validação pura dos dados do agendamento
- src/utils/ids.js — geração de id
- src/js/main.js — conectar initAppointments (quando criado)

## Decisões (as 3 mais importantes)
- 1) Estado central como fonte da verdade; DOM apenas espelha (Input → State → Processamento → Render)
- 2) CSS puro sem frameworks; tokens em :root; layout mobile-first com rem/clamp
- 3) Webpack/Babel como pipeline padrão (dev/prod) + CSS agregador (app.css)

## Próximos passos (3 itens)
- 1) Implementar ADD_APPOINTMENT no state via submit do modal (com validação)
- 2) Renderizar cards no grid diário por período (manhã/tarde/noite) a partir do state
- 3) Refletir dots no calendário com base em appointments (já suportado no render)

## Bugs / Pendências
- Console: -
- Comportamento: -

## Smoke test (manual)
- Abrir app no dev server (OK)
- Abrir/fechar modais (X/backdrop/ESC) (OK)
- Navegar mês prev/next e selecionar dia (OK)
- Grid diário responsivo (mobile/desktop) (OK)

## Último commit
- feat: estilos do grid diario (mobile-first + 3 colunas)
