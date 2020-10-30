"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createFetchRetry = require('@zeit/fetch-retry');
const nodeFetch = require('node-fetch-unix');
exports.default = createFetchRetry(nodeFetch);
exports.FetchError = nodeFetch.FetchError;
exports.Headers = nodeFetch.Headers;
exports.Request = nodeFetch.Request;
exports.Response = nodeFetch.Response;
