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
"string"              return 'R_STRING';
"bool"                return 'R_BOOL';
"rune"                return 'R_RUNE';
"fmt.Println"         return 'R_PRINT';
"true"                return 'R_TRUE';
"false"               return 'R_FALSE';
"nil"                 return 'R_NIL';
"if"                  return 'R_IF';
"else"                return 'R_ELSE';
"for"                 return 'R_FOR';
"return"              return 'R_RETURN';
"break"               return 'R_BREAK';
"continue"            return 'R_CONTINUE';
"switch"              return 'R_SWITCH';
"case"                return 'R_CASE';
"default"             return 'R_DEFAULT';
"len"                 return 'R_LEN';
"append"              return 'R_APPEND';
"slices.Index"        return 'R_SLICES_INDEX';
"strings.Join"        return 'R_STRINGS_JOIN';
"struct"              return 'R_STRUCT';
"strconv.Atoi"        return 'R_ATOI';
"strconv.ParseFloat"  return 'R_PARSE_FLOAT';
"reflect.TypeOf"      return 'R_TYPE_OF';
"range"               return 'R_RANGE';

"=="                  return 'IGUAL_IGUAL';
"!="                  return 'DISTINTO';
"<="                  return 'MENOR_IGUAL';
">="                  return 'MAYOR_IGUAL';
"<"                   return 'MENOR';
">"                   return 'MAYOR';
"&&"                  return 'AND';
"||"                  return 'OR';
"!"                   return 'NOT';

":="                  return 'DOS_PUNTOS_IGUAL';
"+="                  return 'MAS_IGUAL';
"-="                  return 'MENOS_IGUAL';
"++"                  return 'MAS_MAS';
"--"                  return 'MENOS_MENOS';
"+"                   return 'MAS';
"-"                   return 'MENOS';
"*"                   return 'POR';
"/"                   return 'DIVIDIDO';
"%"                   return 'MODULO';
"="                   return 'IGUAL';
":"                   return 'DOS_PUNTOS';
";"                   return 'PTCOMA';
","                   return 'COMA';
"("                   return 'PAR_A';
")"                   return 'PAR_C';
"["                   return 'CORCHE_A';
"]"                   return 'CORCHE_C';
"{"                   return 'LLAVE_A';
"}"                   return 'LLAVE_C';
"."                   return 'PUNTO';

\"([^\"\\]|\\.)*\"    { yytext = yytext.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\"/g, '\"').replace(/\\\\/g, '\\'); return 'CADENA'; }
\'[^\']\'             { yytext = yytext.charCodeAt(1); return 'CARACTER'; }
[0-9]+("."[0-9]+)\b   return 'DECIMAL';
[0-9]+\b              return 'ENTERO';
[a-zA-Z_][a-zA-Z0-9_]* return 'ID';

<<EOF>>               return 'EOF';
.  { 
    if (!(global).erroresScanner) (global).erroresScanner = [];
    (global).erroresScanner.push({ tipo: 'Lexico', descripcion: 'Caracter invalido: ' + yytext, linea: yylloc.first_line, columna: yylloc.first_column }); 
}

/lex

/* ---------------- AREA SINTACTICA ---------------- */

