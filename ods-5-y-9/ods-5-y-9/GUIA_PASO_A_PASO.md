# Guía paso a paso · Industry, Innovation & Equality (ODS 5 + ODS 9)

> La página y el Excel están **en inglés**. Esta guía está en español para el equipo.

Cómo abrir la página en **Visual Studio Code**, cambiar su contenido desde el **Excel**, y **subirla a GitHub** para publicarla gratis con **GitHub Pages**.

---

## 0. Qué hay en la carpeta

```
ods-5-y-9/
├── index.html              ← estructura de la página
├── css/estilos.css         ← diseño: colores del logo, tipografía, animaciones
├── js/app.js               ← lógica: datos, trivia, mito o realidad, memorama, compromisos
├── js/sala3d.js            ← la sala en 3D de la portada (el sol que se completa)
├── js/ciudad3d.js          ← la ciudad en 3D del juego «Ciudad equitativa»
├── datos.js                ← contenido de la página (se genera desde el Excel)
├── base_de_datos.xlsx      ← TU BASE DE DATOS: aquí está TODO el texto de la página
├── actualizar_datos.py     ← convierte el Excel en datos.js
├── vendor/three.min.js     ← librería 3D (ya incluida, funciona sin internet)
├── fonts/                  ← tipografía Archivo (ya incluida)
├── img/                    ← logo del equipo (logo-equipo.webp) y emblema (emblema.png)
├── PRODUCT.md              ← descripción del proyecto (la usa la skill de diseño)
├── .impeccable/            ← decisión de diseño guardada por la skill impeccable
├── .vscode/                ← extensiones recomendadas para VS Code
├── .gitignore, .nojekyll   ← ajustes para Git y GitHub Pages
└── GUIA_PASO_A_PASO.md     ← esta guía
```

**Idea clave:** el HTML no tiene textos escritos. Todo (títulos, botones, datos, cifras, preguntas, obras de la ciudad, frases de *Myth or fact* y pie de página) sale de `base_de_datos.xlsx`.

---

## 1. Instala lo necesario (solo una vez)

| Programa | Para qué |
|---|---|
| Visual Studio Code | Abrir, editar y ver el proyecto |
| Extensión **Live Server** (de Ritwick Dey) | Ver la página con un clic y que se actualice sola |
| Git | Subir el proyecto a GitHub (en Mac ya viene; si te lo pide, acepta instalar las «Command Line Tools») |
| Python 3 | Solo para actualizar la página cuando cambies el Excel |
| Cuenta de GitHub | Guardar y publicar la página |

Al abrir la carpeta, VS Code te sugerirá instalar Live Server automáticamente.

---

## 2. Abre la carpeta en Visual Studio Code

1. Abre VS Code.
2. **Archivo → Abrir carpeta…** (en Mac: **File → Open Folder…**).
3. Elige la carpeta `ods-5-y-9` y presiona **Abrir**.
4. Si pregunta si confías en los autores, elige **Sí, confío**.

---

## 3. Ejecuta la página

- **Opción A (recomendada):** clic derecho en `index.html` → **Open with Live Server**. Se abre tu navegador y cada cambio que guardes se ve al instante.
- **Opción B:** doble clic en `index.html` desde la carpeta. También funciona sin internet, con 3D incluido.

> En la portada, **haz scroll despacio**: la cámara camina por la sala y el sol se completa (de 50 % a 100 %). Así se explica la idea: el ODS 5 y el ODS 9 son dos mitades de la misma luz. Abajo está el horizonte con las 7 salas (*Hall 01 … Hall 07*) para saltar a cada sección.

---

## 4. Cambia el contenido desde el Excel

1. Abre `base_de_datos.xlsx` y lee la hoja **Instructions**.
   - **Hoja1** (formato original: ID, Seccion, Tema, Información, Fuente, Enlace). Seccion solo acepta `ODS`, `Projections 2050`, `Take Action` o `Legal` (las etiquetas de la plantilla original).
     - Las filas cuyo **Tema** empieza con «SDG 5» y «SDG 9» llenan las dos mitades del sol.
     - Las que empiezan con «Guanajuato» aparecen en la franja magenta de Guanajuato.
   - **Texts**: títulos, menú y botones. No cambies la columna *Key*, solo la columna *Text*.
   - **Figures**: las cifras del riel izquierdo de la portada.
   - **Connections, Scenario 2050, Trivia, City game, Myth or fact, Memory game, Pledges**: el contenido de cada elemento interactivo.
