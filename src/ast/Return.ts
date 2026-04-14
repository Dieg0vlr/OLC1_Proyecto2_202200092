import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class Return implements Instruccion {
    constructor(public linea: number, public columna: number, public expresion: Instruccion | null) {}

    interpretar(entorno: Entorno, arbol: any): any {
        if (this.expresion) {
            const resultado = this.expresion.interpretar(entorno, arbol);
            return { type: 'RETURN', valor: resultado.valor, tipo: resultado.tipo };
        }
        return { type: 'RETURN', valor: null, tipo: TipoDato.NULO };
    }
}