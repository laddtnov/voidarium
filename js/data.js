/* ── galaxiesData ─────────────────────────────────────────
   Single source of truth for every object on the map.

   Top-level objects (galaxies, lone black holes, voids):
     x, y     → world coordinates (map units)

   Interior objects (stars / black holes inside a galaxy):
     parent   → id of the host galaxy
     local    → { r, a } polar offset from the galaxy core.
                They orbit as the galaxy spins and only appear
                once you zoom into the host.

   radius    → visual + hit-test radius in world units
   palette   → CSS variable names from variables.css
   spinSpeed → radians per millisecond (own-axis rotation)
   elliptical / ring → alternate galaxy particle shapes */

const galaxiesData = {
  objects: [
    /* ══ GALAXIES ══ */
    {
      id: 'milky-way', name: 'MILKY WAY', type: 'galaxy',
      class: 'Barred spiral · SBbc',
      x: 0, y: 0, radius: 140, arms: 4,
      palette: ['--neon-cyan', '--star-white', '--neon-purple'],
      spinSpeed: 0.00010,
      distance: '0 ly — you are here',
      size: '~105,700 ly across',
      desc: 'Home galaxy of the Solar System — a barred spiral of 100–400 billion stars. Zoom in: inside you will find Sagittarius A*, the black hole every one of those stars orbits, and some of the largest stars ever measured.'
    },
    {
      id: 'andromeda', name: 'ANDROMEDA · M31', type: 'galaxy',
      class: 'Spiral · SA(s)b',
      x: 640, y: -430, radius: 165, arms: 2,
      palette: ['--cyber-pink', '--star-white', '--neon-purple'],
      spinSpeed: 0.00008,
      distance: '2.54 million ly',
      size: '~220,000 ly across',
      desc: 'The nearest major galaxy and the largest member of the Local Group. Andromeda is on a collision course with the Milky Way — in roughly 4.5 billion years the two will merge into a single elliptical galaxy, informally dubbed "Milkomeda".'
    },
    {
      id: 'triangulum', name: 'TRIANGULUM · M33', type: 'galaxy',
      class: 'Spiral · SA(s)cd',
      x: 1060, y: 140, radius: 95, arms: 3,
      palette: ['--neon-purple', '--star-white', '--neon-cyan'],
      spinSpeed: 0.00013,
      distance: '2.73 million ly',
      size: '~60,000 ly across',
      desc: 'Third-largest galaxy of the Local Group and possibly a distant, gravitationally bound companion of Andromeda. Its loose spiral arms host NGC 604, one of the largest star-forming regions known — over 1,500 ly across.'
    },
    {
      id: 'whirlpool', name: 'WHIRLPOOL · M51', type: 'galaxy',
      class: 'Interacting spiral · SA(s)bc pec',
      x: -720, y: -540, radius: 110, arms: 2,
      palette: ['--neon-cyan', '--star-white', '--cyber-pink'],
      spinSpeed: 0.00012,
      distance: '~23 million ly',
      size: '~76,000 ly across',
      desc: 'A textbook grand-design spiral, its arms sharpened by a gravitational tug-of-war with the dwarf companion NGC 5195. The first galaxy ever recognized to have spiral structure, sketched by Lord Rosse in 1845.'
    },
    {
      id: 'sombrero', name: 'SOMBRERO · M104', type: 'galaxy',
      class: 'Lenticular-spiral · SA(s)a',
      x: -1080, y: 320, radius: 90, arms: 3,
      palette: ['--golden-yellow', '--star-white', '--neon-cyan'],
      spinSpeed: 0.00009,
      distance: '~29.3 million ly',
      size: '~49,000 ly across',
      desc: 'Named for its brilliant bulge and the dramatic dust lane ringing its edge-on disk. Swarms with ~2,000 globular clusters — and hides a billion-solar-mass black hole, M104*, at its core. Zoom in to find it.'
    },
    {
      id: 'pinwheel', name: 'PINWHEEL · M101', type: 'galaxy',
      class: 'Grand-design spiral · SAB(rs)cd',
      x: -300, y: -1250, radius: 120, arms: 4,
      palette: ['--neon-cyan', '--star-white', '--terminal-green'],
      spinSpeed: 0.00011,
      distance: '~20.9 million ly',
      size: '~170,000 ly across',
      desc: 'A sprawling spiral nearly twice the diameter of the Milky Way, tilted perfectly face-on to Earth. Its arms are studded with over 3,000 star-forming regions, warped and fed by close encounters with its companion galaxies.'
    },
    {
      id: 'messier-87', name: 'MESSIER 87', type: 'galaxy',
      class: 'Supergiant elliptical · E0', elliptical: true,
      x: -380, y: -920, radius: 130,
      palette: ['--golden-yellow', '--star-white', '--star-red'],
      spinSpeed: 0.00005,
      distance: '~53.5 million ly',
      size: '~120,000 ly across',
      desc: 'A colossal ball of a trillion ancient stars with 12,000 globular clusters and no spiral structure at all. At its heart sits M87* — zoom in to visit the first black hole humanity ever photographed.'
    },
    {
      id: 'lmc', name: 'LARGE MAGELLANIC CLOUD', type: 'galaxy',
      class: 'Barred irregular · SB(s)m',
      x: 330, y: 270, radius: 70, arms: 2,
      palette: ['--terminal-green', '--star-white', '--neon-cyan'],
      spinSpeed: 0.00014,
      distance: '~163,000 ly',
      size: '~32,600 ly across',
      desc: 'The Milky Way’s brightest satellite galaxy, visible to the naked eye from the southern hemisphere. Home to the Tarantula Nebula — the most violent star factory in the Local Group — and the monster star R136a1. Zoom in to find it.'
    },
    {
      id: 'centaurus-a', name: 'CENTAURUS A', type: 'galaxy',
      class: 'Elliptical + dust lane · S0 pec', elliptical: true,
      x: 150, y: 1300, radius: 105,
      palette: ['--golden-yellow', '--star-white', '--cyber-pink'],
      spinSpeed: 0.00007,
      distance: '~12 million ly',
      size: '~60,000 ly across',
      desc: 'The wreckage of a galactic collision — an ancient elliptical devouring a spiral, wrapped in a twisted lane of dust. Its central black hole fires plasma jets a million light-years long, one of the brightest radio sources in the sky.'
    },
    {
      id: 'cartwheel', name: 'CARTWHEEL GALAXY', type: 'galaxy',
      class: 'Ring galaxy · S pec', ring: true,
      x: 1500, y: 450, radius: 85,
      palette: ['--neon-cyan', '--cyber-pink', '--star-white'],
      spinSpeed: 0.00012,
      distance: '~500 million ly',
      size: '~150,000 ly across',
      desc: 'A cosmic bullseye formed when a smaller galaxy punched straight through its disk 200 million years ago. The impact sent a ring-shaped shockwave of star formation expanding outward like a ripple in a pond.'
    },
    {
      id: 'm82', name: 'CIGAR GALAXY · M82', type: 'galaxy',
      class: 'Starburst irregular · I0',
      x: -1500, y: 800, radius: 75, arms: 2,
      palette: ['--cyber-pink', '--star-white', '--golden-yellow'],
      spinSpeed: 0.00016,
      distance: '~12 million ly',
      size: '~37,000 ly across',
      desc: 'A furious starburst galaxy, forming stars ten times faster than the Milky Way after a close pass with its neighbor M81. Its disk glows pink with ionized hydrogen blown out by supernovae. Zoom in for the neutron star hiding in the wreckage.'
    },
    {
      id: 'ngc1313', name: 'TOPSY TURVY · NGC 1313', type: 'galaxy',
      class: 'Barred spiral · SB(s)d',
      x: 1000, y: 1050, radius: 65, arms: 3,
      palette: ['--terminal-green', '--star-white', '--neon-cyan'],
      spinSpeed: 0.00015,
      distance: '~15 million ly',
      size: '~50,000 ly across',
      desc: 'A lopsided barred spiral with no clear center of rotation, likely still recovering from a past collision. Prolific at forming stars for its modest size — and home to one of the most extreme neutron stars ever clocked.'
    },
    {
      id: 'ngc253', name: 'SCULPTOR GALAXY · NGC 253', type: 'galaxy',
      class: 'Starburst spiral · SAB(s)c',
      x: 900, y: -1080, radius: 85, arms: 4,
      palette: ['--golden-yellow', '--star-white', '--terminal-green'],
      spinSpeed: 0.00010,
      distance: '~11.4 million ly',
      size: '~70,000 ly across',
      desc: 'One of the dustiest galaxies known, its core hidden behind thick lanes of star-forming gas. A giant flare recorded in 2004 is suspected to have come from a magnetar buried deep inside it — one of the few ever traced to another galaxy.'
    },
    {
      id: 'phoenix-cluster-galaxy', name: 'PHOENIX CLUSTER GALAXY', type: 'galaxy',
      class: 'Brightest cluster galaxy · cD', elliptical: true,
      x: -1550, y: -350, radius: 80,
      palette: ['--cyber-pink', '--star-white', '--golden-yellow'],
      spinSpeed: 0.00004,
      distance: '~5.8 billion ly',
      size: '~200,000 ly across',
      desc: 'The monstrous central galaxy of the Phoenix Cluster, bathed in more X-ray light than almost any other cluster known. Cooling gas rains onto it from the surrounding cluster medium, fueling one of the highest star-formation rates ever measured in a giant galaxy.'
    },
    {
      id: 'ton-618-host', name: 'TON 618 HOST GALAXY', type: 'galaxy',
      class: 'Unresolved · quasar host', elliptical: true,
      x: 850, y: 720, radius: 75,
      palette: ['--neon-purple', '--star-white', '--cyber-pink'],
      spinSpeed: 0.00006,
      distance: '~10.8 billion ly',
      size: 'unresolved — quasar outshines it',
      desc: 'The galaxy presumed to surround TON 618 is so thoroughly outshone by its quasar that its actual shape has never been directly resolved — this is an artist’s reconstruction of what a host massive enough to feed such a black hole would look like.'
    },

    /* ══ SUPERMASSIVE STARS (inside their host galaxies) ══ */
    {
      id: 'uy-scuti', name: 'UY SCUTI', type: 'star',
      class: 'Red supergiant · M4Ia',
      parent: 'milky-way', local: { r: 72, a: 1.1 }, radius: 12,
      palette: ['--star-red', '--golden-yellow'],
      spinSpeed: 0.0004,
      distance: '~5,900 ly',
      size: '~1,700 solar radii',
      desc: 'One of the largest known stars. Placed at the center of the Solar System, its surface would extend past the orbit of Jupiter. Despite the enormous volume, its bloated outer layers are thinner than Earth’s atmosphere.'
    },
    {
      id: 'stephenson-2-18', name: 'STEPHENSON 2-18', type: 'star',
      class: 'Red supergiant · M6',
      parent: 'milky-way', local: { r: 120, a: 5.6 }, radius: 13,
      palette: ['--star-red', '--cyber-pink'],
      spinSpeed: 0.0003,
      distance: '~18,900 ly',
      size: '~2,150 solar radii',
      desc: 'Possibly the largest star known — roughly 10 billion times the Sun’s volume. Light takes almost 9 hours just to cross its diameter. It sits in the massive open cluster Stephenson 2, deep in the Scutum arm.'
    },
    {
      id: 'betelgeuse', name: 'BETELGEUSE', type: 'star',
      class: 'Red supergiant · M1-M2Ia',
      parent: 'milky-way', local: { r: 112, a: 5.3 }, radius: 10,
      palette: ['--star-red', '--golden-yellow'],
      spinSpeed: 0.0005,
      distance: '~550 ly',
      size: '~764 solar radii',
      desc: 'The shoulder of Orion and one of the most famous stars in the sky. It is expected to explode as a supernova within the next 100,000 years — when it does, it will shine as bright as the half Moon for weeks.'
    },
    {
      id: 'eta-carinae', name: 'ETA CARINAE', type: 'star',
      class: 'Luminous blue variable binary',
      parent: 'milky-way', local: { r: 55, a: 2.5 }, radius: 10,
      palette: ['--neon-cyan', '--star-white'],
      spinSpeed: 0.0006,
      distance: '~7,500 ly',
      size: '~100 solar masses',
      desc: 'A doomed binary that staged the "Great Eruption" of 1843, briefly becoming the second-brightest star in the sky while ejecting ten Suns’ worth of gas. It teeters on the edge of detonating as a hypernova.'
    },
    {
      id: 'r136a1', name: 'R136a1', type: 'star',
      class: 'Wolf–Rayet · WN5h',
      parent: 'lmc', local: { r: 30, a: 0.8 }, radius: 11,
      palette: ['--neon-cyan', '--star-white'],
      spinSpeed: 0.0006,
      distance: '~163,000 ly (LMC)',
      size: '~196 solar masses',
      desc: 'The most massive and one of the most luminous stars known — nearly 5 million times brighter than the Sun. It burns so fiercely that it sheds an Earth’s mass of material every month in a ferocious stellar wind.'
    },

    /* ══ NEUTRON STARS (city-sized cores left behind by supernovae) ══ */
    {
      id: 'm82-x2', name: 'M82 X-2', type: 'neutron',
      class: 'Ultraluminous X-ray pulsar',
      parent: 'm82', local: { r: 42, a: 2.1 }, radius: 8,
      palette: ['--terminal-green', '--star-white'],
      spinSpeed: 0.0012,
      distance: '~12 million ly',
      size: '~1.4 solar masses, ~20 km wide',
      desc: 'A neutron star no bigger than a city, somehow shining 10 million times brighter than the Sun — physics that shouldn’t work unless its magnetic field is scavenging far more infalling gas than anyone expected. Discovered in 2014, it was the first pulsar found powering an ultraluminous X-ray source.'
    },
    {
      id: 'ngc1313-x2', name: 'NGC 1313 X-2', type: 'neutron',
      class: 'Accreting X-ray pulsar',
      parent: 'ngc1313', local: { r: 38, a: 5.0 }, radius: 7,
      palette: ['--terminal-green', '--neon-cyan'],
      spinSpeed: 0.0014,
      distance: '~15 million ly',
      size: '~1.4 solar masses, ~20 km wide',
      desc: 'One of the most extreme spin-up cases on record — this dead star is dragging in so much matter from a companion that its rotation is measurably accelerating year over year, a rare direct look at a neutron star being spun faster by accretion.'
    },
    {
      id: 'ngc253-magnetar', name: 'NGC 253 MAGNETAR', type: 'neutron',
      class: 'Magnetar candidate · soft gamma repeater',
      parent: 'ngc253', local: { r: 55, a: 3.4 }, radius: 8,
      palette: ['--golden-yellow', '--star-white'],
      spinSpeed: 0.0009,
      distance: '~11.4 million ly',
      size: '~1.4 solar masses, ~20 km wide',
      desc: 'The suspected source of a giant flare recorded on Earth in 2004 — a starquake on a neutron star wrapped in a magnetic field trillions of times stronger than any magnet ever built, briefly outshining its entire host galaxy in gamma rays.'
    },

    /* ══ STAR SYSTEMS (a star plus its orbiting planets) ══ */
    {
      id: 'solar-system', name: 'SOLAR SYSTEM', type: 'system',
      class: 'Star system · G2V + 8 planets',
      parent: 'milky-way', local: { r: 85, a: 3.7 }, radius: 14,
      palette: ['--golden-yellow', '--star-white', '--neon-cyan'],
      spinSpeed: 0.0003,
      distance: '0 ly — home',
      size: '~120 AU across, to the heliopause',
      desc: 'Our own star system: the Sun and eight planets bound by its gravity, orbiting roughly 26,000 light-years from the Milky Way’s core. Every human who has ever lived called one of these worlds home.'
    },

    /* ══ BLACK HOLES ══ */
    {
      id: 'sagittarius-a', name: 'SAGITTARIUS A*', type: 'blackhole',
      class: 'Supermassive black hole',
      parent: 'milky-way', local: { r: 0, a: 0 }, radius: 16,
      palette: ['--golden-yellow', '--star-red'],
      spinSpeed: 0.0008,
      distance: '~26,000 ly',
      size: '4.15 million solar masses',
      desc: 'The gravitational anchor of the Milky Way. Every star in the galaxy orbits this point. Imaged by the Event Horizon Telescope in 2022 — the glowing ring of superheated gas is bent around a shadow the size of Mercury’s orbit.'
    },
    {
      id: 'm87-star', name: 'M87*', type: 'blackhole',
      class: 'Supermassive black hole',
      parent: 'messier-87', local: { r: 0, a: 0 }, radius: 22,
      palette: ['--golden-yellow', '--cyber-pink'],
      spinSpeed: 0.0006,
      distance: '~53.5 million ly',
      size: '6.5 billion solar masses',
      desc: 'The first black hole ever photographed (Event Horizon Telescope, 2019). It launches a relativistic jet of plasma 5,000 ly long, moving at 99% the speed of light — visible across the electromagnetic spectrum.'
    },
    {
      id: 'm31-star', name: 'M31*', type: 'blackhole',
      class: 'Supermassive black hole',
      parent: 'andromeda', local: { r: 0, a: 0 }, radius: 15,
      palette: ['--cyber-pink', '--neon-purple'],
      spinSpeed: 0.0007,
      distance: '2.54 million ly',
      size: '~140 million solar masses',
      desc: 'The quiet giant at Andromeda’s core, over 30 times heavier than the Milky Way’s own central black hole. Unusually dormant — a sleeping monster ringed by a mysterious disk of young blue stars that shouldn’t exist so close to it.'
    },
    {
      id: 'm104-star', name: 'M104*', type: 'blackhole',
      class: 'Supermassive black hole',
      parent: 'sombrero', local: { r: 0, a: 0 }, radius: 13,
      palette: ['--golden-yellow', '--star-red'],
      spinSpeed: 0.0007,
      distance: '~29.3 million ly',
      size: '~1 billion solar masses',
      desc: 'One of the most massive black holes ever found in a nearby galaxy, anchoring the Sombrero’s brilliant core — a billion Suns’ worth of gravity packed into a region smaller than our Solar System.'
    },
    {
      id: 'ton-618', name: 'TON 618', type: 'blackhole',
      class: 'Ultramassive black hole · quasar',
      parent: 'ton-618-host', local: { r: 0, a: 0 }, radius: 48,
      gargantuaStyle: true, // from a distance renders as a lensed silhouette; up close (selected) it switches to the normal accretion-disk look
      palette: ['--neon-purple', '--cyber-pink'],
      spinSpeed: 0.0005,
      distance: '~10.8 billion ly',
      size: '~66 billion solar masses',
      desc: 'One of the most massive black holes ever measured, powering a quasar 140 trillion times brighter than the Sun. Its event horizon is so vast that light would need weeks to cross it — over 40 Solar Systems could fit inside.'
    },
    {
      id: 'phoenix-a', name: 'PHOENIX A', type: 'blackhole',
      class: 'Ultramassive black hole',
      parent: 'phoenix-cluster-galaxy', local: { r: 0, a: 0 }, radius: 55,
      palette: ['--cyber-pink', '--golden-yellow'],
      spinSpeed: 0.0004,
      distance: '~5.8 billion ly',
      size: '~100 billion solar masses',
      desc: 'The central engine of the Phoenix Cluster and possibly the most massive black hole known — estimates reach 100 billion solar masses. It floods its cluster with so much energy that stars form around it at 740 Suns per year.'
    },

    /* ══ VOIDS (the empty gaps BETWEEN galaxies) ══ */
    {
      id: 'bootes-void', name: 'BOÖTES VOID', type: 'void',
      class: 'Supervoid · "The Great Nothing"',
      x: -480, y: 820, radius: 300,
      palette: ['--void-blue'],
      spinSpeed: 0.00002,
      distance: '~700 million ly',
      size: '~330 million ly across',
      desc: 'A sphere of almost perfect emptiness containing only ~60 known galaxies where thousands would be expected. If the Milky Way sat at its center, we wouldn’t have known other galaxies existed until the 1960s.'
    },
    {
      id: 'local-void', name: 'LOCAL VOID', type: 'void',
      class: 'Void · adjacent to Local Group',
      x: 1380, y: -600, radius: 330,
      palette: ['--void-blue'],
      spinSpeed: 0.00002,
      distance: 'begins ~75 million ly away',
      size: '~150–300 million ly across',
      desc: 'The vast empty region right next door to the Local Group. Its expansion actively pushes the Milky Way away at ~260 km/s — we are literally being repelled by nothing. Voids like this make up most of the universe’s volume.'
    },
    {
      id: 'eridanus-supervoid', name: 'ERIDANUS SUPERVOID', type: 'void',
      class: 'Supervoid · CMB Cold Spot',
      x: 480, y: -1400, radius: 280,
      palette: ['--void-blue'],
      spinSpeed: 0.00002,
      distance: '~1.8 billion ly',
      size: 'up to ~1 billion ly across',
      desc: 'A suspected billion-light-year gap in the cosmic web, aligned with the mysterious Cold Spot in the cosmic microwave background. If confirmed, it is one of the largest structures — or absences — ever found.'
    }
  ]
};
