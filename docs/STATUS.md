# Projeto: AuQMia Agenda

## Stack

- npm + Webpack + Babel
- json-server (a definir)

## Onde paramos

- Bloco atual: 12 — Cards Aura (CSS: glass + neon dog/cat)
- Status: em andamento

## O que já foi validado (resumo por blocos)

- [x] Bloco 0 — Setup (npm + Webpack/Babel ESM) + tokens globais + .gitignore
- [x] Bloco 1 — Header (HTML semântico + hooks data-action)
- [x] Bloco 2 — Header (CSS responsivo + comportamento mobile/desktop)
- [x] Bloco 3 — Modais (HTML: overlay + dialogs)
- [x] Bloco 4 — Modais (CSS: overlay/backdrop + glass + responsivo)
- [x] Bloco 5 — Modais (JS: state → render; open/close/esc/backdrop)
- [x] Bloco 6 — Calendário (HTML: toolbar + grid + legenda)
- [x] Bloco 7 — Calendário (CSS: grid 7 colunas + estados + legenda)
- [x] Bloco 8 — Calendário (JS: render mês via state + prev/next + select)
- [x] Bloco 9 — Grid Diário (HTML: manhã/tarde/noite + data-slot)
- [x] Bloco 10 — Grid Diário (CSS: layout responsivo + headers)
- [x] Bloco 11 — Agendamentos (JS: form → state → render diário + validação + sync da data selecionada)

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
  - Proibido usar DOM como fonte de verdade (nada de contar/ler texto/classes pra regra)
  - Nunca dois modais abertos ao mesmo tempo
  - Cards e dots do calendário refletem state.data.appointments
  - Ao salvar agendamento, state.ui.calendar sincroniza para a dateISO do novo item

## Arquivos principais tocados (no bloco atual)

- src/styles/sections/appointments.css — estilos do card (.appt-card) com glass + neon dog/cat (a criar)
- src/styles/app.css — import do appointments.css (a fazer)
- src/js/features/appointments/appointments.js — adicionar class appt-card--dog/cat no render (a fazer)

## Decisões (as 3 mais importantes)

- 1. Estado central como fonte da verdade; fluxo: Input → State → Processamento → Render
- 2. Contrato HTML↔JS: FormData (name=) + render targets (data-slot / data-calendar-grid)
- 3. Criar agendamento sincroniza selectedDateISO para garantir render imediato no grid diário

## Próximos passos (3 itens)

- 1. Criar appointments.css com glass-card + neon hover dog/cat (fiel ao Aura)
- 2. Importar appointments.css no app.css
- 3. Render: aplicar classe appt-card--dog/cat baseada em appointment.petType

## Bugs / Pendências

- Console: -
- Comportamento: -

## Smoke test (manual)

- Abrir app no dev server (OK)
- Abrir/fechar modais (X/backdrop/ESC) (OK)
- Navegar mês prev/next e selecionar dia (OK)
- Criar agendamento: vazio → mostra erros / válido → cria card no período correto (OK)
- Criar agendamento para outra data → calendário sincroniza e mostra card (OK)

## Último commit

- fix: selecionar data do agendamento ao salvar (hash curto aqui)
