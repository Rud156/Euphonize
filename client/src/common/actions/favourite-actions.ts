export const ADD_TO_FAVOURITES = 'ADD_TO_FAVOURITES';
export const REMOVE_FROM_FAVOURITES = 'REMOVE_FROM_FAVOURITES';
export const CLEAR_FAVOURITES = 'CLEAR_FAVOURITES';

export const addToFavourites = (trackName: string, artistName: string, image: string) => {
  return {
    type: ADD_TO_FAVOURITES,
    payload: {
      trackName,
      artistName,
      image,
    },
  };
};

export const removeFromFavourites = (id: number) => {
  return {
    type: REMOVE_FROM_FAVOURITES,
    payload: {
      id,
    },
  };
};

export const clearFavourites = () => {
  return {
    type: CLEAR_FAVOURITES,
    payload: {},
  };
};
