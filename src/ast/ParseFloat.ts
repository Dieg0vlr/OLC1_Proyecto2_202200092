import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class ParseFloat implements Instruccion {
    constructor(public linea: number, public columna: number, public expresion: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const valor = this.expresion.interpretar(entorno, arbol);

        if (valor.tipo !== TipoDato.STRING) {
            arbol.agregarError("Semantico", "strconv.ParseFloat requiere un string", this.linea, this.columna);
            return { valor: 0.0, tipo: TipoDato.FLOAT };
        }

        const num = parseFloat(valor.valor);
        if (isNaN(num)) {
            arbol.agregarError("Semantico", "No se pudo convertir a float64", this.linea, this.columna);
            return { valor: 0.0, tipo: TipoDato.FLOAT };
        }

        return { valor: num, tipo: TipoDato.FLOAT };
    }
}