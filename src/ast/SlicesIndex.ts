import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class SlicesIndex implements Instruccion {
    constructor(public linea: number, public columna: number, public slice: Instruccion, public valorBuscado: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const arr = this.slice.interpretar(entorno, arbol);
        const val = this.valorBuscado.interpretar(entorno, arbol);

        if (!Array.isArray(arr.valor)) {
            arbol.agregarError("Semantico", "slices.Index() requiere un Slice", this.linea, this.columna);
            return { valor: -1, tipo: TipoDato.INT };
        }

        const index = arr.valor.indexOf(val.valor);
        return { valor: index, tipo: TipoDato.INT };
    }
}