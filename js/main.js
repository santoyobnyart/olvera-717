/* =====================================================================
   MAIN.JS — INTERACCIONES DE LA WEB DE GUILLERMO OLVERA (#717)
   ---------------------------------------------------------------------
   JavaScript sin librerías. Cada bloque es una función independiente
   que se llama al final del archivo (sección “ARRANQUE”).

     iniciarSemaforo()     → 00 pantalla de carga con luces de arranque
     iniciarNavegacion()   → 01 barra fija, menú de celular, link activo
     iniciarHero()         → 02 brillo que sigue al mouse
     iniciarCarrusel()     → 03 carrusel 3D de reels con video
     iniciarContadores()   → 05/08 números que suben
     iniciarLogros()       → 06 tablero de tiempos con filtros
     iniciarRevelado()     → animaciones de aparición al hacer scroll
     iniciarParalaje()     → 08 fotos que se mueven a distinta velocidad
     iniciarInclinacion()  → 09 tarjetas que se inclinan en 3D
   ===================================================================== */

(() => {
  "use strict";

  /* Utilidades cortas */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esTactil = window.matchMedia("(hover: none)").matches;
  const dosDigitos = (n) => String(n).padStart(2, "0");


  /* ===================================================================
     00 · SEMÁFORO DE ARRANQUE
     Enciende 5 luces rojas una por una, las apaga y muestra “GO”.
     Solo se ve la primera vez por sesión (para no cansar al revisar).
     =================================================================== */
  function iniciarSemaforo() {
    const semaforo = $("#semaforo");
    const luces = $$(".semaforo__luces span", semaforo);

    const terminar = () => {
      semaforo.classList.add("fuera");
      document.body.classList.add("arrancado");
    };

    let yaVisto = false;
    try { yaVisto = sessionStorage.getItem("semaforo") === "1"; } catch (e) { /* sin storage */ }

    if (movimientoReducido || yaVisto) { terminar(); return; }
    try { sessionStorage.setItem("semaforo", "1"); } catch (e) { /* sin storage */ }

    const paso = 260; // milisegundos entre cada luz
    luces.forEach((luz, i) => setTimeout(() => luz.classList.add("encendida"), 200 + i * paso));
    const apagado = 200 + luces.length * paso + 350;
    setTimeout(() => {
      luces.forEach((luz) => luz.classList.remove("encendida"));
      semaforo.classList.add("go");
    }, apagado);
    setTimeout(terminar, apagado + 450);
  }


  /* ===================================================================
     01 · NAVEGACIÓN
     - La barra se vuelve sólida al bajar.
     - Botón ☰ abre/cierra el menú en celular.
     - Subraya el link de la sección que está en pantalla.
     =================================================================== */
  function iniciarNavegacion() {
    const nav = $("#nav");
    const menu = $("#navMenu");
    const links = $("#navLinks");

    const alHacerScroll = () => nav.classList.toggle("solida", window.scrollY > 40);
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    alHacerScroll();

    menu.addEventListener("click", () => {
      const abierto = links.classList.toggle("abierto");
      menu.setAttribute("aria-expanded", abierto);
      document.body.style.overflow = abierto ? "hidden" : "";
    });
    // Cerrar el menú al elegir una sección
    $$("a", links).forEach((a) => a.addEventListener("click", () => {
      links.classList.remove("abierto");
      menu.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }));

    // Link activo: la última sección cuyo inicio ya pasó el 40% de la pantalla
    const secciones = $$("main section[id]");
    const marcarActivo = () => {
      let actual = "";
      secciones.forEach((s) => { if (s.getBoundingClientRect().top < window.innerHeight * 0.4) actual = s.id; });
      $$("a", links).forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === "#" + actual));
    };
    window.addEventListener("scroll", marcarActivo, { passive: true });
    marcarActivo();
  }


  /* ===================================================================
     02 · HERO — brillo azul que sigue al mouse
     Escribe la posición del mouse en las variables CSS --x y --y.
     =================================================================== */
  function iniciarHero() {
    const hero = $(".hero");
    const brillo = $("#heroBrillo");
    if (!hero || esTactil) return;
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      brillo.style.setProperty("--x", ((e.clientX - r.left) / r.width) * 100 + "%");
      brillo.style.setProperty("--y", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  }


  /* ===================================================================
     03 · CARRUSEL DE REELS
     - Crea un “celular” por cada reel de data.js.
     - Se arrastra con mouse o dedo; también flechas y teclado.
     - Solo el celular del centro carga y reproduce su video.
     - Al terminar un video pasa solo al siguiente.
     =================================================================== */
  function iniciarCarrusel() {
    const reels = window.REELS || [];
    const carrusel = $("#carrusel");
    const pista = $("#carruselPista");
    const puntos = $("#reelPuntos");
    const botonSonido = $("#reelSonido");
    if (!reels.length || !carrusel) return;

    const total = reels.length;
    let posicion = 0;       // posición actual (puede tener decimales al arrastrar)
    let activo = 0;         // índice del reel en el centro
    let conSonido = false;  // los navegadores exigen empezar en silencio
    let enPantalla = false; // ¿la sección está visible?

    // --- Crear celulares y puntos ---
    const celulares = reels.map((reel, i) => {
      const cel = document.createElement("div");
      cel.className = "celular";
      cel.innerHTML = `
        <div class="celular__pantalla">
          <img src="${reel.poster}" alt="${reel.titulo}" loading="lazy" draggable="false">
          <video data-src="${reel.video}" poster="${reel.poster}" playsinline muted preload="none"></video>
          <div class="celular__progreso"><i></i></div>
        </div>`;
      pista.appendChild(cel);

      const punto = document.createElement("button");
      punto.setAttribute("aria-label", `Ir al reel ${i + 1}: ${reel.titulo}`);
      punto.addEventListener("click", () => irA(i));
      puntos.appendChild(punto);
      return cel;
    });
    $("#reelTotal").textContent = "/ " + dosDigitos(total);

    // Distancia más corta entre dos índices en un círculo (carrusel infinito)
    const distancia = (i, pos) => {
      let d = i - pos;
      d = ((d % total) + total) % total;
      if (d > total / 2) d -= total;
      return d;
    };

    // Separación horizontal entre celulares (depende del ancho de pantalla)
    const separacion = () => Math.min(window.innerWidth * 0.2, 250);

    // --- Dibujar: coloca cada celular según su distancia al centro ---
    function dibujar() {
      const sep = separacion();
      celulares.forEach((cel, i) => {
        const d = distancia(i, posicion);
        const a = Math.abs(d);
        const x = d * sep;
        const z = -a * 140;
        const giro = Math.max(-35, Math.min(35, -d * 16));
        const escala = Math.max(0.6, 1 - a * 0.1);
        cel.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${giro}deg) scale(${escala})`;
        cel.style.opacity = a > 3.2 ? 0 : 1 - a * 0.16;
        cel.style.filter = `brightness(${1 - Math.min(a, 3) * 0.18})`;
        cel.style.zIndex = 100 - Math.round(a * 10);
        cel.style.pointerEvents = a > 3.2 ? "none" : "";
      });
    }

    // --- Actualizar textos, puntos y video del reel activo ---
    function activar(indice) {
      activo = ((indice % total) + total) % total;
      const reel = reels[activo];
      $("#reelNumero").textContent = dosDigitos(activo + 1);
      $("#reelEtiqueta").textContent = reel.etiqueta;
      $("#reelTitulo").textContent = reel.titulo;
      $("#reelSub").textContent = reel.subtitulo;
      $("#reelTexto").textContent = reel.texto;
      $$("button", puntos).forEach((p, i) => p.classList.toggle("activo", i === activo));
      celulares.forEach((cel, i) => cel.classList.toggle("activo", i === activo));
      reproducirActivo();
    }

    // --- Video: solo el activo se carga y reproduce ---
    function reproducirActivo() {
      celulares.forEach((cel, i) => {
        const video = $("video", cel);
        if (i !== activo) { video.pause(); return; }
        if (!video.src) {
          video.src = video.dataset.src;
          video.addEventListener("playing", () => video.classList.add("listo"), { once: true });
        }
        video.muted = !conSonido;
        if (enPantalla) {
          video.currentTime = 0;
          video.play().catch(() => { /* el navegador bloqueó el autoplay */ });
        }
      });
    }

    // Barra de progreso + pasar al siguiente al terminar
    celulares.forEach((cel, i) => {
      const video = $("video", cel);
      const barra = $(".celular__progreso i", cel);
      video.addEventListener("timeupdate", () => {
        if (video.duration) barra.style.width = (video.currentTime / video.duration) * 100 + "%";
      });
      video.addEventListener("ended", () => { if (i === activo) irA(activo + 1); });
    });

    function irA(indice) {
      // Elegir el camino más corto para el carrusel infinito
      posicion = activo + distancia(indice % total, activo);
      dibujar();
      posicion = ((Math.round(posicion) % total) + total) % total;
      activar(posicion);
    }

    // --- Arrastrar con mouse / dedo ---
    let arrastre = null;
    carrusel.addEventListener("pointerdown", (e) => {
      arrastre = { x: e.clientX, y: e.clientY, pos: posicion, movido: false, objetivo: e.target.closest(".celular") };
    });
    window.addEventListener("pointermove", (e) => {
      if (!arrastre) return;
      const dx = e.clientX - arrastre.x;
      if (!arrastre.movido && Math.abs(dx) < 6) return;
      if (!arrastre.movido) {
        // Si el gesto es vertical, dejamos que la página haga scroll
        if (Math.abs(e.clientY - arrastre.y) > Math.abs(dx)) { arrastre = null; return; }
        arrastre.movido = true;
        carrusel.classList.add("arrastrando");
      }
      posicion = arrastre.pos - dx / separacion();
      dibujar();
    });
    window.addEventListener("pointerup", () => {
      if (!arrastre) return;
      carrusel.classList.remove("arrastrando");
      if (arrastre.movido) {
        irA(Math.round(posicion));
      } else if (arrastre.objetivo) {
        // Clic sin arrastrar: ir a ese celular (o pausar/reproducir si ya es el activo)
        const i = celulares.indexOf(arrastre.objetivo);
        if (i === activo) {
          const video = $("video", celulares[i]);
          video.paused ? video.play().catch(() => {}) : video.pause();
        } else {
          irA(i);
        }
      }
      arrastre = null;
    });

    // --- Botones y teclado ---
    $("#reelAnterior").addEventListener("click", () => irA(activo - 1));
    $("#reelSiguiente").addEventListener("click", () => irA(activo + 1));
    carrusel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") irA(activo - 1);
      if (e.key === "ArrowRight") irA(activo + 1);
    });

    // --- Sonido ---
    botonSonido.addEventListener("click", () => {
      conSonido = !conSonido;
      botonSonido.classList.toggle("con-sonido", conSonido);
      botonSonido.setAttribute("aria-label", conSonido ? "Silenciar" : "Activar sonido");
      const video = $("video", celulares[activo]);
      video.muted = !conSonido;
      if (video.paused) video.play().catch(() => {});
    });

    // --- Pausar cuando la sección no está en pantalla ---
    new IntersectionObserver(([entrada]) => {
      enPantalla = entrada.isIntersecting;
      const video = $("video", celulares[activo]);
      if (enPantalla) {
        if (!video.src) reproducirActivo();
        else video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.35 }).observe(carrusel);

    window.addEventListener("resize", dibujar);
    dibujar();
    activar(0);
  }


  /* ===================================================================
     05 · CONTADORES — los números suben de 0 a su meta
     Usa data-meta="10" y opcional data-sufijo="h".
     =================================================================== */
  function iniciarContadores() {
    const animar = (el) => {
      const meta = Number(el.dataset.meta);
      const sufijo = el.dataset.sufijo || "";
      if (movimientoReducido) { el.textContent = meta + sufijo; return; }
      const duracion = 1400;
      const inicio = performance.now();
      const paso = (ahora) => {
        const t = Math.min(1, (ahora - inicio) / duracion);
        const suave = 1 - Math.pow(1 - t, 3); // frena al final
        el.textContent = Math.round(meta * suave) + sufijo;
        if (t < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    };

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        animar(e.target);
        observador.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    $$("[data-meta]").forEach((el) => observador.observe(el));
  }


  /* ===================================================================
     06 · LOGROS — tablero de tiempos con filtros por año
     Lee window.LOGROS de data.js y dibuja una fila por resultado.
     =================================================================== */
  function iniciarLogros() {
    const lista = $("#tableroLista");
    const logros = window.LOGROS || [];
    if (!lista) return;

    const textoPosicion = (pos) => (pos === "★" ? "★" : `${pos}<small>º</small>`);

    function dibujar(anio) {
      const filtrados = anio === "todos" ? logros : logros.filter((l) => String(l.anio) === anio);
      lista.innerHTML = filtrados.map((l, i) => `
        <li class="fila${l.destacado ? " destacado" : ""}" data-pos="${l.pos}" style="--i:${i}">
          <span class="fila__pos">${textoPosicion(l.pos)}</span>
          <span class="fila__fecha">${l.fecha}</span>
          <span class="fila__carrera">${l.carrera}</span>
          <span class="fila__pista">${l.pista}</span>
        </li>`).join("");
    }

    $$("#filtros .filtro").forEach((boton) => {
      boton.addEventListener("click", () => {
        $$("#filtros .filtro").forEach((b) => b.classList.toggle("activo", b === boton));
        dibujar(boton.dataset.anio);
      });
    });
    dibujar("todos");
  }


  /* ===================================================================
     REVELADO AL HACER SCROLL
     Agrega .visible a cada .revelar cuando entra en pantalla.
     Los elementos hermanos aparecen escalonados (uno tras otro).
     =================================================================== */
  function iniciarRevelado() {
    const elementos = $$(".revelar");
    // Retraso escalonado entre hermanos
    elementos.forEach((el) => {
      const hermanos = [...el.parentElement.children].filter((h) => h.classList.contains("revelar"));
      const i = hermanos.indexOf(el);
      if (i > 0) el.style.setProperty("--retraso", Math.min(i, 6) * 0.08 + "s");
    });

    if (movimientoReducido) { elementos.forEach((el) => el.classList.add("visible")); return; }

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visible");
        observador.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    elementos.forEach((el) => observador.observe(el));
  }


  /* ===================================================================
     08 · PARALAJE — fotos que se mueven más lento/rápido que el scroll
     data-velocidad="0.08" (positivo baja, negativo sube)
     =================================================================== */
  function iniciarParalaje() {
    const fotos = $$(".paralaje");
    if (!fotos.length || movimientoReducido) return;
    let pendiente = false;
    const actualizar = () => {
      const centro = window.innerHeight / 2;
      fotos.forEach((foto) => {
        const r = foto.getBoundingClientRect();
        const desplazamiento = (r.top + r.height / 2 - centro) * Number(foto.dataset.velocidad || 0.05);
        foto.style.transform = `translateY(${desplazamiento.toFixed(1)}px)`;
      });
      pendiente = false;
    };
    window.addEventListener("scroll", () => {
      if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
    }, { passive: true });
    actualizar();
  }


  /* ===================================================================
     09 · INCLINACIÓN 3D — tarjetas siguen al mouse (solo computadora)
     =================================================================== */
  function iniciarInclinacion() {
    if (esTactil || movimientoReducido) return;
    $$(".inclinable").forEach((tarjeta) => {
      tarjeta.addEventListener("pointermove", (e) => {
        const r = tarjeta.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tarjeta.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      tarjeta.addEventListener("pointerleave", () => { tarjeta.style.transform = ""; });
    });
  }


  /* ===================================================================
     ARRANQUE — se ejecuta todo al cargar la página
     =================================================================== */
  iniciarSemaforo();
  iniciarNavegacion();
  iniciarHero();
  iniciarCarrusel();
  iniciarContadores();
  iniciarLogros();
  iniciarRevelado();
  iniciarParalaje();
  iniciarInclinacion();
})();
