import { DeclaracionStruct } from './ast/DeclaracionStruct';
import { InstanciaStruct } from './ast/InstanciaStruct';
import { AccesoStruct } from './ast/AccesoStruct';
import { ModificacionStruct } from './ast/ModificacionStruct';
import { ParseInt } from './ast/ParseInt';
import { ParseFloat } from './ast/ParseFloat';
import { TypeOf } from './ast/TypeOf';
import { DeclaracionFuncion } from './ast/DeclaracionFuncion';
import { LlamadaFuncion } from './ast/LlamadaFuncion';
import { Return } from './ast/Return';

declare var require: any;
const parser = require('./gramatica/gramatica.js');
import { Entorno } from './entorno/Entorno';

// sentencias de GoScript reales
const entrada = `
struct Persona {
    string Nombre;
    int Edad;
}

func main() {
    fmt.Println("--- PRUEBA DE JEFES OCULTOS ---");
    
    // 1. Bloques Independientes (Ámbitos anónimos)
    {
        var temporal string = "Esta variable vive en un bloque fantasma";
        fmt.Println(temporal);
    }

    // 2. Funciones Nativas de Slices
    numeros := []int{10, 20, 30, 40, 50};
    palabras := []string{"Hola", "Mundo", "GoScript"};
    
    fmt.Println("Buscando el 30:", slices.Index(numeros, 30)); 
    fmt.Println("Buscando el 100:", slices.Index(numeros, 100)); 
    fmt.Println("Join de strings:", strings.Join(palabras, " <-> ")); 

    // 3. Formato Estricto de Structs
    p := Persona{Nombre: "Alice", Edad: 25};
    fmt.Println("Imprimiendo mi struct:", p); 
}
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

    // PRIMERA PASADA: Guardar todas las declaraciones globales y funciones
    ast.forEach((instruccion: any) => {
        if (instruccion.tipo !== 'MAIN') {
            instruccion.interpretar(entornoGlobal, arbolSimulado);
        }
    });

    // SEGUNDA PASADA: Buscar la funcion MAIN y ejecutarla
    ast.forEach((instruccion: any) => {
        if (instruccion.tipo === 'MAIN') {
            for (const inst of instruccion.instrucciones) {
                inst.interpretar(entornoGlobal, arbolSimulado);
            }
        }
    });

    console.log("\n--- Memoria (Tabla de Simbolos) ---");
    console.log(entornoGlobal.tabla);

} catch (error) {
    console.log(error);
}