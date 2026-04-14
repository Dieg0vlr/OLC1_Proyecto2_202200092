import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export class LlamadaFuncion implements Instruccion {
    constructor(public linea: number, public columna: number, public id: string, public argumentos: Instruccion[]) {}

    interpretar(entorno: Entorno, arbol: any): any {
        let envGlobal = entorno;
        while(envGlobal.anterior != null) {
            envGlobal = envGlobal.anterior;
        }
        
        const funcSimbolo = envGlobal.obtener(this.id);
        if (!funcSimbolo) {
            arbol.agregarError("Semantico", `La función '${this.id}' no existe.`, this.linea, this.columna);
            return { valor: null, tipo: TipoDato.NULO };
        }

        const declFunc = funcSimbolo.valor; 

        //Validar cantidad de argumentos
        if (declFunc.parametros.length !== this.argumentos.length) {
            arbol.agregarError("Semantico", `La función '${this.id}' espera ${declFunc.parametros.length} argumentos.`, this.linea, this.columna);
            return { valor: null, tipo: TipoDato.NULO };
        }

        // Evaluar los argumentos en el entorno actual antes de entrar a la funcin
        const valoresEvaluados = [];
        for (let i = 0; i < this.argumentos.length; i++) {
            valoresEvaluados.push(this.argumentos[i]!.interpretar(entorno, arbol));
        }

        const entornoLocal = new Entorno(envGlobal);
        
        for (let i = 0; i < declFunc.parametros.length; i++) {
            const param = declFunc.parametros[i];
            const val = valoresEvaluados[i];
            entornoLocal.guardar(param.id, { id: param.id, valor: val.valor, tipo: val.tipo } as any);
        }

        for (const instruccion of declFunc.instrucciones) {
            const result = instruccion.interpretar(entornoLocal, arbol);
            
            if (result && result.type === 'RETURN') {
                return { valor: result.valor, tipo: result.tipo };
            }
        }

        return { valor: null, tipo: TipoDato.NULO };
    }
}