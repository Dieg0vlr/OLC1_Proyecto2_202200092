import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { Simbolo } from '../entorno/Simbolo';
import { TipoDato } from '../entorno/Tipo';

export class Asignacion implements Instruccion {
    public linea: number;
    public columna: number;
    public id: string;
    public expresion: Instruccion;

    constructor(linea: number, columna: number, id: string, expresion: Instruccion) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion = expresion;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        const simboloActual = entorno.obtener(this.id);
        
        if (!simboloActual) {
            arbol.agregarError("Semantico", "La variable '" + this.id + "' no existe y no se puede reasignar", this.linea, this.columna);
            return;
        }

        const nuevoValor = this.expresion.interpretar(entorno, arbol);

        if (simboloActual.tipo !== nuevoValor.tipo) {
            if (simboloActual.tipo === TipoDato.FLOAT && nuevoValor.tipo === TipoDato.INT) {
                nuevoValor.tipo = TipoDato.FLOAT;
            } else {
                arbol.agregarError("Semantico", "Tipo de dato incorrecto al reasignar la variable '" + this.id + "'", this.linea, this.columna);
                return;
            }
        }
        const nuevoSimbolo = new Simbolo(this.id, nuevoValor.valor, simboloActual.tipo);
        entorno.actualizar(this.id, nuevoSimbolo);
    }
}