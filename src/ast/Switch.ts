import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { Caso } from './Caso';

export class Switch implements Instruccion {
    public linea: number;
    public columna: number;
    public expresion: Instruccion;
    public casos: Caso[];

    constructor(linea: number, columna: number, expresion: Instruccion, casos: Caso[]) {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
        this.casos = casos;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        const valorSwitch = this.expresion.interpretar(entorno, arbol);
        let casoEjecutado = false;

        //se busca coincidencias en los "case"
        for (const caso of this.casos) {
            if (caso.expresion !== null) { 
                const valorCaso = caso.expresion.interpretar(entorno, arbol);
                
                if (valorSwitch.valor === valorCaso.valor && valorSwitch.tipo === valorCaso.tipo) {
                    const entornoLocal = new Entorno(entorno);
                    for (const instruccion of caso.instrucciones) {
                        const res = instruccion.interpretar(entornoLocal, arbol);
                        if (res?.tipo === 'BREAK' || res?.tipo === 'CONTINUE' || res?.tipo === 'RETURN') return res;
                    }
                    casoEjecutado = true;
                    break; 
                }
            }
        }

        //si no hubo coincidencia se busca si existe un "default"
        if (!casoEjecutado) {
            for (const caso of this.casos) {
                if (caso.expresion === null) { // Este es el default
                    const entornoLocal = new Entorno(entorno);
                    for (const instruccion of caso.instrucciones) {
                        const res = instruccion.interpretar(entornoLocal, arbol);
                        if (res?.tipo === 'BREAK' || res?.tipo === 'CONTINUE' || res?.tipo === 'RETURN') return res;
                    }
                    break;
                }
            }
        }
    }
}