export class GeneradorAST {
    private contador = 0;
    private dot = "";

    public generar(ast: any[]): string {
        this.dot = "digraph G {\nnode [shape=box, style=filled, color=lightgray];\n";
        this.contador = 0;
        const idRaiz = this.contador++;
        this.dot += `n${idRaiz} [label="Inicio"];\n`;

        for (const inst of ast) {
            this.recorrer(inst, idRaiz);
        }

        this.dot += "}\n";
        return this.dot;
    }

    private recorrer(nodo: any, idPadre: number) {
        if (!nodo || typeof nodo !== 'object') return;

        const miId = this.contador++;
        
        let nombre = nodo.constructor.name || "Nodo";
        if (nodo.tipo && typeof nodo.tipo === 'string') nombre += `\\nTipo: ${nodo.tipo}`;
        if (nodo.id && typeof nodo.id === 'string') nombre += `\\nID: ${nodo.id}`;
        
        if (nodo.valor !== undefined && typeof nodo.valor !== 'object') {
            let valorSeguro = String(nodo.valor).replace(/"/g, '\\"');
            nombre += `\\nValor: ${valorSeguro}`;
        }

        this.dot += `n${miId} [label="${nombre}"];\n`;
        this.dot += `n${idPadre} -> n${miId};\n`;

        for (const key in nodo) {
            if (key === 'linea' || key === 'columna' || key === 'entorno') continue;
            
            const hijo = nodo[key];
            if (Array.isArray(hijo)) {
                for (const item of hijo) {
                    this.recorrer(item, miId);
                }
            } else if (typeof hijo === 'object') {
                this.recorrer(hijo, miId);
            }
        }
    }
}