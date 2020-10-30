'use strict'
const assert = require('assert')
const toNerfDart = require('nerf-dart')

module.exports = function getCredentialsByURI (config, uri) {
  assert(uri && typeof uri === 'string', 'registry URL is required')
  const nerfed = toNerfDart(uri)
  const defnerf = toNerfDart(config.registry)

  const creds = getScopedCredentials(nerfed, `${nerfed}:`, config)
  if (nerfed !== defnerf) return creds

  return {
    ...getScopedCredentials(nerfed, '', config),
    ...creds
  }
}

function getScopedCredentials (nerfed, scope, config) {
  // hidden class micro-optimization
  const c = {}

  // used to override scope matching for tokens as well as legacy auth
  if (config[`${scope}always-auth`] !== undefined) {
    const val = config[`${scope}always-auth`]
    c.alwaysAuth = val === 'false' ? false : !!val
  }

  // Check for bearer token
  if (config[`${scope}_authToken`]) {
    c.authHeaderValue = `Bearer ${config[`${scope}_authToken`]}`
    return c
  }

  // Check for basic auth token
  if (config[`${scope}_auth`]) {
    c.authHeaderValue = `Basic ${config[`${scope}_auth`]}`
    return c
  }

  // Check for username/password auth
  let username, password
  if (config[`${scope}username`]) {
    username = config[`${scope}username`]
  }
  if (config[`${scope}_password`]) {
    if (scope === '') {
      password = config[`${scope}_password`]
    } else {
      password = Buffer.from(config[`${scope}_password`], 'base64').toString('utf8')
    }
  }

  if (username && password) {
    c.authHeaderValue = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  }

  return c
}
