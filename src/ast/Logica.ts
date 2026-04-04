import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export enum OperadorLogico {
    AND, OR, NOT
}

export class Logica implements Instruccion {
    public linea: number;
    public columna: number;
    public operador: OperadorLogico;
    public expresionIzquierda: Instruccion;
    public expresionDerecha: Instruccion | null;

    constructor(linea: number, columna: number, operador: OperadorLogico, expIzq: Instruccion, expDer: Instruccion | null = null) {
        this.linea = linea;
        this.columna = columna;
        this.operador = operador;
        this.expresionIzquierda = expIzq;
        this.expresionDerecha = expDer;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        const izq = this.expresionIzquierda.interpretar(entorno, arbol);
        
        if (this.operador === OperadorLogico.NOT) {
            return { valor: !izq.valor, tipo: TipoDato.BOOL };
        }

        const der = this.expresionDerecha?.interpretar(entorno, arbol);

        let resultado = false;
        if (this.operador === OperadorLogico.AND) {
            resultado = (izq.valor && der.valor);
        } else if (this.operador === OperadorLogico.OR) {
            resultado = (izq.valor || der.valor);
        }

        return { valor: resultado, tipo: TipoDato.BOOL };
    }
}