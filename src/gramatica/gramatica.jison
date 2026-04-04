/* ---------------- AREA LEXICA ---------------- */
%lex
%options case-sensitive

%%

\s+                   /* Omitir espacios */
"//".* /* Omitir comentarios de una linea */
"/*"[^]*?"*/"         /* Omitir comentarios multilinea */

"func"                return 'R_FUNC';
"main"                return 'R_MAIN';
"var"                 return 'R_VAR';
"int"                 return 'R_INT';
"float64"             return 'R_FLOAT64';
"fmt.Println"         return 'R_PRINT';

"+"                   return 'MAS';
"-"                   return 'MENOS';
"*"                   return 'POR';
"/"                   return 'DIVIDIDO';
"%"                   return 'MODULO';
"="                   return 'IGUAL';
";"                   return 'PTCOMA';
","                   return 'COMA';
"("                   return 'PAR_A';
")"                   return 'PAR_C';
"{"                   return 'LLAVE_A';
"}"                   return 'LLAVE_C';

\"[^\"]*\"            { yytext = yytext.slice(1, -1); return 'CADENA'; }
[0-9]+("."[0-9]+)\b   return 'DECIMAL';
[0-9]+\b              return 'ENTERO';
[a-zA-Z_][a-zA-Z0-9_]* return 'ID';

<<EOF>>               return 'EOF';
.                     { console.error('Error lexico: ' + yytext + ' linea ' + yylloc.first_line); }

/lex

/* ---------------- AREA SINTACTICA ---------------- */

%{
    const { Aritmetica, OperadorAritmetico } = require('../ast/Aritmetica');
    const { Literal } = require('../ast/Literal');
    const { TipoDato } = require('../entorno/Tipo');
    const { Declaracion } = require('../ast/Declaracion');
    const { Print } = require('../ast/Print');
    const { AccesoVariable } = require('../ast/AccesoVariable');
%}

%left 'FIN'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVIDIDO' 'MODULO'
%right UMENOS 

%start Inicio

%%

Inicio
    : Instrucciones EOF { return $1; }
    ;

Instrucciones
    : Instrucciones Instruccion { $1.push($2); $$ = $1; }
    | Instruccion               { $$ = [$1]; }
    ;

Instruccion
    : R_FUNC R_MAIN PAR_A PAR_C LLAVE_A Instrucciones LLAVE_C { $$ = { tipo: 'MAIN', instrucciones: $6 }; }
    | Declaracion { $$ = $1; }
    | R_PRINT PAR_A ListaExpresiones PAR_C PTCOMA { $$ = new Print(@1.first_line, @1.first_column, $3); }
    | R_PRINT PAR_A ListaExpresiones PAR_C %prec FIN { $$ = new Print(@1.first_line, @1.first_column, $3); }
    | R_PRINT PAR_A PAR_C PTCOMA { $$ = new Print(@1.first_line, @1.first_column, []); }
    | R_PRINT PAR_A PAR_C %prec FIN { $$ = new Print(@1.first_line, @1.first_column, []); }
    | Expresion PTCOMA { $$ = $1; }
    | Expresion %prec FIN { $$ = $1; } 
    ;

Declaracion
    : R_VAR ID Tipo IGUAL Expresion PTCOMA { $$ = new Declaracion(@1.first_line, @1.first_column, $2, $3, $5); }
    | R_VAR ID Tipo IGUAL Expresion %prec FIN { $$ = new Declaracion(@1.first_line, @1.first_column, $2, $3, $5); }
    ;

ListaExpresiones
    : ListaExpresiones COMA Expresion { $1.push($3); $$ = $1; }
    | Expresion { $$ = [$1]; }
    ;

Tipo
    : R_INT { $$ = TipoDato.INT; }
    | R_FLOAT64 { $$ = TipoDato.FLOAT; }
    ;

Expresion
    : Expresion MAS Expresion       { $$ = new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.SUMA, $1, $3); }
    | Expresion MENOS Expresion     { $$ = new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.RESTA, $1, $3); }
    | Expresion POR Expresion       { $$ = new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.MULTIPLICACION, $1, $3); }
    | Expresion DIVIDIDO Expresion  { $$ = new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.DIVISION, $1, $3); }
    | Expresion MODULO Expresion    { $$ = new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.MODULO, $1, $3); }
    | MENOS Expresion %prec UMENOS  { $$ = new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.NEGACION_UNARIA, $2); }
    | PAR_A Expresion PAR_C         { $$ = $2; } 
    | ENTERO                        { $$ = new Literal(@1.first_line, @1.first_column, Number($1), TipoDato.INT); }
    | DECIMAL                       { $$ = new Literal(@1.first_line, @1.first_column, Number($1), TipoDato.FLOAT); }
    | ID                            { $$ = new AccesoVariable(@1.first_line, @1.first_column, $1); }
    | CADENA                        { $$ = new Literal(@1.first_line, @1.first_column, $1, TipoDato.STRING); }
    ;