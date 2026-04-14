import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';

export class ModificacionSlice2D implements Instruccion {
    constructor(public linea: number, public columna: number, public id: string, public idx1: Instruccion, public idx2: Instruccion, public nuevoValor: Instruccion) {}
    interpretar(entorno: Entorno, arbol: any): any {
        const simbolo = entorno.obtener(this.id);
        if (!simbolo) return;
        const i1 = this.idx1.interpretar(entorno, arbol).valor;
        const i2 = this.idx2.interpretar(entorno, arbol).valor;
        simbolo.valor[i1][i2] = this.nuevoValor.interpretar(entorno, arbol).valor;
    }
}