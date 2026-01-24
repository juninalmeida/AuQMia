import "../styles/app.css";

import { state as initialState } from "./state/state.js";
import { createStore } from "./state/store.js";
import { initModals } from "./features/modals/modals.js";
import { initCalendar } from "./features/calendar/calendar.js";
import { initAppointments } from "./features/appointments/appointments.js";
import { toISODate } from "../utils/calendar.js";

const store = createStore(initialState);

function formatPtBrDate(date) {
  const formatted = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return formatted
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/ de ([a-záéíóúãõç])/g, (_, ch) => ` de ${ch.toUpperCase()}`);
}

function initHeaderDate() {
  const timeEl = document.querySelector(".app-header__date time");
  if (!timeEl) return;

  const today = new Date();
  timeEl.dateTime = toISODate(today);
  timeEl.textContent = formatPtBrDate(today);
}

function initLoader() {
  const loader = document.getElementById("loader-screen");
  const appContent = document.getElementById("app-content");
  if (!loader || !appContent) return;

  const duration = 2000;
  const start = performance.now();
  const progressBar = document.getElementById("loader-progress");
  const percentText = document.getElementById("loader-percentage");
  const catRunner = document.getElementById("cat-runner");
  const dogRunner = document.getElementById("dog-runner");

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const percent = Math.floor(progress * 100);

    if (percentText) percentText.textContent = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;

    if (catRunner) catRunner.style.left = `${15 + progress * 85}%`;
    if (dogRunner) dogRunner.style.left = `${progress * 85}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
      return;
    }

    setTimeout(() => {
      loader.classList.add("loader-hidden");
      appContent.classList.add("loaded");
      document.body.classList.remove("is-loading");
    }, 400);
  }

  requestAnimationFrame(update);
}

function preventFormReloads() {
  document.addEventListener(
    "submit",
    (e) => {
      const form = e.target?.closest?.("form");
      if (!form || !form.classList?.contains("form")) return;
      e.preventDefault();
    },
    true,
  );
}

function initParticlesBackground() {
  if (typeof window === "undefined") return;
  if (!window.particlesJS) return;
  if (!document.getElementById("particles-js")) return;

  const pawSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23ffffff' d='M18.37 8.51c.56-.33 1.65-.46 2.54.07 1.06.64 1.57 2.2 1.01 2.84-.56.64-1.96.69-3.02.05-1.06-.63-1.1-2.62-.53-2.96zm-4.72-3.65c.82-.47 2.09-.13 2.84 1.18.76 1.31.28 3.09-.54 3.55-.83.47-2.1.14-2.85-1.18-.76-1.31-.28-3.09.55-3.55zm-5.7.07c.86-.26 2.06.4 2.55 1.83.49 1.44-.1 2.98-.96 3.24-.85.26-2.06-.4-2.55-1.83-.49-1.44.1-2.98.96-3.24zm-5.2 5.7c.56-.25 1.69-.09 2.38.74.68.83.55 2.43-.01 2.68-.56.26-1.86-.11-2.54-.94-.68-.83-.4-2.23.17-2.48zM8.87 13.84c2.08-1.02 4.82-.56 6.45.92 1.94 1.76 1.71 5.59-.19 7.66-1.73 1.88-5.2 2.58-7.9.15-2.46-2.21-1.84-5.89.09-7.66 1.42-1.3 3.82-1.55 5.95-1.07z'/%3E%3C/svg%3E";

  window.particlesJS("particles-js", {
    particles: {
      number: {
        value: 30,
        density: { enable: true, value_area: 800 },
      },
      color: { value: ["#22d3ee", "#e879f9"] },
      shape: {
        type: ["circle", "image"],
        image: { src: pawSvg, width: 100, height: 100 },
      },
      opacity: {
        value: 0.4,
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
      },
      size: {
        value: 8,
        random: true,
        anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#6366f1",
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "bubble" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        bubble: {
          distance: 200,
          size: 12,
          duration: 2,
          opacity: 0.8,
          speed: 3,
        },
        push: { particles_nb: 4 },
      },
    },
    retina_detect: true,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  preventFormReloads();
  initLoader();
  initModals(store);
  initCalendar(store);
  initAppointments(store);
  initHeaderDate();
  initParticlesBackground();
});
