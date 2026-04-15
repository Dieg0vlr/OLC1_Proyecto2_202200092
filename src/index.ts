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
import express from 'express';
import cors from 'cors';
import { Entorno } from './entorno/Entorno';
import { GeneradorAST } from './ast/GeneradorAST';

declare var require: any;
const parser = require('./gramatica/gramatica.js');


// inicia el servidor
const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

// ruta principal que recibira el codigo GoScript
app.post('/ejecutar', (req, res) => {
    // extrae el codigo que nos mandara la pagina web
    const { codigo } = req.body; 

    try {
        const ast = parser.parse(codigo);
        const entornoGlobal = new Entorno(null);
        const errores: any[] = [];
        
        // Simulador para atrapar errores y mandarlos a la web
        const arbolSimulado = {
            agregarError: (tipo: string, desc: string, linea: number, col: number) => {
                errores.push({ tipo, descripcion: desc, linea, columna: col });
            }
        };

        let consolaSalida = "";
        const logOriginal = console.log;
        console.log = (...args) => {
            consolaSalida += args.join(" ") + "\n";
        };

        // PRIMERA PASADA: Guardar structs, funciones y variables globales
        ast.forEach((instruccion: any) => {
            if (instruccion.tipo !== 'MAIN') {
                instruccion.interpretar(entornoGlobal, arbolSimulado);
            }
        });

        // SEGUNDA PASADA: Buscar y ejecutar el MAIN
        ast.forEach((instruccion: any) => {
            if (instruccion.tipo === 'MAIN') {
                for (const inst of instruccion.instrucciones) {
                    inst.interpretar(entornoGlobal, arbolSimulado);
                }
            }
        });

        console.log = logOriginal;

        // genera el codigo DOT de Graphviz
        const generador = new GeneradorAST();
        const codigoGraphviz = generador.generar(ast);

        // se junta todo y se lo responde a la pagina web
        res.json({
            exito: true,
            consola: consolaSalida,
            errores: errores,
            simbolos: Array.from(entornoGlobal.tabla.entries()),
            ast: codigoGraphviz // envia el texto del arbol a la web
        });

    } catch (error: any) {
        // Si Jison explota por un error sintactico aca se vra
        console.error("Error critico en el servidor:", error);
        res.status(500).json({ 
            exito: false, 
            mensaje: "Error de compilacion", 
            detalle: error.message 
        });
    }
});


app.listen(PORT, () => {
    console.log(`API de GoScript lista y escuchando en http://localhost:${PORT}`);
});