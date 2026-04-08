import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';

export class Append implements Instruccion {
    constructor(public linea: number, public columna: number, public slice: Instruccion, public nuevoValor: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const arr = this.slice.interpretar(entorno, arbol);
        const val = this.nuevoValor.interpretar(entorno, arbol);

        if (!Array.isArray(arr.valor)) {
            arbol.agregarError("Semantico", "append() requiere un Slice", this.linea, this.columna);
            return { valor: null, tipo: arr.tipo };
        }
        
        // Retornamos un nuevo arreglo con el valor añadido al final
        const nuevoArreglo = [...arr.valor, val.valor];
        return { valor: nuevoArreglo, tipo: arr.tipo };
    }
}