export interface Instruccion {
    
    // El numero de linea donde se encuentra la instruccion es utl para reportar errores
    linea: number;
    
    //La columna donde se encuentra la instruccion
    columna: number;

    /**
     * Metodo principal que ejecutara la logica de este nodo
     * @param entorno La tabla de simbolos actual, variables, funciones, etc
     * @param arbol El objeto global que guarda la consola, errores, etc
     */
    interpretar(entorno: any, arbol: any): any;
}