2. Guarda y **cierra** el Excel.
3. En VS Code abre la terminal: **Terminal → Nueva terminal**.
4. La primera vez instala la librería que lee Excel:
   ```bash
   pip3 install openpyxl
   ```
5. Genera los datos:
   ```bash
   python3 actualizar_datos.py
   ```
   Verás: `Done: 27 blocks, 91 texts, 8 questions...`
6. Recarga la página.

> En la hoja **City game**, la columna **Icon** decide qué modelo 3D aparece en la ciudad: `light`, `bus`, `childcare`, `wifi`, `lab`, `factory`, `park` o `school`.

---

## 5. Sube el proyecto a GitHub desde VS Code

### 5.1 Configura Git (solo la primera vez)
En la terminal de VS Code, con tu nombre y el correo de tu cuenta de GitHub:
```bash
git config --global user.name "Tu Nombre"
```
```bash
git config --global user.email "tu-correo@ejemplo.com"
```

### 5.2 Publica
1. En la barra izquierda, haz clic en **Control de código fuente** (`Cmd+Shift+G` en Mac, `Ctrl+Shift+G` en Windows).
2. Presiona **Publicar en GitHub** (*Publish to GitHub*).
3. Inicia sesión en GitHub cuando te lo pida y autoriza en el navegador.
4. Elige **repositorio público** y deja el nombre `ods-5-y-9` (o `sdg-5-and-9`).
5. Deja todos los archivos marcados y acepta.

---

## 6. Publica la página en internet (GitHub Pages)

1. En GitHub, entra a tu repositorio → **Settings** → **Pages**.
2. En **Source** elige **Deploy from a branch**; en **Branch** elige `main` y `/ (root)`. Presiona **Save**.
3. Espera 1 o 2 minutos. Tu enlace será: `https://TU-USUARIO.github.io/ods-5-y-9/`

---

## 7. Cada vez que hagas cambios

1. Edita el Excel → `python3 actualizar_datos.py` → revisa con Live Server.
2. En **Control de código fuente** escribe un mensaje (por ejemplo «Actualicé los datos de Guanajuato»).
3. **Confirmar** (*Commit*) y luego **Sincronizar cambios** (*Sync Changes*).

---

## 8. Cómo está construida (para tu presentación)

**El diseño.** Se eligió con la skill *impeccable* a partir del mundo visual «Sol artificial en la sala»: una nave inmensa con neblina y un medio sol en el muro que, reflejado en el techo espejo, se vuelve un disco completo. Se adaptó a los colores del logo:
- la mitad real del sol es **magenta: ODS 5**;
- la mitad reflejada es **azul claro: ODS 9**;
- las siluetas y el texto van en **azul marino**;
- la neblina es **lavanda**.

| Parte | Qué hace |
|---|---|
| Sala 3D (portada) | Three.js dibuja el piso pulido, el sol y su reflejo, más de 100 siluetas en posturas humanas, sus reflejos en el piso y el techo, y la neblina. El scroll mueve la cámara y completa el sol. Las cifras clave aparecen en el riel izquierdo. |
| *Two halves of the same light* | Explica cada ODS junto a su mitad del sol y la cadena de 5 pasos que las conecta. |
| *What the light reveals* | Datos oficiales en filas con su fuente; la neblina «se levanta» al llegar a cada fila. |
| *Toward 2050* | Línea del horizonte con proyecciones e interruptor *Will the sun be complete?* |
| Minijuegos | *Trivia*; *Fair city* en 3D (eliges obras con presupuesto y el sol de fondo se completa según tu puntaje); *Myth or fact?* (arrastra la tarjeta); *Memory game*. |
| *Add your silhouette to the hall* | Al comprometerte, tu silueta aparece en la sala y en su reflejo. |

---

## 9. Lista de revisión antes de entregar

- [ ] Revisamos y reescribimos con nuestras palabras los textos de **Hoja1** (son un borrador).
- [ ] Abrimos cada **Enlace** y comprobamos que el dato coincide con la fuente (en especial INEGI, Data México y el Congreso de Guanajuato).
- [ ] Cambiamos `footer_derechos` (hoja Texts) por los nombres del equipo.
- [ ] Corregimos el logo original: dice «INDUSTRI» en lugar de «INDUSTRIA» (la página ya escribe el nombre bien).
- [ ] Ejecutamos `python3 actualizar_datos.py` después del último cambio.
- [ ] Probamos los 4 minijuegos en computadora y celular.
- [ ] Subimos los cambios (Commit + Sync) y el enlace de GitHub Pages funciona.
