# Gramatica Libre de Contexto - GoScript Formato BNF

<Inicio> ::= <Instrucciones> EOF

<Instrucciones> ::= <Instrucciones> <Instruccion>
                  | <Instruccion>

<InstruccionesBloque> ::= <Instrucciones>
                        | ε

<Instruccion> ::= "func" "main" "(" ")" "{" <InstruccionesBloque> "}"
                | "func" ID "(" <ListaParametros> ")" <Tipo> "{" <InstruccionesBloque> "}"
                | "func" ID "(" <ListaParametros> ")" "{" <InstruccionesBloque> "}"
                | "func" ID "(" ")" <Tipo> "{" <InstruccionesBloque> "}"
                | "func" ID "(" ")" "{" <InstruccionesBloque> "}"
                | <Declaracion>
                | ID ":=" <Expresion> ";"
                | ID ":=" <Expresion>
                | "var" ID <Tipo> ";"
                | "var" ID <Tipo>
                | ID "=" <Expresion> ";"
                | ID "=" <Expresion>
                | ID "+=" <Expresion> ";"
                | ID "+=" <Expresion>
                | ID "-=" <Expresion> ";"
                | ID "-=" <Expresion>
                | ID "[" <Expresion> "]" "[" <Expresion> "]" "=" <Expresion> ";"
                | ID "[" <Expresion> "]" "[" <Expresion> "]" "=" <Expresion>
                | ID "[" <Expresion> "]" "=" <Expresion> ";"
                | ID "[" <Expresion> "]" "=" <Expresion>
                | "struct" ID "{" <ListaAtributosStruct> "}"
                | ID "." ID "=" <Expresion> ";"
                | ID "." ID "=" <Expresion>
                | ID "." ID "+=" <Expresion> ";"
                | ID "." ID "+=" <Expresion>
                | ID "." ID "-=" <Expresion> ";"
                | ID "." ID "-=" <Expresion>
                | ID ID "=" "{" <ListaValoresStruct> "}" ";"
                | ID ID "=" "{" <ListaValoresStruct> "}"
                | ID "(" <ListaExpresiones> ")" ";"
                | ID "(" <ListaExpresiones> ")"
                | ID "(" ")" ";"
                | ID "(" ")"
                | "return" <Expresion> ";"
                | "return" <Expresion>
                | "return" ";"
                | "return"
                | <EstructuraIf>
                | <EstructuraFor>
                | <EstructuraSwitch>
                | "break" ";"
                | "break"
                | "continue" ";"
                | "continue"
                | ID "++" ";"
                | ID "++"
                | ID "--" ";"
                | ID "--"
                | "fmt.Println" "(" <ListaExpresiones> ")" ";"
                | "fmt.Println" "(" <ListaExpresiones> ")"
                | "{" <InstruccionesBloque> "}"

<EstructuraIf> ::= "if" <Expresion> "{" <InstruccionesBloque> "}"
                 | "if" <Expresion> "{" <InstruccionesBloque> "}" "else" "{" <InstruccionesBloque> "}"
                 | "if" <Expresion> "{" <InstruccionesBloque> "}" "else" <EstructuraIf>

<EstructuraFor> ::= "for" <Expresion> "{" <InstruccionesBloque> "}"
                  | "for" <InstruccionFor> ";" <Expresion> ";" <InstruccionFor> "{" <InstruccionesBloque> "}"
                  | "for" ID "," ID ":=" "range" ID "{" <InstruccionesBloque> "}"

<InstruccionFor> ::= "var" ID <Tipo> "=" <Expresion>
                   | ID ":=" <Expresion>
                   | ID "=" <Expresion>
                   | ID "++"
                   | ID "--"

<EstructuraSwitch> ::= "switch" <Expresion> "{" <ListaCasos> "}"
                     | "switch" <Expresion> "{" "}"

<ListaCasos> ::= <ListaCasos> <Caso>
               | <Caso>

<Caso> ::= "case" <Expresion> ":" <InstruccionesBloque>
         | "default" ":" <InstruccionesBloque>

<Declaracion> ::= "var" ID <Tipo> "=" <Expresion> ";"
                | "var" ID <Tipo> "=" <Expresion>

<ListaExpresiones> ::= <ListaExpresiones> "," <Expresion>
                     | <Expresion>

<ListaParametros> ::= <ListaParametros> "," <Parametro>
                    | <Parametro>

<Parametro> ::= ID <Tipo>

<Tipo> ::= "int"
         | "float64"
         | "string"
         | "bool"
         | "rune"
         | "[" "]" <Tipo>
         | ID

<Expresion> ::= <Expresion> "+" <Expresion>
              | <Expresion> "-" <Expresion>
              | <Expresion> "*" <Expresion>
              | <Expresion> "/" <Expresion>
              | <Expresion> "%" <Expresion>
              | "-" <Expresion>
              | "(" <Expresion> ")"
              | ENTERO
              | DECIMAL
              | CARACTER
              | ID
              | CADENA
              | "[" "]" "[" "]" <Tipo> "{" <ListaListas> "}"
              | "[" "]" <Tipo> "{" <ListaExpresiones> "}"
              | ID "[" <Expresion> "]" "[" <Expresion> "]"
              | ID "[" <Expresion> "]"
              | ID "." ID
              | ID "{" <ListaValoresStruct> "}"
              | "len" "(" <Expresion> ")"
              | "append" "(" <Expresion> "," <Expresion> ")"
              | "slices.Index" "(" <Expresion> "," <Expresion> ")"
              | "strings.Join" "(" <Expresion> "," <Expresion> ")"
              | "strconv.Atoi" "(" <Expresion> ")"
              | "strconv.ParseFloat" "(" <Expresion> ")"
              | "reflect.TypeOf" "(" <Expresion> ")"
              | ID "(" <ListaExpresiones> ")"
              | ID "(" ")"
              | <Expresion> ">" <Expresion>
              | <Expresion> "<" <Expresion>
              | <Expresion> ">=" <Expresion>
              | <Expresion> "<=" <Expresion>
              | <Expresion> "==" <Expresion>
              | <Expresion> "!=" <Expresion>
              | <Expresion> "&&" <Expresion>
              | <Expresion> "||" <Expresion>
              | "!" <Expresion>
              | "true"
              | "false"
              | "nil"

<ListaListas> ::= <ListaListas> "," <Fila>
                | <Fila>

<Fila> ::= "{" <ListaExpresiones> "}"

<ListaAtributosStruct> ::= <ListaAtributosStruct> <AtributoStruct>
                         | <AtributoStruct>

<AtributoStruct> ::= <Tipo> ID ";"
                   | <Tipo> ID

<ListaValoresStruct> ::= <ListaValores>
                       | ε

<ListaValores> ::= <ListaValores> "," <ValorStruct>
                 | <ValorStruct>

<ValorStruct> ::= ID ":" <Expresion>