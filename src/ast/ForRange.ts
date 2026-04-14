import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class ForRange implements Instruccion {
    constructor(
        public linea: number, 
        public columna: number, 
        public idIndice: string, 
        public idValor: string, 
        public expresionSlice: Instruccion, 
        public instrucciones: Instruccion[]
    ) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const sliceVal = this.expresionSlice.interpretar(entorno, arbol);

        if (!Array.isArray(sliceVal.valor)) {
            arbol.agregarError("Semantico", "La expresión del 'range' no es un Slice válido", this.linea, this.columna);
            return;
        }

        const arreglo = sliceVal.valor;

        for (let i = 0; i < arreglo.length; i++) {
            const entornoLocal = new Entorno(entorno);

            entornoLocal.guardar(this.idIndice, { id: this.idIndice, tipo: TipoDato.INT, valor: i } as any);
            
            entornoLocal.guardar(this.idValor, { id: this.idValor, tipo: TipoDato.ANY, valor: arreglo[i] } as any);

            for (const instruccion of this.instrucciones) {
                const result = instruccion.interpretar(entornoLocal, arbol);
                
                if (result) {
                    if (result.type === 'BREAK') return; 
                    if (result.type === 'CONTINUE') break;
                    if (result.type === 'RETURN') return { valor: result.valor, tipo: result.tipo }; 
                }
            }
        }
    }
}