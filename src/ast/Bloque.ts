import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';

export class Bloque implements Instruccion {
    constructor(public linea: number, public columna: number, public instrucciones: Instruccion[]) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const entornoLocal = new Entorno(entorno);
        
        for (const inst of this.instrucciones) {
            const resultado = inst.interpretar(entornoLocal, arbol);
            if (resultado !== null && resultado !== undefined) return resultado; 
        }
    }
}