import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class Asignacion implements Instruccion {
    constructor(public linea: number, public columna: number, public id: string, public expresion: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const simbolo = entorno.obtener(this.id);
        if (!simbolo) {
            arbol.agregarError("Semantico", `Variable '${this.id}' no encontrada.`, this.linea, this.columna);
            return;
        }

        const valEvaluado = this.expresion.interpretar(entorno, arbol);

        if (simbolo.tipo !== valEvaluado.tipo) {    
            const esSliceOStruct = (typeof simbolo.tipo === 'string') || (simbolo.tipo === TipoDato.STRUCT);
            
            if (valEvaluado.tipo === TipoDato.NULO && esSliceOStruct) {
                // Todo en orden, dejamos pasar el nil
            } 
            else if (simbolo.tipo === TipoDato.FLOAT && valEvaluado.tipo === TipoDato.INT) {
                valEvaluado.valor = parseFloat(valEvaluado.valor); 
            } else {
                arbol.agregarError("Semantico", `Tipo de dato incorrecto al reasignar la variable '${this.id}'`, this.linea, this.columna);
                return;
            }
        }

        simbolo.valor = valEvaluado.valor;
    }
}