import { Simbolo } from './Simbolo';

export class Entorno {
    public anterior: Entorno | null;
    public tabla: Map<string, Simbolo>;

    constructor(anterior: Entorno | null) {
        this.anterior = anterior;
        this.tabla = new Map<string, Simbolo>();
    }

    public guardar(id: string, simbolo: Simbolo): boolean {
        if (this.tabla.has(id)) {
            return false; 
        }
        this.tabla.set(id, simbolo);
        return true;
    }

    public obtener(id: string): Simbolo | null {
        let entornoActual: Entorno | null = this;
        
        while (entornoActual != null) {
            if (entornoActual.tabla.has(id)) {
                return entornoActual.tabla.get(id) || null;
            }
            // Si no esta aca, busco en el entorno superior
            entornoActual = entornoActual.anterior;
        }
        return null;
    }

    public actualizar(id: string, simbolo: Simbolo): boolean {
        let entornoActual: Entorno | null = this;
        
        while (entornoActual != null) {
            if (entornoActual.tabla.has(id)) {
                entornoActual.tabla.set(id, simbolo);
                return true;
            }
            entornoActual = entornoActual.anterior;
        }
        
        return false;
    }

    
}