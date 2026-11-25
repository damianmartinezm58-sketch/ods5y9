/* =====================================================================
   Ciudad equitativa en 3D (minijuego). Una colonia sobre una base
   circular: cada obra elegida se levanta en su lote. Detrás, medio sol
   magenta (ODS 5) cuyo reflejo azul (ODS 9) se completa según el puntaje.
   Uso: Ciudad3D.iniciar(canvas, obras) · Ciudad3D.mostrar(indices, puntaje)
   ===================================================================== */
window.Ciudad3D = (function () {
  "use strict";
  const T = window.THREE;
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = { tinta: 0x141c36, lavanda: 0x9b86d6, lavandaClara: 0xc9bbef, magenta: 0xc2187a, rosa: 0xff86bb, azul: 0x5fb3e3, azulClaro: 0xcbeaff, neblina: 0x2b1f4b };
  let renderer, escena, camara, ciudad, solEspejo, lotes = [], modelos = {}, figuras = [];
  let angulo = -0.6, anguloMeta = -0.6, arrastrando = false, ultimoX = 0, visible = false, animando = 0, listo = false;

  const mat = (color, extra) => new T.MeshLambertMaterial(Object.assign({ color }, extra || {}));
  const caja = (w, h, d, color) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat(color)); m.position.y = h / 2; return m; };
  const cil = (r1, r2, h, color, seg) => { const m = new T.Mesh(new T.CylinderGeometry(r1, r2, h, seg || 16), mat(color)); m.position.y = h / 2; return m; };

  /* ---------- Modelos de cada obra (dibujados con piezas simples) ---------- */
  const FABRICA = {
    light() {
      const g = new T.Group();
      [[-0.8, -0.6], [0.8, -0.6], [0, 0.8]].forEach(([x, z]) => {
        const poste = cil(0.06, 0.08, 1.9, C.tinta, 8); poste.position.set(x, 0.95, z);
        const foco = new T.Mesh(new T.SphereGeometry(0.2, 12, 8), new T.MeshBasicMaterial({ color: C.rosa }));
        foco.position.set(x, 2, z);
        const charco = new T.Mesh(new T.CircleGeometry(0.75, 24), new T.MeshBasicMaterial({ color: C.rosa, transparent: true, opacity: 0.25 }));
        charco.rotation.x = -Math.PI / 2; charco.position.set(x, 0.02, z);
        g.add(poste, foco, charco);
      });
      return g;
    },
    bus() {
      const g = new T.Group();
      const cuerpo = caja(2.2, 0.9, 0.95, C.magenta); cuerpo.position.y = 0.6;
      const ventanas = caja(2.05, 0.3, 0.97, C.azulClaro); ventanas.position.y = 0.82;
      g.add(cuerpo, ventanas);
      [[-0.7, 0.48], [0.7, 0.48], [-0.7, -0.48], [0.7, -0.48]].forEach(([x, z]) => {
        const r = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.12, 14), mat(C.tinta));
        r.rotation.x = Math.PI / 2; r.position.set(x, 0.2, z); g.add(r);
      });
      const parada = caja(0.08, 1.4, 0.08, C.tinta); parada.position.set(-1.2, 0.7, 0.9);
      const techo = caja(0.9, 0.06, 0.5, C.azul); techo.position.set(-0.85, 1.4, 0.9);
      g.add(parada, techo);
      return g;
    },
    childcare() {
      const g = new T.Group();
      const casa = caja(1.9, 1.0, 1.7, C.lavandaClara);
      const techo = new T.Mesh(new T.ConeGeometry(1.5, 0.9, 4), mat(C.magenta));
      techo.rotation.y = Math.PI / 4; techo.position.y = 1.45;
      const puerta = caja(0.4, 0.6, 0.05, C.tinta); puerta.position.set(0, 0.3, 0.86);
      const sol = new T.Mesh(new T.CircleGeometry(0.22, 20), new T.MeshBasicMaterial({ color: C.rosa }));
      sol.position.set(0, 0.78, 0.87);
      g.add(casa, techo, puerta, sol);
      return g;
    },
    wifi() {
      const g = new T.Group();
      const torre = new T.Mesh(new T.ConeGeometry(0.45, 2.8, 4, 1, true), mat(C.tinta, { wireframe: true }));
      torre.position.y = 1.4;
      g.add(torre);
      [0.45, 0.75, 1.05].forEach((r, i) => {
        const arco = new T.Mesh(new T.TorusGeometry(r, 0.05, 6, 24, Math.PI * 0.7), new T.MeshBasicMaterial({ color: C.azul, transparent: true }));
        arco.position.y = 2.9; arco.rotation.z = Math.PI * 0.15; arco.userData.onda = i;
        g.add(arco);
      });
      const base = caja(1.2, 0.3, 1.2, C.lavanda);
      g.add(base);
      return g;
    },
    lab() {
      const g = new T.Group();
      const edificio = caja(1.8, 1.1, 1.6, C.lavandaClara);
      const domo = new T.Mesh(new T.SphereGeometry(0.62, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(C.azul));
      domo.position.y = 1.1;
      const franja = caja(1.82, 0.16, 1.62, C.magenta); franja.position.y = 0.55;
      g.add(edificio, domo, franja);
      return g;
    },
    factory() {
      const g = new T.Group();
      const nave = caja(2.3, 0.9, 1.6, C.lavanda);
      g.add(nave);
      for (let i = 0; i < 3; i++) {
        const diente = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 1.6, 3), mat(C.magenta));
        diente.rotation.x = Math.PI / 2; diente.rotation.y = Math.PI; diente.position.set(-0.75 + i * 0.75, 1.1, 0);
        g.add(diente);
      }
      [-0.7, 0.2].forEach((x) => { const ch = cil(0.14, 0.18, 1.3, C.tinta, 10); ch.position.set(x, 1.5, -0.55); g.add(ch); });
      return g;
    },
    park() {
      const g = new T.Group();
      const pasto = new T.Mesh(new T.CircleGeometry(1.25, 28), mat(C.lavanda));
      pasto.rotation.x = -Math.PI / 2; pasto.position.y = 0.03;
      g.add(pasto);
      [[-0.6, -0.4, 1.1], [0.55, -0.2, 0.9], [0, 0.6, 1.3]].forEach(([x, z, h]) => {
        const tronco = cil(0.06, 0.07, h * 0.5, C.tinta, 8); tronco.position.set(x, h * 0.25, z);
        const copa = new T.Mesh(new T.ConeGeometry(0.38, h, 10), mat(C.lavandaClara));
        copa.position.set(x, h * 0.5 + h / 2 - 0.1, z);
        g.add(tronco, copa);
      });
      const farol = cil(0.04, 0.05, 1.3, C.tinta, 8); farol.position.set(0.9, 0.65, 0.7);
      const luz = new T.Mesh(new T.SphereGeometry(0.13, 10, 8), new T.MeshBasicMaterial({ color: C.rosa }));
      luz.position.set(0.9, 1.35, 0.7);
      g.add(farol, luz);
      return g;
    },
    school() {
      const g = new T.Group();
      const edificio = caja(2, 1.5, 1.3, C.lavandaClara);
      g.add(edificio);
      for (let f = 0; f < 2; f++) for (let c = 0; c < 4; c++) {
        const v = caja(0.26, 0.26, 0.04, C.azul); v.position.set(-0.68 + c * 0.45, 0.45 + f * 0.55, 0.66); g.add(v);
      }
      const asta = cil(0.03, 0.03, 1.2, C.tinta, 6); asta.position.set(0.9, 2.1, 0.4);
      const bandera = caja(0.45, 0.28, 0.02, C.magenta); bandera.position.set(1.13, 2.55, 0.4);
      g.add(asta, bandera);
      return g;
    }
  };

  function textura(stops) {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new T.CanvasTexture(c);
  }
  function solMat(centro, borde, op) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false, fog: false,
      uniforms: { a: { value: new T.Color(centro) }, b: { value: new T.Color(borde) }, o: { value: op } },
      vertexShader: "varying vec2 v; void main(){ v = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform vec3 a; uniform vec3 b; uniform float o; varying vec2 v; void main(){ float d = distance(v, vec2(0.5))*2.0; gl_FragColor = vec4(mix(a,b,smoothstep(0.0,1.0,d)), o*(1.0-smoothstep(0.97,1.0,d))); }"
    });
  }

  function iniciar(canvas, obras) {
    if (!T) return false;
    try { renderer = new T.WebGLRenderer({ canvas, antialias: true }); } catch (e) { return false; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    escena = new T.Scene();
    escena.background = new T.Color(C.neblina);
    escena.fog = new T.Fog(C.neblina, 18, 40);
    camara = new T.PerspectiveCamera(38, 1, 0.1, 100);
    camara.position.set(0, 10.5, 20.5);
    camara.lookAt(0, 1.6, 0);
    escena.add(new T.HemisphereLight(0xffffff, 0x6a5aa8, 0.95));
    const dir = new T.DirectionalLight(0xffe2f0, 0.75); dir.position.set(5, 10, 6); escena.add(dir);

    // Sol de fondo: mitad real + mitad espejo que se completa con el puntaje
    const solR = new T.Mesh(new T.CircleGeometry(5.5, 64, Math.PI, Math.PI), solMat(0xff9cc7, 0xc2187a, 0.95));
    solEspejo = new T.Mesh(new T.CircleGeometry(5.5, 64, 0, Math.PI), solMat(0xd8f1ff, 0x5fb3e3, 0.12));
    solR.position.set(0, 6.5, -14); solEspejo.position.set(0, 6.5, -14);
    const halo = new T.Mesh(new T.PlaneGeometry(26, 26), new T.MeshBasicMaterial({ map: textura([[0, "rgba(255,110,180,0.45)"], [1, "rgba(43,31,75,0)"]]), transparent: true, depthWrite: false, fog: false }));
    halo.position.set(0, 5.5, -14.5);
    escena.add(halo, solR, solEspejo);

    ciudad = new T.Group();
    escena.add(ciudad);
    const base = new T.Mesh(new T.CylinderGeometry(7.4, 7.6, 0.6, 64), mat(0x3a2d66));
    base.position.y = -0.3; ciudad.add(base);
    const tapa = new T.Mesh(new T.CircleGeometry(7.4, 64), mat(0x4b3d80));
    tapa.rotation.x = -Math.PI / 2; tapa.position.y = 0.005; ciudad.add(tapa);

    // Calles: una cruz clara
    [[14, 0.7], [0.7, 14]].forEach(([w, d]) => {
      const calle = new T.Mesh(new T.PlaneGeometry(w, d), mat(0x5c4f94));
      calle.rotation.x = -Math.PI / 2; calle.position.y = 0.012; ciudad.add(calle);
    });

    // Lotes 3x3 (el centro es la plaza)
    const paso = 3.4;
    for (let f = -1; f <= 1; f++) for (let c = -1; c <= 1; c++) {
      if (f === 0 && c === 0) continue;
      const lote = new T.Mesh(new T.PlaneGeometry(2.7, 2.7), new T.MeshBasicMaterial({ color: 0x6a5aa8, transparent: true, opacity: 0.35 }));
      lote.rotation.x = -Math.PI / 2;
      const x = c * paso + (c ? Math.sign(c) * 0.35 : 0), z = f * paso + (f ? Math.sign(f) * 0.35 : 0);
      lote.position.set(x, 0.02, z);
      ciudad.add(lote);
      lotes.push(new T.Vector3(x, 0, z));
    }

    // Personas en la plaza: aparecen conforme sube la igualdad
    const geoC = new T.CapsuleGeometry(0.1, 0.32, 3, 8), geoH = new T.SphereGeometry(0.09, 10, 8);
    for (let i = 0; i < 14; i++) {
      const g = new T.Group();
      const color = i % 2 ? C.tinta : C.magenta;
      const cuerpo = new T.Mesh(geoC, mat(color)); cuerpo.position.y = 0.28;
      const cabeza = new T.Mesh(geoH, mat(color)); cabeza.position.y = 0.6;
      g.add(cuerpo, cabeza);
      const a = (i / 14) * Math.PI * 2, r = 0.5 + (i % 3) * 0.32;
      g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      g.scale.setScalar(0.001);
      ciudad.add(g);
      figuras.push(g);
    }

    obras.forEach((o, i) => {
      const crear = FABRICA[o.icono] || FABRICA.school;
      const modelo = crear();
      const lote = lotes[i % lotes.length];
      modelo.position.copy(lote);
      modelo.rotation.y = Math.atan2(lote.x, lote.z) + Math.PI;
      modelo.scale.set(1, 0.001, 1);
      modelo.visible = false;
      modelo.userData = { meta: 0, actual: 0 };
      ciudad.add(modelo);
      modelos[i] = modelo;
    });

    // Girar con el dedo o el mouse
    canvas.addEventListener("pointerdown", (e) => { arrastrando = true; ultimoX = e.clientX; canvas.setPointerCapture(e.pointerId); despertar(); });
    canvas.addEventListener("pointermove", (e) => { if (!arrastrando) return; anguloMeta += (e.clientX - ultimoX) * 0.01; ultimoX = e.clientX; despertar(); });
    const soltar = () => { arrastrando = false; };
    canvas.addEventListener("pointerup", soltar); canvas.addEventListener("pointercancel", soltar);

    const ajustar = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); camara.aspect = w / h; camara.updateProjectionMatrix(); despertar();
    };
    new ResizeObserver(ajustar).observe(canvas);
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) despertar(); }).observe(canvas);
    listo = true;
    ajustar();
    return true;
  }

  let puntajeMeta = 0, puntajeActual = 0, igualdadMeta = 0;
  function mostrar(indices, puntaje, igualdad) {
    if (!listo) return;
    Object.keys(modelos).forEach((k) => {
      const m = modelos[k];
      m.userData.meta = indices.includes(+k) ? 1 : 0;
      if (m.userData.meta) m.visible = true;
    });
    puntajeMeta = puntaje / 100;
    igualdadMeta = igualdad / 100;
    despertar();
  }

  let corriendo = false;
  function despertar() { animando = performance.now() + 1600; if (!corriendo) { corriendo = true; requestAnimationFrame(cuadro); } }
  const k = reducido ? 1 : 0.12;
  function cuadro(t) {
    if (!visible) { corriendo = false; return; }
    if (!arrastrando && !reducido) anguloMeta += 0.0016;
    angulo += (anguloMeta - angulo) * (reducido ? 1 : 0.1);
    ciudad.rotation.y = angulo;
    Object.values(modelos).forEach((m) => {
      const d = m.userData;
      d.actual += (d.meta - d.actual) * k;
      m.scale.y = Math.max(0.001, d.actual);
      if (d.meta === 0 && d.actual < 0.01) m.visible = false;
      m.children.forEach((h) => { if (h.userData.onda !== undefined && !reducido) h.material.opacity = 0.5 + 0.5 * Math.sin(t * 0.004 - h.userData.onda); });
    });
    puntajeActual += (puntajeMeta - puntajeActual) * k;
    solEspejo.material.uniforms.o.value = 0.12 + 0.88 * puntajeActual;
    const visibles = Math.round(igualdadMeta * figuras.length);
    figuras.forEach((f, i) => { const meta = i < visibles ? 1 : 0.001; f.scale.setScalar(f.scale.x + (meta - f.scale.x) * k); });
    renderer.render(escena, camara);
    // Sigue girando lento mientras se ve; si hay movimiento reducido, solo anima tras un cambio
    if (!reducido || t < animando) requestAnimationFrame(cuadro); else corriendo = false;
  }

  return { iniciar, mostrar, despertar };
})();
