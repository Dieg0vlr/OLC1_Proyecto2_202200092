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
    const { codigo } = req.body; 

    (global as any).erroresScanner = [];

    try {
        const ast = parser.parse(codigo);
        const entornoGlobal = new Entorno(null);
        
        // Rescata todos los errores lexicos 
        const errores: any[] = (global as any).erroresScanner || [];
        
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

        ast.forEach((instruccion: any) => {
            if (instruccion.tipo !== 'MAIN') instruccion.interpretar(entornoGlobal, arbolSimulado);
        });

        ast.forEach((instruccion: any) => {
            if (instruccion.tipo === 'MAIN') {
                for (const inst of instruccion.instrucciones) {
                    inst.interpretar(entornoGlobal, arbolSimulado);
                }
            }
        });

        console.log = logOriginal;

        const generador = new GeneradorAST();
        const codigoGraphviz = generador.generar(ast);

        res.json({
            exito: true,
            consola: consolaSalida,
            errores: errores, // manda todos los errores recolectados
            simbolos: Array.from(entornoGlobal.tabla.entries()),
            ast: codigoGraphviz 
        });

    } catch (err: any) {

        console.log("ERROR PRUEBA\n", err.message);
        //Si hubo un error SINTACTICO 
        const errores = (global as any).erroresScanner || [];

        errores.push({
            tipo: "Sintactico",
            descripcion: err.message.split('\n')[0] || "Error de sintaxis", 
            linea: err.hash?.loc?.first_line || 1,    
            columna: err.hash?.loc?.first_column || 1 
        });

        res.json({
            exito: false,
            detalle: "Ocurrieron errores durante el analisis",
            errores: errores, 
            simbolos: []
        });
    }
});


app.listen(PORT, () => {
    console.log(`INICIANDO API en http://localhost:${PORT}`);
});