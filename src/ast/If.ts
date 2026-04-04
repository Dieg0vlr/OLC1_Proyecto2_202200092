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
            //crea un entorno local y ejecuta
            const entornoLocal = new Entorno(entorno);
            for (const instruccion of this.instruccionesIf) {
                instruccion.interpretar(entornoLocal, arbol);
            }
        } else if (this.instruccionesElse !== null) {
            // Si hay un "else if" encadenado
            if (this.instruccionesElse instanceof If) {
                this.instruccionesElse.interpretar(entorno, arbol);
            } else {
                // Si es un "else" normal
                const entornoLocal = new Entorno(entorno);
                for (const instruccion of this.instruccionesElse as Instruccion[]) {
                    instruccion.interpretar(entornoLocal, arbol);
                }
            }
        }
    }
}