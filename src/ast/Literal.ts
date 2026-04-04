import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class Literal implements Instruccion {
    public linea: number;
    public columna: number;
    public valor: any;
    public tipo: TipoDato;

    constructor(linea: number, columna: number, valor: any, tipo: TipoDato) {
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.tipo = tipo;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        return { valor: this.valor, tipo: this.tipo };
    }
}