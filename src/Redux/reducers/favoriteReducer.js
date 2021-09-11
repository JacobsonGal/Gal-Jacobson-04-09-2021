import { ActionTypes } from '../constants/action-types'
import storageService from '../../services/storage-service'
const FAV_DATA = 'favorite-data'
const data = storageService.loadFromStorage(FAV_DATA)

const initialState = {
  favorites: data ? data : []
}

export const favoriteReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_FAVORITES:
      return { ...state, favorites: payload }

    case ActionTypes.ADD_TO_FAVORITES:
      const idx = state.favorites.findIndex(fav => fav.id === payload.id)
      idx === -1
        ? state.favorites.push(payload)
        : state.favorites.splice(idx, 1)
      storageService.saveToStorage(FAV_DATA, state.favorites)
      return { ...state, favorites: storageService.loadFromStorage(FAV_DATA) }

    default:
      return state
  }
}
