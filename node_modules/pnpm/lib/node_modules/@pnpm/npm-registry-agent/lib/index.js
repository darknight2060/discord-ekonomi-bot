"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpAgent = require("agentkeepalive");
const createHttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");
const LRU = require("lru-cache");
const SocksProxyAgent = require("socks-proxy-agent");
const url_1 = require("url");
const getProcessEnv_1 = require("./getProcessEnv");
const HttpsAgent = HttpAgent.HttpsAgent;
const AGENT_CACHE = new LRU({ max: 50 });
function getAgent(uri, opts) {
    var _a;
    const parsedUri = new url_1.URL(uri);
    const isHttps = parsedUri.protocol === 'https:';
    const pxuri = getProxyUri(uri, opts);
    const key = [
        `https:${isHttps}`,
        pxuri
            ? `proxy:${pxuri.protocol}//${pxuri.host}:${pxuri.port}`
            : '>no-proxy<',
        `local-address:${_a = opts.localAddress, (_a !== null && _a !== void 0 ? _a : '>no-local-address<')}`,
        `strict-ssl:${isHttps ? !!opts.strictSSL : '>no-strict-ssl<'}`,
        `ca:${(isHttps && opts.ca) || '>no-ca<'}`,
        `cert:${(isHttps && opts.cert) || '>no-cert<'}`,
        `key:${(isHttps && opts.key) || '>no-key<'}`,
    ].join(':');
    if (AGENT_CACHE.peek(key)) {
        return AGENT_CACHE.get(key);
    }
    if (pxuri) {
        const proxy = getProxy(pxuri, opts, isHttps);
        AGENT_CACHE.set(key, proxy);
        return proxy;
    }
    // If opts.timeout is zero, set the agentTimeout to zero as well. A timeout
    // of zero disables the timeout behavior (OS limits still apply). Else, if
    // opts.timeout is a non-zero value, set it to timeout + 1, to ensure that
    // the node-fetch-npm timeout will always fire first, giving us more
    // consistent errors.
    const agentTimeout = typeof opts.timeout !== 'number' || opts.timeout === 0 ? 0 : opts.timeout + 1;
    const agent = isHttps
        ? new HttpsAgent({
            ca: opts.ca,
            cert: opts.cert,
            key: opts.key,
            localAddress: opts.localAddress,
            maxSockets: opts.maxSockets || 15,
            rejectUnauthorized: opts.strictSSL,
            timeout: agentTimeout,
        }) // tslint:disable-line:no-any
        : new HttpAgent({
            localAddress: opts.localAddress,
            maxSockets: opts.maxSockets || 15,
            timeout: agentTimeout,
        }); // tslint:disable-line:no-any
    AGENT_CACHE.set(key, agent);
    return agent;
}
exports.default = getAgent;
function checkNoProxy(uri, opts) {
    const host = new url_1.URL(uri).hostname.split('.').filter(x => x).reverse();
    let noproxy = (opts.noProxy || getProcessEnv_1.default('no_proxy'));
    if (typeof noproxy === 'string') {
        const noproxyArr = noproxy.split(/\s*,\s*/g);
        return noproxyArr.some(no => {
            const noParts = no.split('.').filter(x => x).reverse();
            if (!noParts.length) {
                return false;
            }
            for (let i = 0; i < noParts.length; i++) {
                if (host[i] !== noParts[i]) {
                    return false;
                }
            }
            return true;
        });
    }
    return noproxy;
}
function getProxyUri(uri, opts) {
    const { protocol } = new url_1.URL(uri);
    let proxy = opts.proxy || (protocol === 'https:' && getProcessEnv_1.default('https_proxy')) || (protocol === 'http:' && getProcessEnv_1.default(['https_proxy', 'http_proxy', 'proxy']));
    if (!proxy) {
        return null;
    }
    if (!proxy.startsWith('http')) {
        proxy = protocol + '//' + proxy;
    }
    const parsedProxy = (typeof proxy === 'string') ? new url_1.URL(proxy) : proxy;
    return !checkNoProxy(uri, opts) && parsedProxy;
}
function getProxy(proxyUrl, opts, isHttps) {
    let popts = {
        auth: (proxyUrl.username ? (proxyUrl.password ? `${proxyUrl.username}:${proxyUrl.password}` : proxyUrl.username) : undefined),
        ca: opts.ca,
        cert: opts.cert,
        host: proxyUrl.hostname,
        key: opts.key,
        localAddress: opts.localAddress,
        maxSockets: opts.maxSockets || 15,
        path: proxyUrl.pathname,
        port: proxyUrl.port,
        protocol: proxyUrl.protocol,
        rejectUnauthorized: opts.strictSSL,
        timeout: typeof opts.timeout !== 'number' || opts.timeout === 0 ? 0 : opts.timeout + 1,
    };
    if (proxyUrl.protocol === 'http:' || proxyUrl.protocol === 'https:') {
        if (!isHttps) {
            return createHttpProxyAgent(popts);
        }
        else {
            return new HttpsProxyAgent(popts);
        }
    }
    if (proxyUrl.protocol && proxyUrl.protocol.startsWith('socks')) {
        return new SocksProxyAgent(popts);
    }
}
