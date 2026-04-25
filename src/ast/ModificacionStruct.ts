import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class ModificacionStruct implements Instruccion {
    constructor(public linea: number, public columna: number, public id: string, public atributo: string, public nuevoValor: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const simbolo = entorno.obtener(this.id);

        if (!simbolo || simbolo.tipo !== TipoDato.STRUCT) {
            arbol.agregarError("Semantico", "El Struct '" + this.id + "' no existe o no es un Struct", this.linea, this.columna);
            return;
        }

        const atributos = this.atributo.split('.');
        let objetivo: any = simbolo.valor; 

        for (let i = 0; i < atributos.length - 1; i++) {
            const art = atributos[i] as string; 
            
            if (objetivo && typeof objetivo === 'object' && art in objetivo) {
                objetivo = objetivo[art];
            } else {
                arbol.agregarError("Semantico", "El atributo '" + art + "' no existe en el struct", this.linea, this.columna);
                return;
            }
        }

        const ultimoAtributo = atributos[atributos.length - 1] as string; 
        
        if (!objetivo || !(ultimoAtributo in objetivo)) {
             arbol.agregarError("Semantico", "El atributo '" + ultimoAtributo + "' no existe en el struct", this.linea, this.columna);
             return;
        }

        const val = this.nuevoValor.interpretar(entorno, arbol);
        
        objetivo[ultimoAtributo] = val.valor;
    }
}