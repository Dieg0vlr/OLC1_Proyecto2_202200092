
import { TipoDato } from './Tipo';

export class Simbolo {
    public id: string;
    public valor: any;
    public tipo: TipoDato;

    constructor(id: string, valor: any, tipo: TipoDato) {
        this.id = id;
        this.valor = valor;
        this.tipo = tipo;
    }
}