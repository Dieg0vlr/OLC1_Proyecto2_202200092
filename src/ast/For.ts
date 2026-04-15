import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class For implements Instruccion {
    public linea: number;
    public columna: number;
    public condicion: Instruccion;
    public instrucciones: Instruccion[];
    public inicializacion: Instruccion | null;
    public incremento: Instruccion | null;

    constructor(linea: number, columna: number, condicion: Instruccion, instrucciones: Instruccion[], inicializacion: Instruccion | null = null, incremento: Instruccion | null = null) {
        this.linea = linea;
        this.columna = columna;
        this.condicion = condicion;
        this.instrucciones = instrucciones;
        this.inicializacion = inicializacion;
        this.incremento = incremento;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        const entornoFor = new Entorno(entorno);

        if (this.inicializacion) {
            this.inicializacion.interpretar(entornoFor, arbol);
        }

        let cond = this.condicion.interpretar(entornoFor, arbol);
        if (cond?.tipo !== TipoDato.BOOL) {
            arbol.agregarError("Semantico", "La condicion del for debe ser BOOL", this.linea, this.columna);
            return;
        }

        while (cond.valor === true) {
            const entornoIteracion = new Entorno(entornoFor);
            let salir = false;

            for (const instruccion of this.instrucciones) {
                const resultado = instruccion.interpretar(entornoIteracion, arbol);
                
                if (resultado?.tipo === 'BREAK') {
                    salir = true;
                    break;
                }
                if (resultado?.tipo === 'CONTINUE') {
                    break;
                }
            }

            if (salir) break;

            if (this.incremento) {
                this.incremento.interpretar(entornoFor, arbol);
            }

            cond = this.condicion.interpretar(entornoFor, arbol);
        }
    }
}