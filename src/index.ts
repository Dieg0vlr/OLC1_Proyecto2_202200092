declare var require: any;
const parser = require('./gramatica/gramatica.js');
import { Entorno } from './entorno/Entorno';

// sentencias de GoScript reales
const entrada = `
var a int = 10;
var b float64 = 2.5;
fmt.Println(a);
fmt.Println("El resultado de sumar a y b es", a + b);
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