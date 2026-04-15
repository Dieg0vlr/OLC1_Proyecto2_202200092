import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';
import { Simbolo } from '../entorno/Simbolo'; // <-- Agregamos esta importacion

export class DeclaracionStruct implements Instruccion {
    constructor(
        public linea: number, 
        public columna: number, 
        public id: string, 
        public atributos: { id: string, tipo: TipoDato | string }[]
    ) {}

    interpretar(entorno: Entorno, arbol: any): any {
        // guarda la plantilla en el entorno con un nombre especifico
        const simboloStruct = new Simbolo(this.id + "_plantilla", this.atributos, TipoDato.STRUCT);
        entorno.guardar(this.id + "_plantilla", simboloStruct);
    }
}