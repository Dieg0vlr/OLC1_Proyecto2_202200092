import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';

export class AsignacionCompuesta implements Instruccion {
    constructor(public linea: number, public columna: number, public id: string, public expresion: Instruccion, public operador: string) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const simbolo = entorno.obtener(this.id);
        if (!simbolo) return;
        const val = this.expresion.interpretar(entorno, arbol);
        if (this.operador === '+=') simbolo.valor += val.valor;
        if (this.operador === '-=') simbolo.valor -= val.valor;
    }
}