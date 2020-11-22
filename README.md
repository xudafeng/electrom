# electrom

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/electrom.svg?style=flat-square
[npm-url]: https://npmjs.org/package/electrom
[travis-image]: https://img.shields.io/travis/xudafeng/electrom.svg?style=flat-square
[travis-url]: https://travis-ci.org/xudafeng/electrom
[coveralls-image]: https://img.shields.io/coveralls/xudafeng/electrom.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/xudafeng/electrom?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/electrom.svg?style=flat-square
[download-url]: https://npmjs.org/package/electrom

> electrom

## Installment

```bash
$ npm i electrom --save-dev
```

## Usage

```bash
$ npx electrom 100
```

## APIs

```javascript
const electrom = require('electrom');

electrom(100)
  .then(data => {
    console.log(data);
  })
  .catch(e) {
    console.log(e);
  }
```

## License

The MIT License (MIT)