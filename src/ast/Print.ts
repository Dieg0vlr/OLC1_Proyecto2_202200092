import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';

export class Print implements Instruccion {
    public linea: number;
    public columna: number;
    public expresiones: Instruccion[];

    constructor(linea: number, columna: number, expresiones: Instruccion[]) {
        this.linea = linea;
        this.columna = columna;
        this.expresiones = expresiones;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        let salida = "";
        
        for (const exp of this.expresiones) {
            const resultado = exp.interpretar(entorno, arbol);
            
            if (resultado && typeof resultado.valor === 'object' && !Array.isArray(resultado.valor) && resultado.valor !== null) {
                const nombreStruct = resultado.valor.tipo_struct_oculto || "Struct";
                const atributos = Object.keys(resultado.valor)
                    .filter(key => key !== 'tipo_struct_oculto')
                    .map(key => `${key}: ${resultado.valor[key]}`);
                

                salida += `${nombreStruct}(${atributos.join(", ")}) `;
            } 
 
            else if (resultado && Array.isArray(resultado.valor)) {
                salida += `[${resultado.valor.join(" ")}] `;
            } 
            else {
                salida += resultado?.valor + " ";
            }
        }
        
        console.log(salida.trimEnd());
    }
}