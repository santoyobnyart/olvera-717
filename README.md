# Web de Guillermo Olvera · Piloto #717

Sitio de una sola página para Guillermo “Memo” Olvera, piloto de karting X30 Jr. que está dando el salto a Trucks México Series.
Está hecho con HTML, CSS y JavaScript sin librerías: no hay nada que instalar ni compilar.

## Estructura

```
web/
├── index.html        ← estructura y textos de cada sección (comentadas 00–12)
├── css/styles.css    ← colores, fuentes, diseño y animaciones
├── js/data.js        ← CONTENIDO EDITABLE: reels y logros
├── js/main.js        ← interacciones (carrusel, contadores, filtros…)
└── assets/
    ├── img/          ← fotos (máx. 1600 px)
    ├── logos/        ← logos *-color.png y *-blanco.png
    └── video/        ← reels 540x960 + póster .jpg
```

## Cambios frecuentes

| Quiero…                        | Archivo        | Dónde                                         |
|--------------------------------|----------------|-----------------------------------------------|
| Agregar o cambiar un reel      | `js/data.js`   | `window.REELS` (copia un bloque `{ … }`)      |
| Agregar un resultado           | `js/data.js`   | `window.LOGROS`                               |
| Cambiar colores                | `css/styles.css` | Sección **A. Variables de marca** (`:root`) |
| Cambiar textos de una sección  | `index.html`   | Busca el comentario de la sección (ej. `07 · SOBRE MEMO`) |
| Cambiar los números (podios…)  | `index.html`   | Sección `05 · NÚMEROS`, atributo `data-meta`  |

### Preparar un reel nuevo

Los reels pesan mucho en 1080x1920. Antes de subirlos, redúcelos a 540x960:

```bash
ffmpeg -i reel.mp4 -vf "scale=540:960,fps=30" -c:v libx264 -preset slow -crf 27 -maxrate 1200k -bufsize 2400k -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k assets/video/nombre.mp4
```

```bash
ffmpeg -ss 3 -i reel.mp4 -frames:v 1 -vf scale=540:960 -q:v 5 assets/video/nombre.jpg
```

## Ver la web en tu computadora

En VS Code instala la extensión **Live Server** (el proyecto te la recomienda al abrirlo), da clic derecho en `index.html` → **Open with Live Server**.

O desde la terminal, dentro de esta carpeta:

```bash
python3 -m http.server 5717
```

y abre http://localhost:5717

## Publicar cambios

La web se publica sola con GitHub Pages cada vez que subes cambios a la rama `main`:

```bash
git add -A
git commit -m "Describe tu cambio"
git push
```

En 1–2 minutos se actualiza el link público.

## Pendientes

- [ ] Link exacto del canal de YouTube “Racing Kart Guillermo” (ahora apunta a una búsqueda).
- [ ] Confirmar con la familia los datos públicos (WhatsApp del papá, correo).
- [ ] Revisar textos y títulos de los reels en `js/data.js`.
