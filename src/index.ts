declare var require: any;
const parser = require('./gramatica/gramatica.js');
import { Entorno } from './entorno/Entorno';

// sentencias de GoScript reales
const entrada = `
fmt.Println("--- PRUEBA DE STRUCTS ---");

struct Persona {
    string Nombre;
    int Edad;
    bool EsEstudiante;
}

Persona miInstancia = { Nombre: "Alice", Edad: 25, EsEstudiante: false };
fmt.Println("Objeto original:", miInstancia);

fmt.Println("Accediendo al nombre:", miInstancia.Nombre);

miInstancia.Edad = 30;
fmt.Println("Accediendo a la edad modificada:", miInstancia.Edad);
`;

try {
    const ast = parser.parse(entrada);
    const entornoGlobal = new Entorno(null);
    const arbolSimulado = {
        agregarError: (tipo: string, desc: string, linea: number, col: number) => {
            console.error(`[ERROR ${tipo}] ${desc} en L:${linea} C:${col}`);
        }
    };

    console.log("--- Ejecutando AST ---");

    ast.forEach((instruccion: any) => {
        if (instruccion.tipo !== 'MAIN') {
            instruccion.interpretar(entornoGlobal, arbolSimulado);
        }
    });

    console.log("\n--- Memoria (Tabla de Simbolos) ---");
    console.log(entornoGlobal.tabla);

} catch (error) {
    console.log(error);
}