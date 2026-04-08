import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class Slice implements Instruccion {
    public linea: number;
    public columna: number;
    public tipoArreglo: TipoDato;
    public listaValores: Instruccion[];

    constructor(linea: number, columna: number, tipoArreglo: TipoDato, listaValores: Instruccion[]) {
        this.linea = linea;
        this.columna = columna;
        this.tipoArreglo = tipoArreglo;
        this.listaValores = listaValores;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        let arreglo: any[] = [];
        
        for (let exp of this.listaValores) {
            let resultado = exp.interpretar(entorno, arbol);
            
            if (resultado.tipo !== this.tipoArreglo) {
                if (this.tipoArreglo === TipoDato.FLOAT && resultado.tipo === TipoDato.INT) {
                    resultado.tipo = TipoDato.FLOAT;
                } else {
                    arbol.agregarError("Semantico", "Dato incorrecto para el Slice", this.linea, this.columna);
                    return { valor: null, tipo: TipoDato.NULO };
                }
            }
            arreglo.push(resultado.valor);
        }
        
        return { valor: arreglo, tipo: this.tipoArreglo };
    }
}