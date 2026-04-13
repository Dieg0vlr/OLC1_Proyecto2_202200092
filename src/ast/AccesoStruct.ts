import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class AccesoStruct implements Instruccion {
    constructor(public linea: number, public columna: number, public id: string, public atributo: string) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const simbolo = entorno.obtener(this.id);

        if (!simbolo || simbolo.tipo !== TipoDato.STRUCT) {
            arbol.agregarError("Semantico", "El Struct '" + this.id + "' no existe o no es un Struct", this.linea, this.columna);
            return { valor: null, tipo: TipoDato.NULO };
        }

        const instancia = simbolo.valor;
        
        if (!(this.atributo in instancia)) {
             arbol.agregarError("Semantico", "El atributo '" + this.atributo + "' no existe en el struct", this.linea, this.columna);
             return { valor: null, tipo: TipoDato.NULO };
        }

        return { valor: instancia[this.atributo], tipo: TipoDato.ANY }; 
    }
}