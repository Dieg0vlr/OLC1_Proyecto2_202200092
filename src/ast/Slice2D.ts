import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class Slice2D implements Instruccion {
    constructor(public linea: number, public columna: number, public tipoBase: TipoDato, public filas: Instruccion[][]) {}
    interpretar(entorno: Entorno, arbol: any): any {
        const matriz = [];
        for (const filaInst of this.filas) {
            const filaValues = [];
            for (const exp of filaInst) filaValues.push(exp.interpretar(entorno, arbol).valor);
            matriz.push(filaValues);
        }
        return { valor: matriz, tipo: TipoDato.ANY };
    }
}