%{
    const { AccesoSlice } = require('../ast/AccesoSlice');
    const { AccesoSlice2D } = require('../ast/AccesoSlice2D');
    const { AccesoStruct } = require('../ast/AccesoStruct');
    const { AccesoVariable } = require('../ast/AccesoVariable');
    const { Append } = require('../ast/Append');
    const { Aritmetica, OperadorAritmetico } = require('../ast/Aritmetica');
    const { Asignacion } = require('../ast/Asignacion');
    const { AsignacionCompuesta } = require('../ast/AsignacionCompuesta');
    const { Bloque } = require('../ast/Bloque');
    const { Break } = require('../ast/Break');
    const { Caso } = require('../ast/Caso');
    const { Continue } = require('../ast/Continue');
    const { Declaracion } = require('../ast/Declaracion');
    const { DeclaracionFuncion } = require('../ast/DeclaracionFuncion');
    const { DeclaracionStruct } = require('../ast/DeclaracionStruct');
    const { For } = require('../ast/For');
    const { ForRange } = require('../ast/ForRange');
    const { If } = require('../ast/If');
    const { Incremento } = require('../ast/Incremento');
    const { InstanciaStruct } = require('../ast/InstanciaStruct');
    const { Len } = require('../ast/Len');
    const { Literal } = require('../ast/Literal');
    const { LlamadaFuncion } = require('../ast/LlamadaFuncion');
    const { Logica, OperadorLogico } = require('../ast/Logica');
    const { ModificacionSlice } = require('../ast/ModificacionSlice');
    const { ModificacionSlice2D } = require('../ast/ModificacionSlice2D');
    const { ModificacionStruct } = require('../ast/ModificacionStruct');
    const { ParseFloat } = require('../ast/ParseFloat');
    const { ParseInt } = require('../ast/ParseInt');
    const { Print } = require('../ast/Print');
    const { Relacional, OperadorRelacional } = require('../ast/Relacional');
    const { Return } = require('../ast/Return');
    const { Slice } = require('../ast/Slice');
    const { Slice2D } = require('../ast/Slice2D');
    const { SlicesIndex } = require('../ast/SlicesIndex');
    const { StringsJoin } = require('../ast/StringsJoin');
    const { Switch } = require('../ast/Switch');
    const { TipoDato } = require('../entorno/Tipo');
    const { TypeOf } = require('../ast/TypeOf');
%}

