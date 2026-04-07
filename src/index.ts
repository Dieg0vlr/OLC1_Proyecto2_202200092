declare var require: any;
const parser = require('./gramatica/gramatica.js');
import { Entorno } from './entorno/Entorno';

// sentencias de GoScript reales
const entrada = `
fmt.Println("--- INICIANDO CICLO FOR ---");

for var i int = 1; i <= 10; i++ {
    if i == 3 {
        fmt.Println("Saltando el numero 3...");
        continue;
    }

    if i == 8 {
        fmt.Println("Me detengo en el 8!");
        break;
    }

    fmt.Println("El valor de i es:", i);
}

fmt.Println("--- CICLO TERMINADO ---");
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