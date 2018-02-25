import {
  ADD_TO_FAVOURITES,
  REMOVE_FROM_FAVOURITES,
  CLEAR_FAVOURITES,
} from '../actions/favourite-actions';

import { writeToLocalStorage } from '../utils/utils';

interface IFavourite {
  trackName: string;
  artistName: string;
  image: string;
  id: number;
}

interface IFavouritesReducer {
  id: number;
  favourites: IFavourite[];
}

const defaultState: IFavouritesReducer = {
  id: 0,
  favourites: [],
};

export const favouritesReducer = (state = defaultState, action): IFavouritesReducer => {
  switch (action.type) {
    case ADD_TO_FAVOURITES:
      const currentFavourites = state.favourites;
      const currentId = state.id;
      const newFavourite: IFavourite = {
        id: currentId,
        ...action.payload,
      };
      currentFavourites.push(newFavourite);
      const addFavouritesStateObject = {
        id: state.id + 1,
        favourites: currentFavourites,
      };
      writeToLocalStorage('favourites', addFavouritesStateObject);
      return addFavouritesStateObject;

    case REMOVE_FROM_FAVOURITES:
      const trackId = action.payload.id;
      const filteredFavourites = state.favourites.filter(element => {
        return element.id !== trackId;
      });
      const removeFavouritesStateObject = {
        id: state.id,
        favourites: filteredFavourites,
      };
      writeToLocalStorage('favourites', removeFavouritesStateObject);
      return removeFavouritesStateObject;

    case CLEAR_FAVOURITES:
      const clearFavouritesStateObject = {
        id: 0,
        favourites: [],
      };
      writeToLocalStorage('favourites', clearFavouritesStateObject);
      return clearFavouritesStateObject;

    default:
      return state;
  }
};