%left 'FIN'
%left 'OR'
%left 'AND'
%left 'IGUAL_IGUAL' 'DISTINTO'
%left 'MAYOR' 'MENOR' 'MAYOR_IGUAL' 'MENOR_IGUAL'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVIDIDO' 'MODULO'
%right UMENOS 'NOT'
%left 'PUNTO'
%left 'CORCHE_A' 'CORCHE_C'

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
    | R_FUNC ID PAR_A ListaParametros PAR_C Tipo LLAVE_A InstruccionesBloque LLAVE_C { $$ = new DeclaracionFuncion(@1.first_line, @1.first_column, $2, $4, $6, $8); }
    | R_FUNC ID PAR_A ListaParametros PAR_C LLAVE_A InstruccionesBloque LLAVE_C { $$ = new DeclaracionFuncion(@1.first_line, @1.first_column, $2, $4, null, $7); }
    | R_FUNC ID PAR_A PAR_C Tipo LLAVE_A InstruccionesBloque LLAVE_C { $$ = new DeclaracionFuncion(@1.first_line, @1.first_column, $2, [], $5, $7); }
    | R_FUNC ID PAR_A PAR_C LLAVE_A InstruccionesBloque LLAVE_C { $$ = new DeclaracionFuncion(@1.first_line, @1.first_column, $2, [], null, $6); }
    | Declaracion { $$ = $1; }
    | ID DOS_PUNTOS_IGUAL Expresion PTCOMA { $$ = new Declaracion(@1.first_line, @1.first_column, $1, null, $3); }
    | ID DOS_PUNTOS_IGUAL Expresion %prec FIN { $$ = new Declaracion(@1.first_line, @1.first_column, $1, null, $3); }
    | R_VAR ID Tipo PTCOMA { $$ = new Declaracion(@1.first_line, @1.first_column, $2, $3, null); }
    | R_VAR ID Tipo %prec FIN { $$ = new Declaracion(@1.first_line, @1.first_column, $2, $3, null); }
    | ID IGUAL Expresion PTCOMA { $$ = new Asignacion(@1.first_line, @1.first_column, $1, $3); }
    | ID IGUAL Expresion %prec FIN { $$ = new Asignacion(@1.first_line, @1.first_column, $1, $3); }
    
    | ID ID IGUAL LLAVE_A ListaValoresStruct LLAVE_C PTCOMA { $$ = new Declaracion(@1.first_line, @1.first_column, $2, TipoDato.STRUCT, new InstanciaStruct(@1.first_line, @1.first_column, $1, $5)); }
    | ID ID IGUAL LLAVE_A ListaValoresStruct LLAVE_C %prec FIN { $$ = new Declaracion(@1.first_line, @1.first_column, $2, TipoDato.STRUCT, new InstanciaStruct(@1.first_line, @1.first_column, $1, $5)); }

    | ID MAS_IGUAL Expresion PTCOMA { $$ = new AsignacionCompuesta(@1.first_line, @1.first_column, $1, $3, '+='); }
    | ID MAS_IGUAL Expresion %prec FIN { $$ = new AsignacionCompuesta(@1.first_line, @1.first_column, $1, $3, '+='); }
    | ID MENOS_IGUAL Expresion PTCOMA { $$ = new AsignacionCompuesta(@1.first_line, @1.first_column, $1, $3, '-='); }
    | ID MENOS_IGUAL Expresion %prec FIN { $$ = new AsignacionCompuesta(@1.first_line, @1.first_column, $1, $3, '-='); }
    | ID CORCHE_A Expresion CORCHE_C CORCHE_A Expresion CORCHE_C IGUAL Expresion PTCOMA { $$ = new ModificacionSlice2D(@1.first_line, @1.first_column, $1, $3, $6, $9); }
    | ID CORCHE_A Expresion CORCHE_C CORCHE_A Expresion CORCHE_C IGUAL Expresion %prec FIN { $$ = new ModificacionSlice2D(@1.first_line, @1.first_column, $1, $3, $6, $9); }
    | ID CORCHE_A Expresion CORCHE_C IGUAL Expresion PTCOMA { $$ = new ModificacionSlice(@1.first_line, @1.first_column, $1, $3, $6); }
    | ID CORCHE_A Expresion CORCHE_C IGUAL Expresion %prec FIN { $$ = new ModificacionSlice(@1.first_line, @1.first_column, $1, $3, $6); }
    | R_STRUCT ID LLAVE_A ListaAtributosStruct LLAVE_C { $$ = new DeclaracionStruct(@1.first_line, @1.first_column, $2, $4); }
    
    | AccesoAtributo IGUAL Expresion PTCOMA { $$ = new ModificacionStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1), $3); }
    | AccesoAtributo IGUAL Expresion %prec FIN { $$ = new ModificacionStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1), $3); }
    | AccesoAtributo MAS_IGUAL Expresion PTCOMA { $$ = new ModificacionStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1), new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.SUMA, new AccesoStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1)), $3)); }
    | AccesoAtributo MAS_IGUAL Expresion %prec FIN { $$ = new ModificacionStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1), new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.SUMA, new AccesoStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1)), $3)); }
    | AccesoAtributo MENOS_IGUAL Expresion PTCOMA { $$ = new ModificacionStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1), new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.RESTA, new AccesoStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1)), $3)); }
    | AccesoAtributo MENOS_IGUAL Expresion %prec FIN { $$ = new ModificacionStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1), new Aritmetica(@1.first_line, @1.first_column, OperadorAritmetico.RESTA, new AccesoStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1)), $3)); }

    | R_RETURN Expresion PTCOMA { $$ = new Return(@1.first_line, @1.first_column, $2); }
    | R_RETURN PTCOMA { $$ = new Return(@1.first_line, @1.first_column, null); }
    | R_RETURN Expresion %prec FIN { $$ = new Return(@1.first_line, @1.first_column, $2); }
    | R_RETURN %prec FIN { $$ = new Return(@1.first_line, @1.first_column, null); }
    | EstructuraIf { $$ = $1; }
    | EstructuraFor { $$ = $1; }
    | EstructuraSwitch { $$ = $1; }
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
    | R_PRINT PAR_A PAR_C PTCOMA { $$ = new Print(@1.first_line, @1.first_column, []); }
    | R_PRINT PAR_A PAR_C %prec FIN { $$ = new Print(@1.first_line, @1.first_column, []); }
    | LLAVE_A InstruccionesBloque LLAVE_C { $$ = new Bloque(@1.first_line, @1.first_column, $2); }
    ;

EstructuraIf
    : R_IF Expresion LLAVE_A InstruccionesBloque LLAVE_C { $$ = new If(@1.first_line, @1.first_column, $2, $4); }
    | R_IF Expresion LLAVE_A InstruccionesBloque LLAVE_C R_ELSE LLAVE_A InstruccionesBloque LLAVE_C { $$ = new If(@1.first_line, @1.first_column, $2, $4, $8); }
    | R_IF Expresion LLAVE_A InstruccionesBloque LLAVE_C R_ELSE EstructuraIf { $$ = new If(@1.first_line, @1.first_column, $2, $4, $7); }
    ;

