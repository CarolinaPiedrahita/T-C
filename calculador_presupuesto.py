#!/usr/bin/env python3
import json

def calcular_presupuesto(archivo_json):
    """Lee un archivo JSON con proyectos y calcula el presupuesto total y promedio."""

    try:
        with open(archivo_json, 'r') as f:
            datos = json.load(f)

        proyectos = datos.get('proyectos', [])

        if not proyectos:
            print("No hay proyectos en el archivo JSON.")
            return

        costos = [proyecto['costo'] for proyecto in proyectos]
        total = sum(costos)
        promedio = total / len(costos)

        print("=" * 50)
        print("REPORTE DE PRESUPUESTO DE CONSTRUCCIÓN")
        print("=" * 50)
        print("\nProyectos:")
        for proyecto in proyectos:
            print(f"  • {proyecto['nombre']}: ${proyecto['costo']:,.2f}")

        print("\n" + "-" * 50)
        print(f"Presupuesto Total: ${total:,.2f}")
        print(f"Presupuesto Promedio: ${promedio:,.2f}")
        print("-" * 50)

    except FileNotFoundError:
        print(f"Error: El archivo '{archivo_json}' no existe.")
    except json.JSONDecodeError:
        print(f"Error: El archivo '{archivo_json}' no tiene un formato JSON válido.")
    except KeyError:
        print("Error: El archivo JSON no tiene la estructura esperada.")

if __name__ == "__main__":
    calcular_presupuesto('proyectos.json')
