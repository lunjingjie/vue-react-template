export function getSessionValue(key) {
  return window.sessionStorage.getItem(key);
}

export function setSessionValue(key, value) {
  window.sessionStorage.setItem(key, value);
}

export function deleteSession(key) {
  window.sessionStorage.removeItem(key);
}
