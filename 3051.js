(self.webpackChunkcoding_with_chrome=self.webpackChunkcoding_with_chrome||[]).push([[3051],{63051:function(T,_){var a,s,E;s=[],void 0===(E="function"==typeof(a=function(){"use strict";var T=T||{Msg:Object.create(null)};return T.Msg.ADD_COMMENT="Dodaj komentar",T.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE="Ne mogu da obrišem varijablu ’%1’ jer je deo definicije funkcije ’%2’",T.Msg.CHANGE_VALUE_TITLE="Promeni vrednost:",T.Msg.CLEAN_UP="Ukloni blokove",T.Msg.COLLAPSED_WARNINGS_WARNING="Collapsed blocks contain warnings.",T.Msg.COLLAPSE_ALL="Skupi blokove",T.Msg.COLLAPSE_BLOCK="Skupi blok",T.Msg.COLOUR_BLEND_COLOUR1="boja 1",T.Msg.COLOUR_BLEND_COLOUR2="boja 2",T.Msg.COLOUR_BLEND_HELPURL="https://meyerweb.com/eric/tools/color-blend/#:::rgbp",T.Msg.COLOUR_BLEND_RATIO="odnos",T.Msg.COLOUR_BLEND_TITLE="pomešaj",T.Msg.COLOUR_BLEND_TOOLTIP="Pomešati dve boje zajedno sa datim odnosom (0.0 - 1.0).",T.Msg.COLOUR_PICKER_HELPURL="https://sr.wikipedia.org/wiki/Boja",T.Msg.COLOUR_PICKER_TOOLTIP="Izaberite boju sa palete.",T.Msg.COLOUR_RANDOM_HELPURL="http://randomcolour.com",T.Msg.COLOUR_RANDOM_TITLE="slučajna boja",T.Msg.COLOUR_RANDOM_TOOLTIP="Izaberite boju nasumice.",T.Msg.COLOUR_RGB_BLUE="plava",T.Msg.COLOUR_RGB_GREEN="zelena",T.Msg.COLOUR_RGB_HELPURL="https://www.december.com/html/spec/colorpercompact.html",T.Msg.COLOUR_RGB_RED="crvena",T.Msg.COLOUR_RGB_TITLE="boja sa",T.Msg.COLOUR_RGB_TOOLTIP="Kreiraj boju sa određenom količinom crvene,zelene, i plave. Sve vrednosti moraju biti između 0 i 100.",T.Msg.CONTROLS_FLOW_STATEMENTS_HELPURL="https://github.com/google/blockly/wiki/Loops#loop-termination-blocks",T.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK="Izađite iz petlje",T.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE="nastavi sa sledećom iteracijom petlje",T.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK="Napusti sadržaj petlje.",T.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE="Preskoči ostatak ove petlje, i nastavi sa sledećom iteracijom(ponavljanjem).",T.Msg.CONTROLS_FLOW_STATEMENTS_WARNING="Upozorenje: Ovaj blok može da se upotrebi samo unutar petlje.",T.Msg.CONTROLS_FOREACH_HELPURL="https://github.com/google/blockly/wiki/Loops#for-each",T.Msg.CONTROLS_FOREACH_TITLE="za svaku stavku %1 na spisku %2",T.Msg.CONTROLS_FOREACH_TOOLTIP="Za svaku stavku unutar liste, podesi promenjivu '%1' po stavci, i onda načini neke izjave-naredbe.",T.Msg.CONTROLS_FOR_HELPURL="https://github.com/google/blockly/wiki/Loops#count-with",T.Msg.CONTROLS_FOR_TITLE="prebroj sa %1 od %2 do %3 od %4",T.Msg.CONTROLS_FOR_TOOLTIP='Imaj promenjivu "%1" uzmi vrednosti od početnog broja do zadnjeg broja, brojeći po određenom intervalu, i izvrši određene blokove.',T.Msg.CONTROLS_IF_ELSEIF_TOOLTIP="Dodajte uslov bloku „ako“.",T.Msg.CONTROLS_IF_ELSE_TOOLTIP="Dodaj konačni, catch-all  (uhvati sve) uslove if bloka.",T.Msg.CONTROLS_IF_HELPURL="https://github.com/google/blockly/wiki/IfElse",T.Msg.CONTROLS_IF_IF_TOOLTIP="Dodaj, ukloni, ili preuredi delove kako bih rekonfigurisali ovaj if blok.",T.Msg.CONTROLS_IF_MSG_ELSE="inače",T.Msg.CONTROLS_IF_MSG_ELSEIF="inače-ako",T.Msg.CONTROLS_IF_MSG_IF="ako",T.Msg.CONTROLS_IF_TOOLTIP_1="ako je vrednost tačna, onda izvrši neke naredbe-izjave.",T.Msg.CONTROLS_IF_TOOLTIP_2="ako je vrednost tačna, onda izvrši prvi blok naredbi, U suprotnom, izvrši drugi blok naredbi.",T.Msg.CONTROLS_IF_TOOLTIP_3="Ako je prva vrednost tačna, onda izvrši prvi blok naredbi, u suprotnom, ako je druga vrednost tačna , izvrši drugi blok naredbi.",T.Msg.CONTROLS_IF_TOOLTIP_4="Ako je prva vrednost tačna, onda izvrši prvi blok naredbi, u suprotnom, ako je druga vrednost tačna , izvrši drugi blok naredbi. Ako ni jedna od vrednosti nije tačna, izvrši poslednji blok naredbi.",T.Msg.CONTROLS_REPEAT_HELPURL="https://sr.wikipedia.org/wiki/For_petlja",T.Msg.CONTROLS_REPEAT_INPUT_DO="izvrši",T.Msg.CONTROLS_REPEAT_TITLE="ponovi %1 puta",T.Msg.CONTROLS_REPEAT_TOOLTIP="Odraditi neke naredbe nekoliko puta.",T.Msg.CONTROLS_WHILEUNTIL_HELPURL="https://github.com/google/blockly/wiki/Loops#repeat",T.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL="ponavljati do",T.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE="ponavljati dok",T.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL="Dok vrednost nije tačna, onda izvršiti neke naredbe.",T.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE="Dok je vrednost tačna, onda izvršite neke naredbe.",T.Msg.DELETE_ALL_BLOCKS="Da obrišem svih %1 blokova?",T.Msg.DELETE_BLOCK="Obriši blok",T.Msg.DELETE_VARIABLE="Obriši promenljivu '%1'",T.Msg.DELETE_VARIABLE_CONFIRMATION="Da obrišem %1 upotreba promenljive '%2'?",T.Msg.DELETE_X_BLOCKS="Obriši %1 blokova",T.Msg.DIALOG_CANCEL="Otkaži",T.Msg.DIALOG_OK="U redu",T.Msg.DISABLE_BLOCK="Onemogući blok",T.Msg.DUPLICATE_BLOCK="Dupliraj",T.Msg.DUPLICATE_COMMENT="Duplicate Comment",T.Msg.ENABLE_BLOCK="Omogući blok",T.Msg.EXPAND_ALL="Proširi blokove",T.Msg.EXPAND_BLOCK="Proširi blok",T.Msg.EXTERNAL_INPUTS="Spoljni ulazi",T.Msg.HELP="Pomoć",T.Msg.INLINE_INPUTS="Unutrašnji ulazi",T.Msg.LISTS_CREATE_EMPTY_HELPURL="https://github.com/google/blockly/wiki/Lists#create-empty-list",T.Msg.LISTS_CREATE_EMPTY_TITLE="napravi prazan spisak",T.Msg.LISTS_CREATE_EMPTY_TOOLTIP="vraća listu, dužine 0, ne sadržavajući  evidenciju podataka",T.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD="spisak",T.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP="Dodajte, izbrišite, ili preuredite delove kako bi se reorganizovali ovaj blok liste.",T.Msg.LISTS_CREATE_WITH_HELPURL="https://github.com/google/blockly/wiki/Lists#create-list-with",T.Msg.LISTS_CREATE_WITH_INPUT_WITH="napravi spisak sa",T.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP="Dodajte stavku na spisak.",T.Msg.LISTS_CREATE_WITH_TOOLTIP="Kreiraj listu sa bilo kojim brojem stavki.",T.Msg.LISTS_GET_INDEX_FIRST="prva",T.Msg.LISTS_GET_INDEX_FROM_END="# sa kraja",T.Msg.LISTS_GET_INDEX_FROM_START="#",T.Msg.LISTS_GET_INDEX_GET="preuzmi",T.Msg.LISTS_GET_INDEX_GET_REMOVE="preuzmi i ukloni",T.Msg.LISTS_GET_INDEX_LAST="poslednja",T.Msg.LISTS_GET_INDEX_RANDOM="slučajna",T.Msg.LISTS_GET_INDEX_REMOVE="ukloni",T.Msg.LISTS_GET_INDEX_TAIL="",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FIRST="Vraća prvu stavku na spisku.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM="Vraća stavku na određenu poziciju na listi.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_LAST="Vraća poslednju stavku na spisku.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM="Vraća slučajnu stavku sa spiska.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST="Uklanja i vraća prvu stavku sa spiska.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM="Uklanja i vraća stavku sa određenog položaja na spisku.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST="Uklanja i vraća poslednju stavku sa spiska.",T.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM="Uklanja i vraća slučajnu stavku sa spiska.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST="Uklanja prvu stavku sa spiska.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM="Uklanja stavku sa određenog položaja na spisku.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST="Uklanja poslednju stavku sa spiska.",T.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM="Uklanja slučajnu stavku sa spiska.",T.Msg.LISTS_GET_SUBLIST_END_FROM_END="do # od kraja",T.Msg.LISTS_GET_SUBLIST_END_FROM_START="do #",T.Msg.LISTS_GET_SUBLIST_END_LAST="do poslednje",T.Msg.LISTS_GET_SUBLIST_HELPURL="https://github.com/google/blockly/wiki/Lists#getting-a-sublist",T.Msg.LISTS_GET_SUBLIST_START_FIRST="preuzmi podspisak od prve",T.Msg.LISTS_GET_SUBLIST_START_FROM_END="preuzmi podspisak iz # sa kraja",T.Msg.LISTS_GET_SUBLIST_START_FROM_START="preuzmi podspisak od #",T.Msg.LISTS_GET_SUBLIST_TAIL="",T.Msg.LISTS_GET_SUBLIST_TOOLTIP="Pravi kopiju određenog dela liste.",T.Msg.LISTS_INDEX_FROM_END_TOOLTIP="%1 je poslednja stavka.",T.Msg.LISTS_INDEX_FROM_START_TOOLTIP="%1 je prva stavka.",T.Msg.LISTS_INDEX_OF_FIRST="pronađi prvo pojavljivanje stavke",T.Msg.LISTS_INDEX_OF_HELPURL="https://github.com/google/blockly/wiki/Lists#getting-items-from-a-list",T.Msg.LISTS_INDEX_OF_LAST="pronađi poslednje pojavljivanje stavke",T.Msg.LISTS_INDEX_OF_TOOLTIP="Vraća broj prvog i/poslednjeg ulaska elementa u listu. Vraća %1 Ako element nije pronađen.",T.Msg.LISTS_INLIST="na spisku",T.Msg.LISTS_ISEMPTY_HELPURL="https://github.com/google/blockly/wiki/Lists#is-empty",T.Msg.LISTS_ISEMPTY_TITLE="%1 je prazan",T.Msg.LISTS_ISEMPTY_TOOLTIP="Vraća vrednost tačno ako je lista prazna.",T.Msg.LISTS_LENGTH_HELPURL="https://github.com/google/blockly/wiki/Lists#length-of",T.Msg.LISTS_LENGTH_TITLE="dužina spiska %1",T.Msg.LISTS_LENGTH_TOOLTIP="Vraća dužinu spiska.",T.Msg.LISTS_REPEAT_HELPURL="https://github.com/google/blockly/wiki/Lists#create-list-with",T.Msg.LISTS_REPEAT_TITLE="Napraviti listu sa stavkom %1 koja se ponavlja %2 puta",T.Msg.LISTS_REPEAT_TOOLTIP="Pravi listu koja se sastoji od zadane vrednosti koju ponavljamo određeni broj šuta.",T.Msg.LISTS_REVERSE_HELPURL="https://github.com/google/blockly/wiki/Lists#reversing-a-list",T.Msg.LISTS_REVERSE_MESSAGE0="obrnuto %1",T.Msg.LISTS_REVERSE_TOOLTIP="Obrni kopiju spiska.",T.Msg.LISTS_SET_INDEX_HELPURL="https://github.com/google/blockly/wiki/Lists#in-list--set",T.Msg.LISTS_SET_INDEX_INPUT_TO="kao",T.Msg.LISTS_SET_INDEX_INSERT="ubaci na",T.Msg.LISTS_SET_INDEX_SET="postavi",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST="Ubacuje stavku na početak spiska.",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM="Ubacuje stavku na određeni položaj na spisku.",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST="Dodajte stavku na kraj spiska.",T.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM="Ubacuje stavku na slučajno mesto na spisku.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST="Postavlja prvu stavku na spisku.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM="Postavlja stavku na određeni položaj na spisku.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST="Postavlja poslednju stavku na spisku.",T.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM="Postavlja slučajnu stavku na spisku.",T.Msg.LISTS_SORT_HELPURL="https://github.com/google/blockly/wiki/Lists#sorting-a-list",T.Msg.LISTS_SORT_ORDER_ASCENDING="rastuće",T.Msg.LISTS_SORT_ORDER_DESCENDING="opadajuće",T.Msg.LISTS_SORT_TITLE="sortiraj %1 %2 %3",T.Msg.LISTS_SORT_TOOLTIP="Sortirajte kopiju spiska.",T.Msg.LISTS_SORT_TYPE_IGNORECASE="azbučno, ignoriši mala i velika slova",T.Msg.LISTS_SORT_TYPE_NUMERIC="kao brojeve",T.Msg.LISTS_SORT_TYPE_TEXT="azbučno",T.Msg.LISTS_SPLIT_HELPURL="https://github.com/google/blockly/wiki/Lists#splitting-strings-and-joining-lists",T.Msg.LISTS_SPLIT_LIST_FROM_TEXT="napravite listu sa teksta",T.Msg.LISTS_SPLIT_TEXT_FROM_LIST="da tekst iz liste",T.Msg.LISTS_SPLIT_TOOLTIP_JOIN="Da se pridruži listu tekstova u jedan tekst, podeljenih za razdvajanje.",T.Msg.LISTS_SPLIT_TOOLTIP_SPLIT="Podeliti tekst u listu tekstova, razbijanje na svakom graničnik.",T.Msg.LISTS_SPLIT_WITH_DELIMITER="sa razdvajanje",T.Msg.LOGIC_BOOLEAN_FALSE="netačno",T.Msg.LOGIC_BOOLEAN_HELPURL="https://github.com/google/blockly/wiki/Logic#values",T.Msg.LOGIC_BOOLEAN_TOOLTIP="Vraća ili tačno ili netačno.",T.Msg.LOGIC_BOOLEAN_TRUE="tačno",T.Msg.LOGIC_COMPARE_HELPURL="https://sr.wikipedia.org/wiki/Nejednakost",T.Msg.LOGIC_COMPARE_TOOLTIP_EQ="Vraća vrednost „tačno“ ako su oba ulaza jednaka.",T.Msg.LOGIC_COMPARE_TOOLTIP_GT="Vraća vrednost „tačno“ ako je prvi ulaz veći od drugog.",T.Msg.LOGIC_COMPARE_TOOLTIP_GTE="Vraća vrednost „tačno“ ako je prvi ulaz veći ili jednak drugom.",T.Msg.LOGIC_COMPARE_TOOLTIP_LT="Vraća vrednost „tačno“ ako je prvi ulaz manji od drugog.",T.Msg.LOGIC_COMPARE_TOOLTIP_LTE="Vraća vrednost „tačno“ ako je prvi ulaz manji ili jednak drugom.",T.Msg.LOGIC_COMPARE_TOOLTIP_NEQ="Vraća vrednost „tačno“ ako su oba ulaza nejednaka.",T.Msg.LOGIC_NEGATE_HELPURL="https://github.com/google/blockly/wiki/Logic#not",T.Msg.LOGIC_NEGATE_TITLE="nije %1",T.Msg.LOGIC_NEGATE_TOOLTIP="Vraća vrednost „tačno“ ako je ulaz netačan. Vraća vrednost „netačno“ ako je ulaz tačan.",T.Msg.LOGIC_NULL="bez vrednosti",T.Msg.LOGIC_NULL_HELPURL="https://en.wikipedia.org/wiki/Nullable_type",T.Msg.LOGIC_NULL_TOOLTIP="Vraća „bez vrednosti“.",T.Msg.LOGIC_OPERATION_AND="i",T.Msg.LOGIC_OPERATION_HELPURL="https://github.com/google/blockly/wiki/Logic#logical-operations",T.Msg.LOGIC_OPERATION_OR="ili",T.Msg.LOGIC_OPERATION_TOOLTIP_AND="Vraća vrednost „tačno“ ako su oba ulaza tačna.",T.Msg.LOGIC_OPERATION_TOOLTIP_OR="Vraća vrednost „tačno“ ako je bar jedan od ulaza tačan.",T.Msg.LOGIC_TERNARY_CONDITION="proba",T.Msg.LOGIC_TERNARY_HELPURL="https://en.wikipedia.org/wiki/%3F:",T.Msg.LOGIC_TERNARY_IF_FALSE="ako je netačno",T.Msg.LOGIC_TERNARY_IF_TRUE="ako je tačno",T.Msg.LOGIC_TERNARY_TOOLTIP="Proveri uslov u 'test'. Ako je uslov tačan, tada vraća 'if true' vrednost; u drugom slučaju vraća 'if false' vrednost.",T.Msg.MATH_ADDITION_SYMBOL="+",T.Msg.MATH_ARITHMETIC_HELPURL="https://en.wikipedia.org/wiki/Arithmetic",T.Msg.MATH_ARITHMETIC_TOOLTIP_ADD="Vratite zbir dva broja.",T.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE="Vraća količnik dva broja.",T.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS="Vraća razliku dva broja.",T.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY="Vraća proizvod dva broja.",T.Msg.MATH_ARITHMETIC_TOOLTIP_POWER="Vraća prvi broj stepenovan drugim.",T.Msg.MATH_ATAN2_HELPURL="https://en.wikipedia.org/wiki/Atan2",T.Msg.MATH_ATAN2_TITLE="atan2 of X:%1 Y:%2",T.Msg.MATH_ATAN2_TOOLTIP="Return the arctangent of point (X, Y) in degrees from -180 to 180.",T.Msg.MATH_CHANGE_HELPURL="https://en.wikipedia.org/wiki/Programming_idiom#Incrementing_a_counter",T.Msg.MATH_CHANGE_TITLE="promeni %1 za %2",T.Msg.MATH_CHANGE_TOOLTIP="Dodajte broj promenljivoj „%1“.",T.Msg.MATH_CONSTANT_HELPURL="https://sr.wikipedia.org/wiki/Matematička_konstanta",T.Msg.MATH_CONSTANT_TOOLTIP="vrati jednu od zajedničkih konstanti: π (3.141…), e (2.718…), φ (1.618…), sqrt(2) (1.414…), sqrt(½) (0.707…), ili ∞ (infinity).",T.Msg.MATH_CONSTRAIN_HELPURL="https://en.wikipedia.org/wiki/Clamping_(graphics)",T.Msg.MATH_CONSTRAIN_TITLE="ograniči %1 nisko %2 visoko %3",T.Msg.MATH_CONSTRAIN_TOOLTIP="Ograničava broj na donje i gornje granice (uključivo).",T.Msg.MATH_DIVISION_SYMBOL="÷",T.Msg.MATH_IS_DIVISIBLE_BY="je deljiv sa",T.Msg.MATH_IS_EVEN="je paran",T.Msg.MATH_IS_NEGATIVE="je negativan",T.Msg.MATH_IS_ODD="je neparan",T.Msg.MATH_IS_POSITIVE="je pozitivan",T.Msg.MATH_IS_PRIME="je prost",T.Msg.MATH_IS_TOOLTIP="Provjerava da li je broj paran, neparan, prost, cio, pozitivan, negativan, ili da li je deljiv sa određenim brojem. Vraća tačno ili netačno.",T.Msg.MATH_IS_WHOLE="je ceo",T.Msg.MATH_MODULO_HELPURL="https://sr.wikipedia.org/wiki/Kongruencija",T.Msg.MATH_MODULO_TITLE="podsetnik od %1 ÷ %2",T.Msg.MATH_MODULO_TOOLTIP="Vraća podsetnik od deljenja dva broja.",T.Msg.MATH_MULTIPLICATION_SYMBOL="×",T.Msg.MATH_NUMBER_HELPURL="https://en.wikipedia.org/wiki/Number",T.Msg.MATH_NUMBER_TOOLTIP="Neki broj.",T.Msg.MATH_ONLIST_HELPURL="",T.Msg.MATH_ONLIST_OPERATOR_AVERAGE="prosek spiska",T.Msg.MATH_ONLIST_OPERATOR_MAX="maks. spiska",T.Msg.MATH_ONLIST_OPERATOR_MEDIAN="medijana spiska",T.Msg.MATH_ONLIST_OPERATOR_MIN="min. spiska",T.Msg.MATH_ONLIST_OPERATOR_MODE="modus spiska",T.Msg.MATH_ONLIST_OPERATOR_RANDOM="slučajna stavka spiska",T.Msg.MATH_ONLIST_OPERATOR_STD_DEV="standardna devijacija spiska",T.Msg.MATH_ONLIST_OPERATOR_SUM="zbir spiska",T.Msg.MATH_ONLIST_TOOLTIP_AVERAGE="Vraća prosek numeričkih vrednosti sa spiska.",T.Msg.MATH_ONLIST_TOOLTIP_MAX="Vraća najveći broj sa spiska.",T.Msg.MATH_ONLIST_TOOLTIP_MEDIAN="Vraća medijanu sa spiska.",T.Msg.MATH_ONLIST_TOOLTIP_MIN="Vraća najmanji broj sa spiska.",T.Msg.MATH_ONLIST_TOOLTIP_MODE="Vraća najčešće stavke sa spiska.",T.Msg.MATH_ONLIST_TOOLTIP_RANDOM="Vraća slučajni element sa spiska.",T.Msg.MATH_ONLIST_TOOLTIP_STD_DEV="Vraća standardnu devijaciju spiska.",T.Msg.MATH_ONLIST_TOOLTIP_SUM="Vraća zbir svih brojeva sa spiska.",T.Msg.MATH_POWER_SYMBOL="^",T.Msg.MATH_RANDOM_FLOAT_HELPURL="https://sr.wikipedia.org/wiki/Generator_slučajnih_brojeva",T.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM="slučajni razlomak",T.Msg.MATH_RANDOM_FLOAT_TOOLTIP="Vraća slučajni razlomak između 0.0 (uključivo) i 1.0 (isključivo).",T.Msg.MATH_RANDOM_INT_HELPURL="https://sr.wikipedia.org/wiki/Generator_slučajnih_brojeva",T.Msg.MATH_RANDOM_INT_TITLE="sličajno odabrani cijeli broj od %1 do %2",T.Msg.MATH_RANDOM_INT_TOOLTIP="Vraća slučajno odabrani celi broj između dve određene granice, uključivo.",T.Msg.MATH_ROUND_HELPURL="https://sr.wikipedia.org/wiki/Zaokruživanje",T.Msg.MATH_ROUND_OPERATOR_ROUND="zaokruži",T.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN="zaokruži naniže",T.Msg.MATH_ROUND_OPERATOR_ROUNDUP="zaokruži naviše",T.Msg.MATH_ROUND_TOOLTIP="Zaokružite broj na veću ili manju vrednost.",T.Msg.MATH_SINGLE_HELPURL="https://sr.wikipedia.org/wiki/Kvadratni_koren",T.Msg.MATH_SINGLE_OP_ABSOLUTE="apsolutan",T.Msg.MATH_SINGLE_OP_ROOT="kvadratni koren",T.Msg.MATH_SINGLE_TOOLTIP_ABS="Vraća apsolutnu vrednost broja.",T.Msg.MATH_SINGLE_TOOLTIP_EXP="vratiti e na vlasti broja.",T.Msg.MATH_SINGLE_TOOLTIP_LN="Vraća prirodni logaritam broja.",T.Msg.MATH_SINGLE_TOOLTIP_LOG10="Vraća logaritam broja sa osnovom 10.",T.Msg.MATH_SINGLE_TOOLTIP_NEG="Vraća negaciju broja.",T.Msg.MATH_SINGLE_TOOLTIP_POW10="Vraća 10-ti stepen broja.",T.Msg.MATH_SINGLE_TOOLTIP_ROOT="Vraća kvadratni koren broja.",T.Msg.MATH_SUBTRACTION_SYMBOL="-",T.Msg.MATH_TRIG_ACOS="arc cos",T.Msg.MATH_TRIG_ASIN="arc sin",T.Msg.MATH_TRIG_ATAN="arc tan",T.Msg.MATH_TRIG_COS="cos",T.Msg.MATH_TRIG_HELPURL="https://sr.wikipedia.org/wiki/Trigonometrijske_funkcije",T.Msg.MATH_TRIG_SIN="sin",T.Msg.MATH_TRIG_TAN="tan",T.Msg.MATH_TRIG_TOOLTIP_ACOS="Vraća arkus kosinus broja.",T.Msg.MATH_TRIG_TOOLTIP_ASIN="Vraća arkus broja.",T.Msg.MATH_TRIG_TOOLTIP_ATAN="Vraća arkus tangens broja.",T.Msg.MATH_TRIG_TOOLTIP_COS="Vraća kosinus stepena (ne radijan).",T.Msg.MATH_TRIG_TOOLTIP_SIN="Vraća sinus stepena (ne radijan).",T.Msg.MATH_TRIG_TOOLTIP_TAN="Vraća tangens stepena (ne radijan).",T.Msg.NEW_COLOUR_VARIABLE="Create colour variable...",T.Msg.NEW_NUMBER_VARIABLE="Create number variable...",T.Msg.NEW_STRING_VARIABLE="Create string variable...",T.Msg.NEW_VARIABLE="Napravi promenljivu…",T.Msg.NEW_VARIABLE_TITLE="Ime nove promenljive:",T.Msg.NEW_VARIABLE_TYPE_TITLE="New variable type:",T.Msg.ORDINAL_NUMBER_SUFFIX="",T.Msg.PROCEDURES_ALLOW_STATEMENTS="dozvoliti izreke",T.Msg.PROCEDURES_BEFORE_PARAMS="sa:",T.Msg.PROCEDURES_CALLNORETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_CALLNORETURN_TOOLTIP="Pokrenite prilagođenu funkciju „%1“.",T.Msg.PROCEDURES_CALLRETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_CALLRETURN_TOOLTIP="Pokrenite prilagođenu funkciju „%1“ i koristi njen izlaz.",T.Msg.PROCEDURES_CALL_BEFORE_PARAMS="sa:",T.Msg.PROCEDURES_CREATE_DO="Napravi „%1“",T.Msg.PROCEDURES_DEFNORETURN_COMMENT="Opisati ovu funkciju...",T.Msg.PROCEDURES_DEFNORETURN_DO="",T.Msg.PROCEDURES_DEFNORETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_DEFNORETURN_PROCEDURE="uradite nešto",T.Msg.PROCEDURES_DEFNORETURN_TITLE="da",T.Msg.PROCEDURES_DEFNORETURN_TOOLTIP="Pravi funkciju bez izlaza.",T.Msg.PROCEDURES_DEFRETURN_HELPURL="https://en.wikipedia.org/wiki/Subroutine",T.Msg.PROCEDURES_DEFRETURN_RETURN="vrati",T.Msg.PROCEDURES_DEFRETURN_TOOLTIP="Pravi funkciju sa izlazom.",T.Msg.PROCEDURES_DEF_DUPLICATE_WARNING="Upozorenje: Ova funkcija ima duplikate parametara.",T.Msg.PROCEDURES_HIGHLIGHT_DEF="Istakni definiciju funkcije",T.Msg.PROCEDURES_IFRETURN_HELPURL="http://c2.com/cgi/wiki?GuardClause",T.Msg.PROCEDURES_IFRETURN_TOOLTIP="Ukoliko je vrednost tačna, vrati drugu vrednost.",T.Msg.PROCEDURES_IFRETURN_WARNING="Upozorenje: Ovaj blok se može koristiti jedino u definiciji funkcije.",T.Msg.PROCEDURES_MUTATORARG_TITLE="naziv ulaza:",T.Msg.PROCEDURES_MUTATORARG_TOOLTIP="Dodajte ulazna funkcija.",T.Msg.PROCEDURES_MUTATORCONTAINER_TITLE="ulazi",T.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP="Da dodate, uklonite ili pereuporяdočitь ulaza za ovu funkciju.",T.Msg.REDO="Ponovi",T.Msg.REMOVE_COMMENT="Ukloni komentar",T.Msg.RENAME_VARIABLE="Preimenuj promenljivu…",T.Msg.RENAME_VARIABLE_TITLE="Preimenuj sve „%1“ promenljive u:",T.Msg.TEXT_APPEND_HELPURL="https://github.com/google/blockly/wiki/Text#text-modification",T.Msg.TEXT_APPEND_TITLE="na %1 dodaj tekst %2",T.Msg.TEXT_APPEND_TOOLTIP="Dodajte tekst na promenljivu „%1“.",T.Msg.TEXT_CHANGECASE_HELPURL="https://github.com/google/blockly/wiki/Text#adjusting-text-case",T.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE="malim slovima",T.Msg.TEXT_CHANGECASE_OPERATOR_TITLECASE="svaka reč velikim slovom",T.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE="velikim slovima",T.Msg.TEXT_CHANGECASE_TOOLTIP="Vraća primerak teksta sa drugačijom veličinom slova.",T.Msg.TEXT_CHARAT_FIRST="preuzmi prvo slovo",T.Msg.TEXT_CHARAT_FROM_END="preuzmi slovo # sa kraja",T.Msg.TEXT_CHARAT_FROM_START="preuzmi slovo #",T.Msg.TEXT_CHARAT_HELPURL="https://github.com/google/blockly/wiki/Text#extracting-text",T.Msg.TEXT_CHARAT_LAST="preuzmi poslednje slovo",T.Msg.TEXT_CHARAT_RANDOM="preuzmi slučajno slovo",T.Msg.TEXT_CHARAT_TAIL="",T.Msg.TEXT_CHARAT_TITLE="u tekstu %1 %2",T.Msg.TEXT_CHARAT_TOOLTIP="Vraća slovo na određeni položaj.",T.Msg.TEXT_COUNT_HELPURL="https://github.com/google/blockly/wiki/Text#counting-substrings",T.Msg.TEXT_COUNT_MESSAGE0="broj %1 u %2",T.Msg.TEXT_COUNT_TOOLTIP="Broji koliko puta se neki tekst pojavljuje unutar nekog drugog teksta.",T.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP="Dodajte stavku u tekst.",T.Msg.TEXT_CREATE_JOIN_TITLE_JOIN="spajanjem",T.Msg.TEXT_CREATE_JOIN_TOOLTIP="Dodaj, ukloni, ili drugačije poredaj odjelke kako bi iznova postavili ovaj tekst blok.",T.Msg.TEXT_GET_SUBSTRING_END_FROM_END="slovu # sa kraja",T.Msg.TEXT_GET_SUBSTRING_END_FROM_START="slovu #",T.Msg.TEXT_GET_SUBSTRING_END_LAST="poslednjem slovu",T.Msg.TEXT_GET_SUBSTRING_HELPURL="https://github.com/google/blockly/wiki/Text#extracting-a-region-of-text",T.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT="u tekstu",T.Msg.TEXT_GET_SUBSTRING_START_FIRST="preuzmi podnisku iz prvog slova",T.Msg.TEXT_GET_SUBSTRING_START_FROM_END="preuzmi podnisku iz slova # sa kraja",T.Msg.TEXT_GET_SUBSTRING_START_FROM_START="preuzmi podnisku iz slova #",T.Msg.TEXT_GET_SUBSTRING_TAIL="",T.Msg.TEXT_GET_SUBSTRING_TOOLTIP="Vraća određeni deo teksta.",T.Msg.TEXT_INDEXOF_HELPURL="https://github.com/google/blockly/wiki/Text#finding-text",T.Msg.TEXT_INDEXOF_OPERATOR_FIRST="pronađi prvo pojavljivanje teksta",T.Msg.TEXT_INDEXOF_OPERATOR_LAST="pronađi poslednje pojavljivanje teksta",T.Msg.TEXT_INDEXOF_TITLE="u tekstu %1 %2 %3",T.Msg.TEXT_INDEXOF_TOOLTIP="Vraća odnos prvog/zadnjeg pojavljivanja teksta u drugom tekstu. Vrađa %1 ako tekst nije pronađen.",T.Msg.TEXT_ISEMPTY_HELPURL="https://github.com/google/blockly/wiki/Text#checking-for-empty-text",T.Msg.TEXT_ISEMPTY_TITLE="%1 je prazan",T.Msg.TEXT_ISEMPTY_TOOLTIP="Vraća tačno ako je dostavljeni tekst prazan.",T.Msg.TEXT_JOIN_HELPURL="https://github.com/google/blockly/wiki/Text#text-creation",T.Msg.TEXT_JOIN_TITLE_CREATEWITH="napiši tekst sa",T.Msg.TEXT_JOIN_TOOLTIP="Napraviti dio teksta spajajući različite stavke.",T.Msg.TEXT_LENGTH_HELPURL="https://github.com/google/blockly/wiki/Text#text-modification",T.Msg.TEXT_LENGTH_TITLE="dužina teksta %1",T.Msg.TEXT_LENGTH_TOOLTIP="Vraća broj slova (uključujući razmake) u datom tekstu.",T.Msg.TEXT_PRINT_HELPURL="https://github.com/google/blockly/wiki/Text#printing-text",T.Msg.TEXT_PRINT_TITLE="prikaži %1",T.Msg.TEXT_PRINT_TOOLTIP="Prikažite određeni tekst, broj ili drugu vrednost na ekranu.",T.Msg.TEXT_PROMPT_HELPURL="https://github.com/google/blockly/wiki/Text#getting-input-from-the-user",T.Msg.TEXT_PROMPT_TOOLTIP_NUMBER="Pitajte korisnika za broj.",T.Msg.TEXT_PROMPT_TOOLTIP_TEXT="Pitajte korisnika za unos teksta.",T.Msg.TEXT_PROMPT_TYPE_NUMBER="pitaj za broj sa porukom",T.Msg.TEXT_PROMPT_TYPE_TEXT="pitaj za tekst sa porukom",T.Msg.TEXT_REPLACE_HELPURL="https://github.com/google/blockly/wiki/Text#replacing-substrings",T.Msg.TEXT_REPLACE_MESSAGE0="zamena %1 sa %2 u %3",T.Msg.TEXT_REPLACE_TOOLTIP="Zamena svih pojava nekog teksta unutar nekog drugog teksta.",T.Msg.TEXT_REVERSE_HELPURL="https://github.com/google/blockly/wiki/Text#reversing-text",T.Msg.TEXT_REVERSE_MESSAGE0="obrnuto %1",T.Msg.TEXT_REVERSE_TOOLTIP="Obrće redosled karaktera u tekstu.",T.Msg.TEXT_TEXT_HELPURL="https://sr.wikipedia.org/wiki/Niska",T.Msg.TEXT_TEXT_TOOLTIP="Slovo, reč ili red teksta.",T.Msg.TEXT_TRIM_HELPURL="https://github.com/google/blockly/wiki/Text#trimming-removing-spaces",T.Msg.TEXT_TRIM_OPERATOR_BOTH="trim praznine sa obe strane",T.Msg.TEXT_TRIM_OPERATOR_LEFT="skratiti prostor sa leve strane",T.Msg.TEXT_TRIM_OPERATOR_RIGHT="skratiti prostor sa desne strane",T.Msg.TEXT_TRIM_TOOLTIP="Vraća kopiju teksta sa uklonjenim prostorom sa jednog od dva kraja.",T.Msg.TODAY="Danas",T.Msg.UNDO="Opozovi",T.Msg.UNNAMED_KEY="unnamed",T.Msg.VARIABLES_DEFAULT_NAME="stavka",T.Msg.VARIABLES_GET_CREATE_SET="Napravi „postavi %1“",T.Msg.VARIABLES_GET_HELPURL="https://github.com/google/blockly/wiki/Variables#get",T.Msg.VARIABLES_GET_TOOLTIP="Vraća vrednost ove promenljive.",T.Msg.VARIABLES_SET="postavi %1 u %2",T.Msg.VARIABLES_SET_CREATE_GET="Napravi „preuzmi %1“",T.Msg.VARIABLES_SET_HELPURL="https://github.com/google/blockly/wiki/Variables#set",T.Msg.VARIABLES_SET_TOOLTIP="Postavlja promenljivu tako da bude jednaka ulazu.",T.Msg.VARIABLE_ALREADY_EXISTS="Promenljiva pod imenom '%1' već postoji.",T.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE="Varijabla po imenu '%1' već postoji za drugu varijablu tipa '%2'.",T.Msg.VARIABLE_ALREADY_EXISTS_FOR_A_PARAMETER="A variable named '%1' already exists as a parameter in the procedure '%2'.",T.Msg.WORKSPACE_ARIA_LABEL="Blockly Workspace",T.Msg.WORKSPACE_COMMENT_DEFAULT_TEXT="Say something...",T.Msg.CONTROLS_FOREACH_INPUT_DO=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.CONTROLS_FOR_INPUT_DO=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF=T.Msg.CONTROLS_IF_MSG_ELSEIF,T.Msg.CONTROLS_IF_ELSE_TITLE_ELSE=T.Msg.CONTROLS_IF_MSG_ELSE,T.Msg.CONTROLS_IF_IF_TITLE_IF=T.Msg.CONTROLS_IF_MSG_IF,T.Msg.CONTROLS_IF_MSG_THEN=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.CONTROLS_WHILEUNTIL_INPUT_DO=T.Msg.CONTROLS_REPEAT_INPUT_DO,T.Msg.LISTS_CREATE_WITH_ITEM_TITLE=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.LISTS_GET_INDEX_HELPURL=T.Msg.LISTS_INDEX_OF_HELPURL,T.Msg.LISTS_GET_INDEX_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.LISTS_INDEX_OF_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.LISTS_SET_INDEX_INPUT_IN_LIST=T.Msg.LISTS_INLIST,T.Msg.MATH_CHANGE_TITLE_ITEM=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.PROCEDURES_DEFRETURN_COMMENT=T.Msg.PROCEDURES_DEFNORETURN_COMMENT,T.Msg.PROCEDURES_DEFRETURN_DO=T.Msg.PROCEDURES_DEFNORETURN_DO,T.Msg.PROCEDURES_DEFRETURN_PROCEDURE=T.Msg.PROCEDURES_DEFNORETURN_PROCEDURE,T.Msg.PROCEDURES_DEFRETURN_TITLE=T.Msg.PROCEDURES_DEFNORETURN_TITLE,T.Msg.TEXT_APPEND_VARIABLE=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM=T.Msg.VARIABLES_DEFAULT_NAME,T.Msg.LOGIC_HUE="210",T.Msg.LOOPS_HUE="120",T.Msg.MATH_HUE="230",T.Msg.TEXTS_HUE="160",T.Msg.LISTS_HUE="260",T.Msg.COLOUR_HUE="20",T.Msg.VARIABLES_HUE="330",T.Msg.VARIABLES_DYNAMIC_HUE="310",T.Msg.PROCEDURES_HUE="290",T.Msg})?a.apply(_,s):a)||(T.exports=E)}}]);