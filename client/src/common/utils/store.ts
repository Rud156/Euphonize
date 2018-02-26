import { createStore, combineReducers, Store } from 'redux';

import { playlistReducer, IPlaylistReducer } from '../reducers/playlist-reducer';
import { playerReducer, IPlayerReducer } from '../reducers/player-reducer';
import { favouritesReducer, IFavouritesReducer } from '../reducers/favourite-reducer';

interface IStore {
  playlist: IPlaylistReducer;
  player: IPlayerReducer;
  favourites: IFavouritesReducer
}

class StoreClass {
  private combinedReducers;
  public dataStore: Store<IStore>;

  constructor() {
    this.combinedReducers = combineReducers({
      playlist: playlistReducer,
      player: playerReducer,
      favourites: favouritesReducer
    });

    this.dataStore = createStore(
      this.combinedReducers,
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
}

export default StoreClass;
