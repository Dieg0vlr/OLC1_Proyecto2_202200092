import { Instruccion } from './Instruccion';

export class Caso {
    public expresion: Instruccion | null;
    public instrucciones: Instruccion[];

    constructor(expresion: Instruccion | null, instrucciones: Instruccion[]) {
        this.expresion = expresion;
        this.instrucciones = instrucciones;
    }
}