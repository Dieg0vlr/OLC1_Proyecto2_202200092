import { Instruccion } from './Instruccion';

export class Break implements Instruccion {
    public linea: number;
    public columna: number;
    
    constructor(linea: number, columna: number) {
        this.linea = linea;
        this.columna = columna;
    }

    interpretar(entorno: any, arbol: any): any {
        return { tipo: 'BREAK' }; 
    }
}