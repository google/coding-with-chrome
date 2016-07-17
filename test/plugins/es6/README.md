# karma-es6-preprocessor

Preprocessor for es6 test to add "use strict"; on the fly for compatibility
reasons for some browsers.

Example error message:
```js
Uncaught SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
```

## Installation
Add `karma-es6-preprocessor` as a devDependency by:
```bash
npm install karma-es6-preprocessor --save-dev
```

## Configuration

Following code shows the default configuration

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.js': ['es6']
    },
   ...
  })
}
```

Disclaimer
----------
This is not an official Google product.


Author
------
[Markus Bordihn](https://github.com/MarkusBordihn)
