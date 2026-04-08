import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class StringsJoin implements Instruccion {
    constructor(public linea: number, public columna: number, public slice: Instruccion, public separador: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const arr = this.slice.interpretar(entorno, arbol);
        const sep = this.separador.interpretar(entorno, arbol);

        if (!Array.isArray(arr.valor)) {
            arbol.agregarError("Semantico", "strings.Join() requiere un Slice", this.linea, this.columna);
            return { valor: "", tipo: TipoDato.STRING };
        }

        if (arr.tipo !== TipoDato.STRING) {
            arbol.agregarError("Semantico", "strings.Join() solo acepta Slices de tipo string", this.linea, this.columna);
            return { valor: "", tipo: TipoDato.STRING };
        }

        const resultado = arr.valor.join(sep.valor);
        return { valor: resultado, tipo: TipoDato.STRING };
    }
}