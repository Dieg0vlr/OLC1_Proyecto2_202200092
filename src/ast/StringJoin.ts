import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class StringsJoin implements Instruccion {
    constructor(public linea: number, public columna: number, public expresionSlice: Instruccion, public expresionSeparador: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const sliceVal = this.expresionSlice.interpretar(entorno, arbol);
        const separador = this.expresionSeparador.interpretar(entorno, arbol);

        if (!Array.isArray(sliceVal.valor) || separador?.tipo !== TipoDato.STRING) {
            arbol.agregarError("Semantico", "strings.Join requiere un arreglo y un separador string", this.linea, this.columna);
            return { tipo: TipoDato.STRING, valor: "" };
        }

        const resultado = sliceVal.valor.join(separador.valor);
        return { tipo: TipoDato.STRING, valor: resultado };
    }
}