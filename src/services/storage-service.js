function loadFromStorage (key) {
  var val = localStorage.getItem(key)
  return val ? JSON.parse(val) : null
}

function saveToStorage (key, val) {
  localStorage[key] = JSON.stringify(val)
}

const storageService = {
  loadFromStorage,
  saveToStorage
}
export default storageService
