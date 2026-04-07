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
"true"                return 'R_TRUE';
"false"               return 'R_FALSE';
"if"                  return 'R_IF';
"else"                return 'R_ELSE';
"for"                 return 'R_FOR';
"break"               return 'R_BREAK';
"continue"            return 'R_CONTINUE';

"=="                  return 'IGUAL_IGUAL';
"!="                  return 'DISTINTO';
"<="                  return 'MENOR_IGUAL';
">="                  return 'MAYOR_IGUAL';
"<"                   return 'MENOR';
">"                   return 'MAYOR';
"&&"                  return 'AND';
"||"                  return 'OR';
"!"                   return 'NOT';

"++"                  return 'MAS_MAS';
"--"                  return 'MENOS_MENOS';
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
    const { Asignacion } = require('../ast/Asignacion');
    const { Print } = require('../ast/Print');
    const { AccesoVariable } = require('../ast/AccesoVariable');
    const { Relacional, OperadorRelacional } = require('../ast/Relacional');
    const { Logica, OperadorLogico } = require('../ast/Logica');
    const { If } = require('../ast/If');
    const { For } = require('../ast/For');
    const { Break } = require('../ast/Break');
    const { Continue } = require('../ast/Continue');
    const { Incremento } = require('../ast/Incremento');
%}

%left 'FIN'
%left 'OR'
%left 'AND'
%left 'IGUAL_IGUAL' 'DISTINTO'
%left 'MAYOR' 'MENOR' 'MAYOR_IGUAL' 'MENOR_IGUAL'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVIDIDO' 'MODULO'
%right UMENOS 'NOT'

%start Inicio

%%

Inicio
    : Instrucciones EOF { return $1; }
    ;

Instrucciones
    : Instrucciones Instruccion { $1.push($2); $$ = $1; }
    | Instruccion               { $$ = [$1]; }
    ;

InstruccionesBloque
    : Instrucciones { $$ = $1; }
    | /* EPSILON */ { $$ = []; }
    ;

Instruccion
    : R_FUNC R_MAIN PAR_A PAR_C LLAVE_A InstruccionesBloque LLAVE_C { $$ = { tipo: 'MAIN', instrucciones: $6 }; }
    | Declaracion { $$ = $1; }
    | ID IGUAL Expresion PTCOMA { $$ = new Asignacion(@1.first_line, @1.first_column, $1, $3); }
    | ID IGUAL Expresion %prec FIN { $$ = new Asignacion(@1.first_line, @1.first_column, $1, $3); }
    | EstructuraIf { $$ = $1; }
    | EstructuraFor { $$ = $1; }
    | R_BREAK PTCOMA { $$ = new Break(@1.first_line, @1.first_column); }
    | R_BREAK %prec FIN { $$ = new Break(@1.first_line, @1.first_column); }
    | R_CONTINUE PTCOMA { $$ = new Continue(@1.first_line, @1.first_column); }
    | R_CONTINUE %prec FIN { $$ = new Continue(@1.first_line, @1.first_column); }
    | ID MAS_MAS PTCOMA { $$ = new Incremento(@1.first_line, @1.first_column, $1, '++'); }
    | ID MAS_MAS %prec FIN { $$ = new Incremento(@1.first_line, @1.first_column, $1, '++'); }
    | ID MENOS_MENOS PTCOMA { $$ = new Incremento(@1.first_line, @1.first_column, $1, '--'); }
    | ID MENOS_MENOS %prec FIN { $$ = new Incremento(@1.first_line, @1.first_column, $1, '--'); }
    | R_PRINT PAR_A ListaExpresiones PAR_C PTCOMA { $$ = new Print(@1.first_line, @1.first_column, $3); }
    | R_PRINT PAR_A ListaExpresiones PAR_C %prec FIN { $$ = new Print(@1.first_line, @1.first_column, $3); }
    | Expresion PTCOMA { $$ = $1; }
    | Expresion %prec FIN { $$ = $1; } 
    ;

EstructuraIf
    : R_IF Expresion LLAVE_A InstruccionesBloque LLAVE_C { $$ = new If(@1.first_line, @1.first_column, $2, $4); }
    | R_IF Expresion LLAVE_A InstruccionesBloque LLAVE_C R_ELSE LLAVE_A InstruccionesBloque LLAVE_C { $$ = new If(@1.first_line, @1.first_column, $2, $4, $8); }
    | R_IF Expresion LLAVE_A InstruccionesBloque LLAVE_C R_ELSE EstructuraIf { $$ = new If(@1.first_line, @1.first_column, $2, $4, $7); }
    ;

EstructuraFor
    : R_FOR Expresion LLAVE_A InstruccionesBloque LLAVE_C { $$ = new For(@1.first_line, @1.first_column, $2, $4); }
    | R_FOR InstruccionFor PTCOMA Expresion PTCOMA InstruccionFor LLAVE_A InstruccionesBloque LLAVE_C { $$ = new For(@1.first_line, @1.first_column, $4, $8, $2, $6); }
    ;

InstruccionFor
    : R_VAR ID Tipo IGUAL Expresion { $$ = new Declaracion(@1.first_line, @1.first_column, $2, $3, $5); }
    | ID IGUAL Expresion { $$ = new Asignacion(@1.first_line, @1.first_column, $1, $3); }
    | ID MAS_MAS { $$ = new Incremento(@1.first_line, @1.first_column, $1, '++'); }
    | ID MENOS_MENOS { $$ = new Incremento(@1.first_line, @1.first_column, $1, '--'); }
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
    | Expresion MAYOR Expresion     { $$ = new Relacional(@1.first_line, @1.first_column, OperadorRelacional.MAYOR, $1, $3); }
    | Expresion MENOR Expresion     { $$ = new Relacional(@1.first_line, @1.first_column, OperadorRelacional.MENOR, $1, $3); }
    | Expresion MAYOR_IGUAL Expresion { $$ = new Relacional(@1.first_line, @1.first_column, OperadorRelacional.MAYOR_IGUAL, $1, $3); }
    | Expresion MENOR_IGUAL Expresion { $$ = new Relacional(@1.first_line, @1.first_column, OperadorRelacional.MENOR_IGUAL, $1, $3); }
    | Expresion IGUAL_IGUAL Expresion { $$ = new Relacional(@1.first_line, @1.first_column, OperadorRelacional.IGUAL, $1, $3); }
    | Expresion DISTINTO Expresion  { $$ = new Relacional(@1.first_line, @1.first_column, OperadorRelacional.DISTINTO, $1, $3); }
    | Expresion AND Expresion       { $$ = new Logica(@1.first_line, @1.first_column, OperadorLogico.AND, $1, $3); }
    | Expresion OR Expresion        { $$ = new Logica(@1.first_line, @1.first_column, OperadorLogico.OR, $1, $3); }
    | NOT Expresion                 { $$ = new Logica(@1.first_line, @1.first_column, OperadorLogico.NOT, $2); }
    | R_TRUE                        { $$ = new Literal(@1.first_line, @1.first_column, true, TipoDato.BOOL); }
    | R_FALSE                       { $$ = new Literal(@1.first_line, @1.first_column, false, TipoDato.BOOL); }
    ;