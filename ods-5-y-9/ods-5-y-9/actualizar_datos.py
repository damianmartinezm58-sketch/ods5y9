"""
Converts base_de_datos.xlsx into datos.js, the file the website reads.
EVERYTHING on the page comes from the Excel file.

Usage (Visual Studio Code terminal, inside the project folder):
    pip3 install openpyxl          (first time only)
    python3 actualizar_datos.py
"""
import json
import re
from pathlib import Path

from openpyxl import load_workbook

FOLDER = Path(__file__).resolve().parent
EXCEL = FOLDER / "base_de_datos.xlsx"
OUTPUT = FOLDER / "datos.js"
SECTIONS = ["ODS", "Projections 2050", "Take Action", "Legal"]
ICONS = {"light", "bus", "childcare", "wifi", "lab", "factory", "park", "school"}


def read(book, sheet, columns):
    if sheet not in book.sheetnames:
        raise SystemExit(f"Sheet '{sheet}' is missing from {EXCEL.name}")
    rows = list(book[sheet].iter_rows(values_only=True))
    head = [str(c).strip() if c is not None else "" for c in rows[0]]
    missing = [c for c in columns if c not in head]
    if missing:
        raise SystemExit(f"Sheet '{sheet}' is missing the columns: {missing}")
    out = []
    for row in rows[1:]:
        row = list(row) + [None] * len(head)
        rec = {c: (row[head.index(c)].strip() if isinstance(row[head.index(c)], str) else row[head.index(c)]) for c in columns}
        if all(v in (None, "") for k, v in rec.items() if k != "ID"):
            continue
        out.append(rec)
    return out


def num(v, default=0.0):
    try:
        return float(v)
    except (TypeError, ValueError):
        return default


def txt(v):
    return "" if v is None else str(v)


def main():
    book = load_workbook(EXCEL, read_only=True)

    contenido = []
    for r in read(book, "Hoja1", ["ID", "Seccion", "Tema", "Información", "Fuente", "Enlace"]):
        if r["Seccion"] not in SECTIONS:
            print(f"Warning: invalid section '{r['Seccion']}' in '{r['Tema']}'. Skipped.")
            continue
        contenido.append({"id": r["ID"], "seccion": r["Seccion"], "tema": txt(r["Tema"]),
                          "informacion": txt(r["Información"]), "fuente": txt(r["Fuente"]), "enlace": txt(r["Enlace"])})

    textos = {txt(r["Key"]): txt(r["Text"]) for r in read(book, "Texts", ["Key", "Text"]) if r["Key"]}

    cifras = [{"cifra": num(r["Figure"]), "unidad": txt(r["Unit"]), "descripcion": txt(r["Description"]),
               "fuente": txt(r["Source"]), "enlace": txt(r["Link"])}
              for r in read(book, "Figures", ["Figure", "Unit", "Description", "Source", "Link"])]

    conexiones = [{"paso": txt(r["Step"]), "explicacion": txt(r["Explanation"])}
                  for r in read(book, "Connections", ["Step", "Explanation"])]

    escenario = {"si": [], "no": []}
    for r in read(book, "Scenario 2050", ["Scenario", "Point"]):
        negativo = re.search(r"\b(no|not|don't|don’t|dont)\b", txt(r["Scenario"]).lower())
        escenario["no" if negativo else "si"].append(txt(r["Point"]))

    trivia = []
    for r in read(book, "Trivia", ["Question", "Option A", "Option B", "Option C", "Option D",
                                   "Correct answer", "Explanation", "Source", "Link"]):
        opciones = [txt(r[f"Option {l}"]) for l in "ABCD" if r[f"Option {l}"] not in (None, "")]
        letra = txt(r["Correct answer"]).upper() or "A"
        trivia.append({"pregunta": txt(r["Question"]), "opciones": opciones,
                       "correcta": "ABCD".index(letra) if letra in "ABCD" else 0,
                       "explicacion": txt(r["Explanation"]), "fuente": txt(r["Source"]), "enlace": txt(r["Link"])})

    simulador = []
    for r in read(book, "City game", ["Project", "Icon", "Cost", "Equality", "Infrastructure", "Innovation", "Description"]):
        icono = txt(r["Icon"]).lower()
        if icono not in ICONS:
            print(f"Warning: icon '{icono}' is not valid in '{r['Project']}'. Using 'school'.")
            icono = "school"
        simulador.append({"nombre": txt(r["Project"]), "icono": icono, "costo": int(num(r["Cost"], 1)),
                          "puntos": [num(r["Equality"]), num(r["Infrastructure"]), num(r["Innovation"])],
                          "descripcion": txt(r["Description"])})

    mitos = [{"frase": txt(r["Statement"]), "realidad": txt(r["Answer"]).lower().startswith("fact"),
              "explicacion": txt(r["Explanation"]), "fuente": txt(r["Source"]), "enlace": txt(r["Link"])}
             for r in read(book, "Myth or fact", ["Statement", "Answer", "Explanation", "Source", "Link"])]

    memorama = [{"termino": txt(r["Term"]), "definicion": txt(r["Definition"])}
                for r in read(book, "Memory game", ["Term", "Definition"])]

    compromisos = [txt(r["Pledge"]) for r in read(book, "Pledges", ["Pledge"])]

    datos = {"textos": textos, "contenido": contenido, "cifras": cifras, "conexiones": conexiones,
             "escenario": escenario, "trivia": trivia, "simulador": simulador, "mitos": mitos,
             "memorama": memorama, "compromisos": compromisos}
    OUTPUT.write_text(
        "// Generated automatically by actualizar_datos.py from base_de_datos.xlsx.\n"
        "// Do not edit by hand: change the Excel file and run the script again.\n"
        "window.DATOS = " + json.dumps(datos, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"Done: {len(contenido)} blocks, {len(textos)} texts, {len(trivia)} questions, {len(simulador)} projects, "
          f"{len(mitos)} statements, {len(memorama)} pairs and {len(compromisos)} pledges -> {OUTPUT.name}")


if __name__ == "__main__":
    main()