EstructuraFor
    : R_FOR Expresion LLAVE_A InstruccionesBloque LLAVE_C { $$ = new For(@1.first_line, @1.first_column, $2, $4); }
    | R_FOR InstruccionFor PTCOMA Expresion PTCOMA InstruccionFor LLAVE_A InstruccionesBloque LLAVE_C { $$ = new For(@1.first_line, @1.first_column, $4, $8, $2, $6); }
    | R_FOR ID COMA ID DOS_PUNTOS_IGUAL R_RANGE ID LLAVE_A InstruccionesBloque LLAVE_C { $$ = new ForRange(@1.first_line, @1.first_column, $2, $4, new AccesoVariable(@1.first_line, @1.first_column, $7), $9); }
    ;

InstruccionFor
    : R_VAR ID Tipo IGUAL Expresion { $$ = new Declaracion(@1.first_line, @1.first_column, $2, $3, $5); }
    | ID DOS_PUNTOS_IGUAL Expresion { $$ = new Declaracion(@1.first_line, @1.first_column, $1, null, $3); }
    | ID IGUAL Expresion { $$ = new Asignacion(@1.first_line, @1.first_column, $1, $3); }
    | ID MAS_MAS { $$ = new Incremento(@1.first_line, @1.first_column, $1, '++'); }
    | ID MENOS_MENOS { $$ = new Incremento(@1.first_line, @1.first_column, $1, '--'); }
    ;

EstructuraSwitch
    : R_SWITCH Expresion LLAVE_A ListaCasos LLAVE_C { $$ = new Switch(@1.first_line, @1.first_column, $2, $4); }
    | R_SWITCH Expresion LLAVE_A LLAVE_C { $$ = new Switch(@1.first_line, @1.first_column, $2, []); }
    ;

ListaCasos
    : ListaCasos Caso { $1.push($2); $$ = $1; }
    | Caso { $$ = [$1]; }
    ;

Caso
    : R_CASE Expresion DOS_PUNTOS InstruccionesBloque { $$ = new Caso($2, $4); }
    | R_DEFAULT DOS_PUNTOS InstruccionesBloque { $$ = new Caso(null, $3); }
    ;

Declaracion
    : R_VAR ID Tipo IGUAL Expresion PTCOMA { $$ = new Declaracion(@1.first_line, @1.first_column, $2, $3, $5); }
    | R_VAR ID Tipo IGUAL Expresion %prec FIN { $$ = new Declaracion(@1.first_line, @1.first_column, $2, $3, $5); }
    ;

ListaExpresiones
    : ListaExpresiones COMA Expresion { $1.push($3); $$ = $1; }
    | Expresion { $$ = [$1]; }
    ;

ListaParametros
    : ListaParametros COMA Parametro { $1.push($3); $$ = $1; }
    | Parametro { $$ = [$1]; }
    ;

Parametro
    : ID Tipo { $$ = { id: $1, tipo: $2 }; }
    ;

