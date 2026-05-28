# proxy-disposable

[![github actions](https://github.com/remcohaszing/proxy-disposable/actions/workflows/ci.yaml/badge.svg)](https://github.com/remcohaszing/proxy-disposable/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/remcohaszing/proxy-disposable/branch/main/graph/badge.svg)](https://codecov.io/gh/remcohaszing/proxy-disposable)
[![npm version](https://img.shields.io/npm/v/proxy-disposable)](https://www.npmjs.com/package/proxy-disposable)
[![npm downloads](https://img.shields.io/npm/dm/proxy-disposable)](https://www.npmjs.com/package/proxy-disposable)

Make objects with a `dispose` method compatible with an ES6
[disposable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/dispose).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [`d`](#d)
- [Why](#why)
- [Compatibility](#compatibility)
- [License](#license)

## Installation

```sh
npm install proxy-disposable
```

## Usage

Create an object with a `dispose` method. Then wrap it using the [`d`](#d) function. For example,
the following script:

```js
import { d } from 'proxy-disposable'

using disposable = d({
  name: 'object',

  dispose() {
    console.log('Disposed', this.name)
  }
})

disposable.name = 'disposable'
```

Yields:

```plaintext
Disposed disposable
```

## API

### `d`

Wrap an object with a `dispose` method as an ES6
[disposable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/dispose).

#### Arguments

- `disposable` (`Object`) — The disposable to wrap.

#### Returns

The input disposable as an ES6 disposable.

## Why

The `dispose` method is commonly used in various projects, such as
[language server](https://github.com/microsoft/vscode-languageserver-node) related projects and
[Monaco editor](https://microsoft.github.io/monaco-editor).

This package makes these nicer to work with in contexts where you want to quickly create an object,
and clean up afterwards. A typical use case is tests.

## Compatibility

This project is compatible with Node.js 24 or greater.

## License

[MIT](LICENSE.md) © [Remco Haszing](https://github.com/remcohaszing)
