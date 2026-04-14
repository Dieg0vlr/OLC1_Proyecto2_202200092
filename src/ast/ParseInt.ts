import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class ParseInt implements Instruccion {
    constructor(public linea: number, public columna: number, public expresion: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const valor = this.expresion.interpretar(entorno, arbol);

        if (valor.tipo !== TipoDato.STRING) {
            arbol.agregarError("Semantico", "strconv.Atoi requiere un string", this.linea, this.columna);
            return { valor: 0, tipo: TipoDato.INT };
        }

        if (valor.valor.includes(".")) {
            arbol.agregarError("Semantico", "strconv.Atoi no acepta decimales", this.linea, this.columna);
            return { valor: 0, tipo: TipoDato.INT };
        }

        const num = parseInt(valor.valor);
        if (isNaN(num)) {
            arbol.agregarError("Semantico", "No se pudo convertir a int", this.linea, this.columna);
            return { valor: 0, tipo: TipoDato.INT };
        }

        return { valor: num, tipo: TipoDato.INT };
    }
}