/* =====================================================================
   DATA.JS — CONTENIDO EDITABLE DE LA WEB
   ---------------------------------------------------------------------
   Aquí viven los textos que cambian seguido: reels, logros y medios.
   Para agregar un reel o un resultado, copia un bloque { ... },
   pégalo debajo y cambia los datos. No hace falta tocar main.js.
   ===================================================================== */

/* ---------------------------------------------------------------------
   REELS — carrusel de celulares (sección #reels)
   video  : ruta del .mp4 vertical (540x960) dentro de assets/video
   poster : imagen que se ve mientras carga el video
   titulo / subtitulo / texto : lo que aparece debajo del carrusel
   etiqueta : texto pequeño tipo chip (categoría o fecha)
   --------------------------------------------------------------------- */
window.REELS = [
  {
    video: "assets/video/dia-de-carrera.mp4",
    poster: "assets/video/dia-de-carrera.jpg",
    titulo: "Día de carrera",
    subtitulo: "Ronda 6 · Kartódromo Óscar Casillas",
    texto: "Del pit a la parrilla: así se vive un sábado de carrera con el kart #717.",
    etiqueta: "22 · NOV · 2026"
  },
  {
    video: "assets/video/diseno-patrocinadores.mp4",
    poster: "assets/video/diseno-patrocinadores.jpg",
    titulo: "Diseño y patrocinadores",
    subtitulo: "La nueva piel del 717",
    texto: "Cada marca tiene su lugar en el kart, el casco y el uniforme.",
    etiqueta: "PATROCINIO"
  },
  {
    video: "assets/video/llantas-zigzag.mp4",
    poster: "assets/video/llantas-zigzag.jpg",
    titulo: "¿Por qué zigzaguear?",
    subtitulo: "Karting explicado",
    texto: "Por qué los pilotos calientan las llantas antes de arrancar.",
    etiqueta: "TÉCNICA"
  },
  {
    video: "assets/video/trucks-dynamic.mp4",
    poster: "assets/video/trucks-dynamic.jpg",
    titulo: "Rumbo a Trucks",
    subtitulo: "Con Dynamic Motorsports",
    texto: "Primeros pasos fuera del kart: la camioneta #17.",
    etiqueta: "NUEVA ETAPA"
  },
  {
    video: "assets/video/trucks-cabina.mp4",
    poster: "assets/video/trucks-cabina.jpg",
    titulo: "Dentro de la cabina",
    subtitulo: "Trucks México Series",
    texto: "Ajustes, asiento y volante: la preparación antes de rodar.",
    etiqueta: "TRUCKS"
  },
  {
    video: "assets/video/en-pista.mp4",
    poster: "assets/video/en-pista.jpg",
    titulo: "En pista",
    subtitulo: "Memo cuenta su fin de semana",
    texto: "Así se prepara un piloto de X30 Jr. antes de salir a pista.",
    etiqueta: "X30 JR"
  },
  {
    video: "assets/video/junta-pilotos.mp4",
    poster: "assets/video/junta-pilotos.jpg",
    titulo: "Junta de pilotos",
    subtitulo: "Antes de la bandera verde",
    texto: "Reglas, banderas y estrategia: lo que pasa antes de la carrera.",
    etiqueta: "PADDOCK"
  },
  {
    video: "assets/video/casco-detalle.mp4",
    poster: "assets/video/casco-detalle.jpg",
    titulo: "Al detalle",
    subtitulo: "Casco y kart",
    texto: "Los logos que acompañan a Memo en cada curva.",
    etiqueta: "MARCAS"
  }
];

/* ---------------------------------------------------------------------
   LOGROS — tablero de tiempos (sección #logros)
   pos    : "1", "2", "3", "4"… o "★" para logros especiales
   anio   : se usa para los filtros por año
   fecha  : texto libre que se muestra
   destacado : true = la fila se resalta (amarillo placa)
   --------------------------------------------------------------------- */
window.LOGROS = [
  { pos: "2", anio: 2026, fecha: "10 OCT 2026", carrera: "Copa Óscar Casillas · Ronda 5", pista: "Kartódromo Óscar Casillas" },
  { pos: "3", anio: 2026, fecha: "15 AGO 2026", carrera: "Copa Óscar Casillas · Ronda 3", pista: "Kartódromo Óscar Casillas" },
  { pos: "1", anio: 2026, fecha: "30 MAY 2026", carrera: "SKUSA 6 Horas", pista: "Autódromo Miguel E. Abed", destacado: true },
  { pos: "4", anio: 2026, fecha: "21 MAR 2026", carrera: "Carrera local · Ronda 1", pista: "Kartódromo Óscar Casillas" },
  { pos: "★", anio: 2026, fecha: "2026", carrera: "24 Horas de Cuautla — en el top 3 hasta la hora 9", pista: "Cuautla, Morelos" },
  { pos: "★", anio: 2026, fecha: "2026", carrera: "8 Horas de Querétaro — participación", pista: "Kartódromo Internacional de Querétaro" },
  { pos: "2", anio: 2025, fecha: "13 DIC 2025", carrera: "Carrera Kartódromo Óscar Casillas", pista: "Kartódromo Óscar Casillas" },
  { pos: "1", anio: 2025, fecha: "22 NOV 2025", carrera: "Carrera Kartódromo Óscar Casillas", pista: "Kartódromo Óscar Casillas", destacado: true },
  { pos: "4", anio: 2025, fecha: "20 SEP 2025", carrera: "Carrera Kartódromo Óscar Casillas", pista: "Kartódromo Óscar Casillas" },
  { pos: "2", anio: 2025, fecha: "16 AGO 2025", carrera: "Copa Óscar Casillas", pista: "Kartódromo Óscar Casillas" },
  { pos: "1", anio: 2024, fecha: "NOV 2024", carrera: "Time Attack Daniel Cibrián — al mes de volver", pista: "Kartódromo Óscar Casillas", destacado: true },
  { pos: "★", anio: 2023, fecha: "1 NOV 2023", carrera: "Accidente: fractura de tibia y peroné. Regresa en oct 2024", pista: "Kartódromo Checo Pérez" },
  { pos: "3", anio: 2023, fecha: "OCT 2023", carrera: "Carrera Kartódromo Checo Pérez", pista: "Kartódromo Checo Pérez" },
  { pos: "3", anio: 2023, fecha: "SEP 2023", carrera: "Carrera Kartódromo Checo Pérez", pista: "Kartódromo Checo Pérez" },
  { pos: "3", anio: 2023, fecha: "AGO 2023", carrera: "Carrera Kartódromo Checo Pérez", pista: "Kartódromo Checo Pérez" },
  { pos: "3", anio: 2023, fecha: "JUL 2023", carrera: "Carrera Kartódromo Checo Pérez", pista: "Kartódromo Checo Pérez" }
];
