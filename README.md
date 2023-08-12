# mongoose-bread-url-builder

A Url Builder for [mongoose-bread](https://github.com/mjlux/mongoose-bread).

[![npm version](https://img.shields.io/npm/v/mongoose-bread-url-builder.svg)](https://www.npmjs.com/package/mongoose-bread-url-builder)
[![unittests](https://github.com/mjlux/mongoose-bread-url-builder/actions/workflows/unittests.js.yml/badge.svg)](https://github.com/mjlux/mongoose-bread-url-builder/actions/workflows/unittests.js.yml)

## Why This Plugin

mongoose-bread is a pagination and softdelete library for quick feature-rich setup of JSON apis.
This package accompanies the frontend by creating urls with chainable methods, instead of string concatenation, to create api requests.

## Dependencies

none

## Installation

```sh
npm install mongoose-bread-url-builder
```

## Quick Use

Import the plugin in your Project

```js
// your imports
import BreadUrlBuilder from "mongoose-bread-url-builder";

const rootUrl = "https://api.example.com/api/v1/"

const urlBuilder = new BreadUrlBuilder(rootUrl)
```


## License

[MIT](LICENSE)