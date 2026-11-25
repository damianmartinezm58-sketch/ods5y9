/* =====================================================================
   The hall in 3D (hero). A vast hazy hall with a magenta half sun on the
   wall (SDG 5), its light-blue reflection in the mirrored ceiling (SDG 9)
   and a polished floor that reflects the sun and the people lying on it.
   Scrolling walks the camera toward the sun and completes the disc.
   Uses Three.js (vendor/three.min.js). Without WebGL, the illustrated
   CSS fallback is shown instead.
   ===================================================================== */
(function () {
  "use strict";
  const sala = document.querySelector(".sala");
  const fija = document.querySelector(".sala-fija");
  const canvas = document.getElementById("salaCanvas");
  const pct = document.getElementById("discoPct");
  if (!sala || !canvas) return;

  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const suave = (t) => t * t * (3 - 2 * t);

  function progreso() {
    const r = sala.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
  }
  function pintarProgreso(p) {
    fija.style.setProperty("--p", p.toFixed(3));
    if (pct) pct.textContent = Math.round(50 + 50 * suave(p)) + " %";
  }

  let renderer;
  try {
    if (!window.THREE) throw new Error("no three");
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    sala.classList.add("sin-webgl");
    const alScroll = () => pintarProgreso(progreso());
    addEventListener("scroll", alScroll, { passive: true });
    alScroll();
    return;
  }

  const T = THREE;
  const NEBLINA = 0xe7d3ec;
  const TECHO = 18;           // mirrored ceiling height
  const R = 15;               // sun radius
  const movil = innerWidth < 760;
  const SOL = new T.Vector3(movil ? 3 : 28, TECHO, -72);

  renderer.setPixelRatio(Math.min(devicePixelRatio, movil ? 1.5 : 1.75));
  const escena = new T.Scene();
  escena.background = new T.Color(NEBLINA);
  escena.fog = new T.FogExp2(NEBLINA, 0.017);
  const camara = new T.PerspectiveCamera(movil ? 62 : 50, 1, 0.1, 400);
  camara.rotation.order = "YXZ";

  function texturaRadial(stops, w, h) {
    const c = document.createElement("canvas");
    c.width = w || 256; c.height = h || 256;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(c.width / 2, c.height / 2, 0, c.width / 2, c.height / 2, Math.min(c.width, c.height) / 2);
    stops.forEach(([o, col]) => gr.addColorStop(o, col));
    g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
    return new T.CanvasTexture(c);
  }

  /* ---------- Polished floor: translucent, so the mirrored world shows through ---------- */
  const piso = new T.Mesh(new T.PlaneGeometry(400, 400), new T.MeshBasicMaterial({ color: 0xd6bfe2, transparent: true, opacity: 0.86 }));
  piso.rotation.x = -Math.PI / 2;
  piso.renderOrder = 2;
  escena.add(piso);

  /* ---------- The sun: real half (SDG 5) and mirrored half (SDG 9) ---------- */
  function materialSol(centro, borde, opacidad) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false, fog: false,
      uniforms: { uCentro: { value: new T.Color(centro) }, uBorde: { value: new T.Color(borde) }, uOpacidad: { value: opacidad } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform vec3 uCentro; uniform vec3 uBorde; uniform float uOpacidad; varying vec2 vUv;" +
        "void main(){ float d = distance(vUv, vec2(0.5)) * 2.0; vec3 c = mix(uCentro, uBorde, smoothstep(0.0, 1.0, d));" +
        "float borde = 1.0 - smoothstep(0.97, 1.0, d); gl_FragColor = vec4(c, uOpacidad * borde); }"
    });
  }
  const solReal = new T.Mesh(new T.CircleGeometry(R, 96, Math.PI, Math.PI), materialSol(0xff9cc7, 0xc2187a, 1));
  const solEspejo = new T.Mesh(new T.CircleGeometry(R, 96, 0, Math.PI), materialSol(0xd8f1ff, 0x5fb3e3, 0.18));
  solReal.position.copy(SOL); solEspejo.position.copy(SOL);
  // The real half reflected in the floor (below it, seen through the polished surface)
  const solPiso = new T.Mesh(new T.CircleGeometry(R, 96, Math.PI, Math.PI), materialSol(0xff9cc7, 0xc2187a, 0.38));
  solPiso.position.set(SOL.x, -SOL.y, SOL.z); solPiso.scale.y = -1;
  solReal.renderOrder = solEspejo.renderOrder = 5; // the sun glows through the haze
  escena.add(solReal, solEspejo, solPiso);

  const halo = new T.Mesh(new T.PlaneGeometry(R * 6, R * 6), new T.MeshBasicMaterial({
    map: texturaRadial([[0, "rgba(255,120,180,0.55)"], [0.35, "rgba(214,90,170,0.22)"], [1, "rgba(231,211,236,0)"]]),
    transparent: true, depthWrite: false, fog: false
  }));
  halo.position.set(SOL.x, SOL.y - 1, SOL.z - 0.5);
  halo.renderOrder = 4;
  escena.add(halo);

  // Column of sunlight across the wet floor, from the wall toward the visitor
  function texturaColumna() {
    // Bright, pale streak; it narrows toward the visitor so perspective does not flood the floor
    const c = document.createElement("canvas"); c.width = 256; c.height = 1024;
    const g = c.getContext("2d");
    for (let y = 0; y < 1024; y += 8) {
      const t = y / 1024;                       // 0 = wall end, 1 = visitor end
      const mitad = 128 * (1 - 0.88 * t);
      const a = t < 0.8 ? 0.95 - 0.2 * t : (1 - t) / 0.2 * 0.79;
      const gr = g.createLinearGradient(128 - mitad, 0, 128 + mitad, 0);
      gr.addColorStop(0, "rgba(255,110,180,0)");
      gr.addColorStop(0.28, `rgba(255,110,180,${(a * 0.55).toFixed(3)})`);
      gr.addColorStop(0.5, `rgba(255,248,252,${Math.min(1, a * 1.05).toFixed(3)})`);
      gr.addColorStop(0.72, `rgba(255,110,180,${(a * 0.55).toFixed(3)})`);
      gr.addColorStop(1, "rgba(255,110,180,0)");
      g.fillStyle = gr; g.fillRect(0, y, 256, 8);
    }
    return new T.CanvasTexture(c);
  }
  // The column runs from the foot of the sun toward the visitor's feet, so it crosses the whole floor
  const cerca = new T.Vector3(movil ? 0.3 : 1.6, 0, 10), lejos = new T.Vector3(SOL.x, 0, SOL.z);
  const largoColumna = cerca.distanceTo(lejos);
  const columna = new T.Mesh(new T.PlaneGeometry(R * 0.9, largoColumna), new T.MeshBasicMaterial({ map: texturaColumna(), transparent: true, depthWrite: false, fog: false }));
  columna.rotation.x = -Math.PI / 2;
  columna.renderOrder = 3;
  const grupoColumna = new T.Group();
  grupoColumna.position.set((cerca.x + lejos.x) / 2, 0.04, (cerca.z + lejos.z) / 2);
  grupoColumna.rotation.y = Math.atan2(-(lejos.x - cerca.x), -(lejos.z - cerca.z));
  grupoColumna.add(columna);
  escena.add(grupoColumna);

  // Ceiling line: the horizon where both halves meet
  const linea = new T.Mesh(new T.BoxGeometry(400, 0.06, 0.06), new T.MeshBasicMaterial({ color: 0x8e7fb5 }));
  linea.position.set(0, TECHO, SOL.z + 0.2);
  escena.add(linea);

  /* ---------- People: authored poses built from limbs ---------- */
  const N = movil ? 64 : 105;
  const geoLimb = new T.CapsuleGeometry(0.25, 1, 4, 10);   // total length 1.5
  const geoCabeza = new T.SphereGeometry(0.22, 14, 10);
  function limb(x1, y1, x2, y2, r, z) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    return new T.Matrix4().compose(
      new T.Vector3((x1 + x2) / 2, (y1 + y2) / 2, z || 0),
      new T.Quaternion().setFromEuler(new T.Euler(0, 0, Math.atan2(dy, dx) - Math.PI / 2)),
      new T.Vector3(r / 0.25, Math.max(0.05, L / 1.5), r / 0.25));
  }
  const cabeza = (x, y) => new T.Matrix4().makeTranslation(x, y, 0);
  const PIERNAS = 0.12;
  const POSES = {
    // lying on the back, knees up, one arm behind the head
    tendida: { limbs: [limb(-1.0, 0.24, 0.12, 0.24, 0.25), limb(0.12, 0.2, 0.56, 0.72, 0.12, PIERNAS), limb(0.12, 0.2, 0.56, 0.72, 0.12, -PIERNAS),
      limb(0.56, 0.72, 1.02, 0.12, 0.11, PIERNAS), limb(0.56, 0.72, 1.02, 0.12, 0.11, -PIERNAS), limb(-0.62, 0.3, -1.5, 0.42, 0.085, 0.2)],
      cabezas: [cabeza(-1.32, 0.3)] },
    // sitting, hugging the knees
    sentada: { limbs: [limb(0, 0.3, -0.16, 1.05, 0.24), limb(0, 0.24, 0.5, 0.64, 0.13, PIERNAS), limb(0, 0.24, 0.5, 0.64, 0.13, -PIERNAS),
      limb(0.5, 0.64, 0.6, 0.1, 0.12, PIERNAS), limb(0.5, 0.64, 0.6, 0.1, 0.12, -PIERNAS), limb(-0.1, 0.92, 0.46, 0.6, 0.08, 0.26), limb(-0.1, 0.92, 0.46, 0.6, 0.08, -0.26)],
      cabezas: [cabeza(-0.14, 1.38)] },
    // reclining on an elbow, one knee bent
    recostada: { limbs: [limb(-0.72, 0.48, 0.36, 0.22, 0.24), limb(-0.76, 0.56, -0.82, 0.06, 0.09, 0.2), limb(0.36, 0.2, 1.36, 0.13, 0.12, PIERNAS),
      limb(0.36, 0.22, 0.86, 0.66, 0.12, -PIERNAS), limb(0.86, 0.66, 1.2, 0.12, 0.11, -PIERNAS)],
      cabezas: [cabeza(-0.98, 0.8)] },
    // standing
    parada: { limbs: [limb(0, 0.98, 0, 1.6, 0.24), limb(0, 0.98, 0, 0.06, 0.12, 0.1), limb(0, 0.98, 0, 0.06, 0.12, -0.1),
      limb(0, 1.56, 0.06, 0.92, 0.08, 0.3), limb(0, 1.56, 0.06, 0.92, 0.08, -0.3)],
      cabezas: [cabeza(0, 1.95)] }
  };

  let semilla = 7;
  const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647);
  const partes = [], cabezas = [], partesLejos = [], cabezasLejos = [], partesCerca = [], cabezasCerca = [];
  const base = new T.Matrix4();
  const puestos = [];
  const fuera = (x, z) => z > -7 || (z > -50 && (x < (movil ? -4 : 12) || x > (movil ? 0.28 : 0.62) * (14 - z)));
  // Each person keeps some personal space so every pose reads on its own (more space up front)
  const apretado = (x, z) => puestos.some(([px, pz]) => Math.hypot(px - x, pz - z) < (z > -50 ? 3.4 : 1.9));
  for (let i = 0; i < N; i++) {
    let x, z, intentos = 0;
    do { x = (azar() - 0.5) * 84; z = -70 + azar() * 66; intentos++; }
    while ((fuera(x, z) || apretado(x, z)) && intentos < 400);
    if (intentos >= 400) continue;
    puestos.push([x, z]);
    const r = azar();
    const pose = r < 0.38 ? POSES.tendida : r < 0.68 ? POSES.sentada : r < 0.9 || z > -50 ? POSES.recostada : POSES.parada;
    base.compose(new T.Vector3(x, 0, z), new T.Quaternion().setFromEuler(new T.Euler(0, azar() * Math.PI * 2, 0)), new T.Vector3(1, 1, 1));
    const cerca = z > -50;
    pose.limbs.forEach((p) => { const m = new T.Matrix4().multiplyMatrices(base, p); partes.push(m); (cerca ? partesCerca : partesLejos).push(m); });
    pose.cabezas.forEach((p) => { const m = new T.Matrix4().multiplyMatrices(base, p); cabezas.push(m); (cerca ? cabezasCerca : cabezasLejos).push(m); });
  }
  const matFigura = new T.MeshBasicMaterial({ color: 0x141c36 });
  const matTecho = new T.MeshBasicMaterial({ color: 0x5866a3, transparent: true, opacity: 0.16, side: T.DoubleSide });
  const matPiso = new T.MeshBasicMaterial({ color: 0x141c36, side: T.DoubleSide });
  const espejoTecho = new T.Matrix4().makeTranslation(0, 2 * TECHO, 0).multiply(new T.Matrix4().makeScale(1, -1, 1));
  const espejoPiso = new T.Matrix4().makeScale(1, -1, 1);
  const tmp = new T.Matrix4();
  function instancias(geo, mat, lista, espejo) {
    const im = new T.InstancedMesh(geo, mat, lista.length);
    lista.forEach((mx, i) => im.setMatrixAt(i, espejo ? tmp.multiplyMatrices(espejo, mx) : mx));
    im.instanceMatrix.needsUpdate = true;
    escena.add(im);
  }
  const matCerca = new T.MeshBasicMaterial({ color: 0x141c36, fog: false });
  instancias(geoLimb, matCerca, partesCerca); instancias(geoCabeza, matCerca, cabezasCerca);
  instancias(geoLimb, matFigura, partesLejos); instancias(geoCabeza, matFigura, cabezasLejos);
  instancias(geoLimb, matTecho, partesLejos, espejoTecho); instancias(geoCabeza, matTecho, cabezasLejos, espejoTecho);
  instancias(geoLimb, matPiso, partes, espejoPiso); instancias(geoCabeza, matPiso, cabezas, espejoPiso);

  /* ---------- Soft drifting haze: layered translucent fog banks ---------- */
  function texturaNiebla() {
    const c = document.createElement("canvas"); c.width = 512; c.height = 128;
    const g = c.getContext("2d");
    for (let i = 0; i < 46; i++) {
      const x = azar() * 512, y = 40 + azar() * 60, r = 30 + azar() * 70;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(255,240,250,0.22)"); gr.addColorStop(1, "rgba(255,240,250,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 512, 128);
    }
    const t = new T.CanvasTexture(c); t.wrapS = T.RepeatWrapping;
    return t;
  }
  const bancos = [];
  const texNiebla = texturaNiebla();
  for (let i = 0; i < (movil ? 4 : 7); i++) {
    const m = new T.Mesh(new T.PlaneGeometry(160, 9), new T.MeshBasicMaterial({ map: texNiebla.clone(), transparent: true, opacity: 0.3, depthWrite: false }));
    m.material.map.needsUpdate = true;
    m.material.map.repeat.set(1.4, 1);
    m.position.set((azar() - 0.5) * 30, 1.6 + azar() * 1.8, -12 - i * 9);
    m.userData.v = (azar() * 0.6 + 0.4) * (i % 2 ? 1 : -1);
    escena.add(m); bancos.push(m);
  }

  /* ---------- Camera walks toward the sun, always facing forward (straight horizon) ---------- */
  const desde = { pos: new T.Vector3(0, 1.8, 14), inclinacion: movil ? -0.17 : 0.07 };
  const hasta = { pos: new T.Vector3(SOL.x * 0.32, 4, -10), inclinacion: movil ? -0.12 : 0.1 };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const vPos = new T.Vector3();

  function tamano() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
  }
  addEventListener("resize", tamano);
  tamano();
  if (!reducido) {
    addEventListener("pointermove", (e) => {
      mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  let pActual = progreso();
  function cuadro(t) {
    pActual += (progreso() - pActual) * (reducido ? 1 : 0.09);
    const e = suave(pActual);
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    vPos.lerpVectors(desde.pos, hasta.pos, e);
    vPos.x += mouse.x * 0.8;
    vPos.y += -mouse.y * 0.3;
    camara.position.copy(vPos);
    camara.rotation.set(desde.inclinacion + (hasta.inclinacion - desde.inclinacion) * e, 0, 0);

    solEspejo.material.uniforms.uOpacidad.value = 0.18 + 0.82 * e;
    halo.material.opacity = 0.75 + 0.25 * e;
    columna.material.opacity = 0.85 + 0.15 * e;
    if (!reducido) bancos.forEach((b) => { b.material.map.offset.x = (t * 0.000012 * b.userData.v) % 1; });
    pintarProgreso(pActual);
    renderer.render(escena, camara);
  }

  /* Draws only while the hero is on screen and the tab is active */
  let visible = true, corriendo = false;
  function bucle(t) {
    if (!visible || document.hidden) { corriendo = false; return; }
    cuadro(t);
    requestAnimationFrame(bucle);
  }
  function arrancar() { if (!corriendo) { corriendo = true; requestAnimationFrame(bucle); } }
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) arrancar(); }).observe(fija);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) arrancar(); });
  arrancar();
})();
