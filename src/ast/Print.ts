import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';

export class Print implements Instruccion {
    public linea: number;
    public columna: number;
    public expresiones: Instruccion[];

    constructor(linea: number, columna: number, expresiones: Instruccion[]) {
        this.linea = linea;
        this.columna = columna;
        this.expresiones = expresiones;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        let salida = "";

        for (let i = 0; i < this.expresiones.length; i++) {
            const resultado = this.expresiones[i].interpretar(entorno, arbol);
            salida += String(resultado.valor) + (i === this.expresiones.length - 1 ? "" : " ");
        }

        console.log(salida);
        return null;
    }
}