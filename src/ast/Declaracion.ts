import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class Declaracion implements Instruccion {
    constructor(public linea: number, public columna: number, public id: string, public tipo: TipoDato | null, public valor: Instruccion | null) {}

    interpretar(entorno: Entorno, arbol: any): any {
        let valFinal = null;
        let tipoFinal = this.tipo;

        if (this.valor !== null) {
            //Declaración con valor 
            const valEvaluado = this.valor.interpretar(entorno, arbol);
            valFinal = valEvaluado.valor;
            
            if (this.tipo === null) {
                tipoFinal = valEvaluado.tipo;
            } else if (this.tipo !== valEvaluado.tipo) {
                if (this.tipo === TipoDato.FLOAT && valEvaluado.tipo === TipoDato.INT) {
                    valFinal = parseFloat(valFinal);
                } else {
                    arbol.agregarError("Semantico", "Tipo de dato incorrecto en declaración", this.linea, this.columna);
                    return;
                }
            }
        } else {
            // Declaracion sin valor (var x int;) Asigna valores por defecto
            switch (this.tipo) {
                case TipoDato.INT: valFinal = 0; break;
                case TipoDato.FLOAT: valFinal = 0.0; break;
                case TipoDato.STRING: valFinal = ""; break;
                case TipoDato.BOOL: valFinal = false; break;
                case TipoDato.RUNE: valFinal = 0; break; 
                default: valFinal = null; break;
            }
        }

        entorno.guardar(this.id, { id: this.id, tipo: tipoFinal, valor: valFinal } as any);
    }
}