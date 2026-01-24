<div align="center">
  <img src="src/assets/favicon.svg" alt="Logo do AuQMia" width="120" />

  <h1>AuQMia Agenda 🐾</h1>
  <p>Agenda inteligente para serviços pet com calendário mensal, validações de horário e UI premium em vidro.</p>

  <p>
    <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
    <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
    <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" />
    <img alt="Webpack" src="https://img.shields.io/badge/Webpack-5.104.1-8DD6F9?style=for-the-badge&logo=webpack&logoColor=000" />
  </p>
</div>

<a id="indice"></a>

## 🧭 Índice

- [💡 Sobre o Projeto](#sobre-o-projeto)
- [🎬 Demo](#demo)
- [✨ Funcionalidades](#funcionalidades)
- [🚀 Tecnologias](#tecnologias)
- [🧠 Conceitos Aplicados](#conceitos-aplicados)
- [🎯 Destaques Técnicos](#destaques-tecnicos)
- [📱 Responsividade](#responsividade)
- [🎨 Design System](#design-system)
- [📁 Estrutura do Projeto](#estrutura-do-projeto)
- [🔧 Instalação](#instalacao)
- [📖 Como Usar](#como-usar)
- [🗺️ Roadmap](#roadmap)
- [🎓 Aprendizados](#aprendizados)
- [🤝 Contribuições](#contribuicoes)
- [👨‍💻 Autor](#autor)

<a id="sobre-o-projeto"></a>

## 💡 Sobre o Projeto

O **AuQMia Agenda** é uma aplicação de um projeto prático desenvolvida focada em serviços pet (banho, tosa, consultas e afins), combinando **calendário mensal**, **agenda diária por períodos** e um **formulário com validações inteligentes**. O objetivo é simular a rotina de um pet shop/veterinária, com UI refinada e experiência fluida.

**O que este projeto demonstra tecnicamente:**

- **Organização por features** (appointments, calendar, modals) com estado centralizado.
- **Integração com mock API** via `json-server` no desenvolvimento.
- **Modo estático** para GitHub Pages com dados seed em JSON + persistência em `localStorage`.
- **Renderização dinâmica** de listas e calendário com indicadores por espécie.
- **Validações temporais** (data/horário) e prevenção de conflitos.

**Habilidades desenvolvidas:**

- Arquitetura front-end modular com Vanilla JS.
- Manipulação avançada de DOM e estados reativos.
- UX refinado (loader, modais, feedbacks e acessibilidade).

<a id="demo"></a>

## 🎬 Demo

- **Deploy:** GitHub Pages (pasta `/docs`)
- **Preview visual da interface:**

  ![Preview da interface AuQMia](docs/preview.svg)

<a id="funcionalidades"></a>

## ✨ Funcionalidades

**Core Features**

- ✅ 📅 Calendário mensal interativo com seleção de dia
- ✅ 🐶🐱 Agenda diária segmentada por manhã/tarde/noite
- ✅ 🗓️ Data do cabeçalho sincronizada com o dia selecionado
- ✅ ✍️ Cadastro de agendamentos com dados do pet e tutor
- ✅ 🗑️ Remoção de agendamentos com atualização imediata

**Validações e UX**

- ✅ ⏱️ Bloqueio de datas e horários passados
- ✅ 🚫 Detecção de conflito por horário no mesmo dia
- ✅ 🔔 Notificações inline e mensagens contextualizadas
- ✅ 🎞️ Loader animado com progresso e mascotes
- ✅ ✨ Glassmorphism, partículas e microinterações visuais

<a id="tecnologias"></a>

## 🚀 Tecnologias

**Frontend**

- HTML5
- CSS3 (Grid, Flex, CSS Variables, `clamp()`)
- JavaScript ES6+ (modules, async/await)
- Iconify (ícones)
- Particles.js (background)
- Google Fonts: Inter e Playfair Display

**Backend / Mock API (opcional, apenas desenvolvimento)**

- json-server `^0.17.4`

**Ferramentas**

- Webpack `^5.104.1`
- Babel `^7.28.6`
- Webpack Dev Server `^5.2.3`
- Mini CSS Extract Plugin `^2.10.0`

<a id="conceitos-aplicados"></a>

## 🧠 Conceitos Aplicados

**JavaScript**

- ✅ ES Modules e organização por features
- ✅ Store reativo com `subscribe()` e reducers
- ✅ DOM API + criação de elementos dinâmicos
- ✅ Event delegation para ações de UI
- ✅ Fetch API + `async/await` com tratamento de falhas
- ✅ Validação de formulário com regras temporais
- ✅ Formatação de datas em PT-BR
- ✅ Atualização de UI baseada em estado

**CSS**

- ✅ Design tokens com CSS Variables
- ✅ Grid/Flex para layouts responsivos
- ✅ Glassmorphism (`backdrop-filter` + blur)
- ✅ Gradientes e efeitos neon
- ✅ Tipografia fluida com `clamp()`
- ✅ `:focus-visible` para acessibilidade
- ✅ Transições com `cubic-bezier`
- ✅ Scrollbar customizada

**Arquitetura**

- ✅ Separação por responsabilidades (ui/state/data)
- ✅ Camada de utilidades (datas, ids, validações)
- ✅ Estado centralizado com render reativo
- ✅ Fluxo unidirecional de atualizações
- ✅ Mock API desacoplada do front-end

<a id="destaques-tecnicos"></a>

## 🎯 Destaques Técnicos

### 1) Store reativo minimalista

```javascript
// Store simples para centralizar estado e notificar listeners
export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  const getState = () => state;

  const setState = (nextState) => {
    state = nextState; // mutacao controlada
    listeners.forEach((fn) => fn(state));
  };

  const update = (updater) => setState(updater(state));

  const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  return { getState, setState, update, subscribe };
}
```

**Por que essa abordagem?**
Uma store enxuta reduz complexidade e torna as features independentes, sem depender de frameworks.

**Decisões e vantagens:**

- Atualização centralizada evita inconsistências entre componentes.
- `subscribe()` facilita re-renderização reativa sem reatividade pesada.
- `update()` permite reducers funcionais e previsíveis.

### 2) Calendário mensal com grid fixo + indicadores por espécie

```javascript
function render(state) {
  const { year, month, selectedDateISO } = state.ui.calendar;
  const cells = getMonthGrid(year, month); // 6 semanas fixas
  gridEl.innerHTML = "";

  const actualTodayISO = (() => {
    const d = new Date();
    const pad2 = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  })();

  cells.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "calendar__day";
    btn.dataset.date = c.dateISO;

    if (!c.inMonth) btn.disabled = true;
    if (c.dateISO === selectedDateISO)
      btn.classList.add("calendar__day--selected");
    if (c.dateISO === actualTodayISO) btn.classList.add("calendar__day--today");

    const { hasDog, hasCat } = buildDotsForDate(state, c.dateISO);
    if (hasDog || hasCat) {
      const dots = document.createElement("div");
      dots.className = "calendar__dots";

      if (hasDog) {
        const d = document.createElement("span");
        d.className = "calendar__dot calendar__dot--dog";
        d.setAttribute("aria-hidden", "true");
        dots.appendChild(d);
      }
      if (hasCat) {
        const d = document.createElement("span");
        d.className = "calendar__dot calendar__dot--cat";
        d.setAttribute("aria-hidden", "true");
        dots.appendChild(d);
      }

      btn.appendChild(dots);
    }

    btn.textContent = String(c.day);
    gridEl.appendChild(btn);
  });
}
```

**Como funciona?**
O calendário usa um grid de 42 células (6 semanas), garantindo alinhamento consistente e permitindo mostrar dias fora do mês atual sem quebrar o layout.

**Decisões e vantagens:**

- Grid fixo evita “pulos” de layout entre meses.
- Indicadores por espécie melhoram leitura visual sem poluir o card.
- Seleção e “hoje” são estilos separados, mantendo hierarquia clara.

### 3) Validação de agendamentos com regras temporais

```javascript
export function validateAppointment(draft) {
  const errors = {};

  if (!["dog", "cat"].includes(draft.petType))
    errors.petType = "Selecione o tipo";
  if (isEmpty(draft.petName)) errors.petName = "Informe o nome do pet";
  if (isEmpty(draft.ownerName)) errors.ownerName = "Informe o nome do tutor";
  if (isEmpty(draft.service)) errors.service = "Selecione o serviço";
  if (isEmpty(draft.time)) errors.time = "Informe o horário";
  if (isEmpty(draft.dateISO)) errors.dateISO = "Informe a data";

  const todayISO = toISODate(new Date());
  if (!errors.dateISO && draft.dateISO < todayISO) {
    errors.dateISO = "Data já passou"; // bloqueia datas antigas
  }

  if (!errors.time && !errors.dateISO) {
    if (draft.dateISO === todayISO) {
      const [hh, mm] = String(draft.time).split(":").map(Number);
      if (Number.isFinite(hh) && Number.isFinite(mm)) {
        const now = new Date();
        const scheduled = new Date();
        scheduled.setHours(hh, mm, 0, 0);
        if (scheduled.getTime() < now.getTime()) {
          errors.time = "Horário já passou";
        }
      }
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
```

**Por que essa abordagem?**
As regras são colocadas em um utilitário isolado, facilitando testes e evolução (ex.: regras por serviço).

**Decisões e vantagens:**

- Validações explícitas aumentam previsibilidade do formulário.
- Regras temporais evitam agendamentos inválidos no mesmo dia.
- Estrutura de `errors` alimenta UI com mensagens específicas.

### 4) Agrupamento por período do dia

```javascript
function getPeriod(timeHHMM) {
  const [hh] = timeHHMM.split(":").map(Number);
  // regra simples para categorizar o período
  if (hh < 12) return "morning";
  if (hh < 18) return "afternoon";
  return "night";
}

function renderDaily(state) {
  const selectedDateISO = state.ui.calendar.selectedDateISO;
  const todays = state.data.appointments
    .filter((a) => a.dateISO === selectedDateISO)
    .slice()
    .sort(sortByTime);

  // agrupa os agendamentos por faixa do dia
  const grouped = { morning: [], afternoon: [], night: [] };
  todays.forEach((a) => grouped[getPeriod(a.time)].push(a));

  if (!grouped.morning.length) renderEmpty(slots.morning, "manhã");
  else grouped.morning.forEach((a) => slots.morning.appendChild(renderCard(a)));

  if (!grouped.afternoon.length) renderEmpty(slots.afternoon, "tarde");
  else
    grouped.afternoon.forEach((a) =>
      slots.afternoon.appendChild(renderCard(a)),
    );

  if (!grouped.night.length) renderEmpty(slots.night, "noite");
  else grouped.night.forEach((a) => slots.night.appendChild(renderCard(a)));
}
```

**Como funciona?**
A agenda do dia é filtrada pela data selecionada e segmentada em três períodos, garantindo leitura rápida e organização visual.

**Decisões e vantagens:**

- `getPeriod()` centraliza a regra de segmentação de horários.
- Ordenação garante sequência cronológica dos cards.
- Renderização por slots mantém layout coerente mesmo sem dados.

### 5) Loader animado com progresso sincronizado

```javascript
function initLoader() {
  // controla o progresso do loader e a transição de entrada
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const percent = Math.floor(progress * 100);

    percentText.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    catRunner.style.left = `${15 + progress * 85}%`;
    dogRunner.style.left = `${progress * 85}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
      return;
    }

    // finaliza suavemente apos o progresso completar
    setTimeout(() => {
      loader.classList.add("loader-hidden");
      appContent.classList.add("loaded");
      document.body.classList.remove("is-loading");
    }, 400);
  }

  requestAnimationFrame(update);
}
```

**Por que essa abordagem?**
O loader combina progresso visual, microinterações e timing controlado para reduzir percepção de espera.

**Decisões e vantagens:**

- `requestAnimationFrame` mantém animação suave e sincronizada.
- Progresso linear dá previsibilidade ao usuário.
- Finalização com delay evita “corte seco” na transição.

<a id="responsividade"></a>

## 📱 Responsividade

A abordagem é **mobile-first**: layouts base são para telas menores, com ajustes progressivos em `min-width`.

**Breakpoints principais (exemplos reais):**

```css
.day-grid {
  display: grid;
  gap: clamp(1.25rem, 2.4vw, 1.75rem);
}

@media (min-width: 48rem) {
  .app-header {
    flex-direction: row;
  }
  .btn--calendar-desktop {
    display: inline-flex;
  }
}

@media (min-width: 64rem) {
  .day-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 40rem) {
  .modal__body--new {
    max-height: 75vh;
    overflow: auto;
  }
}
```

**Tipografia fluida (exemplo real):**

```css
.brand__name {
  font-style: italic;
  font-weight: 700;

  background: linear-gradient(90deg, #ffffff, rgba(199, 210, 254, 0.95));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
  letter-spacing: -0.02em;
}
```

<a id="design-system"></a>

## 🎨 Design System

**Paleta de cores (tokens principais):**

```css
:root {
  --c-bg: #050505;
  --c-text: #e2e8f0;
  --c-indigo-500: #6366f1;
  --c-indigo-200: #c7d2fe;
  --c-cyan-400: #22d3ee;
  --c-cyan-600: #0891b2;
  --c-fuchsia-400: #e879f9;
  --c-fuchsia-600: #c026d3;
}
```

**Tabela de tokens**
| Categoria | Token/Valor | Uso prático |
| --- | --- | --- |
| Spacing | `clamp(1rem, 2vw, 1.5rem)` | gaps e padding fluidos |
| Radius | `--r-sm: 0.5rem` | cantos de cards e badges |
| Radius | `--r-2xl: 1.5rem` | cards principais e modais |
| Blur | `--blur-glass: 1rem` | efeito glassmorphism |
| Timing | `--t-med: 300ms` | transições padrão |
| Easing | `--ease-premium` | motion suave |
| Container | `--container-max: 80rem` | largura máxima do layout |

**Efeitos especiais**

- **Glassmorphism:** `background: var(--glass-bg)` + `backdrop-filter: blur(var(--blur-glass))` com bordas translúcidas.
- **Gradiente de fundo:** `--bg-gradient` cria profundidade e atmosfera noturna.
- **Neon por espécie:** sombras e bordas distintas para cães e gatos.

<a id="estrutura-do-projeto"></a>

## 📁 Estrutura do Projeto

```text
AuQMia/
├─ 📁 src/
│  ├─ 📁 assets/
│  │  └─ 🖼️ favicon.svg
│  ├─ 📁 data/
│  │  └─ 📄 fallback.json
│  ├─ 📁 js/
│  │  ├─ 📁 features/
│  │  │  ├─ 📁 appointments/
│  │  │  ├─ 📁 calendar/
│  │  │  └─ 📁 modals/
│  │  ├─ 📁 state/
│  │  └─ 📄 main.js
│  ├─ 📁 styles/
│  │  ├─ 📄 global.css
│  │  └─ 📁 sections/
│  ├─ 📁 utils/
│  │  ├─ 📄 calendar.js
│  │  ├─ 📄 ids.js
│  │  └─ 📄 validators.js
│  └─ 📄 index.html
├─ 📁 docs/
├─ 📁 dist/
├─ 📄 db.json
├─ 📄 webpack.config.js
├─ 📄 package.json
└─ 📄 README.md
```

**Organização modular:**

- **features/** concentra lógicas de UI independentes.
- **state/** centraliza o estado e assinatura de listeners.
- **utils/** reúne regras puras de negócio (datas, validações, ids).
- **styles/** separa estilos globais e seções específicas.

<a id="instalacao"></a>

## 🔧 Instalação

**Pré-requisitos:**

- Node.js (LTS recomendado)
- npm

**Passo a passo:**

```bash
# 1) instalar dependências
npm install

# 2) (opcional) subir a API mock (em outro terminal)
npm run server

# 3) iniciar o ambiente de desenvolvimento
npm run dev

# 4) gerar build otimizado (saída em /docs)
npm run build

# 5) (opcional) visualizar o build localmente
npx serve docs
```

**Deploy (produção):** publique a pasta `docs/` (GitHub Pages) ou aponte para ela em um host estático.

<a id="como-usar"></a>

## 📖 Como Usar

1. Clique em **"Novo Agendamento"** para abrir o formulário.
2. Selecione **tipo de pet**, informe **nome**, **tutor**, **serviço**, **data** e **horário**.
3. Confirme o agendamento e acompanhe a separação por período do dia.
4. Use o **Calendário Mensal** para navegar entre datas.
5. Remova um agendamento com o ícone de lixeira.

**Preview adicional:**

![Interface - agenda diária](docs/preview.svg)

<a id="roadmap"></a>

## 🗺️ Roadmap

**v1.1 (curto prazo)**

- ✨ Edição de agendamentos
- 🔍 Filtros por serviço e espécie
- 📌 Destaque de horários mais concorridos

<a id="aprendizados"></a>

## 🎓 Aprendizados

- **Front-end:** estado reativo, DOM avançado, validações e API mock.
- **UX/UI:** hierarquia visual, feedbacks imediatos, acessibilidade.
- **Tooling:** bundling, pipeline CSS, organização por módulos.

<a id="autor"></a>

## 👨‍💻 Autor

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/juninalmeida.png?size=120" width="120" alt="Foto de Horacio Junior" />
      <br />
      <strong>Horacio Junior</strong>
      <br />
      <a href="https://www.linkedin.com/in/j%C3%BAnior-almeida-3563a934b/">
        <img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
      </a>
      <a href="https://github.com/juninalmeida">
        <img alt="GitHub" src="https://img.shields.io/badge/GitHub-111111?style=for-the-badge&logo=github&logoColor=white" />
      </a>
      <a href="mailto:junioralmeidati2023@gmail.com">
        <img alt="Email" src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
      </a>
    </td>
  </tr>
</table>

<p align="center">Obrigado por visitar! 🐾</p>
