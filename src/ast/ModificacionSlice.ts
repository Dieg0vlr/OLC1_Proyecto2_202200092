import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class ModificacionSlice implements Instruccion {
    constructor(public linea: number, public columna: number, public id: string, public indice: Instruccion, public nuevoValor: Instruccion) {}

    interpretar(entorno: Entorno, arbol: any): any {
        const simbolo = entorno.obtener(this.id);
        
        if (!simbolo || !Array.isArray(simbolo.valor)) {
            arbol.agregarError("Semantico", "El Slice '" + this.id + "' no existe", this.linea, this.columna);
            return;
        }

        const idx = this.indice.interpretar(entorno, arbol);
        const nuevoVal = this.nuevoValor.interpretar(entorno, arbol);

        if (idx.valor < 0 || idx.valor >= simbolo.valor.length) {
            arbol.agregarError("Semantico", "Indice de Slice fuera de rango", this.linea, this.columna);
            return;
        }

        // JS modifica el arreglo en memoria, cumpliendo la regla de pasar por referencia
        simbolo.valor[idx.valor] = nuevoVal.valor;
    }
}