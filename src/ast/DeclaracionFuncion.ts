import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';
import { Simbolo } from '../entorno/Simbolo';

export class DeclaracionFuncion implements Instruccion {
    constructor(
        public linea: number,
        public columna: number,
        public id: string,
        public parametros: { id: string, tipo: TipoDato | string }[],
        public tipoRetorno: TipoDato | string | null,
        public instrucciones: Instruccion[]
    ) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const funcionSimbolo = new Simbolo(this.id, this, TipoDato.ANY);
        entorno.guardar(this.id, funcionSimbolo);
    }
}