export interface Instruccion {
    /**
     * El número de línea donde se encuentra la instrucción (útil para reportar errores)
     */
    linea: number;
    
    /**
     * La columna donde se encuentra la instrucción
     */
    columna: number;

    /**
     * Método principal que ejecutará la lógica de este nodo
     * @param entorno La tabla de símbolos actual (variables, funciones, etc.)
     * @param arbol El objeto global que guarda la consola, errores, etc.
     */
    interpretar(entorno: any, arbol: any): any;
}