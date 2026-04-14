import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class SlicesIndex implements Instruccion {
    constructor(public linea: number, public columna: number, public expresionSlice: Instruccion, public expresionValor: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const sliceVal = this.expresionSlice.interpretar(entorno, arbol);
        const valorBuscado = this.expresionValor.interpretar(entorno, arbol);

        if (!Array.isArray(sliceVal.valor)) {
            arbol.agregarError("Semantico", "slices.Index requiere un arreglo", this.linea, this.columna);
            return { tipo: TipoDato.INT, valor: -1 };
        }

        const indice = sliceVal.valor.findIndex((v: any) => v === valorBuscado.valor);
        return { tipo: TipoDato.INT, valor: indice };
    }
}