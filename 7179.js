(self.webpackChunkcoding_with_chrome=self.webpackChunkcoding_with_chrome||[]).push([[7179],{57179:function(T,_){var E,s,O;s=[],void 0===(O="function"==typeof(E=function(){"use strict";var T=T||{Msg:Object.create(null)};return T.Msg.ADD_COMMENT="Фекер өҫтәргә",T.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE="Can't delete the variable '%1' because it's part of the definition of the function '%2'",T.Msg.CHANGE_VALUE_TITLE="Мәғәнәне үҙгәртегеҙ:",T.Msg.CLEAN_UP="Блоктарҙы таҙартырға",T.Msg.COLLAPSED_WARNINGS_WARNING="Collapsed blocks contain warnings.",T.Msg.COLLAPSE_ALL="Блоктарҙы төрөргә",T.Msg.COLLAPSE_BLOCK="Блокты төрөргә",T.Msg.COLOUR_BLEND_COLOUR1="1-се төҫ",T.Msg.COLOUR_BLEND_COLOUR2="2-се төҫ",T.Msg.COLOUR_BLEND_HELPURL="https://meyerweb.com/eric/tools/color-blend/#:::rgbp",T.Msg.COLOUR_BLEND_RATIO="1-се төҫтөң өлөшө",T.Msg.COLOUR_BLEND_TITLE="ҡатнаштырырға",T.Msg.COLOUR_BLEND_TOOLTIP="Ике төҫтө бирелгән нисбәттә болғата (0.0 - 1.0).",T.Msg.COLOUR_PICKER_HELPURL="https://en.wikipedia.org/wiki/Төҫ",T.Msg.COLOUR_PICKER_TOOLTIP="Палитранан төҫ һайлағыҙ.",T.Msg.COLOUR_RANDOM_HELPURL="http://randomcolour.com",T.Msg.COLOUR_RANDOM_TITLE="осраҡлы төҫ",T.Msg.COLOUR_RANDOM_TOOLTIP="Төҫтө осраҡлылыҡ буйынса һайлай.",T.Msg.COLOUR_RGB_BLUE="зәңгәр",T.Msg.COLOUR_RGB_GREEN="йәшелдән",T.Msg.COLOUR_RGB_HELPURL="https://www.december.com/html/spec/colorpercompact.html",T.Msg.COLOUR_RGB_RED="ҡыҙылдан",T.Msg.COLOUR_RGB_TITLE="ошонан төҫ",T.Msg.COLOUR_RGB_TOOLTIP="Бирелгән нисбәттәрҙә ҡыҙылдан, йәшелдән һәм зәңгәрҙән төҫ барлыҡҡа килә. Бөтә мәғәнәләр 0 менән 100 араһында булырға тейеш.",T.Msg.CONTROLS_FLOW_STATEMENTS_HELPURL="https://github.com/google/blockly/wiki/Loops#loop-termination-blocks",T.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK="циклдан сығырға",T.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE="циклдың киләһе аҙымына күсергә",T.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK="Был циклды өҙә.",T.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE="Циклдың ҡалдығын төшөрөп ҡалдыра һәм киләһе аҙымға күсә.",T.Msg.CONTROLS_FLOW_STATEMENTS_WARNING="Иҫкәртеү: был блок цикл эсендә генә ҡулланыла ала.",T.Msg.CONTROLS_FOREACH_HELPURL="https://github.com/google/blockly/wiki/Loops#for-each",T.Msg.CONTROLS_FOREACH_TITLE="һәр элемент өсөн %1 исемлектә %2",T.Msg.CONTROLS_FOREACH_TOOLTIP="Исемлектәге һәр элемент өсөн үҙгәреүсәнгә элементтың '%1' мәғәнәһен бирә һәм күрһәтелгән командаларҙы үтәй.",T.Msg.CONTROLS_FOR_HELPURL="https://github.com/google/blockly/wiki/Loops#count-with",T.Msg.CONTROLS_FOR_TITLE="count with %1 from %2 to %3 by %4",T.Msg.CONTROLS_FOR_TOOLTIP="Үҙгәреүсәнгә башынан аҙағына тиклем тәғәйен аҙым менән %1 мәғәнәне бирә һәм күрһәтелгән командаларҙы үтәй.",T.Msg.CONTROLS_IF_ELSEIF_TOOLTIP='"Әгәр" блогына шарт өҫтәй',T.Msg.CONTROLS_IF_ELSE_TOOLTIP="Бер шарт та дөрөҫ булмаған осраҡҡа йомғаҡлау ярҙамсы блогын өҫтәргә.",T.Msg.CONTROLS_IF_HELPURL="https://github.com/google/blockly/wiki/IfElse",T.Msg.CONTROLS_IF_IF_TOOLTIP='"Әгәр" блогын ҡабаттан төҙөү өсөн киҫәктәрҙе өҫтәгеҙ, юйҙырығыҙ, урындарын алмаштырығыҙ.',T.Msg.CONTROLS_IF_MSG_ELSE="юғиһә",T.Msg.CONTROLS_IF_MSG_ELSEIF="юғиһә, әгәр",T.Msg.CONTROLS_IF_MSG_IF="әгәр",T.Msg.CONTROLS_IF_TOOLTIP_1="Мәғәнә дөрөҫ булғанда, командаларҙы үтәй.",T.Msg.CONTROLS_IF_TOOLTIP_2="Шарт дөрөҫ булғанда, командаларҙың беренсе блогын үтәй. Улай булмаһа, командаларҙың икенсе блогы үтәлә.",T.Msg.CONTROLS_IF_TOOLTIP_3="Беренсе шарт дөрөҫ булһа, командаларҙың беренсе блогын үтәй. Икенсе шарт дөрөҫ булһа, командаларҙың икенсе блогын үтәй.",T.Msg.CONTROLS_IF_TOOLTIP_4="Беренсе шарт дөрөҫ булһа, командаларҙың беренсе блогын үтәй. Әгәр икенсе шарт дөрөҫ булһа, командаларҙың икенсе блогын үтәй. Бер шарт та дөрөҫ булмаһа, команда блоктарының һуңғыһын үтәй.",T.Msg.CONTROLS_REPEAT_HELPURL="https://en.wikipedia.org/wiki/Цикл_(программалау)",T.Msg.CONTROLS_REPEAT_INPUT_DO="үтәргә",T.Msg.CONTROLS_REPEAT_TITLE=" %1 тапҡыр ҡабатларға",T.Msg.CONTROLS_REPEAT_TOOLTIP="Командаларҙы бер нисә тапҡыр үтәй.",T.Msg.CONTROLS_WHILEUNTIL_HELPURL="https://github.com/google/blockly/wiki/Loops#repeat",T.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL="ҡабатларға, әлегә юҡ",T.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE="ҡабатларға, әлегә",T.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL="Мәғәнә ялған булғанда, командаларҙы ҡабатлай.",T.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE="Мәғәнә дөрөҫ булғанда, командаларҙы ҡабатлай.",T.Msg.DELETE_ALL_BLOCKS="Бөтә %1 блоктарҙы юйырғамы?",T.Msg.DELETE_BLOCK="Блокты юйҙырырға",T.Msg.DELETE_VARIABLE="Delete the '%1' variable",T.Msg.DELETE_VARIABLE_CONFIRMATION="Delete %1 uses of the '%2' variable?",T.Msg.DELETE_X_BLOCKS=" %1 блокты юйҙырырға",T.Msg.DIALOG_CANCEL=" Баш тартыу",T.Msg.DIALOG_OK="Яҡшы",T.Msg.DISABLE_BLOCK="Блокты һүндерергә",T.Msg.DUPLICATE_BLOCK="Күсереп алырға",T.Msg.DUPLICATE_COMMENT="Duplicate Comment",T.Msg.ENABLE_BLOCK="Блокты тоҡандырырға",T.Msg.EXPAND_ALL="Блоктарҙы йәйергә",T.Msg.EXPAND_BLOCK="Блокты йәйергә",T.Msg.EXTERNAL_INPUTS="Тышҡы өҫтәлмә",T.Msg.HELP="Ярҙам",T.Msg.INLINE_INPUTS="Эске өҫтәлмә",T.Msg.LISTS_CREATE_EMPTY_HELPURL="https://github.com/google/blockly/wiki/Lists#create-empty-list",T.Msg.LISTS_CREATE_EMPTY_TITLE="create empty list",T.Msg.LISTS_CREATE_EMPTY_TOOLTIP="Returns a list, of length 0, containing no data records",T.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD="исемлек",T.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP="Add, remove, or reorder sections to reconfigure this list block.",T.Msg.LISTS_CREATE_WITH_HELPURL="https://github.com/google/blockly/wiki/Lists#create-list-with",T.Msg.LISTS_CREATE_WITH_INPUT_WITH="менән исемлек төҙөргә",T.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP="Add an item to the list.",T.Msg.LISTS_CREATE_WITH_TOOLTIP="Create a list with any number of items.",T.Msg.LISTS_GET_INDEX_FIRST="беренсе",T.Msg.LISTS_GET_INDEX_FROM_END="# аҙағынан",T.Msg.LISTS_GET_INDEX_FROM_START="#",T.Msg.LISTS_GET_INDEX_GET="алырға",T.Msg.LISTS_GET_INDEX_GET_REMOVE="алырға һәм юйырға",T.Msg.LISTS_GET_INDEX_LAST="аҙаҡҡы",T.Msg.LISTS_GET_INDEX_RANDOM="осраҡлы",T.Msg.LISTS_GET_INDEX_REMOVE="юйырға",T.Msg.LISTS_GET_INDEX_TAIL="",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FIRST="Returns the first item in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM="Returns the item at the specified position in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_LAST="Returns the last item in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM="Returns a random item in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST="Removes and returns the first item in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM="Removes and returns the item at the specified position in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST="Removes and returns the last item in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM="Removes and returns a random item in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST="Removes the first item in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM="Removes the item at the specified position in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST="Removes the last item in a list.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM="Removes a random item in a list.",T.Msg.LISTS_GET_SUBLIST_END_FROM_END="to # from end",T.Msg.LISTS_GET_SUBLIST_END_FROM_START="to #",T.Msg.LISTS_GET_SUBLIST_END_LAST="to last",T.Msg.LISTS_GET_SUBLIST_HELPURL="https://github.com/google/blockly/wiki/Lists#getting-a-sublist",T.Msg.LISTS_GET_SUBLIST_START_FIRST="get sub-list from first",T.Msg.LISTS_GET_SUBLIST_START_FROM_END="get sub-list from # from end",T.Msg.LISTS_GET_SUBLIST_START_FROM_START="get sub-list from #",T.Msg.LISTS_GET_SUBLIST_TAIL="",T.Msg.LISTS_GET_SUBLIST_TOOLTIP="Creates a copy of the specified portion of a list.",T.Msg.LISTS_INDEX_FROM_END_TOOLTIP="%1 is the last item.",T.Msg.LISTS_INDEX_FROM_START_TOOLTIP="%1 is the first item.",T.Msg.LISTS_INDEX_OF_FIRST="find first occurrence of item",T.Msg.LISTS_INDEX_OF_HELPURL="https://github.com/google/blockly/wiki/Lists#getting-items-from-a-list",T.Msg.LISTS_INDEX_OF_LAST="find last occurrence of item",T.Msg.LISTS_INDEX_OF_TOOLTIP="Returns the index of the first/last occurrence of the item in the list. Returns %1 if item is not found.",T.Msg.LISTS_INLIST="исемлеккә",T.Msg.LISTS_ISEMPTY_HELPURL="https://github.com/google/blockly/wiki/Lists#is-empty",T.Msg.LISTS_ISEMPTY_TITLE="%1 буш",T.Msg.LISTS_ISEMPTY_TOOLTIP="Returns true if the list is empty.",T.Msg.LISTS_LENGTH_HELPURL="https://github.com/google/blockly/wiki/Lists#length-of",T.Msg.LISTS_LENGTH_TITLE="оҙонлоғо %1",T.Msg.LISTS_LENGTH_TOOLTIP="Returns the length of a list.",T.Msg.LISTS_REPEAT_HELPURL="https://github.com/google/blockly/wiki/Lists#create-list-with",T.Msg.LISTS_REPEAT_TITLE="create list with item %1 repeated %2 times",T.Msg.LISTS_REPEAT_TOOLTIP="Creates a list consisting of the given value repeated the specified number of times.",T.Msg.LISTS_REVERSE_HELPURL="https://github.com/google/blockly/wiki/Lists#reversing-a-list",T.Msg.LISTS_REVERSE_MESSAGE0="reverse %1",T.Msg.LISTS_REVERSE_TOOLTIP="Reverse a copy of a list.",T.Msg.LISTS_SET_INDEX_HELPURL="https://github.com/google/blockly/wiki/Lists#in-list--set",T.Msg.LISTS_SET_INDEX_INPUT_TO="кеүек",T.Msg.LISTS_SET_INDEX_INSERT="өҫтәп ҡуйырға",T.Msg.LISTS_SET_INDEX_SET="йыйылма",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST="Inserts the item at the start of a list.",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM="Inserts the item at the specified position in a list.",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST="Append the item to the end of a list.",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM="Inserts the item randomly in a list.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST="Sets the first item in a list.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM="Sets the item at the specified position in a list.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST="Sets the last item in a list.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM="Sets a random item in a list.",T.Msg.LISTS_SORT_HELPURL="https://github.com/google/blockly/wiki/Lists#sorting-a-list",T.Msg.LISTS_SORT_ORDER_ASCENDING="ascending",T.Msg.LISTS_SORT_ORDER_DESCENDING="descending",T.Msg.LISTS_SORT_TITLE="sort %1 %2 %3",T.Msg.LISTS_SORT_TOOLTIP="Sort a copy of a list.",T.Msg.LISTS_SORT_TYPE_IGNORECASE="alphabetic, ignore case",T.Msg.LISTS_SORT_TYPE_NUMERIC="numeric",T.Msg.LISTS_SORT_TYPE_TEXT="alphabetic",T.Msg.LISTS_SPLIT_HELPURL="https://github.com/google/blockly/wiki/Lists#splitting-strings-and-joining-lists",T.Msg.LISTS_SPLIT_LIST_FROM_TEXT="make list from text",T.Msg.LISTS_SPLIT_TEXT_FROM_LIST="make text from list",T.Msg.LISTS_SPLIT_TOOLTIP_JOIN="Join a list of texts into one text, separated by a delimiter.",T.Msg.LISTS_SPLIT_TOOLTIP_SPLIT="Split text into a list of texts, breaking at each delimiter.",T.Msg.LISTS_SPLIT_WITH_DELIMITER="with delimiter",T.Msg.LOGIC_BOOLEAN_FALSE="ялған",T.Msg.LOGIC_BOOLEAN_HELPURL="https://github.com/google/blockly/wiki/Logic#values",T.Msg.LOGIC_BOOLEAN_TOOLTIP="Дөрөҫ йәки ялғанды ҡайтара.",T.Msg.LOGIC_BOOLEAN_TRUE="дөрөҫ",T.Msg.LOGIC_COMPARE_HELPURL="https://en.wikipedia.org/wiki/Inequality_(математика)",T.Msg.LOGIC_COMPARE_TOOLTIP_EQ="Өҫтәмәләр тигеҙ булһа, дөрөҫ мәғәнәһен кире ҡайтара.",T.Msg.LOGIC_COMPARE_TOOLTIP_GT="Беренсе өҫтәмә икенсеһенән ҙурыраҡ булһа, дөрөҫ мәғәнәһен кире ҡайтара.",T.Msg.LOGIC_COMPARE_TOOLTIP_GTE="Беренсе өҫтәмә икенсеһенән бәләкәйерәк йә уға тиң булһа, дөрөҫ мәғәнәһен кире ҡайтара.",T.Msg.LOGIC_COMPARE_TOOLTIP_LT="Беренсе өҫтәмә икенсеһенән бәләкәйерәк булһа, дөрөҫ мәғәнәһен кире ҡайтара.",T.Msg.LOGIC_COMPARE_TOOLTIP_LTE="Беренсе өҫтәмә икенсеһенән бәләкәйерәк йә уға тиң булһа, дөрөҫ мәғәнәһен кире ҡайтара.",T.Msg.LOGIC_COMPARE_TOOLTIP_NEQ="Өҫтәмәләр тигеҙ булмаһа, дөрөҫ мәғәнәһен кире ҡайтара.",T.Msg.LOGIC_NEGATE_HELPURL="https://github.com/google/blockly/wiki/Logic#not",T.Msg.LOGIC_NEGATE_TITLE="%1 түгел",T.Msg.LOGIC_NEGATE_TOOLTIP="Өҫтәлмә ялған булһа, дөрөҫ аңлатманы ҡайтара. Өҫтәлмә дөрөҫ булһа, ялған аңлатманы ҡайтара.",T.Msg.LOGIC_NULL="нуль",T.Msg.LOGIC_NULL_HELPURL="https://en.wikipedia.org/wiki/Nullable_type",T.Msg.LOGIC_NULL_TOOLTIP="Нулде ҡайтара.",T.Msg.LOGIC_OPERATION_AND="һәм",T.Msg.LOGIC_OPERATION_HELPURL="https://github.com/google/blockly/wiki/Logic#logical-operations",T.Msg.LOGIC_OPERATION_OR="йәки",T.Msg.LOGIC_OPERATION_TOOLTIP_AND="Әгәр ҙә ике өҫтәлмә лә тап килһә, дөрөҫ аңлатманы кире ҡайтара.",T.Msg.LOGIC_OPERATION_TOOLTIP_OR="Өҫтәлмәләрҙең береһе генә дөрөҫ булһа, дөрөҫ аңлатманы ҡайтара.",T.Msg.LOGIC_TERNARY_CONDITION="тест",T.Msg.LOGIC_TERNARY_HELPURL="https://en.wikipedia.org/wiki/%3F:",T.Msg.LOGIC_TERNARY_IF_FALSE="әгәр ялған булһа",T.Msg.LOGIC_TERNARY_IF_TRUE="әгәр дөрөҫ булһа",T.Msg.LOGIC_TERNARY_TOOLTIP="Һайлау шартын тикшерә. Әгәр ул дөрөҫ булһа, беренсе мәғәнәне, хата булһа, икенсе мәғәнәне ҡайтара.",T.Msg.MATH_ADDITION_SYMBOL="+",T.Msg.MATH_ARITHMETIC_HELPURL="https://ba.wikipedia.org/wiki/Арифметика",T.Msg.MATH_ARITHMETIC_TOOLTIP_ADD="Ике һандың суммаһын ҡайтара.",T.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE="Ике һандың бүлендеген ҡайтара.",T.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS="Ике һандың айырмаһын ҡайтара.",T.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY="Ике һандың ҡабатландығын ҡайтара.",T.Msg.MATH_ARITHMETIC_TOOLTIP_POWER="Дәрәжәгә күтәрелгән икенсе һандан тәүгеһенә ҡайтара.",T.Msg.MATH_ATAN2_HELPURL="https://en.wikipedia.org/wiki/Atan2",T.Msg.MATH_ATAN2_TITLE="atan2 of X:%1 Y:%2",T.Msg.MATH_ATAN2_TOOLTIP="Return the arctangent of point (X, Y) in degrees from -180 to 180.",T.Msg.MATH_CHANGE_HELPURL="https://ba.wikipedia.org/wiki/Programming_idiom#Incrementing_a_counter",T.Msg.MATH_CHANGE_TITLE="%1 тан %2 ҡа арттырырға",T.Msg.MATH_CHANGE_TOOLTIP="Үҙгәреүсән һанға өҫтәй '%1'.",T.Msg.MATH_CONSTANT_HELPURL="https://ba.wikipedia.org/wiki/Математик_константа",T.Msg.MATH_CONSTANT_TOOLTIP="Таралған константаның береһен күрһәтә: π (3.141...), e (2.718...), φ (1.618...), sqrt(2) (1.414...), sqrt(½) (0.707...) йәки ∞ (сикһеҙлек).",T.Msg.MATH_CONSTRAIN_HELPURL="https://en.wikipedia.org/wiki/Clamping_(graphics)",T.Msg.MATH_CONSTRAIN_TITLE="сикләргә %1 аҫтан %2 өҫтән %3",T.Msg.MATH_CONSTRAIN_TOOLTIP="Һанды аҫтан һәм өҫтән сикләй (сиктәгеләрен индереп).",T.Msg.MATH_DIVISION_SYMBOL="÷",T.Msg.MATH_IS_DIVISIBLE_BY="бүленә",T.Msg.MATH_IS_EVEN="тағы",T.Msg.MATH_IS_NEGATIVE="тиҫкәре",T.Msg.MATH_IS_ODD="сәйер",T.Msg.MATH_IS_POSITIVE="ыңғай",T.Msg.MATH_IS_PRIME="ябай",T.Msg.MATH_IS_TOOLTIP="Һандың йоп, таҡ, ябай, бөтөн, ыңғай, кире йәки билдәле һанға ҡарата ниндәй булыуын тикшерә. Дөрөҫ йә ялған мәғәнәһен күрһәтә.",T.Msg.MATH_IS_WHOLE="бөтөн",T.Msg.MATH_MODULO_HELPURL="https://ba.wikipedia.org/wiki/Ҡалдыҡ_менән_бүлеү",T.Msg.MATH_MODULO_TITLE="ҡалдыҡ %1 : %2 араһында",T.Msg.MATH_MODULO_TOOLTIP="Ике һанды бүлеү ҡалдығын күрһәтә.",T.Msg.MATH_MULTIPLICATION_SYMBOL="×",T.Msg.MATH_NUMBER_HELPURL="https://ba.wikipedia.org/wiki/Һан",T.Msg.MATH_NUMBER_TOOLTIP="Рәт.",T.Msg.MATH_ONLIST_HELPURL="",T.Msg.MATH_ONLIST_OPERATOR_AVERAGE="исемлектең уртаса арифметик дәүмәле",T.Msg.MATH_ONLIST_OPERATOR_MAX="исемлектәге иң ҙуры",T.Msg.MATH_ONLIST_OPERATOR_MEDIAN="исемлек медианаһы",T.Msg.MATH_ONLIST_OPERATOR_MIN="Исемлектәге иң бәләкәйе",T.Msg.MATH_ONLIST_OPERATOR_MODE="исемлек модалары",T.Msg.MATH_ONLIST_OPERATOR_RANDOM="исемлектең осраҡлы элементы",T.Msg.MATH_ONLIST_OPERATOR_STD_DEV="исемлекте стандарт кире ҡағыу",T.Msg.MATH_ONLIST_OPERATOR_SUM="исемлек суммаһы",T.Msg.MATH_ONLIST_TOOLTIP_AVERAGE="Исемлектең уртаса арифметик дәүмәле күрһәтә.",T.Msg.MATH_ONLIST_TOOLTIP_MAX="Исемлектең иң ҙур һанын  күрһәтә.",T.Msg.MATH_ONLIST_TOOLTIP_MEDIAN="Исемлек медианаһын күрһәтә.",T.Msg.MATH_ONLIST_TOOLTIP_MIN="Исемлектәге иң бәләкәй һанды күрһәтә.",T.Msg.MATH_ONLIST_TOOLTIP_MODE="Исемлектең иң күп осраған элементтарын күрһәтә.",T.Msg.MATH_ONLIST_TOOLTIP_RANDOM="Исемлектең осраҡлы элементын күрһәтә.",T.Msg.MATH_ONLIST_TOOLTIP_STD_DEV="Исемлекте стандарт кире ҡағыуҙы күрһәтә.",T.Msg.MATH_ONLIST_TOOLTIP_SUM="Исемлектәрҙәге һандар суммаһын күрһәтә.",T.Msg.MATH_POWER_SYMBOL="^",T.Msg.MATH_RANDOM_FLOAT_HELPURL="https://ba.wikipedia.org/wiki/Ялған осраҡлы_һандар_генераторы",T.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM="0 (үҙен дә индереп) һәм 1 араһындағы осраҡлы һан",T.Msg.MATH_RANDOM_FLOAT_TOOLTIP="Return a random fraction between 0.0 (inclusive) and 1.0 (exclusive).",T.Msg.MATH_RANDOM_INT_HELPURL="https://ba.wikipedia.org/wiki/Ялған осраҡлы_һандар_генераторы",T.Msg.MATH_RANDOM_INT_TITLE="%1-ҙән %2-гә тиклем осраҡлы бөтөн һан",T.Msg.MATH_RANDOM_INT_TOOLTIP="Ике бирелгән һан араһындағы (үҙҙәрен дә индереп) осраҡлы һанды күрһәтә.",T.Msg.MATH_ROUND_HELPURL="https://ba.wikipedia.org/wiki/Т=Түңәрәкләү",T.Msg.MATH_ROUND_OPERATOR_ROUND="түңәрәк",T.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN="бәләкәйгә тиклем түңәрәкләргә",T.Msg.MATH_ROUND_OPERATOR_ROUNDUP="ҙурына тиклем түңәрәкләргә",T.Msg.MATH_ROUND_TOOLTIP="Һанды ҙурына йә бәләкәйенә тиклем түңәрәкләргә.",T.Msg.MATH_SINGLE_HELPURL="https://ba.wikipedia.org/wiki/Квадрат_тамыр",T.Msg.MATH_SINGLE_OP_ABSOLUTE="абсолют",T.Msg.MATH_SINGLE_OP_ROOT="квадрат тамыр",T.Msg.MATH_SINGLE_TOOLTIP_ABS="Һандың модулен ҡайтара.",T.Msg.MATH_SINGLE_TOOLTIP_EXP="Күрһәтелгән дәрәжәлә ҡайтара.",T.Msg.MATH_SINGLE_TOOLTIP_LN="Һандың натураль логаритмын ҡайтара.",T.Msg.MATH_SINGLE_TOOLTIP_LOG10="Һандың унынсы логаритмын ҡайтара.",T.Msg.MATH_SINGLE_TOOLTIP_NEG="Кире һанды ҡайтара.",T.Msg.MATH_SINGLE_TOOLTIP_POW10="Күрһәтелгән 10-сы дәрәжәлә ҡайтара.",T.Msg.MATH_SINGLE_TOOLTIP_ROOT="Һандың квадрат тамырын ҡайтара.",T.Msg.MATH_SUBTRACTION_SYMBOL="-",T.Msg.MATH_TRIG_ACOS="acos",T.Msg.MATH_TRIG_ASIN="asin",T.Msg.MATH_TRIG_ATAN="atan",T.Msg.MATH_TRIG_COS="cos",T.Msg.MATH_TRIG_HELPURL="https://ba..wikipedia.org/wiki/Тригонометрик_функциялар",T.Msg.MATH_TRIG_SIN="sin",T.Msg.MATH_TRIG_TAN="tan",T.Msg.MATH_TRIG_TOOLTIP_ACOS="Арккосинусты градустарҙа күрһәтә.",T.Msg.MATH_TRIG_TOOLTIP_ASIN="Арксинусты градустарҙа күрһәтә.",T.Msg.MATH_TRIG_TOOLTIP_ATAN="Арктангенсты градустарҙа күрһәтә.",T.Msg.MATH_TRIG_TOOLTIP_COS="Мөйөштөң косинусын градустарҙа ҡайтара.",T.Msg.MATH_TRIG_TOOLTIP_SIN="Мөйөштөң синусын градустарҙа ҡайтара.",T.Msg.MATH_TRIG_TOOLTIP_TAN="Мөйөштөң тангенсын градустарҙа күрһәтә.",T.Msg.NEW_COLOUR_VARIABLE="Create colour variable...",T.Msg.NEW_NUMBER_VARIABLE="Create number variable...",T.Msg.NEW_STRING_VARIABLE="Create string variable...",T.Msg.NEW_VARIABLE="Яңы үҙгәреүсән...",T.Msg.NEW_VARIABLE_TITLE="Яңы үҙгәреүсәндең исеме:",T.Msg.NEW_VARIABLE_TYPE_TITLE="New variable type:",T.Msg.ORDINAL_NUMBER_SUFFIX="",T.Msg.PROCEDURES_ALLOW_STATEMENTS="allow statements",T.Msg.PROCEDURES_BEFORE_PARAMS="with:",T.Msg.PROCEDURES_CALLNORETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_CALLNORETURN_TOOLTIP="Run the user-defined function '%1'.",T.Msg.PROCEDURES_CALLRETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_CALLRETURN_TOOLTIP="Run the user-defined function '%1' and use its output.",T.Msg.PROCEDURES_CALL_BEFORE_PARAMS="with:",T.Msg.PROCEDURES_CREATE_DO="'%1' төҙөргә",T.Msg.PROCEDURES_DEFNORETURN_COMMENT="Describe this function...",T.Msg.PROCEDURES_DEFNORETURN_DO="",T.Msg.PROCEDURES_DEFNORETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_DEFNORETURN_PROCEDURE="do something",T.Msg.PROCEDURES_DEFNORETURN_TITLE="to",T.Msg.PROCEDURES_DEFNORETURN_TOOLTIP="Creates a function with no output.",T.Msg.PROCEDURES_DEFRETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_DEFRETURN_RETURN="кире ҡайтарыу",T.Msg.PROCEDURES_DEFRETURN_TOOLTIP="Creates a function with an output.",T.Msg.PROCEDURES_DEF_DUPLICATE_WARNING="Warning: This function has duplicate parameters.",T.Msg.PROCEDURES_HIGHLIGHT_DEF="Highlight function definition",T.Msg.PROCEDURES_IFRETURN_HELPURL="http://c2.com/cgi/wiki?GuardClause",T.Msg.PROCEDURES_IFRETURN_TOOLTIP="If a value is true, then return a second value.",T.Msg.PROCEDURES_IFRETURN_WARNING="Warning: This block may be used only within a function definition.",T.Msg.PROCEDURES_MUTATORARG_TITLE="инеү исеме:",T.Msg.PROCEDURES_MUTATORARG_TOOLTIP="Add an input to the function.",T.Msg.PROCEDURES_MUTATORCONTAINER_TITLE="инеү",T.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP="Add, remove, or reorder inputs to this function.",T.Msg.REDO="документтарҙы үҙгәртергә",T.Msg.REMOVE_COMMENT="Аңлатмаларҙы юйырға",T.Msg.RENAME_VARIABLE="Үҙгәреүсәндең исемен алмаштырырға...",T.Msg.RENAME_VARIABLE_TITLE="Бөтә '%1' үҙгәреүсәндәрҙең исемен ошолай алмаштырырға:",T.Msg.TEXT_APPEND_HELPURL="https://github.com/google/blockly/wiki/Text#text-modification",T.Msg.TEXT_APPEND_TITLE="to %1 append text %2",T.Msg.TEXT_APPEND_TOOLTIP="Үҙгәреүсән «%1»-гә текст өҫтәргә.",T.Msg.TEXT_CHANGECASE_HELPURL="https://github.com/google/blockly/wiki/Text#adjusting-text-case",T.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE="to lower case",T.Msg.TEXT_CHANGECASE_OPERATOR_TITLECASE="to Title Case",T.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE="to UPPER CASE",T.Msg.TEXT_CHANGECASE_TOOLTIP="Return a copy of the text in a different case.",T.Msg.TEXT_CHARAT_FIRST="тәүге хәрефте алырға",T.Msg.TEXT_CHARAT_FROM_END="№ хәрефен аҙаҡтан алырға",T.Msg.TEXT_CHARAT_FROM_START="хат алырға #",T.Msg.TEXT_CHARAT_HELPURL="https://github.com/google/blockly/wiki/Text#extracting-text",T.Msg.TEXT_CHARAT_LAST="һуңғы хәрефте алырға",T.Msg.TEXT_CHARAT_RANDOM="осраҡлы хәрефте алырға",T.Msg.TEXT_CHARAT_TAIL="",T.Msg.TEXT_CHARAT_TITLE="in text %1 %2",T.Msg.TEXT_CHARAT_TOOLTIP="Returns the letter at the specified position.",T.Msg.TEXT_COUNT_HELPURL="https://github.com/google/blockly/wiki/Text#counting-substrings",T.Msg.TEXT_COUNT_MESSAGE0="count %1 in %2",T.Msg.TEXT_COUNT_TOOLTIP="Count how many times some text occurs within some other text.",T.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP="Текстҡа элемент өҫтәү.",T.Msg.TEXT_CREATE_JOIN_TITLE_JOIN="ҡушылығыҙ",T.Msg.TEXT_CREATE_JOIN_TOOLTIP="Add, remove, or reorder sections to reconfigure this text block.",T.Msg.TEXT_GET_SUBSTRING_END_FROM_END="to letter # from end",T.Msg.TEXT_GET_SUBSTRING_END_FROM_START="# хатҡа",T.Msg.TEXT_GET_SUBSTRING_END_LAST="һуңғы хәрефкә тиклем",T.Msg.TEXT_GET_SUBSTRING_HELPURL="https://github.com/google/blockly/wiki/Text#extracting-a-region-of-text",T.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT="текста",T.Msg.TEXT_GET_SUBSTRING_START_FIRST="get substring from first letter",T.Msg.TEXT_GET_SUBSTRING_START_FROM_END="get substring from letter # from end",T.Msg.TEXT_GET_SUBSTRING_START_FROM_START="get substring from letter #",T.Msg.TEXT_GET_SUBSTRING_TAIL="",T.Msg.TEXT_GET_SUBSTRING_TOOLTIP="Returns a specified portion of the text.",T.Msg.TEXT_INDEXOF_HELPURL="https://github.com/google/blockly/wiki/Text#finding-text",T.Msg.TEXT_INDEXOF_OPERATOR_FIRST="текстың тәүге инеүен табырға",T.Msg.TEXT_INDEXOF_OPERATOR_LAST="Текстың һуңғы инеүен табырға",T.Msg.TEXT_INDEXOF_TITLE="текстҡа %1 %2 %3",T.Msg.TEXT_INDEXOF_TOOLTIP="Returns the index of the first/last occurrence of the first text in the second text. Returns %1 if text is not found.",T.Msg.TEXT_ISEMPTY_HELPURL="https://github.com/google/blockly/wiki/Text#checking-for-empty-text",T.Msg.TEXT_ISEMPTY_TITLE="%1 буш",T.Msg.TEXT_ISEMPTY_TOOLTIP="Returns true if the provided text is empty.",T.Msg.TEXT_JOIN_HELPURL="https://github.com/google/blockly/wiki/Text#text-creation",T.Msg.TEXT_JOIN_TITLE_CREATEWITH="текст төҙөргә",T.Msg.TEXT_JOIN_TOOLTIP="Элементтарҙың теләһә күпме һанын берләштереп текст фрагментын булдыра.",T.Msg.TEXT_LENGTH_HELPURL="https://github.com/google/blockly/wiki/Text#text-modification",T.Msg.TEXT_LENGTH_TITLE="оҙонлоғо %1",T.Msg.TEXT_LENGTH_TOOLTIP="Бирелгән текстағы символдар һанын (буш урындар менән бергә) кире ҡайтара.",T.Msg.TEXT_PRINT_HELPURL="https://github.com/google/blockly/wiki/Text#printing-text",T.Msg.TEXT_PRINT_TITLE="%1 баҫтырырға",T.Msg.TEXT_PRINT_TOOLTIP="Print the specified text, number or other value.",T.Msg.TEXT_PROMPT_HELPURL="https://github.com/google/blockly/wiki/Text#getting-input-from-the-user",T.Msg.TEXT_PROMPT_TOOLTIP_NUMBER="Prompt for user for a number.",T.Msg.TEXT_PROMPT_TOOLTIP_TEXT="Prompt for user for some text.",T.Msg.TEXT_PROMPT_TYPE_NUMBER="prompt for number with message",T.Msg.TEXT_PROMPT_TYPE_TEXT="prompt for text with message",T.Msg.TEXT_REPLACE_HELPURL="https://github.com/google/blockly/wiki/Text#replacing-substrings",T.Msg.TEXT_REPLACE_MESSAGE0="replace %1 with %2 in %3",T.Msg.TEXT_REPLACE_TOOLTIP="Replace all occurances of some text within some other text.",T.Msg.TEXT_REVERSE_HELPURL="https://github.com/google/blockly/wiki/Text#reversing-text",T.Msg.TEXT_REVERSE_MESSAGE0="reverse %1",T.Msg.TEXT_REVERSE_TOOLTIP="Reverses the order of the characters in the text.",T.Msg.TEXT_TEXT_HELPURL="https://en.wikipedia.org/wiki/String_(computer_science)",T.Msg.TEXT_TEXT_TOOLTIP="Текстың хәрефе, һүҙе йәки юлы.",T.Msg.TEXT_TRIM_HELPURL="https://github.com/google/blockly/wiki/Text#trimming-removing-spaces",T.Msg.TEXT_TRIM_OPERATOR_BOTH="trim spaces from both sides of",T.Msg.TEXT_TRIM_OPERATOR_LEFT="trim spaces from left side of",T.Msg.TEXT_TRIM_OPERATOR_RIGHT="trim spaces from right side of",T.Msg.TEXT_TRIM_TOOLTIP="Return a copy of the text with spaces removed from one or both ends.",T.Msg.TODAY="Бөгөн",T.Msg.UNDO="Кире алырға",T.Msg.UNNAMED_KEY="unnamed",T.Msg.VARIABLES_DEFAULT_NAME="элемент",T.Msg.VARIABLES_GET_CREATE_SET="Create 'set %1'",T.Msg.VARIABLES_GET_HELPURL="https://github.com/google/blockly/wiki/Variables#get",T.Msg.VARIABLES_GET_TOOLTIP="Returns the value of this variable.",T.Msg.VARIABLES_SET="set %1 to %2",T.Msg.VARIABLES_SET_CREATE_GET="Create 'get %1'",T.Msg.VARIABLES_SET_HELPURL="https://github.com/google/blockly/wiki/Variables#set",T.Msg.VARIABLES_SET_TOOLTIP="Sets this variable to be equal to the input.",T.Msg.VARIABLE_ALREADY_EXISTS="A variable named '%1' already exists.",T.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE="A variable named '%1' already exists for another type: '%2'.",T.Msg.VARIABLE_ALREADY_EXISTS_FOR_A_PARAMETER="A variable named '%1' already exists as a parameter in the procedure '%2'.",T.Msg.WORKSPACE_ARIA_LABEL="Blockly Workspace",T.Msg.WORKSPACE_COMMENT_DEFAULT_TEXT="Say something...",T.Msg.CONTROLS_FOREACH_INPUT_DO=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.CONTROLS_FOR_INPUT_DO=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF=T.Msg.CONTROLS_IF_MSG_ELSEIF,T.Msg.CONTROLS_IF_ELSE_TITLE_ELSE=T.Msg.CONTROLS_IF_MSG_ELSE,T.Msg.CONTROLS_IF_IF_TITLE_IF=T.Msg.CONTROLS_IF_MSG_IF,T.Msg.CONTROLS_IF_MSG_THEN=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.CONTROLS_WHILEUNTIL_INPUT_DO=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.LISTS_CREATE_WITH_ITEM_TITLE=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.LISTS_GET_INDEX_HELPURL=T.Msg.LISTS_INDEX_OF_HELPURL,T.Msg.LISTS_GET_INDEX_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.LISTS_INDEX_OF_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.LISTS_SET_INDEX_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.MATH_CHANGE_TITLE_ITEM=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.PROCEDURES_DEFRETURN_COMMENT=T.Msg.PROCEDURES_DEFNORETURN_COMMENT,T.Msg.PROCEDURES_DEFRETURN_DO=T.Msg.PROCEDURES_DEFNORETURN_DO,T.Msg.PROCEDURES_DEFRETURN_PROCEDURE=T.Msg.PROCEDURES_DEFNORETURN_PROCEDURE,T.Msg.PROCEDURES_DEFRETURN_TITLE=T.Msg.PROCEDURES_DEFNORETURN_TITLE,T.Msg.TEXT_APPEND_VARIABLE=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.LOGIC_HUE="210",T.Msg.LOOPS_HUE="120",T.Msg.MATH_HUE="230",T.Msg.TEXTS_HUE="160",T.Msg.LISTS_HUE="260",T.Msg.COLOUR_HUE="20",T.Msg.VARIABLES_HUE="330",T.Msg.VARIABLES_DYNAMIC_HUE="310",T.Msg.PROCEDURES_HUE="290",T.Msg})?E.apply(_,s):E)||(T.exports=O)}}]);