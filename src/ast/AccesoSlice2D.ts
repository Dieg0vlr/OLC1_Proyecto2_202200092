import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class AccesoSlice2D implements Instruccion {
    constructor(public linea: number, public columna: number, public id: string, public idx1: Instruccion, public idx2: Instruccion) {}
    interpretar(entorno: Entorno, arbol: any): any {
        const simbolo = entorno.obtener(this.id);
        if (!simbolo) return { valor: null, tipo: TipoDato.NULO };
        const i1 = this.idx1.interpretar(entorno, arbol).valor;
        const i2 = this.idx2.interpretar(entorno, arbol).valor;
        return { valor: simbolo.valor[i1][i2], tipo: TipoDato.ANY };
    }
}