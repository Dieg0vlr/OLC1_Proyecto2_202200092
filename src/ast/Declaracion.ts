import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { Simbolo } from '../entorno/Simbolo';
import { TipoDato } from '../entorno/Tipo';

export class Declaracion implements Instruccion {
    public linea: number;
    public columna: number;
    public id: string;
    public tipoDato: TipoDato;
    public expresion: Instruccion;

    constructor(linea: number, columna: number, id: string, tipoDato: TipoDato, expresion: Instruccion) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.tipoDato = tipoDato;
        this.expresion = expresion;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        // resuelve el valor matematico o literal
        const valorInterpretado = this.expresion.interpretar(entorno, arbol);

        if (valorInterpretado.tipo === TipoDato.NULO) {
            arbol.agregarError("Semantico", "No se puede asignar un error a " + this.id, this.linea, this.columna);
            return;
        }

        // valido tipos (GoScript permite asignar int a float64)
        if (this.tipoDato !== valorInterpretado.tipo) {
            if (this.tipoDato === TipoDato.FLOAT && valorInterpretado.tipo === TipoDato.INT) {
                valorInterpretado.tipo = TipoDato.FLOAT;
            } else {
                arbol.agregarError("Semantico", "El tipo asignado no coincide con la variable " + this.id, this.linea, this.columna);
                return;
            }
        }

        // guardo en la memoria
        const nuevoSimbolo = new Simbolo(this.id, valorInterpretado.valor, this.tipoDato);
        const guardado = entorno.guardar(this.id, nuevoSimbolo);

        if (!guardado) {
            arbol.agregarError("Semantico", "La variable " + this.id + " ya existe", this.linea, this.columna);
        }
    }
}