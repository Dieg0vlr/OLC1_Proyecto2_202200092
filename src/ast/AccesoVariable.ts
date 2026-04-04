import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class AccesoVariable implements Instruccion {
    public linea: number;
    public columna: number;
    public id: string;

    constructor(linea: number, columna: number, id: string) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        const simbolo = entorno.obtener(this.id);
        
        if (simbolo === null) {
            arbol.agregarError("Semantico", "La variable '" + this.id + "' no ha sido declarada", this.linea, this.columna);
            return { valor: null, tipo: TipoDato.NULO };
        }

        return { valor: simbolo.valor, tipo: simbolo.tipo };
    }
}