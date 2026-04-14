import { Instruccion } from './Instruccion';
import { Entorno } from '../entorno/Entorno';
import { TipoDato } from '../entorno/Tipo';

export enum OperadorAritmetico {
    SUMA,
    RESTA,
    MULTIPLICACION,
    DIVISION,
    MODULO,
    NEGACION_UNARIA
}

export class Aritmetica implements Instruccion {
    public linea: number;
    public columna: number;
    public operador: OperadorAritmetico;
    public expresionIzquierda: Instruccion;
    public expresionDerecha: Instruccion | null;

    constructor(linea: number, columna: number, operador: OperadorAritmetico, expIzq: Instruccion, expDer: Instruccion | null = null) {
        this.linea = linea;
        this.columna = columna;
        this.operador = operador;
        this.expresionIzquierda = expIzq;
        this.expresionDerecha = expDer;
    }

    interpretar(entorno: Entorno, arbol: any): any {
        const valorIzq = this.expresionIzquierda.interpretar(entorno, arbol);
        let valorDer = null;
        
        if (this.expresionDerecha) {
            valorDer = this.expresionDerecha.interpretar(entorno, arbol);
        }

        let operarComoBool = false;
        if (valorIzq?.tipo === TipoDato.BOOL && valorDer?.tipo === TipoDato.BOOL) {
            operarComoBool = true;
        }

        if (valorIzq && valorIzq.tipo === TipoDato.RUNE) valorIzq.tipo = TipoDato.INT;
        if (valorDer && valorDer.tipo === TipoDato.RUNE) valorDer.tipo = TipoDato.INT;

        if (valorIzq && valorIzq.tipo === TipoDato.BOOL) {
            valorIzq.valor = valorIzq.valor ? 1 : 0;
            valorIzq.tipo = TipoDato.INT;
        }
        if (valorDer && valorDer.tipo === TipoDato.BOOL) {
            valorDer.valor = valorDer.valor ? 1 : 0;
            valorDer.tipo = TipoDato.INT;
        }

        const tipoIzq = valorIzq?.tipo;
        const tipoDer = valorDer?.tipo;
        const valIzq = valorIzq?.valor;
        const valDer = valorDer?.valor;

        let resultado = null;

        switch (this.operador) {
            case OperadorAritmetico.SUMA:
                resultado = this.operarSuma(valIzq, valDer, tipoIzq, tipoDer, arbol); break;
            case OperadorAritmetico.RESTA:
                resultado = this.operarResta(valIzq, valDer, tipoIzq, tipoDer, arbol); break;
            case OperadorAritmetico.MULTIPLICACION:
                resultado = this.operarMultiplicacion(valIzq, valDer, tipoIzq, tipoDer, arbol); break;
            case OperadorAritmetico.DIVISION:
                resultado = this.operarDivision(valIzq, valDer, tipoIzq, tipoDer, arbol); break;
            case OperadorAritmetico.MODULO:
                resultado = this.operarModulo(valIzq, valDer, tipoIzq, tipoDer, arbol); break;
            case OperadorAritmetico.NEGACION_UNARIA:
                resultado = this.operarNegacion(valIzq, tipoIzq, arbol); break;
            default:
                arbol.agregarError("Semantico", "Operador aritmetico desconocido", this.linea, this.columna);
                return { valor: null, tipo: TipoDato.NULO };
        }

        if (operarComoBool && resultado && resultado.tipo === TipoDato.INT) {
            resultado.tipo = TipoDato.BOOL;
            resultado.valor = resultado.valor !== 0; // Convierte 1 a true y 0 a false
        }

        return resultado;
    }

    private operarSuma(valIzq: any, valDer: any, tipoIzq: TipoDato, tipoDer: TipoDato, arbol: any): any {
        if (tipoIzq === TipoDato.INT && tipoDer === TipoDato.INT) return { valor: valIzq + valDer, tipo: TipoDato.INT };
        if (tipoIzq === TipoDato.FLOAT || tipoDer === TipoDato.FLOAT) return { valor: valIzq + valDer, tipo: TipoDato.FLOAT };
        if (tipoIzq === TipoDato.STRING || tipoDer === TipoDato.STRING) return { valor: String(valIzq) + String(valDer), tipo: TipoDato.STRING };
        arbol.agregarError("Semantico", "Suma no valida", this.linea, this.columna);
        return { valor: null, tipo: TipoDato.NULO };
    }

    private operarResta(valIzq: any, valDer: any, tipoIzq: TipoDato, tipoDer: TipoDato, arbol: any): any {
        if (tipoIzq === TipoDato.INT && tipoDer === TipoDato.INT) return { valor: valIzq - valDer, tipo: TipoDato.INT };
        if (tipoIzq === TipoDato.FLOAT || tipoDer === TipoDato.FLOAT) return { valor: valIzq - valDer, tipo: TipoDato.FLOAT };
        arbol.agregarError("Semantico", "Resta no valida", this.linea, this.columna);
        return { valor: null, tipo: TipoDato.NULO };
    }

    private operarMultiplicacion(valIzq: any, valDer: any, tipoIzq: TipoDato, tipoDer: TipoDato, arbol: any): any {
        if (tipoIzq === TipoDato.INT && tipoDer === TipoDato.INT) return { valor: valIzq * valDer, tipo: TipoDato.INT };
        if (tipoIzq === TipoDato.FLOAT || tipoDer === TipoDato.FLOAT) return { valor: valIzq * valDer, tipo: TipoDato.FLOAT };
        arbol.agregarError("Semantico", "Multiplicacion no valida", this.linea, this.columna);
        return { valor: null, tipo: TipoDato.NULO };
    }

    private operarDivision(valIzq: any, valDer: any, tipoIzq: TipoDato, tipoDer: TipoDato, arbol: any): any {
        if (valDer === 0) {
            arbol.agregarError("Semantico", "Division por cero", this.linea, this.columna);
            return { valor: null, tipo: TipoDato.NULO };
        }
        if (tipoIzq === TipoDato.INT && tipoDer === TipoDato.INT) return { valor: Math.trunc(valIzq / valDer), tipo: TipoDato.INT };
        if (tipoIzq === TipoDato.FLOAT || tipoDer === TipoDato.FLOAT) return { valor: valIzq / valDer, tipo: TipoDato.FLOAT };
        arbol.agregarError("Semantico", "Division no valida", this.linea, this.columna);
        return { valor: null, tipo: TipoDato.NULO };
    }

    private operarModulo(valIzq: any, valDer: any, tipoIzq: TipoDato, tipoDer: TipoDato, arbol: any): any {
        if (valDer === 0) {
            arbol.agregarError("Semantico", "Modulo por cero", this.linea, this.columna);
            return { valor: null, tipo: TipoDato.NULO };
        }
        if (tipoIzq === TipoDato.INT && tipoDer === TipoDato.INT) return { valor: valIzq % valDer, tipo: TipoDato.INT };
        arbol.agregarError("Semantico", "Modulo solo permite enteros", this.linea, this.columna);
        return { valor: null, tipo: TipoDato.NULO };
    }

    private operarNegacion(valIzq: any, tipoIzq: TipoDato, arbol: any): any {
        if (tipoIzq === TipoDato.INT) return { valor: -valIzq, tipo: TipoDato.INT };
        if (tipoIzq === TipoDato.FLOAT) return { valor: -valIzq, tipo: TipoDato.FLOAT };
        arbol.agregarError("Semantico", "Negacion no valida", this.linea, this.columna);
        return { valor: null, tipo: TipoDato.NULO };
    }
}