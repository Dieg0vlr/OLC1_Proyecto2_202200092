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

        this.expresiones.forEach((exp, index) => {
            const resultado = exp.interpretar(entorno, arbol);
            // Concatenamos los resultados con un espacio de por medio
            salida += String(resultado.valor) + (index === this.expresiones.length - 1 ? "" : " ");
        });

        console.log(salida);
        return null;
    }
}