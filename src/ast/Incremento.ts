import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';

export class Incremento implements Instruccion {
    public linea: number;
    public columna: number;
    public id: string;
    public operador: string;

    constructor(linea: number, columna: number, id: string, operador: string) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.operador = operador;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        const simbolo = entorno.obtener(this.id);
        if (!simbolo) {
            arbol.agregarError("Semantico", "La variable '" + this.id + "' no existe", this.linea, this.columna);
            return;
        }

        if (this.operador === '++') {
            simbolo.valor = Number(simbolo.valor) + 1;
        } else if (this.operador === '--') {
            simbolo.valor = Number(simbolo.valor) - 1;
        }

        entorno.actualizar(this.id, simbolo);
    }
}