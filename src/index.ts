declare var require: any;
const parser = require('./gramatica/gramatica.js');
import { Entorno } from './entorno/Entorno';

// sentencias de GoScript reales
const entrada = `
fmt.Println("--- PRUEBAS LOGICAS Y RELACIONALES ---");
fmt.Println("5 > 3 es:", 5 > 3);
fmt.Println("10 == 10 es:", 10 == 10);
fmt.Println("10 != 10 es:", 10 != 10);
fmt.Println("true && false es:", true && false);
fmt.Println("!false es:", !false);
fmt.Println("Combinado:", (5 >= 5) || (10 < 2));
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