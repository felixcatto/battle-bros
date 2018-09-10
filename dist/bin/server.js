#!/usr/bin/env node
"use strict";

var _app = _interopRequireDefault(require("../server/app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_app.default.listen(process.env.PORT || 4000);