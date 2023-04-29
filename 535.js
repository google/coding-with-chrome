/*! For license information please see 535.js.LICENSE.txt */
"use strict";(self.webpackChunkcoding_with_chrome=self.webpackChunkcoding_with_chrome||[]).push([[535],{32354:(n,e,l)=>{var t=l(34948),a=l.n(t),o=l(5466);t.Blocks.math_input_angle={init:function(){this.setHelpUrl(""),this.setColour(230),this.appendDummyInput().appendField(new(a().FieldAngle)(0),"angle"),this.setOutput(!0,"Number"),this.setTooltip("")}},o.javascriptGenerator.math_input_angle=function(n){return[n.getFieldValue("angle")||0,o.javascriptGenerator.ORDER_NONE]}},63858:(n,e,l)=>{l.d(e,{Z:()=>t});const t={defaultBlocks:[{kind:"block",type:"colour_picker"},{kind:"block",type:"colour_random"},{kind:"block",blockxml:'\n  <block type="colour_rgb">\n    <value name="RED">\n      <shadow type="math_number">\n        <field name="NUM">100</field>\n      </shadow>\n    </value>\n    <value name="GREEN">\n      <shadow type="math_number">\n        <field name="NUM">50</field>\n      </shadow>\n    </value>\n    <value name="BLUE">\n      <shadow type="math_number">\n        <field name="NUM">0</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="colour_blend">\n    <value name="COLOUR1">\n      <shadow type="colour_picker">\n        <field name="COLOUR">#ff0000</field>\n      </shadow>\n    </value>\n    <value name="COLOUR2">\n      <shadow type="colour_picker">\n        <field name="COLOUR">#3333ff</field>\n      </shadow>\n    </value>\n    <value name="RATIO">\n      <shadow type="math_number">\n        <field name="NUM">0.5</field>\n      </shadow>\n    </value>\n  </block>'}]}},33014:(n,e,l)=>{l.d(e,{Z:()=>t});l(32354);const t={defaultBlocks:[{kind:"block",blockxml:'\n  <block type="variables_set">\n    <field name="VAR">list</field>\n    <value name="VALUE">\n      <block type="lists_create_with">\n        <mutation items="3"></mutation>\n        <value name="ADD0">\n          <block type="text">\n            <field name="TEXT"></field>\n          </block>\n        </value>\n        <value name="ADD1">\n          <block type="text">\n            <field name="TEXT"></field>\n          </block>\n        </value>\n        <value name="ADD2">\n          <block type="text">\n            <field name="TEXT"></field>\n          </block>\n        </value>\n      </block>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="lists_create_with">\n    <mutation items="0"></mutation>\n  </block>'},{kind:"block",type:"lists_create_with"},{kind:"block",blockxml:'\n  <block type="lists_repeat">\n    <value name="NUM">\n      <shadow type="math_number">\n        <field name="NUM">5</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",type:"lists_length"},{kind:"block",type:"lists_isEmpty"},{kind:"block",blockxml:'\n  <block type="lists_indexOf">\n    <value name="VALUE">\n      <block type="variables_get">\n        <field name="VAR">list</field>\n      </block>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="lists_getIndex">\n    <value name="VALUE">\n      <block type="variables_get">\n        <field name="VAR">list</field>\n      </block>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="lists_setIndex">\n    <value name="LIST">\n      <block type="variables_get">\n        <field name="VAR">list</field>\n      </block>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="lists_getSublist">\n    <value name="LIST">\n      <block type="variables_get">\n        <field name="VAR">list</field>\n      </block>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="lists_split">\n    <value name="DELIM">\n      <shadow type="text">\n        <field name="TEXT">,</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",type:"lists_sort"}]}},50072:(n,e,l)=>{l.d(e,{Z:()=>t});const t={defaultBlocks:[{kind:"block",type:"controls_if"},{kind:"block",type:"logic_compare"},{kind:"block",type:"logic_operation"},{kind:"block",type:"logic_negate"},{kind:"block",type:"logic_boolean"},{kind:"block",type:"logic_null"},{kind:"block",type:"logic_ternary"}]}},2662:(n,e,l)=>{l.d(e,{Z:()=>c});var t=l(34948),a=l.n(t),o=l(5466),i=l(83663);t.Blocks.controls_infinity_loop={init:function(){this.setHelpUrl(""),this.setColour(120),this.appendDummyInput().appendField(i.ZP.t("BLOCKS_REPEAT_FOREVER")),this.appendStatementInput("CODE").setAlign(a().ALIGN_CENTRE),this.setPreviousStatement(!0),this.setNextStatement(!0),this.setTooltip("")}},o.javascriptGenerator.controls_infinity_loop=function(n){return`\n  let infinity_loop = function() {\n    try {\n      ${o.javascriptGenerator.statementToCode(n,"CODE")}\n    } catch (err) {\n      return;\n    }\n    window.setTimeout(infinity_loop, 50);\n  };\n  infinity_loop();\n  `};const c={defaultBlocks:[{kind:"block",blockxml:'\n  <block type="controls_repeat_ext">\n    <value name="TIMES">\n      <block type="math_number"><field name="NUM">10</field></block>\n    </value>\n  </block>'},{kind:"block",type:"controls_infinity_loop"},{kind:"block",blockxml:'\n  <block type="controls_for">\n    <value name="FROM">\n      <block type="math_number"><field name="NUM">1</field></block>\n    </value>\n    <value name="TO">\n      <block type="math_number"><field name="NUM">10</field></block>\n    </value><value name="BY">\n      <block type="math_number"><field name="NUM">1</field></block>\n    </value>\n  </block>'},{kind:"block",type:"controls_forEach"},{kind:"block",type:"controls_flow_statements"},{kind:"block",type:"controls_whileUntil"}]}},45532:(n,e,l)=>{l.d(e,{Z:()=>t});l(32354);const t={defaultBlocks:[{kind:"block",type:"math_number"},{kind:"block",type:"math_input_angle"},{kind:"block",blockxml:'\n  <block type="math_arithmetic">\n    <value name="A">\n      <shadow type="math_number">\n        <field name="NUM">1</field>\n      </shadow>\n    </value>\n    <value name="B">\n      <shadow type="math_number">\n        <field name="NUM">1</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="math_single">\n    <value name="NUM">\n      <shadow type="math_number">\n        <field name="NUM">9</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="math_trig">\n    <value name="NUM">\n      <shadow type="math_number">\n        <field name="NUM">45</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",type:"math_constant"},{kind:"block",blockxml:'\n  <block type="math_number_property">\n    <value name="NUMBER_TO_CHECK">\n      <shadow type="math_number">\n        <field name="NUM">0</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="math_change">\n    <value name="DELTA">\n      <shadow type="math_number">\n        <field name="NUM">1</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="math_round">\n    <value name="NUM">\n      <shadow type="math_number">\n        <field name="NUM">3.1</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",type:"math_on_list"},{kind:"block",blockxml:'\n  <block type="math_modulo">\n    <value name="DIVIDEND">\n      <shadow type="math_number">\n        <field name="NUM">64</field>\n      </shadow>\n    </value>\n    <value name="DIVISOR">\n      <shadow type="math_number">\n        <field name="NUM">10</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="math_constrain">\n    <value name="VALUE">\n      <shadow type="math_number">\n        <field name="NUM">50</field>\n      </shadow>\n    </value>\n    <value name="LOW">\n      <shadow type="math_number">\n        <field name="NUM">1</field>\n      </shadow>\n    </value>\n    <value name="HIGH">\n      <shadow type="math_number">\n        <field name="NUM">100</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="math_random_int">\n    <value name="FROM">\n      <shadow type="math_number">\n        <field name="NUM">1</field>\n      </shadow>\n    </value>\n    <value name="TO">\n      <shadow type="math_number">\n        <field name="NUM">100</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",type:"math_random_float"}]}},21241:(n,e,l)=>{l.d(e,{Z:()=>t});l(32354);const t={defaultBlocks:[{kind:"block",type:"text"},{kind:"block",type:"text_join"},{kind:"block",blockxml:'\n  <block type="text_append">\n    <value name="TEXT">\n      <shadow type="text"></shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="text_length">\n    <value name="VALUE">\n      <shadow type="text">\n        <field name="TEXT">abc</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="text_isEmpty">\n    <value name="VALUE">\n      <shadow type="text">\n        <field name="TEXT"></field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="text_indexOf">\n    <value name="VALUE">\n      <block type="variables_get">\n        <field name="VAR">text</field>\n      </block>\n    </value>\n    <value name="FIND">\n      <shadow type="text">\n        <field name="TEXT">abc</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="text_charAt">\n    <value name="VALUE">\n      <block type="variables_get">\n        <field name="VAR">text</field>\n      </block>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="text_getSubstring">\n    <value name="STRING">\n      <block type="variables_get">\n        <field name="VAR">text</field>\n      </block>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="text_changeCase">\n    <value name="TEXT">\n      <shadow type="text">\n        <field name="TEXT">abc</field>\n      </shadow>\n    </value>\n  </block>'},{kind:"block",blockxml:'\n  <block type="text_trim">\n    <value name="TEXT">\n      <shadow type="text">\n        <field name="TEXT">abc</field>\n      </shadow>\n    </value>\n  </block>'}]}},80535:(n,e,l)=>{l.r(e),l.d(e,{Toolbox:()=>d,default:()=>b});var t=l(63858),a=l(33014),o=l(50072),i=l(2662),c=l(45532),k=l(21241);class d{static getToolbox(){return{kind:"categoryToolbox",contents:[t.Z.defaultBlocks,a.Z.defaultBlocks,o.Z.defaultBlocks,i.Z.defaultBlocks,c.Z.defaultBlocks,k.Z.defaultBlocks]}}}const b=d}}]);