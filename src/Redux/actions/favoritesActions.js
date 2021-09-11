import { ActionTypes } from '../constants/action-types'
export const getFavorites = () => {
  return {
    type: ActionTypes.GET_FAVORITES
  }
}
export const setFavorites = favorites => {
  return {
    type: ActionTypes.SET_FAVORITES,
    payload: favorites
  }
}
export const addToFavorites = favorite => {
  return {
    type: ActionTypes.ADD_TO_FAVORITES,
    payload: favorite
  }
}
