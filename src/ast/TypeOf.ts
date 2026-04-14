import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class TypeOf implements Instruccion {
    constructor(public linea: number, public columna: number, public expresion: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const resultado = this.expresion.interpretar(entorno, arbol);
        let tipoStr = "desconocido";

        // se verifica si es un Slice (Arreglo en JS)
        if (Array.isArray(resultado.valor)) {
            let tipoBase = "";
            switch (resultado.tipo) {
                case TipoDato.INT: tipoBase = "int"; break;
                case TipoDato.FLOAT: tipoBase = "float64"; break;
                case TipoDato.STRING: tipoBase = "string"; break;
                case TipoDato.BOOL: tipoBase = "bool"; break;
                case TipoDato.RUNE: tipoBase = "rune"; break;
                case TipoDato.STRUCT: tipoBase = "struct"; break;
            }
            tipoStr = "[]" + tipoBase;
        } else {
            // evalua variables normales y Structs
            switch (resultado.tipo) {
                case TipoDato.INT: tipoStr = "int"; break;
                case TipoDato.FLOAT: tipoStr = "float64"; break;
                case TipoDato.STRING: tipoStr = "string"; break;
                case TipoDato.BOOL: tipoStr = "bool"; break;
                case TipoDato.RUNE: tipoStr = "rune"; break;
                case TipoDato.STRUCT: 
                
                    tipoStr = resultado.valor.tipo_struct_oculto ? resultado.valor.tipo_struct_oculto : "struct"; 
                    break;
            }
        }

        return { valor: tipoStr, tipo: TipoDato.STRING };
    }
}