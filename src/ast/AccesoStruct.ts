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

        const atributos = this.atributo.split('.');
        let valorFinal = simbolo.valor;

        for (const art of atributos) {
            if (valorFinal && typeof valorFinal === 'object' && art in valorFinal) {
                valorFinal = valorFinal[art];
            } else {
                arbol.agregarError("Semantico", "El atributo '" + art + "' no existe en el struct", this.linea, this.columna);
                return { valor: null, tipo: TipoDato.NULO };
            }
        }

        return { valor: valorFinal, tipo: TipoDato.ANY }; 
    }
}