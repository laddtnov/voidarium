# VOIDARIUM

> **An interactive, animated deep-space observatory — a spinning universe map you can travel through.**

Voidarium is a zero-dependency universe map rendered entirely on a single `<canvas>` in vanilla HTML/CSS/JavaScript. The whole universe slowly rotates around its own axis while every spiral galaxy spins independently. Click any object to fly there with a smooth camera flight and read its story on a holographic terminal card.

![status](https://img.shields.io/badge/status-exploring-00f0ff) ![stack](https://img.shields.io/badge/stack-vanilla_JS_%2B_canvas-ff2fb9) ![deps](https://img.shields.io/badge/dependencies-none-52ff9a)

![Voidarium overview — the full spinning map](assets/screenshots/overview.png)

| Inside the Milky Way | Visiting TON 618 |
|---|---|
| ![Milky Way interior with its stars and Sagittarius A*](assets/screenshots/milky-way-interior.png) | ![TON 618 ultramassive black hole up close](assets/screenshots/ton-618.png) |

![Sagittarius A* — deep inside the Milky Way's glowing core](assets/screenshots/sagittarius-a.png)

## ✦ What's inside

**54 real astronomical objects across eight classes:**

| Class | Objects |
|---|---|
| 🌀 **Galaxies** (25) | Milky Way, Andromeda, Triangulum, Whirlpool, Sombrero, Pinwheel, Messier 87, Large Magellanic Cloud, Centaurus A, Cartwheel, Cigar Galaxy (M82), Topsy Turvy (NGC 1313), Sculptor Galaxy (NGC 253), Phoenix Cluster Galaxy, TON 618 Host Galaxy, IC 1101, Messier 60, Maffei 1, Cygnus A, NGC 1300, NGC 3923, Antennae Galaxies, NGC 1569, Seyfert Galaxy (M77), Holm 15A |
| 🟣 **Nebulae** (4) | Orion Nebula (M42), Crab Nebula (M1), Helix Nebula (NGC 7293), Tarantula Nebula (30 Doradus) |
| 🔵 **Star clusters** (2) | Pleiades (M45), Omega Centauri |
| ⭐ **Notable stars** (6) | UY Scuti, Stephenson 2-18, Betelgeuse, Eta Carinae, R136a1, Sirius |
| 🟢 **Neutron stars** (3) | M82 X-2, NGC 1313 X-2, NGC 253 Magnetar |
| 🪐 **Star systems** (1) | The Solar System — the Sun and its 8 planets, orbiting inside the Milky Way |
| ⚫ **Black holes** (10) | Sagittarius A*, M87*, M31*, M104*, M60*, Cygnus A*, M77*, Holm 15A*, TON 618, Phoenix A |
| 🕳 **Cosmic voids** (3) | Boötes Void, Local Void, Eridanus Supervoid |

**Galaxies have interiors.** Stars, nebulae, star clusters, neutron stars, black holes, and even our own Solar System live *inside* their real host galaxies — Sagittarius A* anchors the Milky Way, R136a1 and the Tarantula Nebula burn in the Large Magellanic Cloud, M87* hides in Messier 87, and the ultraluminous pulsar M82 X-2 spins inside the starburst Cigar Galaxy. TON 618 and Phoenix A — previously floating alone in deep space — now sit inside their real host galaxies too. Zoom into a galaxy and its residents fade into view, orbiting along with the galaxy's spin. Voids stay out in deep space, because that's what voids are: the enormous empty gaps *between* galaxies.

**The Milky Way got roomier.** With a dozen objects now sharing its interior — including Sirius, the brightest star in Earth's night sky, and its hidden white-dwarf companion — the galaxy's radius grew and every resident was respaced so nothing crowds its neighbors.

**A full gallery of galaxy varieties**, all reusing the same particle-based renderer with different shape flags: elliptical radio galaxy (Cygnus A, whose black hole may have a fainter companion caught mid-merger), barred spiral (NGC 1300), elliptical shell galaxy (NGC 3923 — concentric rings of stars still settling after a merger), colliding spirals (the Antennae Galaxies), dwarf starburst (NGC 1569), Seyfert galaxy (M77, the namesake of the entire active-galaxy class), and Type-cD galaxy (Holm 15A, holder of the largest known galactic core, anchored by a ~40-billion-solar-mass black hole).

**Two kinds of star cluster.** The Pleiades render as a loose scatter of bright young stars still wrapped in the blue haze of the reflection nebula they're passing through; Omega Centauri renders as a dense, symmetric ball of hundreds of faint stars packed tightly toward its core — the same visual grammar, tuned by a single `globular` flag.

**Nebulae glow like real ionized gas.** Each is a handful of soft, overlapping glow-puffs blended with additive compositing, so where two puffs overlap the color brightens instead of just layering flat — a cheap trick that reads as a roiling gas cloud instead of a static blob.

**TON 618 has two looks.** From a distance it renders as a lensed silhouette in the style of *Interstellar*'s Gargantua — a tall halo of light bent over the poles with a thin bright band where its tilted disk is seen edge-on. Click it and travel there, and it switches to the same detailed neon accretion-disk rendering every other black hole uses.

## ✦ Features

- **Own-axis rotation** — the entire map spins (toggleable), and each galaxy rotates independently with its own angular speed
- **Click-to-travel** — smooth exponential camera flights; arrival triggers the info panel
- **Level-of-detail reveal** — interior objects appear only when their host galaxy fills enough of the screen, and hidden objects can't be clicked
- **Orbit lock** — when you visit an object inside a spinning galaxy, the camera follows it around its orbit; drag or scroll to break the lock
- **Holographic info cards** — scanline-swept panels with a VT323 typewriter effect, real distances, sizes, and descriptions
- **Free navigation** — drag to pan, scroll to zoom toward the cursor, destinations drawer with the full nested catalog
- **Deep links** — `?goto=ton-618` flies to an object on load; add `&snap=1` to jump there instantly
- **Physically flavored rendering** — Keplerian accretion disks whose inner particles orbit faster and pass behind/in front of the event horizon, pulsing supergiants with diffraction spikes, sweeping lighthouse beams on neutron stars, ring and elliptical galaxy particle distributions, parallax starfield

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
