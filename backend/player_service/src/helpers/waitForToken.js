// https://codepen.io/eanbowman/pen/jxqKjJ
const timeout = 1000000
const lib = function () {}

export function setNewPlayerToken(token) {
  lib.token = token
}

export function resetPlayerToken() {
  for (var key in lib) {
    if (lib.hasOwnProperty(key)) {
      delete lib[key]
    }
  }
}

export function ensureTokenIsSet() {
  const start = Date.now()
  return new Promise(waitForToken)

  function waitForToken(resolve, reject) {
    if (lib && lib.token) resolve(lib.token)
    else if (timeout && Date.now() - start >= timeout)
      reject(new Error("timeout"))
    else setTimeout(waitForToken.bind(this, resolve, reject), 300)
  }
}
