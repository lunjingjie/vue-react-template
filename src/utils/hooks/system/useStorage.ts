export function getSessionValue(key: string) {
  return window.sessionStorage.getItem(key);
}

export function setSessionValue(key: string, value: any) {
  window.sessionStorage.setItem(key, value);
}

export function deleteSession(key: string) {
  window.sessionStorage.removeItem(key);
}