Tipo
    : R_INT { $$ = TipoDato.INT; }
    | R_FLOAT64 { $$ = TipoDato.FLOAT; }
    | R_STRING { $$ = TipoDato.STRING; }
    | R_BOOL { $$ = TipoDato.BOOL; }
    | R_RUNE { $$ = TipoDato.RUNE; }
    | CORCHE_A CORCHE_C Tipo { $$ = "[]" + $3; }
    | ID { $$ = $1; }
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
    | CARACTER                      { $$ = new Literal(@1.first_line, @1.first_column, Number($1), TipoDato.RUNE); }
    | ID                            { $$ = new AccesoVariable(@1.first_line, @1.first_column, $1); }
    | CADENA                        { $$ = new Literal(@1.first_line, @1.first_column, $1, TipoDato.STRING); }
    | CORCHE_A CORCHE_C CORCHE_A CORCHE_C Tipo LLAVE_A ListaListas LLAVE_C { $$ = new Slice2D(@1.first_line, @1.first_column, $5, $7); }
    | CORCHE_A CORCHE_C CORCHE_A CORCHE_C Tipo LLAVE_A ListaListas COMA LLAVE_C { $$ = new Slice2D(@1.first_line, @1.first_column, $5, $7); }
    | CORCHE_A CORCHE_C Tipo LLAVE_A ListaExpresiones LLAVE_C { $$ = new Slice(@1.first_line, @1.first_column, $3, $5); }
    | CORCHE_A CORCHE_C Tipo LLAVE_A ListaExpresiones COMA LLAVE_C { $$ = new Slice(@1.first_line, @1.first_column, $3, $5); }

    | CORCHE_A CORCHE_C CORCHE_A CORCHE_C Tipo LLAVE_A LLAVE_C { $$ = new Slice2D(@1.first_line, @1.first_column, $5, []); }
    | CORCHE_A CORCHE_C Tipo LLAVE_A LLAVE_C { $$ = new Slice(@1.first_line, @1.first_column, $3, []); }
    | ID CORCHE_A Expresion CORCHE_C CORCHE_A Expresion CORCHE_C { $$ = new AccesoSlice2D(@1.first_line, @1.first_column, $1, $3, $6); }
    | ID CORCHE_A Expresion CORCHE_C { $$ = new AccesoSlice(@1.first_line, @1.first_column, $1, $3); }
    
    | AccesoAtributo { $$ = new AccesoStruct(@1.first_line, @1.first_column, $1.split('.')[0], $1.substring($1.indexOf('.')+1)); }

    | R_LEN PAR_A Expresion PAR_C { $$ = new Len(@1.first_line, @1.first_column, $3); }
    | R_APPEND PAR_A Expresion COMA Expresion PAR_C { $$ = new Append(@1.first_line, @1.first_column, $3, $5); }
    | R_SLICES_INDEX PAR_A Expresion COMA Expresion PAR_C { $$ = new SlicesIndex(@1.first_line, @1.first_column, $3, $5); }
    | R_STRINGS_JOIN PAR_A Expresion COMA Expresion PAR_C { $$ = new StringsJoin(@1.first_line, @1.first_column, $3, $5); }
    | R_ATOI PAR_A Expresion PAR_C { $$ = new ParseInt(@1.first_line, @1.first_column, $3); }
    | R_PARSE_FLOAT PAR_A Expresion PAR_C { $$ = new ParseFloat(@1.first_line, @1.first_column, $3); }
    | R_TYPE_OF PAR_A Expresion PAR_C { $$ = new TypeOf(@1.first_line, @1.first_column, $3); }
    | ID PAR_A ListaExpresiones PAR_C { $$ = new LlamadaFuncion(@1.first_line, @1.first_column, $1, $3); }
    | ID PAR_A PAR_C { $$ = new LlamadaFuncion(@1.first_line, @1.first_column, $1, []); }
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
    | R_NIL                         { $$ = new Literal(@1.first_line, @1.first_column, null, TipoDato.NULO); }
    ;

ListaListas
    : ListaListas COMA Fila { $1.push($3); $$ = $1; }
    | Fila { $$ = [$1]; }
    ;

Fila
    : LLAVE_A ListaExpresiones LLAVE_C { $$ = $2; }
    ;

ListaAtributosStruct
    : ListaAtributosStruct AtributoStruct { $1.push($2); $$ = $1; }
    | AtributoStruct { $$ = [$1]; }
    ;

AtributoStruct
    : Tipo ID PTCOMA { $$ = { id: $2, tipo: $1 }; }
    | Tipo ID %prec FIN { $$ = { id: $2, tipo: $1 }; }
    ;

ListaValoresStruct
    : ListaValores { $$ = $1; }
    | /* EPSILON */ { $$ = []; }
    ;

ListaValores
    : ListaValores COMA ValorStruct { $1.push($3); $$ = $1; }
    | ValorStruct { $$ = [$1]; }
    ;

ValorStruct
    : ID DOS_PUNTOS Expresion { $$ = { id: $1, valor: $3 }; }
    ;

AccesoAtributo
    : ID PUNTO ID { $$ = $1 + "." + $3; }
    | AccesoAtributo PUNTO ID { $$ = $1 + "." + $3; }
    ;