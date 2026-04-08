declare var require: any;
const parser = require('./gramatica/gramatica.js');
import { Entorno } from './entorno/Entorno';

// sentencias de GoScript reales
const entrada = `
fmt.Println("--- FUNCIONES DE SLICE ---");

var numeros []int = []int{10, 20, 30, 40};
fmt.Println("Longitud del slice numeros:", len(numeros));
fmt.Println("Buscando el valor 30 (Indice):", slices.Index(numeros, 30));

numeros = append(numeros, 50);
fmt.Println("Slice despues de append:", numeros);

var palabras []string = []string{"hola", "mundo", "goScript"};
fmt.Println("Join de palabras:", strings.Join(palabras, "-"));
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