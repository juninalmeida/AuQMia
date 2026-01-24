# Project: AuQMia Agenda

## Status snapshot

- Project is feature-complete for the MVP UI/UX flow.
- Only minor polish remains (see "Open items").

## How to run

- App: `npm run dev` (webpack dev server on http://localhost:3000)
- Mock API: `npm run server` (json-server on http://localhost:3001)
- Dev server proxies `/api` -> `http://localhost:3001`

## Stack

- Webpack + Babel + CSS loader stack
- json-server for mock API
- Iconify icons
- particles.js background

## Core UX (implemented)

- Animated loader screen with cat/dog runners and progress bar (2s duration).
- Animated particle background.
- Header date auto-syncs with today.
- Calendar modal with month nav, selection, and monthly appointment count.
- Calendar day selection closes the modal and updates the daily list.
- Daily grid split into morning/afternoon/night.
- Appointment cards with dog/cat styling, hover effects, delete action.
- Validation errors shown in a subtle centered notice (1.5s) with glass overlay.

## Data model

- State shape:
  - ui:
    - modals: { calendarOpen: boolean, newAppointmentOpen: boolean }
    - calendar: { year: number, month: number, selectedDateISO: string }
  - data:
    - appointments: Array<{
      id: string,
      petType: "dog" | "cat",
      petName: string,
      ownerName: string,
      service: string, // service id from API
      dateISO: string, // YYYY-MM-DD
      time: string // HH:mm
      }>

## API (json-server)

- db.json:
  - services: list of service { id, label }
  - appointments: list of saved appointments
- Endpoints:
  - GET /api/services
  - GET /api/appointments
  - POST /api/appointments
  - DELETE /api/appointments/:id
- Service labels are populated from API and used on cards.

## Validation rules

- Required fields: petType, petName, ownerName, service, time, dateISO.
- dateISO cannot be in the past.
- If dateISO is today, time must be in the future.
- Conflicts are blocked: no two appointments can share the same date + time.

## Key files

- `src/index.html`:
  - Loader markup
  - App layout (header, day grid, modals, notice)
- `src/js/main.js`:
  - Loader logic
  - Header date sync
  - Particles init
- `src/js/features/modals/modals.js`:
  - Modal open/close state + ESC/backdrop behavior
- `src/js/features/calendar/calendar.js`:
  - Calendar rendering
  - Month navigation
  - Day selection + close modal
  - Monthly appointment count
- `src/js/features/appointments/appointments.js`:
  - Services fetch and select population
  - Appointments fetch/save/delete
  - Daily list render + card layout
  - Error notice + cooldown
- `src/utils/validators.js`:
  - Validation logic for appointments
- `src/styles/global.css`:
  - Global tokens
  - Loader styles + animations
- `src/styles/sections/*.css`:
  - Header, modals, calendar, day grid, appointments
- `db.json`:
  - Mock API data
- `webpack.config.js`:
  - Dev server proxy and favicon handling

## Open items / polish

- Add edit flow for appointments (currently only delete).
- Optional: improve API offline UX (notice when server is down).
- Optional: extend tests/automation (none added yet).
- Optional: unify language across UI strings (some UI text remains PT-BR).

## Notes

- Appointment list only persists when json-server is running.
- The date input in the new appointment form syncs the calendar selection.
- Calendar selection drives which appointments are visible in the daily grid.
