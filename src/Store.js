import { observable, computed, action, decorate } from 'mobx'
import storageService from './services/storage-service'
const FAV_DATA = 'favorite-data'

class Store {
  constructor () {
    const data = storageService.loadFromStorage(FAV_DATA)
    if (data) this.favorites = data
    else this.favorites = []
  }

  get getFavorites () {
    return this.favorites
  }

  addToFavorite = city => {
    const idx = this.favorites.findIndex(fav => fav.id === city.id)
    if (idx === -1) {
      this.favorites.push(city)
    } else {
      this.favorites.splice(idx, 1)
    }
    storageService.saveToStorage(FAV_DATA, this.favorites)
  }
}

decorate(Store, {
  getFavorites: computed,
  favorites: observable,
  addToFavorite: action
})

export default new Store()
