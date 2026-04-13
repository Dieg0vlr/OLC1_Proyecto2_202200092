import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class InstanciaStruct implements Instruccion {
    constructor(
        public linea: number,
        public columna: number,
        public tipoStruct: string,
        public valores: { id: string, valor: Instruccion }[]
    ) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const instancia: any = { tipo_struct_oculto: this.tipoStruct }; 

        for (const val of this.valores) {
            const resultado = val.valor.interpretar(entorno, arbol);
            instancia[val.id] = resultado.valor;
        }

        return { valor: instancia, tipo: TipoDato.STRUCT }; 
    }
}