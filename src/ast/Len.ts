import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class Len implements Instruccion {
    constructor(public linea: number, public columna: number, public expresion: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const valor = this.expresion.interpretar(entorno, arbol);
        
        if (Array.isArray(valor.valor) || typeof valor.valor === 'string') {
            return { valor: valor.valor.length, tipo: TipoDato.INT };
        }
        
        arbol.agregarError("Semantico", "len() solo acepta Slices o Strings", this.linea, this.columna);
        return { valor: 0, tipo: TipoDato.INT };
    }
}