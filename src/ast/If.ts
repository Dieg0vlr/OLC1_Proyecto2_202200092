import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class If implements Instruccion {
    public linea: number;
    public columna: number;
    public condicion: Instruccion;
    public instruccionesIf: Instruccion[];
    public instruccionesElse: Instruccion[] | Instruccion | null;

    constructor(linea: number, columna: number, condicion: Instruccion, instruccionesIf: Instruccion[], instruccionesElse: Instruccion[] | Instruccion | null = null) {
        this.linea = linea;
        this.columna = columna;
        this.condicion = condicion;
        this.instruccionesIf = instruccionesIf;
        this.instruccionesElse = instruccionesElse;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        const cond = this.condicion.interpretar(entorno, arbol);

        if (cond.tipo !== TipoDato.BOOL) {
            arbol.agregarError("Semantico", "La condicion del IF debe ser de tipo BOOL", this.linea, this.columna);
            return;
        }

        if (cond.valor === true) {
            const entornoLocal = new Entorno(entorno);
            for (const instruccion of this.instruccionesIf) {
                const res = instruccion.interpretar(entornoLocal, arbol);
                if (res?.tipo === 'BREAK' || res?.tipo === 'CONTINUE' || res?.tipo === 'RETURN') return res;
            }
        } else if (this.instruccionesElse !== null) {
            if (this.instruccionesElse instanceof If) {
                return this.instruccionesElse.interpretar(entorno, arbol);
            } else {
                const entornoLocal = new Entorno(entorno);
                for (const instruccion of this.instruccionesElse as Instruccion[]) {
                    const res = instruccion.interpretar(entornoLocal, arbol);
                    if (res?.tipo === 'BREAK' || res?.tipo === 'CONTINUE' || res?.tipo === 'RETURN') return res;
                }
            }
        }
    }


}