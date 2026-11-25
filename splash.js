"use strict";

(() => {
  const splash = document.querySelector("#startup-splash");
  const app = document.querySelector(".app-shell");
  const bar = document.querySelector("#splash-progress");
  const percentLabel = document.querySelector("#splash-percent");
  const progressbar = document.querySelector(".loading-track");
  const tip = document.querySelector("#loading-tip");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let preferences = {};
  try {
    const saved = JSON.parse(localStorage.getItem("wowbrowser.preferences.v1") || "{}");
    if (saved && typeof saved === "object" && !Array.isArray(saved))
      preferences = saved;
  } catch {
    // Keep the default Spanish splash if saved preferences are unavailable.
  }
  const content = {
    es: {
      eyebrow: "PREPARANDO EL VIAJE", title: "Los caminos<br>vuelven a abrirse.",
      subtitle: "Reuniendo tus mundos favoritos en un solo lugar.", tipTitle: "CONSEJO DEL VIAJERO",
      loading: "PREPARANDO EL PORTAL", caption: "Un momento, aventurero…",
      aria: "Progreso de inicio estimado",
      tips: ["Revisa tu equipo antes de aventurarte en una mazmorra.", "Explora los caminos secundarios: pueden esconder atajos y sorpresas.", "Coordina tus habilidades con el grupo antes de un gran encuentro.", "Guarda una poción para esos momentos en que el viaje se complica.", "Una pausa a tiempo también forma parte de una buena aventura."]
    },
    en: {
      eyebrow: "PREPARING YOUR JOURNEY", title: "The paths<br>are open again.",
      subtitle: "Bringing your favorite worlds together in one place.", tipTitle: "TRAVELER’S TIP",
      loading: "PREPARING THE PORTAL", caption: "Just a moment, adventurer…",
      aria: "Estimated startup progress",
      tips: ["Check your gear before venturing into a dungeon.", "Explore side paths: they may hide shortcuts and surprises.", "Coordinate your abilities with the group before a big encounter.", "Save a potion for when the journey gets rough.", "Taking a break is part of every good adventure."]
    },
    pt: {
      eyebrow: "PREPARANDO A VIAGEM", title: "Os caminhos<br>estão abertos novamente.",
      subtitle: "Reunindo seus mundos favoritos em um só lugar.", tipTitle: "DICA DO VIAJANTE",
      loading: "PREPARANDO O PORTAL", caption: "Um momento, aventureiro…",
      aria: "Progresso de inicialização estimado",
      tips: ["Confira seu equipamento antes de se aventurar em uma masmorra.", "Explore caminhos alternativos: eles podem esconder atalhos e surpresas.", "Coordene suas habilidades com o grupo antes de um grande encontro.", "Guarde uma poção para quando a jornada ficar difícil.", "Fazer uma pausa também faz parte de uma boa aventura."]
    },
    fr: {
      eyebrow: "PRÉPARATION DU VOYAGE", title: "Les chemins<br>s’ouvrent à nouveau.",
      subtitle: "Tous vos mondes préférés réunis au même endroit.", tipTitle: "CONSEIL DU VOYAGEUR",
      loading: "OUVERTURE DU PORTAIL", caption: "Un instant, aventurier…",
      aria: "Progression estimée du démarrage",
      tips: ["Vérifiez votre équipement avant de vous aventurer dans un donjon.", "Explorez les chemins secondaires : ils cachent parfois des raccourcis.", "Coordonnez vos capacités avec le groupe avant un grand combat.", "Gardez une potion pour les moments difficiles.", "Faire une pause fait aussi partie de l’aventure."]
    },
    de: {
      eyebrow: "DIE REISE WIRD VORBEREITET", title: "Die Wege<br>öffnen sich wieder.",
      subtitle: "Deine Lieblingswelten an einem Ort.", tipTitle: "REISETIPP",
      loading: "PORTAL WIRD VORBEREITET", caption: "Einen Moment, Abenteurer…",
      aria: "Geschätzter Startfortschritt",
      tips: ["Prüfe deine Ausrüstung, bevor du dich in einen Dungeon wagst.", "Erkunde Nebenwege: Dort können Abkürzungen und Überraschungen warten.", "Stimme deine Fähigkeiten vor einem großen Kampf mit der Gruppe ab.", "Heb dir einen Trank für schwierige Momente auf.", "Eine Pause gehört zu jedem guten Abenteuer."]
    }
  };
  const savedLanguage = preferences.uiLanguage ||
    (!Object.hasOwn(preferences, "uiLanguage") && preferences.language === "en" ? "en" : "es");
  const locale = content[savedLanguage] ? savedLanguage : "es";
  const strings = content[locale];
  const tips = strings.tips;
  splash.querySelector(".splash-eyebrow").innerHTML = `<span></span> ${strings.eyebrow}`;
  splash.querySelector(".splash-copy h1").innerHTML = strings.title;
  splash.querySelector(".splash-copy p").textContent = strings.subtitle;
  splash.querySelector(".tip-heading").innerHTML = `<span class="tip-star">✦</span> ${strings.tipTitle}`;
  splash.querySelector(".loading-label span:first-child").textContent = strings.loading;
  splash.querySelector(".splash-caption").textContent = strings.caption;
  progressbar.setAttribute("aria-label", strings.aria);
  const startedAt = performance.now();
  let progress = 0;
  let tipIndex = 0;
  let lastTipAt = startedAt;
  let finished = false;
  let pageReady = document.readyState === "complete";
  let readyAt = pageReady ? startedAt : null;
  let progressAtReady = 0;

  function finishSplash() {
    if (finished) return;
    finished = true;
    splash.classList.add("is-leaving");
    splash.setAttribute("aria-hidden", "true");
    app.inert = false;
    window.setTimeout(() => {
      splash.remove();
      document.documentElement.classList.remove("is-loading");
      window.dispatchEvent(new Event("wowbrowser:ready"));
    }, 650);
  }

  function update(now) {
    if (pageReady) {
      const transitionDuration = reducedMotion ? 100 : 650;
      const transition = Math.min(1, (now - readyAt) / transitionDuration);
      progress = progressAtReady + (100 - progressAtReady) * transition;
    } else {
      const loadingDuration = reducedMotion ? 1800 : 4000;
      progress = Math.min(88, 88 * ((now - startedAt) / loadingDuration));
    }
    const shown = Math.floor(progress);
    bar.style.width = `${progress}%`;
    percentLabel.textContent = `${shown}%`;
    progressbar.setAttribute("aria-valuenow", String(shown));

    if (now - lastTipAt > 3200) {
      tipIndex = (tipIndex + 1) % tips.length;
      tip.textContent = tips[tipIndex];
      lastTipAt = now;
    }

    if (pageReady && progress >= 99.9 && now - startedAt >= 1900) {
      finishSplash();
      return;
    }
    window.requestAnimationFrame(update);
  }

  if (!pageReady) {
    window.addEventListener("load", () => {
      pageReady = true;
      readyAt = performance.now();
      progressAtReady = progress;
    }, { once: true });
    // Cover the narrow race where load fires between the initial check and listener registration.
    if (document.readyState === "complete") {
      pageReady = true;
      readyAt = performance.now();
      progressAtReady = progress;
    }
  }
  window.requestAnimationFrame(update);

  // The native language bridge navigates to a custom URL that CEF cancels.
  // In some timing cases that prevents the load event from ever firing, so
  // guarantee the splash always finishes even if the page never reports ready.
  // Animate to 100% first so the bar does not appear stuck at 88%.
  window.setTimeout(() => {
    if (!finished) {
      pageReady = true;
      progressAtReady = progress;
      readyAt = performance.now();
      window.setTimeout(() => {
        if (!finished) finishSplash();
      }, 800);
    }
  }, 4500);
})();
