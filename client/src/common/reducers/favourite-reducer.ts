import {
  ADD_TO_FAVOURITES,
  REMOVE_FROM_FAVOURITES,
  CLEAR_FAVOURITES,
} from '../actions/favourite-actions';

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
      // TODO: Add To LocalStorage
      return {
        id: state.id + 1,
        favourites: currentFavourites,
      };

    case REMOVE_FROM_FAVOURITES:
      const trackId = action.payload.id;
      const filteredFavourites = state.favourites.filter(element => {
        return element.id !== trackId;
      });
      return {
        id: state.id,
        favourites: filteredFavourites,
      };

    case CLEAR_FAVOURITES:
      return {
        id: 0,
        favourites: [],
      };

    default:
      return state;
  }
};
