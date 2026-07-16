# VOIDARIUM

> **An interactive, animated deep-space observatory — a spinning galaxy map you can travel through.**

Voidarium is a zero-dependency galaxy map rendered entirely on a single `<canvas>` in vanilla HTML/CSS/JavaScript. The whole universe slowly rotates around its own axis while every spiral galaxy spins independently. Click any object to fly there with a smooth camera flight and read its story on a holographic terminal card.

![status](https://img.shields.io/badge/status-exploring-00f0ff) ![stack](https://img.shields.io/badge/stack-vanilla_JS_%2B_canvas-ff2fb9) ![deps](https://img.shields.io/badge/dependencies-none-52ff9a)

## ✦ What's inside

**24 real astronomical objects across four classes:**

| Class | Objects |
|---|---|
| 🌀 **Galaxies** (10) | Milky Way, Andromeda, Triangulum, Whirlpool, Sombrero, Pinwheel, Messier 87, Large Magellanic Cloud, Centaurus A, Cartwheel |
| ⭐ **Supermassive stars** (5) | UY Scuti, Stephenson 2-18, Betelgeuse, Eta Carinae, R136a1 |
| ⚫ **Black holes** (6) | Sagittarius A*, M87*, M31*, M104*, TON 618, Phoenix A |
| 🕳 **Cosmic voids** (3) | Boötes Void, Local Void, Eridanus Supervoid |

**Galaxies have interiors.** Stars and black holes live *inside* their real host galaxies — Sagittarius A* anchors the Milky Way, R136a1 burns in the Large Magellanic Cloud, M87* hides in Messier 87. Zoom into a galaxy and its residents fade into view, orbiting along with the galaxy's spin. Voids stay out in deep space, because that's what voids are: the enormous empty gaps *between* galaxies.

## ✦ Features

- **Own-axis rotation** — the entire map spins (toggleable), and each galaxy rotates independently with its own angular speed
- **Click-to-travel** — smooth exponential camera flights; arrival triggers the info panel
- **Level-of-detail reveal** — interior objects appear only when their host galaxy fills enough of the screen, and hidden objects can't be clicked
- **Orbit lock** — when you visit an object inside a spinning galaxy, the camera follows it around its orbit; drag or scroll to break the lock
- **Holographic info cards** — scanline-swept panels with a VT323 typewriter effect, real distances, sizes, and descriptions
- **Free navigation** — drag to pan, scroll to zoom toward the cursor, destinations drawer with the full nested catalog
- **Physically flavored rendering** — Keplerian accretion disks whose inner particles orbit faster and pass behind/in front of the event horizon, pulsing supergiants with diffraction spikes, ring and elliptical galaxy particle distributions, parallax starfield

## ✦ Running it

No build step, no dependencies. Serve the folder with any static server:

```bash
python3 -m http.server 5641
# then open http://localhost:5641
```

## ✦ Project structure

```
├── index.html          # shell: HUD, destinations nav, info panel
├── css/
│   ├── variables.css   # every color in the project — single source of truth
│   └── style.css       # neon HUD, glow effects, scanlines, responsive layout
└── js/
    ├── data.js         # galaxiesData — the object catalog (add entries here)
    └── main.js         # canvas engine: camera, rotation, renderers, travel
```

## ✦ Adding your own object

Everything is data-driven. Add one entry to `galaxiesData` in [`js/data.js`](js/data.js) and the engine, navigation list, and info panel pick it up automatically:

```js
{
  id: 'my-star', name: 'MY STAR', type: 'star',
  class: 'Red supergiant',
  parent: 'milky-way',            // lives inside a galaxy…
  local: { r: 80, a: 2.4 },       // …at this polar offset from its core
  radius: 11,
  palette: ['--star-red', '--golden-yellow'],  // CSS vars from variables.css
  spinSpeed: 0.0005,
  distance: '~1,000 ly',
  size: '~900 solar radii',
  desc: 'Your story here — typed out on the terminal card.'
}
```

Top-level objects (galaxies, lone black holes, voids) use `x, y` world coordinates instead of `parent`/`local`.

## ✦ How it works

One world, one camera. Every object lives in world coordinates; a single camera `(x, y, zoom)` plus a global rotation angle maps world → screen. Traveling is just easing the camera's target values — the render loop never special-cases "travel mode". Interior objects store polar offsets relative to their host, so galactic rotation moves everything inside for free.

---

*Part of the Cyber-Cards & Interactive Systems project — cyberpunk/neon aesthetic, Canvas over DOM, frontend strictly separated from any future backend.*
