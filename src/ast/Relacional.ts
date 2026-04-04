import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export enum OperadorRelacional {
    IGUAL, DISTINTO, MAYOR, MENOR, MAYOR_IGUAL, MENOR_IGUAL
}

export class Relacional implements Instruccion {
    public linea: number;
    public columna: number;
    public operador: OperadorRelacional;
    public expresionIzquierda: Instruccion;
    public expresionDerecha: Instruccion;

    constructor(linea: number, columna: number, operador: OperadorRelacional, expIzq: Instruccion, expDer: Instruccion) {
        this.linea = linea;
        this.columna = columna;
        this.operador = operador;
        this.expresionIzquierda = expIzq;
        this.expresionDerecha = expDer;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        const izq = this.expresionIzquierda.interpretar(entorno, arbol);
        const der = this.expresionDerecha.interpretar(entorno, arbol);

        const valIzq = izq.valor;
        const valDer = der.valor;

        let resultado = false;

        switch (this.operador) {
            case OperadorRelacional.IGUAL: resultado = (valIzq === valDer); break;
            case OperadorRelacional.DISTINTO: resultado = (valIzq !== valDer); break;
            case OperadorRelacional.MAYOR: resultado = (valIzq > valDer); break;
            case OperadorRelacional.MENOR: resultado = (valIzq < valDer); break;
            case OperadorRelacional.MAYOR_IGUAL: resultado = (valIzq >= valDer); break;
            case OperadorRelacional.MENOR_IGUAL: resultado = (valIzq <= valDer); break;
        }

        return { valor: resultado, tipo: TipoDato.BOOL };
    }
}