(self.webpackChunkcoding_with_chrome=self.webpackChunkcoding_with_chrome||[]).push([[9362],{79362:function(T,e){var _,o,a;o=[],void 0===(a="function"==typeof(_=function(){"use strict";var T=T||{Msg:Object.create(null)};return T.Msg.ADD_COMMENT="Adicionar Comentário",T.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE="Não se pode eliminar a variável '%1' porque faz parte da definição da função '%2'",T.Msg.CHANGE_VALUE_TITLE="Alterar valor:",T.Msg.CLEAN_UP="Limpar Blocos",T.Msg.COLLAPSED_WARNINGS_WARNING="Os blocos ocultados contêm avisos.",T.Msg.COLLAPSE_ALL="Ocultar Blocos",T.Msg.COLLAPSE_BLOCK="Ocultar Bloco",T.Msg.COLOUR_BLEND_COLOUR1="cor 1",T.Msg.COLOUR_BLEND_COLOUR2="cor 2",T.Msg.COLOUR_BLEND_HELPURL="https://meyerweb.com/eric/tools/color-blend/#:::rgbp",T.Msg.COLOUR_BLEND_RATIO="proporção",T.Msg.COLOUR_BLEND_TITLE="misturar",T.Msg.COLOUR_BLEND_TOOLTIP="Mistura duas cores com a proporção indicada (0.0 - 1.0).",T.Msg.COLOUR_PICKER_HELPURL="http://pt.wikipedia.org/wiki/Cor",T.Msg.COLOUR_PICKER_TOOLTIP="Escolha uma cor da paleta de cores.",T.Msg.COLOUR_RANDOM_HELPURL="http://randomcolour.com",T.Msg.COLOUR_RANDOM_TITLE="cor aleatória",T.Msg.COLOUR_RANDOM_TOOLTIP="Escolha uma cor aleatoriamente.",T.Msg.COLOUR_RGB_BLUE="azul",T.Msg.COLOUR_RGB_GREEN="verde",T.Msg.COLOUR_RGB_HELPURL="https://www.december.com/html/spec/colorpercompact.html",T.Msg.COLOUR_RGB_RED="vermelho",T.Msg.COLOUR_RGB_TITLE="pinte com",T.Msg.COLOUR_RGB_TOOLTIP="Cria uma cor de acordo com a quantidade especificada de vermelho, verde e azul. Todos os valores devem estar entre 0 e 100.",T.Msg.CONTROLS_FLOW_STATEMENTS_HELPURL="https://github.com/google/blockly/wiki/Loops#loop-termination-blocks",T.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK="sair do ciclo",T.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE="continuar com a próxima iteração do ciclo",T.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK="Sair do ciclo que está contido.",T.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE="Ignorar o resto deste ciclo, e continuar com a próxima iteração.",T.Msg.CONTROLS_FLOW_STATEMENTS_WARNING="Aviso: Este bloco só pode ser usado dentro de um ciclo.",T.Msg.CONTROLS_FOREACH_HELPURL="https://github.com/google/blockly/wiki/Loops#for-each",T.Msg.CONTROLS_FOREACH_TITLE="para cada item %1 na lista %2",T.Msg.CONTROLS_FOREACH_TOOLTIP='Para cada item numa lista, define a variável "%1" para o item e então faz algumas instruções.',T.Msg.CONTROLS_FOR_HELPURL="https://github.com/google/blockly/wiki/Loops#count-with",T.Msg.CONTROLS_FOR_TITLE="contar com %1 de %2 até %3 por %4",T.Msg.CONTROLS_FOR_TOOLTIP='Faz com que a variável "%1" assuma os valores desde o número inicial até ao número final, contando de acordo com o intervalo especificado e executa os blocos especificados.',T.Msg.CONTROLS_IF_ELSEIF_TOOLTIP="Acrescente uma condição ao bloco se.",T.Msg.CONTROLS_IF_ELSE_TOOLTIP="Acrescente uma condição de excepação final para o bloco se.",T.Msg.CONTROLS_IF_HELPURL="https://github.com/google/blockly/wiki/IfElse",T.Msg.CONTROLS_IF_IF_TOOLTIP="Acrescente, remova ou reordene secções para reconfigurar este bloco se.",T.Msg.CONTROLS_IF_MSG_ELSE="senão",T.Msg.CONTROLS_IF_MSG_ELSEIF="senão se",T.Msg.CONTROLS_IF_MSG_IF="se",T.Msg.CONTROLS_IF_TOOLTIP_1="Se um valor é verdadeiro, então realize alguns passos.",T.Msg.CONTROLS_IF_TOOLTIP_2="Se um valor é verdadeiro, então realize o primeiro bloco de instruções.  Senão, realize o segundo bloco de instruções",T.Msg.CONTROLS_IF_TOOLTIP_3="Se o primeiro valor é verdadeiro, então realize o primeiro bloco de instruções.  Senão, se o segundo valor é verdadeiro, realize o segundo bloco de instruções.",T.Msg.CONTROLS_IF_TOOLTIP_4="Se o primeiro valor é verdadeiro, então realize o primeiro bloco de instruções.  Senão, se o segundo valor é verdadeiro, realize o segundo bloco de instruções.  Se nenhum dos blocos for verdadeiro, realize o último bloco de instruções.",T.Msg.CONTROLS_REPEAT_HELPURL="http://pt.wikipedia.org/wiki/Estrutura_de_repeti%C3%A7%C3%A3o#Repeti.C3.A7.C3.A3o_com_vari.C3.A1vel_de_controle",T.Msg.CONTROLS_REPEAT_INPUT_DO="faça",T.Msg.CONTROLS_REPEAT_TITLE="repetir %1 vez",T.Msg.CONTROLS_REPEAT_TOOLTIP="Faça algumas instruções várias vezes.",T.Msg.CONTROLS_WHILEUNTIL_HELPURL="https://github.com/google/blockly/wiki/Loops#repeat",T.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL="repetir até",T.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE="repetir enquanto",T.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL="Enquanto um valor for falso, então faça algumas instruções.",T.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE="Enquanto um valor for verdadeiro, então faça algumas instruções.",T.Msg.DELETE_ALL_BLOCKS="Eliminar todos os %1 blocos?",T.Msg.DELETE_BLOCK="Eliminar Bloco",T.Msg.DELETE_VARIABLE="Eliminar a variável '%1'",T.Msg.DELETE_VARIABLE_CONFIRMATION="Eliminar %1 utilizações da variável '%2'?",T.Msg.DELETE_X_BLOCKS="Eliminar %1 Blocos",T.Msg.DIALOG_CANCEL="Cancelar",T.Msg.DIALOG_OK="OK",T.Msg.DISABLE_BLOCK="Desativar Bloco",T.Msg.DUPLICATE_BLOCK="Duplicar",T.Msg.DUPLICATE_COMMENT="Duplicar comentário",T.Msg.ENABLE_BLOCK="Ativar Bloco",T.Msg.EXPAND_ALL="Expandir Blocos",T.Msg.EXPAND_BLOCK="Expandir Bloco",T.Msg.EXTERNAL_INPUTS="Entradas Externas",T.Msg.HELP="Ajuda",T.Msg.INLINE_INPUTS="Entradas Em Linhas",T.Msg.LISTS_CREATE_EMPTY_HELPURL="https://github.com/google/blockly/wiki/Lists#create-empty-list",T.Msg.LISTS_CREATE_EMPTY_TITLE="criar lista vazia",T.Msg.LISTS_CREATE_EMPTY_TOOLTIP="Retorna uma lista, de tamanho 0, contendo nenhum registo",T.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD="lista",T.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP="Acrescente, remova ou reordene as seções para reconfigurar este bloco lista.",T.Msg.LISTS_CREATE_WITH_HELPURL="https://github.com/google/blockly/wiki/Lists#create-list-with",T.Msg.LISTS_CREATE_WITH_INPUT_WITH="criar lista com",T.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP="Acrescenta um item à lista.",T.Msg.LISTS_CREATE_WITH_TOOLTIP="Cria uma lista com qualquer número de itens.",T.Msg.LISTS_GET_INDEX_FIRST="primeiro",T.Msg.LISTS_GET_INDEX_FROM_END="# a partir do final",T.Msg.LISTS_GET_INDEX_FROM_START="#",T.Msg.LISTS_GET_INDEX_GET="obter",T.Msg.LISTS_GET_INDEX_GET_REMOVE="obter e remover",T.Msg.LISTS_GET_INDEX_LAST="último",T.Msg.LISTS_GET_INDEX_RANDOM="aleatório",T.Msg.LISTS_GET_INDEX_REMOVE="remover",T.Msg.LISTS_GET_INDEX_TAIL="",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FIRST="Retorna o primeiro item de uma lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM="Retorna o item na posição especificada da lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_LAST="Retorna o último item de uma lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM="Retorna um item aleatório de uma lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST="Remove e retorna o primeiro item de uma lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM="Remove e retorna o item na posição especificada de uma lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST="Remove e retorna o último item de uma lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM="Remove e retorna um item aleatório de uma lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST="Remove o primeiro item de uma lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM="Remove o item de uma posição especifica da lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST="Remove o último item de uma lista.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM="Remove um item aleatório de uma lista.",T.Msg.LISTS_GET_SUBLIST_END_FROM_END="até #, a partir do final",T.Msg.LISTS_GET_SUBLIST_END_FROM_START="até #",T.Msg.LISTS_GET_SUBLIST_END_LAST="para o último",T.Msg.LISTS_GET_SUBLIST_HELPURL="https://github.com/google/blockly/wiki/Lists#getting-a-sublist",T.Msg.LISTS_GET_SUBLIST_START_FIRST="obtem sublista da primeira lista",T.Msg.LISTS_GET_SUBLIST_START_FROM_END="obtem sublista de # a partir do final",T.Msg.LISTS_GET_SUBLIST_START_FROM_START="obtem sublista de #",T.Msg.LISTS_GET_SUBLIST_TAIL="",T.Msg.LISTS_GET_SUBLIST_TOOLTIP="Cria uma cópia da porção especificada de uma lista.",T.Msg.LISTS_INDEX_FROM_END_TOOLTIP="%1 é o último item.",T.Msg.LISTS_INDEX_FROM_START_TOOLTIP="%1 é o primeiro item.",T.Msg.LISTS_INDEX_OF_FIRST="encontre a primeira ocorrência do item",T.Msg.LISTS_INDEX_OF_HELPURL="https://github.com/google/blockly/wiki/Lists#getting-items-from-a-list",T.Msg.LISTS_INDEX_OF_LAST="encontre a última ocorrência do item",T.Msg.LISTS_INDEX_OF_TOOLTIP="Retorna a posição da primeira/última ocorrência do item na lista.  Retorna %1 se o item não for encontrado.",T.Msg.LISTS_INLIST="na lista",T.Msg.LISTS_ISEMPTY_HELPURL="https://github.com/google/blockly/wiki/Lists#is-empty",T.Msg.LISTS_ISEMPTY_TITLE="%1 está vazia",T.Msg.LISTS_ISEMPTY_TOOLTIP="Retona verdadeiro se a lista estiver vazia.",T.Msg.LISTS_LENGTH_HELPURL="https://github.com/google/blockly/wiki/Lists#length-of",T.Msg.LISTS_LENGTH_TITLE="tamanho de %1",T.Msg.LISTS_LENGTH_TOOLTIP="Retorna o tamanho de uma lista.",T.Msg.LISTS_REPEAT_HELPURL="https://github.com/google/blockly/wiki/Lists#create-list-with",T.Msg.LISTS_REPEAT_TITLE="criar lista com o item %1 repetido %2 vezes",T.Msg.LISTS_REPEAT_TOOLTIP="Cria uma lista constituída por um dado valor repetido o número de vezes especificado.",T.Msg.LISTS_REVERSE_HELPURL="https://github.com/google/blockly/wiki/Lists#reversing-a-list",T.Msg.LISTS_REVERSE_MESSAGE0="inverter %1",T.Msg.LISTS_REVERSE_TOOLTIP="Inverter uma cópia da lista.",T.Msg.LISTS_SET_INDEX_HELPURL="https://github.com/google/blockly/wiki/Lists#in-list--set",T.Msg.LISTS_SET_INDEX_INPUT_TO="como",T.Msg.LISTS_SET_INDEX_INSERT="inserir em",T.Msg.LISTS_SET_INDEX_SET="definir",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST="Insere o item no início da lista.",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM="Insere o item numa posição especificada numa lista.",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST="Insere o item no final da lista.",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM="Insere o item numa posição aleatória de uma lista.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST="Define o primeiro item de uma lista.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM="Define o item na posição especificada de uma lista.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST="Define o último item de uma lista.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM="Define um item aleatório de uma lista.",T.Msg.LISTS_SORT_HELPURL="https://github.com/google/blockly/wiki/Lists#sorting-a-list",T.Msg.LISTS_SORT_ORDER_ASCENDING="ascendente",T.Msg.LISTS_SORT_ORDER_DESCENDING="descendente",T.Msg.LISTS_SORT_TITLE="ordenar %1 %2 %3",T.Msg.LISTS_SORT_TOOLTIP="Ordenar uma cópia de uma lista.",T.Msg.LISTS_SORT_TYPE_IGNORECASE="alfabética, ignorar maiúsculas/minúsculas",T.Msg.LISTS_SORT_TYPE_NUMERIC="numérica",T.Msg.LISTS_SORT_TYPE_TEXT="alfabética",T.Msg.LISTS_SPLIT_HELPURL="https://github.com/google/blockly/wiki/Lists#splitting-strings-and-joining-lists",T.Msg.LISTS_SPLIT_LIST_FROM_TEXT="fazer lista a partir de texto",T.Msg.LISTS_SPLIT_TEXT_FROM_LIST="fazer texto a partir da lista",T.Msg.LISTS_SPLIT_TOOLTIP_JOIN="Juntar uma lista de textos num único texto, separado por um delimitador.",T.Msg.LISTS_SPLIT_TOOLTIP_SPLIT="Dividir o texto numa lista de textos, separando-o em cada delimitador.",T.Msg.LISTS_SPLIT_WITH_DELIMITER="com delimitador",T.Msg.LOGIC_BOOLEAN_FALSE="falso",T.Msg.LOGIC_BOOLEAN_HELPURL="https://github.com/google/blockly/wiki/Logic#values",T.Msg.LOGIC_BOOLEAN_TOOLTIP="Retorna verdadeiro ou falso.",T.Msg.LOGIC_BOOLEAN_TRUE="verdadeiro",T.Msg.LOGIC_COMPARE_HELPURL="http://pt.wikipedia.org/wiki/Inequa%C3%A7%C3%A3o",T.Msg.LOGIC_COMPARE_TOOLTIP_EQ="Retorna verdadeiro se ambas as entradas forem iguais entre si.",T.Msg.LOGIC_COMPARE_TOOLTIP_GT="Retorna verdadeiro se a primeira entrada for maior que a segunda entrada.",T.Msg.LOGIC_COMPARE_TOOLTIP_GTE="Retorna verdadeiro se a primeira entrada for maior ou igual à segunda entrada.",T.Msg.LOGIC_COMPARE_TOOLTIP_LT="Retorna verdadeiro se a primeira entrada for menor que a segunda entrada.",T.Msg.LOGIC_COMPARE_TOOLTIP_LTE="Retorna verdadeiro se a primeira entrada for menor ou igual à segunda entrada.",T.Msg.LOGIC_COMPARE_TOOLTIP_NEQ="Retorna verdadeiro se ambas as entradas forem diferentes entre si.",T.Msg.LOGIC_NEGATE_HELPURL="https://github.com/google/blockly/wiki/Logic#not",T.Msg.LOGIC_NEGATE_TITLE="não %1",T.Msg.LOGIC_NEGATE_TOOLTIP="Retorna verdadeiro se a entrada for falsa.  Retorna falso se a entrada for verdadeira.",T.Msg.LOGIC_NULL="nulo",T.Msg.LOGIC_NULL_HELPURL="http://en.wikipedia.org/wiki/Nullable_type",T.Msg.LOGIC_NULL_TOOLTIP="Retorna nulo.",T.Msg.LOGIC_OPERATION_AND="e",T.Msg.LOGIC_OPERATION_HELPURL="https://github.com/google/blockly/wiki/Logic#logical-operations",T.Msg.LOGIC_OPERATION_OR="ou",T.Msg.LOGIC_OPERATION_TOOLTIP_AND="Retorna verdadeiro se ambas as entradas forem verdadeiras.",T.Msg.LOGIC_OPERATION_TOOLTIP_OR="Retorna verdadeiro se pelo menos uma das estradas for verdadeira.",T.Msg.LOGIC_TERNARY_CONDITION="teste",T.Msg.LOGIC_TERNARY_HELPURL="http://en.wikipedia.org/wiki/%3F:",T.Msg.LOGIC_TERNARY_IF_FALSE="se falso",T.Msg.LOGIC_TERNARY_IF_TRUE="se verdadeiro",T.Msg.LOGIC_TERNARY_TOOLTIP='Avalia a condição em "teste". Se a condição for verdadeira retorna o valor "se verdadeiro", senão retorna o valor "se falso".',T.Msg.MATH_ADDITION_SYMBOL="+",T.Msg.MATH_ARITHMETIC_HELPURL="http://pt.wikipedia.org/wiki/Aritm%C3%A9tica",T.Msg.MATH_ARITHMETIC_TOOLTIP_ADD="Retorna a soma de dois números.",T.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE="Retorna o quociente da divisão de dois números.",T.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS="Retorna a diferença de dois números.",T.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY="Retorna o produto de dois números.",T.Msg.MATH_ARITHMETIC_TOOLTIP_POWER="Retorna o primeiro número elevado à potência do segundo número.",T.Msg.MATH_ATAN2_HELPURL="https://en.wikipedia.org/wiki/Atan2",T.Msg.MATH_ATAN2_TITLE="atan2 de X:%1 Y:%2",T.Msg.MATH_ATAN2_TOOLTIP="Devolver o arco tangente do ponto (X, Y) em graus entre -180 e 180.",T.Msg.MATH_CHANGE_HELPURL="http://pt.wikipedia.org/wiki/Adi%C3%A7%C3%A3o",T.Msg.MATH_CHANGE_TITLE="alterar %1 por %2",T.Msg.MATH_CHANGE_TOOLTIP='Soma um número à variável "%1".',T.Msg.MATH_CONSTANT_HELPURL="http://pt.wikipedia.org/wiki/Anexo:Lista_de_constantes_matem%C3%A1ticas",T.Msg.MATH_CONSTANT_TOOLTIP="Retorna uma das constantes comuns: π (3.141…), e (2.718…), φ (1.618…), sqrt(2) (1.414…), sqrt(½) (0.707…), ou ∞ (infinito).",T.Msg.MATH_CONSTRAIN_HELPURL="https://en.wikipedia.org/wiki/Clamping_(graphics)",T.Msg.MATH_CONSTRAIN_TITLE="restringe %1 inferior %2 superior %3",T.Msg.MATH_CONSTRAIN_TOOLTIP="Restringe um número entre os limites especificados (inclusive).",T.Msg.MATH_DIVISION_SYMBOL="÷",T.Msg.MATH_IS_DIVISIBLE_BY="é divisível por",T.Msg.MATH_IS_EVEN="é par",T.Msg.MATH_IS_NEGATIVE="é negativo",T.Msg.MATH_IS_ODD="é impar",T.Msg.MATH_IS_POSITIVE="é positivo",T.Msg.MATH_IS_PRIME="é primo",T.Msg.MATH_IS_TOOLTIP="Verifica se um número é par, impar, primo, inteiro, positivo, negativo, ou se é divisível por outro número.  Retorna verdadeiro ou falso.",T.Msg.MATH_IS_WHOLE="é inteiro",T.Msg.MATH_MODULO_HELPURL="http://pt.wikipedia.org/wiki/Opera%C3%A7%C3%A3o_m%C3%B3dulo",T.Msg.MATH_MODULO_TITLE="resto da divisão de %1 ÷ %2",T.Msg.MATH_MODULO_TOOLTIP="Retorna o resto da divisão de dois números.",T.Msg.MATH_MULTIPLICATION_SYMBOL="×",T.Msg.MATH_NUMBER_HELPURL="http://pt.wikipedia.org/wiki/N%C3%BAmero",T.Msg.MATH_NUMBER_TOOLTIP="Um número.",T.Msg.MATH_ONLIST_HELPURL="",T.Msg.MATH_ONLIST_OPERATOR_AVERAGE="média de uma lista",T.Msg.MATH_ONLIST_OPERATOR_MAX="maior de uma lista",T.Msg.MATH_ONLIST_OPERATOR_MEDIAN="mediana de uma lista",T.Msg.MATH_ONLIST_OPERATOR_MIN="menor de uma lista",T.Msg.MATH_ONLIST_OPERATOR_MODE="moda de uma lista",T.Msg.MATH_ONLIST_OPERATOR_RANDOM="item aleatório de uma lista",T.Msg.MATH_ONLIST_OPERATOR_STD_DEV="desvio padrão de uma lista",T.Msg.MATH_ONLIST_OPERATOR_SUM="soma da lista",T.Msg.MATH_ONLIST_TOOLTIP_AVERAGE="Retorna a média aritmética dos valores números da lista.",T.Msg.MATH_ONLIST_TOOLTIP_MAX="Retorna o maior número da lista.",T.Msg.MATH_ONLIST_TOOLTIP_MEDIAN="Retorna a mediana da lista.",T.Msg.MATH_ONLIST_TOOLTIP_MIN="Retorna o menor número da lista.",T.Msg.MATH_ONLIST_TOOLTIP_MODE="Retorna a lista de item(ns) mais comum(ns) da lista.",T.Msg.MATH_ONLIST_TOOLTIP_RANDOM="Retorna um elemento aleatório da lista.",T.Msg.MATH_ONLIST_TOOLTIP_STD_DEV="Retorna o desvio padrão dos números da lista.",T.Msg.MATH_ONLIST_TOOLTIP_SUM="Retorna a soma de todos os números da lista.",T.Msg.MATH_POWER_SYMBOL="^",T.Msg.MATH_RANDOM_FLOAT_HELPURL="http://pt.wikipedia.org/wiki/N%C3%BAmero_aleat%C3%B3rio",T.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM="fração aleatória",T.Msg.MATH_RANDOM_FLOAT_TOOLTIP="Insere uma fração aleatória entre 0.0 (inclusive) e 1.0 (exclusive).",T.Msg.MATH_RANDOM_INT_HELPURL="http://pt.wikipedia.org/wiki/N%C3%BAmero_aleat%C3%B3rio",T.Msg.MATH_RANDOM_INT_TITLE="inteiro aleatório entre %1 e %2",T.Msg.MATH_RANDOM_INT_TOOLTIP="Retorna um número inteiro entre os dois limites especificados, inclusive.",T.Msg.MATH_ROUND_HELPURL="http://pt.wikipedia.org/wiki/Arredondamento",T.Msg.MATH_ROUND_OPERATOR_ROUND="arredonda",T.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN="arredonda para baixo",T.Msg.MATH_ROUND_OPERATOR_ROUNDUP="arredonda para cima",T.Msg.MATH_ROUND_TOOLTIP="Arredonda um número para cima ou para baixo.",T.Msg.MATH_SINGLE_HELPURL="http://pt.wikipedia.org/wiki/Raiz_quadrada",T.Msg.MATH_SINGLE_OP_ABSOLUTE="absoluto",T.Msg.MATH_SINGLE_OP_ROOT="raíz quadrada",T.Msg.MATH_SINGLE_TOOLTIP_ABS="Retorna o valor absoluto de um número.",T.Msg.MATH_SINGLE_TOOLTIP_EXP="Retorna o número e elevado à potência de um número.",T.Msg.MATH_SINGLE_TOOLTIP_LN="Retorna o logarítmo natural de um número.",T.Msg.MATH_SINGLE_TOOLTIP_LOG10="Retorna o logarítmo em base 10 de um número.",T.Msg.MATH_SINGLE_TOOLTIP_NEG="Retorna o oposto de um número.",T.Msg.MATH_SINGLE_TOOLTIP_POW10="Retorna 10 elevado à potência de um número.",T.Msg.MATH_SINGLE_TOOLTIP_ROOT="Retorna a raiz quadrada de um número.",T.Msg.MATH_SUBTRACTION_SYMBOL="-",T.Msg.MATH_TRIG_ACOS="acos",T.Msg.MATH_TRIG_ASIN="asin",T.Msg.MATH_TRIG_ATAN="atan",T.Msg.MATH_TRIG_COS="cos",T.Msg.MATH_TRIG_HELPURL="http://pt.wikipedia.org/wiki/Fun%C3%A7%C3%A3o_trigonom%C3%A9trica",T.Msg.MATH_TRIG_SIN="sin",T.Msg.MATH_TRIG_TAN="tan",T.Msg.MATH_TRIG_TOOLTIP_ACOS="Retorna o arco cosseno de um número.",T.Msg.MATH_TRIG_TOOLTIP_ASIN="Retorna o arco seno de um número.",T.Msg.MATH_TRIG_TOOLTIP_ATAN="Retorna o arco tangente de um número.",T.Msg.MATH_TRIG_TOOLTIP_COS="Retorna o cosseno de um grau (não radiano).",T.Msg.MATH_TRIG_TOOLTIP_SIN="Retorna o seno de um grau (não radiano).",T.Msg.MATH_TRIG_TOOLTIP_TAN="Retorna a tangente de um grau (não radiano).",T.Msg.NEW_COLOUR_VARIABLE="Criar variável colorida...",T.Msg.NEW_NUMBER_VARIABLE="Criar variável numérica...",T.Msg.NEW_STRING_VARIABLE="Criar variável de segmentos de texto...",T.Msg.NEW_VARIABLE="Criar variável…",T.Msg.NEW_VARIABLE_TITLE="Nome da nova variável:",T.Msg.NEW_VARIABLE_TYPE_TITLE="Tipo da nova variável:",T.Msg.ORDINAL_NUMBER_SUFFIX="",T.Msg.PROCEDURES_ALLOW_STATEMENTS="permitir declarações",T.Msg.PROCEDURES_BEFORE_PARAMS="com:",T.Msg.PROCEDURES_CALLNORETURN_HELPURL="https://pt.wikipedia.org/wiki/Sub-rotina",T.Msg.PROCEDURES_CALLNORETURN_TOOLTIP='Executa a função "%1".',T.Msg.PROCEDURES_CALLRETURN_HELPURL="https://pt.wikipedia.org/wiki/Sub-rotina",T.Msg.PROCEDURES_CALLRETURN_TOOLTIP='Executa a função "%1" e usa o seu retorno.',T.Msg.PROCEDURES_CALL_BEFORE_PARAMS="com:",T.Msg.PROCEDURES_CREATE_DO='Criar "%1"',T.Msg.PROCEDURES_DEFNORETURN_COMMENT="Descreva esta função...",T.Msg.PROCEDURES_DEFNORETURN_DO="",T.Msg.PROCEDURES_DEFNORETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_DEFNORETURN_PROCEDURE="faz algo",T.Msg.PROCEDURES_DEFNORETURN_TITLE="para",T.Msg.PROCEDURES_DEFNORETURN_TOOLTIP="Cria uma função que não tem retorno.",T.Msg.PROCEDURES_DEFRETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_DEFRETURN_RETURN="retorna",T.Msg.PROCEDURES_DEFRETURN_TOOLTIP="Cria uma função que possui um valor de retorno.",T.Msg.PROCEDURES_DEF_DUPLICATE_WARNING="Aviso: Esta função tem parâmetros duplicados.",T.Msg.PROCEDURES_HIGHLIGHT_DEF="Destacar definição da função",T.Msg.PROCEDURES_IFRETURN_HELPURL="http://c2.com/cgi/wiki?GuardClause",T.Msg.PROCEDURES_IFRETURN_TOOLTIP="se o valor é verdadeiro, então retorna um segundo valor.",T.Msg.PROCEDURES_IFRETURN_WARNING="Aviso: Este bloco só pode ser utilizado dentro da definição de uma função.",T.Msg.PROCEDURES_MUTATORARG_TITLE="nome da entrada:",T.Msg.PROCEDURES_MUTATORARG_TOOLTIP="Adicionar uma entrada para a função.",T.Msg.PROCEDURES_MUTATORCONTAINER_TITLE="entradas",T.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP="Adicionar, remover ou reordenar as entradas para esta função.",T.Msg.REDO="Refazer",T.Msg.REMOVE_COMMENT="Remover Comentário",T.Msg.RENAME_VARIABLE="Renomear variável...",T.Msg.RENAME_VARIABLE_TITLE="Renomear todas as variáveis '%1' para:",T.Msg.TEXT_APPEND_HELPURL="https://github.com/google/blockly/wiki/Text#text-modification",T.Msg.TEXT_APPEND_TITLE="para %1 acrescentar texto %2",T.Msg.TEXT_APPEND_TOOLTIP='Acrescentar um pedaço de texto à variável "%1".',T.Msg.TEXT_CHANGECASE_HELPURL="https://github.com/google/blockly/wiki/Text#adjusting-text-case",T.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE="para minúsculas",T.Msg.TEXT_CHANGECASE_OPERATOR_TITLECASE="para Iniciais Maiúsculas",T.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE="para MAIÚSCULAS",T.Msg.TEXT_CHANGECASE_TOOLTIP="Retorna uma cópia do texto em formato diferente.",T.Msg.TEXT_CHARAT_FIRST="obter primeira letra",T.Msg.TEXT_CHARAT_FROM_END="obter letra nº a partir do final",T.Msg.TEXT_CHARAT_FROM_START="obter letra nº",T.Msg.TEXT_CHARAT_HELPURL="https://github.com/google/blockly/wiki/Text#extracting-text",T.Msg.TEXT_CHARAT_LAST="obter última letra",T.Msg.TEXT_CHARAT_RANDOM="obter letra aleatória",T.Msg.TEXT_CHARAT_TAIL="",T.Msg.TEXT_CHARAT_TITLE="no texto %1 %2",T.Msg.TEXT_CHARAT_TOOLTIP="Retorna a letra na posição especificada.",T.Msg.TEXT_COUNT_HELPURL="https://github.com/google/blockly/wiki/Text#counting-substrings",T.Msg.TEXT_COUNT_MESSAGE0="contar %1 em %2",T.Msg.TEXT_COUNT_TOOLTIP="Conte quantas vezes um certo texto aparece dentro de algum outro texto.",T.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP="Acrescentar um item ao texto.",T.Msg.TEXT_CREATE_JOIN_TITLE_JOIN="unir",T.Msg.TEXT_CREATE_JOIN_TOOLTIP="Acrescenta, remove ou reordena seções para reconfigurar este bloco de texto.",T.Msg.TEXT_GET_SUBSTRING_END_FROM_END="até letra nº a partir do final",T.Msg.TEXT_GET_SUBSTRING_END_FROM_START="até letra nº",T.Msg.TEXT_GET_SUBSTRING_END_LAST="até última letra",T.Msg.TEXT_GET_SUBSTRING_HELPURL="https://github.com/google/blockly/wiki/Text#extracting-a-region-of-text",T.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT="no texto",T.Msg.TEXT_GET_SUBSTRING_START_FIRST="obter subsequência a partir da primeira letra",T.Msg.TEXT_GET_SUBSTRING_START_FROM_END="obter subsequência de tamanho # a partir do final",T.Msg.TEXT_GET_SUBSTRING_START_FROM_START="obter subsequência de tamanho #",T.Msg.TEXT_GET_SUBSTRING_TAIL="",T.Msg.TEXT_GET_SUBSTRING_TOOLTIP="Retorna a parte especificada do texto.",T.Msg.TEXT_INDEXOF_HELPURL="https://github.com/google/blockly/wiki/Text#finding-text",T.Msg.TEXT_INDEXOF_OPERATOR_FIRST="primeira ocorrência do texto",T.Msg.TEXT_INDEXOF_OPERATOR_LAST="última ocorrência do texto",T.Msg.TEXT_INDEXOF_TITLE="no texto %1 %2 %3",T.Msg.TEXT_INDEXOF_TOOLTIP="Retorna a posição da primeira/última ocorrência do primeiro texto no segundo texto. Retorna %1 se o texto não for encontrado.",T.Msg.TEXT_ISEMPTY_HELPURL="https://github.com/google/blockly/wiki/Text#checking-for-empty-text",T.Msg.TEXT_ISEMPTY_TITLE="%1 está vazio",T.Msg.TEXT_ISEMPTY_TOOLTIP="Retorna verdadeiro se o texto fornecido estiver vazio.",T.Msg.TEXT_JOIN_HELPURL="https://github.com/google/blockly/wiki/Text#text-creation",T.Msg.TEXT_JOIN_TITLE_CREATEWITH="criar texto com",T.Msg.TEXT_JOIN_TOOLTIP="Criar um pedaço de texto juntando qualquer número de itens.",T.Msg.TEXT_LENGTH_HELPURL="https://github.com/google/blockly/wiki/Text#text-modification",T.Msg.TEXT_LENGTH_TITLE="tamanho de %1",T.Msg.TEXT_LENGTH_TOOLTIP="Devolve o número de letras (incluindo espaços) do texto fornecido.",T.Msg.TEXT_PRINT_HELPURL="https://github.com/google/blockly/wiki/Text#printing-text",T.Msg.TEXT_PRINT_TITLE="imprime %1",T.Msg.TEXT_PRINT_TOOLTIP="Imprime o texto, número ou outro valor especificado.",T.Msg.TEXT_PROMPT_HELPURL="https://github.com/google/blockly/wiki/Text#getting-input-from-the-user",T.Msg.TEXT_PROMPT_TOOLTIP_NUMBER="Pede ao utilizador um número.",T.Msg.TEXT_PROMPT_TOOLTIP_TEXT="Pede ao utilizador um texto.",T.Msg.TEXT_PROMPT_TYPE_NUMBER="pede um número com a mensagem",T.Msg.TEXT_PROMPT_TYPE_TEXT="Pede um texto com a mensagem",T.Msg.TEXT_REPLACE_HELPURL="https://github.com/google/blockly/wiki/Text#replacing-substrings",T.Msg.TEXT_REPLACE_MESSAGE0="substituir %1 por %2 em %3",T.Msg.TEXT_REPLACE_TOOLTIP="Substituir todas as ocorrências de um certo texto dentro de algum outro texto.",T.Msg.TEXT_REVERSE_HELPURL="https://github.com/google/blockly/wiki/Text#reversing-text",T.Msg.TEXT_REVERSE_MESSAGE0="inverter %1",T.Msg.TEXT_REVERSE_TOOLTIP="Inverte a ordem dos caracteres no texto.",T.Msg.TEXT_TEXT_HELPURL="http://pt.wikipedia.org/wiki/Cadeia_de_caracteres",T.Msg.TEXT_TEXT_TOOLTIP="Uma letra, palavra ou linha de texto.",T.Msg.TEXT_TRIM_HELPURL="https://github.com/google/blockly/wiki/Text#trimming-removing-spaces",T.Msg.TEXT_TRIM_OPERATOR_BOTH="remover espaços de ambos os lados",T.Msg.TEXT_TRIM_OPERATOR_LEFT="remover espaços à esquerda de",T.Msg.TEXT_TRIM_OPERATOR_RIGHT="remover espaços à direita",T.Msg.TEXT_TRIM_TOOLTIP="Retorna uma cópia do texto com os espaços removidos de uma ou ambas as extremidades.",T.Msg.TODAY="Hoje",T.Msg.UNDO="Desfazer",T.Msg.UNNAMED_KEY="sem nome",T.Msg.VARIABLES_DEFAULT_NAME="item",T.Msg.VARIABLES_GET_CREATE_SET='Criar "definir %1"',T.Msg.VARIABLES_GET_HELPURL="https://github.com/google/blockly/wiki/Variables#get",T.Msg.VARIABLES_GET_TOOLTIP="Retorna o valor desta variável.",T.Msg.VARIABLES_SET="definir %1 para %2",T.Msg.VARIABLES_SET_CREATE_GET='Criar "obter %1"',T.Msg.VARIABLES_SET_HELPURL="https://github.com/google/blockly/wiki/Variables#set",T.Msg.VARIABLES_SET_TOOLTIP="Define esta variável para o valor inserido.",T.Msg.VARIABLE_ALREADY_EXISTS="Já existe uma variável com o nome de '%1'.",T.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE="Já existe uma variável chamada '%1' para outra do tipo: '%2'.",T.Msg.VARIABLE_ALREADY_EXISTS_FOR_A_PARAMETER="A variable named '%1' already exists as a parameter in the procedure '%2'.",T.Msg.WORKSPACE_ARIA_LABEL="Espaço de trabalho de Blockly",T.Msg.WORKSPACE_COMMENT_DEFAULT_TEXT="Diz algo...",T.Msg.CONTROLS_FOREACH_INPUT_DO=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.CONTROLS_FOR_INPUT_DO=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF=T.Msg.CONTROLS_IF_MSG_ELSEIF,T.Msg.CONTROLS_IF_ELSE_TITLE_ELSE=T.Msg.CONTROLS_IF_MSG_ELSE,T.Msg.CONTROLS_IF_IF_TITLE_IF=T.Msg.CONTROLS_IF_MSG_IF,T.Msg.CONTROLS_IF_MSG_THEN=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.CONTROLS_WHILEUNTIL_INPUT_DO=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.LISTS_CREATE_WITH_ITEM_TITLE=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.LISTS_GET_INDEX_HELPURL=T.Msg.LISTS_INDEX_OF_HELPURL,T.Msg.LISTS_GET_INDEX_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.LISTS_INDEX_OF_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.LISTS_SET_INDEX_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.MATH_CHANGE_TITLE_ITEM=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.PROCEDURES_DEFRETURN_COMMENT=T.Msg.PROCEDURES_DEFNORETURN_COMMENT,T.Msg.PROCEDURES_DEFRETURN_DO=T.Msg.PROCEDURES_DEFNORETURN_DO,T.Msg.PROCEDURES_DEFRETURN_PROCEDURE=T.Msg.PROCEDURES_DEFNORETURN_PROCEDURE,T.Msg.PROCEDURES_DEFRETURN_TITLE=T.Msg.PROCEDURES_DEFNORETURN_TITLE,T.Msg.TEXT_APPEND_VARIABLE=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.LOGIC_HUE="210",T.Msg.LOOPS_HUE="120",T.Msg.MATH_HUE="230",T.Msg.TEXTS_HUE="160",T.Msg.LISTS_HUE="260",T.Msg.COLOUR_HUE="20",T.Msg.VARIABLES_HUE="330",T.Msg.VARIABLES_DYNAMIC_HUE="310",T.Msg.PROCEDURES_HUE="290",T.Msg})?_.apply(e,o):_)||(T.exports=a)}}]);