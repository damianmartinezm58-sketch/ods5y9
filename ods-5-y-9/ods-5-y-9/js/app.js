/* =====================================================================
   Lógica de la página. Todo el contenido viene de window.DATOS
   (datos.js), que se genera desde base_de_datos.xlsx.
   ===================================================================== */
(function () {
  "use strict";
  const D = window.DATOS;
  if (!D) {
    document.body.insertAdjacentHTML("afterbegin", '<p style="padding:24px;background:#fff">datos.js was not found. Run: python3 actualizar_datos.py</p>');
    return;
  }
  const T = (k) => (D.textos[k] !== undefined ? D.textos[k] : "");
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const url = (u) => (/^https?:\/\//i.test(u || "") ? u : "#");
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const icono = (id, cls) => `<svg class="ico ${cls || ""}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const enlace = (c, texto) => c.enlace ? `<a href="${esc(url(c.enlace))}" target="_blank" rel="noopener">${esc(texto || T("ver_fuente"))}${icono("externo")}</a>` : "";
  const empieza = (c, p) => c.tema.trim().toLowerCase().startsWith(p.toLowerCase());

  /* ---------- 1. Textos de la hoja "Textos" ---------- */
  $$("[data-t]").forEach((el) => { el.textContent = T(el.dataset.t); });
  $("#nombre").placeholder = T("compromiso_nombre");
  document.title = `${T("sitio_nombre")} · SDG 5 + SDG 9`;

  /* ---------- 1b. Halls on the horizon (seven sections, numbered) ---------- */
  const SALAS = [["sol", "nav_sol"], ["datos", "nav_datos"], ["p2050", "nav_2050"], ["juegos", "nav_juegos"], ["actua", "nav_actua"], ["ley", "nav_ley"], ["fuentes", "nav_fuentes"]];
  $("#horizonte").innerHTML = SALAS.map(([id, k], i) => `<a href="#${id}"><span>${esc(T("sala_prefijo"))} ${String(i + 1).padStart(2, "0")}</span><b>${esc(T(k))}</b></a>`).join("");

  /* ---------- 2. Barra y menú ---------- */
  const barra = $(".barra"), menu = $("#menu"), menuBtn = $("#menuBtn");
  const secciones = $$("main section[id], section[id]");
  function alScroll() {
    barra.classList.toggle("solida", scrollY > innerHeight * 0.6);
    let actual = "";
    secciones.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.35) actual = s.id; });
    $$("a", menu).forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === "#" + actual));
    const salas = $$("#horizonte a");
    salas.forEach((a) => a.classList.toggle("activa", a.getAttribute("href") === "#" + (actual && actual !== "inicio" ? actual : "sol")));
  }
  addEventListener("scroll", alScroll, { passive: true });
  alScroll();
  menuBtn.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    menuBtn.setAttribute("aria-expanded", abierto);
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => { menu.classList.remove("abierto"); menuBtn.setAttribute("aria-expanded", "false"); }));

  /* ---------- 3. Figures as readouts in the hero rail ---------- */
  const fmt = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 1 });
  $("#cifras").innerHTML = D.cifras.map((c) => `
    <div><dt>${fmt(c.cifra)}<small>${esc(c.unidad.trim())}</small></dt>
      <dd><span>${esc(c.descripcion)}</span><br>${enlace(c, c.fuente)}</dd></div>`).join("");

  /* ---------- 4. El sol: dos mitades ---------- */
  const ods = D.contenido.filter((c) => c.seccion === "ODS");
  function llenarMitad(id, prefijo) {
    const i = ods.findIndex((c) => empieza(c, prefijo));
    const caja = $(id);
    if (i === -1) { caja.hidden = true; return; }
    const c = ods.splice(i, 1)[0];
    $("h3", caja).textContent = c.tema;
    $("p", caja).textContent = c.informacion;
    const a = $("a", caja);
    a.href = url(c.enlace);
    a.innerHTML = `${esc(T("ver_fuente"))}: ${esc(c.fuente)} ${icono("externo")}`;
  }
  llenarMitad("#mitad5", "SDG 5");
  llenarMitad("#mitad9", "SDG 9");
  $("#disco").classList.add("encendido"); // encendido por defecto (ver sección 15)

  // Cadena de conexiones sobre el horizonte
  const cadena = $("#cadena");
  cadena.style.setProperty("--n", D.conexiones.length);
  cadena.innerHTML = D.conexiones.map((c, i) => `<button class="nodo" role="tab" aria-selected="false" data-i="${i}"><i></i><b>${esc(c.paso)}</b></button>`).join("");
  const cadenaTexto = $("#cadenaTexto"), cadenaEco = $("#cadenaEco");
  $$(".nodo", cadena).forEach((b) => {
    const mostrar = () => {
      $$(".nodo", cadena).forEach((x) => x.setAttribute("aria-selected", "false"));
      b.setAttribute("aria-selected", "true");
      const txt = D.conexiones[b.dataset.i].explicacion;
      cadenaTexto.textContent = txt;
      cadenaEco.textContent = txt;
    };
    b.addEventListener("click", mostrar);
    b.addEventListener("mouseenter", mostrar);
    b.addEventListener("focus", mostrar);
  });

  /* ---------- 5. Datos (filas) y Guanajuato ---------- */
  const fila = (c) => `<li><h3>${esc(c.tema)}</h3><p>${esc(c.informacion)}</p><div class="fuente">${esc(c.fuente)}<br>${enlace(c)}</div></li>`;
  const gto = ods.filter((c) => empieza(c, "Guanajuato"));
  const resto = ods.filter((c) => !empieza(c, "Guanajuato"));
  $("#filasDatos").innerHTML = resto.map(fila).join("");
  const sinPrefijo = (t) => { const r = t.replace(/^Guanajuato\s*[:\-–]\s*/i, ""); return r.charAt(0).toUpperCase() + r.slice(1); };
  $("#filasGto").innerHTML = gto.map((c) => `<article><h3>${esc(sinPrefijo(c.tema))}</h3><p>${esc(c.informacion)}</p>${enlace(c, T("ver_fuente") + ": " + c.fuente)}</article>`).join("");
  if (!gto.length) $(".gto").hidden = true;

  /* ---------- 6. Rumbo a 2050 ---------- */
  const p2050 = D.contenido.filter((c) => c.seccion === "Projections 2050");
  const linea = $("#linea2050");
  linea.style.setProperty("--n", p2050.length);
  linea.innerHTML = p2050.map((c, i) => `<li style="grid-column:${i + 1}"><h3>${esc(c.tema)}</h3><p>${esc(c.informacion)}</p>${enlace(c, c.fuente)}</li>`).join("");
  function ejeLinea() {
    const primero = $("li:nth-child(odd)", linea);
    if (!primero || innerWidth <= 1080) { linea.style.removeProperty("--eje"); $$("li", linea).forEach((li) => (li.style.gridColumn = "")); return; }
    $$("li", linea).forEach((li, i) => (li.style.gridColumn = i + 1));
    let alto = 0;
    $$("li:nth-child(odd)", linea).forEach((li) => (alto = Math.max(alto, li.offsetHeight)));
    linea.style.setProperty("--eje", alto + "px");
  }
  addEventListener("resize", ejeLinea);
  addEventListener("load", ejeLinea);
  ejeLinea();

  // Escenario: ¿se completa el sol?
  const gente = $("#miniGente");
  const POSES = [["fig-tendida", 70, 28], ["fig-sentada", 36, 42], ["fig-parada", 22, 54], ["fig-recostada", 66, 30]];
  let s = 11;
  const azar = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  gente.innerHTML = Array.from({ length: 26 }, (_, i) => {
    const [id, w, h] = POSES[i % 7 === 0 ? 2 : i % 3 === 0 ? 1 : i % 4 === 1 ? 3 : 0];
    const d = azar(), esc2 = 0.5 + d * 0.8;
    const x = 10 + azar() * 560, y = 40 + d * 70 - h * esc2;
    return `<use href="#${id}" x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(w * esc2).toFixed(0)}" height="${(h * esc2).toFixed(0)}" class="${i % 2 ? "extra" : ""}"/>`;
  }).join("");
  function escenario(si) {
    $("#miniSala").classList.toggle("apagada", !si);
    $("#btnSi").setAttribute("aria-pressed", si);
    $("#btnNo").setAttribute("aria-pressed", !si);
    const lista = $("#listaEscenario");
    lista.className = "lista-escenario " + (si ? "si" : "no");
    lista.innerHTML = (si ? D.escenario.si : D.escenario.no).map((p) => `<li>${esc(p)}</li>`).join("");
  }
  $("#btnSi").addEventListener("click", () => escenario(true));
  $("#btnNo").addEventListener("click", () => escenario(false));
  escenario(true);

  /* ---------- 7. Pestañas de juegos ---------- */
  const tabs = $$(".pestanas [role=tab]");
  function abrir(tab) {
    tabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; $("#" + t.getAttribute("aria-controls")).hidden = !on; });
    if (tab.id === "t-ciudad") iniciarCiudad();
  }
  tabs.forEach((t, i) => {
    t.tabIndex = i ? -1 : 0;
    t.addEventListener("click", () => abrir(t));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); abrir(n);
    });
  });

  /* ---------- 8. Trivia ---------- */
  const tv = { i: 0, puntos: 0 };
  function pregunta() {
    const total = D.trivia.length;
    $("#triviaPuntos").textContent = tv.puntos;
    $("#triviaCuenta").textContent = `${Math.min(tv.i + 1, total)} / ${total}`;
    $("#triviaBarra").style.width = (tv.i / total) * 100 + "%";
    const zona = $("#triviaZona");
    if (tv.i >= total) {
      const r = tv.puntos / total;
      const msj = r >= 0.8 ? T("trivia_final_alto") : r >= 0.5 ? T("trivia_final_medio") : T("trivia_final_bajo");
      zona.innerHTML = `<div class="resultado"><div class="grande">${tv.puntos}/${total}</div><p>${esc(msj)}</p>
        <button class="btn btn-borde-claro" id="triviaOtra">${esc(T("trivia_reiniciar"))}${icono("flecha")}</button></div>`;
      $("#triviaOtra").onclick = () => { tv.i = 0; tv.puntos = 0; pregunta(); };
      return;
    }
    const q = D.trivia[tv.i];
    zona.innerHTML = `<p class="pregunta">${esc(q.pregunta)}</p>
      <div class="opciones">${q.opciones.map((o, k) => `<button class="opcion" data-k="${k}"><b>${"ABCD"[k]}</b><span>${esc(o)}</span></button>`).join("")}</div>
      <div class="explica" id="triviaExp" hidden></div>`;
    $$(".opcion", zona).forEach((b) => b.addEventListener("click", () => {
      const k = +b.dataset.k, ok = k === q.correcta;
      $$(".opcion", zona).forEach((x) => (x.disabled = true));
      $$(".opcion", zona)[q.correcta].classList.add("correcta");
      b.classList.add("elegida");
      if (ok) tv.puntos++; else b.classList.add("incorrecta");
      $("#triviaPuntos").textContent = tv.puntos;
      const exp = $("#triviaExp");
      exp.hidden = false;
      exp.innerHTML = `<p>${esc(q.explicacion)} ${enlace(q, q.fuente)}</p>
        <button class="btn btn-borde-claro" id="triviaSig">${esc(T("trivia_siguiente"))}${icono("flecha")}</button>`;
      $("#triviaSig").focus({ preventScroll: true });
      $("#triviaSig").onclick = () => { tv.i++; pregunta(); };
    }));
  }
  pregunta();

  /* ---------- 9. Ciudad equitativa ---------- */
  const PRESUPUESTO = parseInt(T("ciudad_presupuesto"), 10) || 12;
  const COLORES = ["var(--rosa)", "var(--azul)", "var(--lavanda)"];
  const elegidas = new Set();
  let ciudad3d = false, ciudadIniciada = false;
  $("#obras").innerHTML = D.simulador.map((o, i) => `
    <button class="obra" aria-pressed="false" data-i="${i}" title="${esc(o.descripcion)}">
      ${icono(o.icono)}<b>${esc(o.nombre)}</b><small>${"<i></i>".repeat(o.costo)} ${o.costo}</small>
    </button>`).join("");
  $("#indicadores").innerHTML = [1, 2, 3].map((n, k) => `
    <div class="indicador"><div><span>${esc(T("ciudad_ind_" + n))}</span><b id="ind${k}">0</b></div>
    <div class="pista"><span id="pis${k}" style="background:${COLORES[k]}"></span></div></div>`).join("");
  function pintarCiudad() {
    const gastado = [...elegidas].reduce((a, i) => a + D.simulador[i].costo, 0);
    const resta = PRESUPUESTO - gastado;
    $("#ciudadRestante").textContent = `${resta} / ${PRESUPUESTO}`;
    $("#monedas").innerHTML = Array.from({ length: PRESUPUESTO }, (_, k) => `<span class="moneda ${k >= resta ? "gastada" : ""}"></span>`).join("");
    const v = [0, 1, 2].map((k) => Math.min(100, [...elegidas].reduce((a, i) => a + D.simulador[i].puntos[k], 0)));
    v.forEach((n, k) => { $("#ind" + k).textContent = n; $("#pis" + k).style.width = n + "%"; });
    $$(".obra").forEach((b) => {
      const i = +b.dataset.i, sel = elegidas.has(i);
      b.setAttribute("aria-pressed", sel);
      b.disabled = !sel && D.simulador[i].costo > resta;
    });
    const min = Math.min(...v), prom = (v[0] + v[1] + v[2]) / 3;
    $("#ciudadMensaje").textContent = !elegidas.size ? T("ciudad_msg_inicio") : (min >= 50 && prom >= 65) ? T("ciudad_msg_alto") : min >= 25 ? T("ciudad_msg_medio") : T("ciudad_msg_bajo");
    if (ciudad3d) window.Ciudad3D.mostrar([...elegidas], prom, v[0]);
  }
  $$(".obra").forEach((b) => b.addEventListener("click", () => {
    const i = +b.dataset.i;
    elegidas.has(i) ? elegidas.delete(i) : elegidas.add(i);
    pintarCiudad();
  }));
  $("#ciudadReiniciar").addEventListener("click", () => { elegidas.clear(); pintarCiudad(); });
  function iniciarCiudad() {
    if (ciudadIniciada) return;
    ciudadIniciada = true;
    ciudad3d = !!(window.Ciudad3D && window.Ciudad3D.iniciar($("#ciudadCanvas"), D.simulador));
    if (!ciudad3d) $(".ciudad-escena").hidden = true;
    pintarCiudad();
  }
  pintarCiudad();

  /* ---------- 10. ¿Mito o realidad? (deslizar) ---------- */
  const pila = $("#mitoPila"), resp = $("#mitoResp");
  const lados = { izq: $(".mito-lado.izq"), der: $(".mito-lado.der") };
  const mito = { i: 0, buenas: 0, bloqueado: false };
  function tarjeta(i, clase) {
    const m = D.mitos[i];
    return m ? `<div class="tarjeta-mito ${clase}" data-i="${i}" tabindex="${clase ? -1 : 0}" aria-label="${esc(m.frase)}"><p>${esc(m.frase)}</p><small>${i + 1} / ${D.mitos.length}</small></div>` : "";
  }
  function pintarMito() {
    resp.innerHTML = "";
    $("#mitoCuenta").textContent = `${Math.min(mito.i + 1, D.mitos.length)} / ${D.mitos.length}`;
    if (mito.i >= D.mitos.length) {
      pila.innerHTML = "";
      resp.innerHTML = `<b>${esc(T("mito_final"))} ${mito.buenas} / ${D.mitos.length}</b>
        <button class="btn btn-borde-claro" id="mitoOtra">${esc(T("mito_reiniciar"))}${icono("flecha")}</button>`;
      $("#mitoOtra").onclick = () => { mito.i = 0; mito.buenas = 0; pintarMito(); };
      $("#btnMito").disabled = $("#btnReal").disabled = true;
      return;
    }
    $("#btnMito").disabled = $("#btnReal").disabled = false;
    pila.innerHTML = tarjeta(mito.i + 1, "atras") + tarjeta(mito.i, "");
    mito.bloqueado = false;
    arrastre($(".tarjeta-mito:not(.atras)", pila));
  }
  function responder(esRealidad) {
    if (mito.bloqueado) return;
    mito.bloqueado = true;
    const m = D.mitos[mito.i], ok = esRealidad === m.realidad;
    if (ok) mito.buenas++;
    const carta = $(".tarjeta-mito:not(.atras)", pila);
    if (carta) {
      carta.style.transition = reducido ? "none" : "transform .55s var(--salida), opacity .55s";
      carta.style.transform = `translateX(${esRealidad ? 140 : -140}%) rotate(${esRealidad ? 16 : -16}deg)`;
      carta.style.opacity = "0";
    }
    lados.izq.classList.toggle("on", !esRealidad); lados.der.classList.toggle("on", esRealidad);
    $("#btnMito").disabled = $("#btnReal").disabled = true;
    resp.innerHTML = `<b>${esc(ok ? T("mito_correcto") : T("mito_incorrecto"))} ${esc(m.realidad ? T("mito_boton_realidad") : T("mito_boton_mito"))}.</b>
      <p>${esc(m.explicacion)} ${enlace(m, m.fuente)}</p>
      <button class="btn btn-borde-claro" id="mitoSig">${esc(T("mito_siguiente"))}${icono("flecha")}</button>`;
    $("#mitoSig").focus({ preventScroll: true });
    $("#mitoSig").onclick = () => { lados.izq.classList.remove("on"); lados.der.classList.remove("on"); mito.i++; pintarMito(); };
  }
  function arrastre(carta) {
    if (!carta) return;
    let x0 = 0, dx = 0, ux = 0, ut = 0, vel = 0, activo = false;
    carta.addEventListener("pointerdown", (e) => {
      if (mito.bloqueado) return;
      activo = true; x0 = ux = e.clientX; ut = performance.now(); dx = 0; vel = 0;
      carta.setPointerCapture(e.pointerId);
      carta.style.transition = "none";
    });
    carta.addEventListener("pointermove", (e) => {
      if (!activo) return;
      const ahora = performance.now();
      vel = (e.clientX - ux) / Math.max(1, ahora - ut);
      ux = e.clientX; ut = ahora;
      dx = e.clientX - x0;
      carta.style.transform = `translateX(${dx}px) rotate(${dx * 0.045}deg)`;
      lados.izq.classList.toggle("on", dx < -40);
      lados.der.classList.toggle("on", dx > 40);
    });
    const fin = () => {
      if (!activo) return;
      activo = false;
      if (dx > 120 || vel > 0.6) return responder(true);
      if (dx < -120 || vel < -0.6) return responder(false);
      carta.style.transition = "transform .5s var(--salida)";
      carta.style.transform = "";
      lados.izq.classList.remove("on"); lados.der.classList.remove("on");
    };
    carta.addEventListener("pointerup", fin);
    carta.addEventListener("pointercancel", fin);
  }
  $("#btnMito").addEventListener("click", () => responder(false));
  $("#btnReal").addEventListener("click", () => responder(true));
  $("#j-mito").addEventListener("keydown", (e) => {
    if (e.target.closest("a, input")) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); responder(false); }
    if (e.key === "ArrowRight") { e.preventDefault(); responder(true); }
  });
  pintarMito();

  /* ---------- 11. Memorama ---------- */
  const memo = { abiertas: [], mov: 0, pares: 0, espera: false };
  function barajar(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function iniciarMemo() {
    Object.assign(memo, { abiertas: [], mov: 0, pares: 0, espera: false });
    $("#memoMov").textContent = 0;
    $("#memoFin").hidden = true;
    const cartas = barajar(D.memorama.flatMap((m, i) => [{ par: i, t: m.termino, termino: true }, { par: i, t: m.definicion }]));
    $("#tablero").innerHTML = cartas.map((c) => `<button class="carta" data-par="${c.par}" aria-label="Hidden card">
      <span class="cara dorso"></span><span class="cara frente ${c.termino ? "termino" : ""}">${esc(c.t)}</span></button>`).join("");
    $$(".carta").forEach((c) => c.addEventListener("click", () => voltear(c)));
  }
  function voltear(c) {
    if (memo.espera || c.classList.contains("volteada")) return;
    c.classList.add("volteada");
    c.setAttribute("aria-label", $(".frente", c).textContent);
    memo.abiertas.push(c);
    if (memo.abiertas.length < 2) return;
    memo.mov++;
    $("#memoMov").textContent = memo.mov;
    const [a, b] = memo.abiertas;
    if (a.dataset.par === b.dataset.par) {
      a.classList.add("par"); b.classList.add("par");
      memo.abiertas = [];
      if (++memo.pares === D.memorama.length) $("#memoFin").hidden = false;
    } else {
      memo.espera = true;
      setTimeout(() => {
        [a, b].forEach((x) => { x.classList.remove("volteada"); x.setAttribute("aria-label", "Hidden card"); });
        memo.abiertas = []; memo.espera = false;
      }, 1100);
    }
  }
  $("#memoReiniciar").addEventListener("click", iniciarMemo);
  iniciarMemo();

  /* ---------- 12. Toma acción y compromiso ---------- */
  $("#filasAccion").innerHTML = D.contenido.filter((c) => c.seccion === "Take Action").map(fila).join("");
  $("#listaCompromisos").innerHTML = D.compromisos.map((c, i) => `<label class="check"><input type="checkbox" value="${i}"><span>${esc(c)}</span></label>`).join("");

  const svg = $("#multitud");
  const NS = "http://www.w3.org/2000/svg";
  let s2 = 23;
  const azar2 = () => ((s2 = (s2 * 16807) % 2147483647) / 2147483647);
  function figura(id, w, h, x, d, clase) {
    const e = 0.45 + d * 0.85;
    const y = 158 + d * 120 - h * e;
    return `<use href="#${id}" x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(w * e).toFixed(0)}" height="${(h * e).toFixed(0)}" class="figura ${clase || ""}"/>`;
  }
  const base = Array.from({ length: 30 }, (_, i) => {
    const [id, w, h] = POSES[i % 6 === 0 ? 2 : i % 3 === 0 ? 1 : i % 4 === 1 ? 3 : 0];
    return figura(id, w, h, 10 + azar2() * 720, azar2());
  }).join("");
  svg.innerHTML = `<line x1="0" y1="150" x2="800" y2="150" stroke="#141c36" stroke-opacity=".35"/>
    <g class="piso">${base}</g><g class="reflejo" transform="translate(0 300) scale(1 -1)">${base}</g><g class="nombres"></g>`;
  const CLAVE = "ods59_siluetas";
  const leer = () => { try { return parseInt(localStorage.getItem(CLAVE), 10) || 0; } catch (e) { return 0; } };
  function sumarSilueta(nombre, animar) {
    const [id, w, h] = POSES[1 + Math.floor(azar2() * 3)];
    const x = 40 + azar2() * 680, d = 0.55 + azar2() * 0.4;
    const html = figura(id, w, h, x, d, "tuya" + (animar ? " entra" : ""));
    $(".piso", svg).insertAdjacentHTML("beforeend", html);
    $(".reflejo", svg).insertAdjacentHTML("beforeend", html);
    if (nombre) {
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", x.toFixed(0)); t.setAttribute("y", (158 + d * 120 - h * (0.45 + d * 0.85) - 8).toFixed(0));
      t.textContent = nombre;
      $(".nombres", svg).appendChild(t);
    }
  }
  for (let i = 0; i < Math.min(leer(), 12); i++) sumarSilueta("", false);
  $("#contadorSiluetas").textContent = leer();
  $("#formCompromiso").addEventListener("submit", (e) => {
    e.preventDefault();
    const marcados = $$("#listaCompromisos input:checked");
    const err = $("#compromisoError");
    if (!marcados.length) { err.hidden = false; $("#listaCompromisos input").focus(); return; }
    err.hidden = true;
    sumarSilueta($("#nombre").value.trim(), !reducido);
    const n = leer() + 1;
    try { localStorage.setItem(CLAVE, n); } catch (e2) { /* sin almacenamiento */ }
    $("#contadorSiluetas").textContent = n;
    $("#multitudMsg").textContent = T("compromiso_listo");
  });
  $("#listaCompromisos").addEventListener("change", () => { $("#compromisoError").hidden = true; });

  /* ---------- 13. Legal ---------- */
  $("#acordeonLey").innerHTML = D.contenido.filter((c) => c.seccion === "Legal").map((c, i) => `
    <details ${i === 0 ? "open" : ""}><summary>${esc(c.tema)}<i aria-hidden="true"></i></summary>
      <div class="cuerpo"><p>${esc(c.informacion)}</p><p>${esc(c.fuente)} · ${enlace(c)}</p></div></details>`).join("");

  /* ---------- 14. Fuentes ---------- */
  const fuentes = new Map();
  [...D.contenido, ...D.cifras, ...D.trivia, ...D.mitos].forEach((c) => { if (c.enlace && !fuentes.has(c.enlace)) fuentes.set(c.enlace, c.fuente); });
  $("#listaFuentes").innerHTML = [...fuentes].map(([u, n]) => `<li>${esc(n)}. <a href="${esc(url(u))}" target="_blank" rel="noopener">${esc(u)}</a></li>`).join("");

  /* ---------- 15. La neblina se levanta (solo sobre lo que aún no se ve) ----------
     Todo es visible por defecto. Cuando la persona empieza a bajar, lo que todavía
     está debajo de la pantalla se cubre de neblina y se aclara al llegar a ello. */
  $$("#filasDatos, #filasAccion").forEach((l) => l.classList.add("revela"));
  let armado = false;
  function armar() {
    if (armado || reducido) return;
    armado = true;
    const abajo = (el) => el.getBoundingClientRect().top > innerHeight;
    const obs = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.toggle("neblina", false);
      if (e.target.id === "disco") e.target.classList.add("encendido");
      obs.unobserve(e.target);
    }), { threshold: 0.2 });
    $$(".revela li").filter(abajo).forEach((li) => { li.classList.add("neblina"); obs.observe(li); });
    const disco = $("#disco");
    if (abajo(disco)) { disco.classList.toggle("encendido", false); obs.observe(disco); }
  }
  addEventListener("scroll", armar, { passive: true });
})();
