import { createStore, combineReducers, Store } from 'redux';

import { playlistReducer, IPlaylistReducer } from '../reducers/playlist-reducer';
import { playerReducer, IPlayerReducer } from '../reducers/player-reducer';

interface IStore {
  playlist: IPlaylistReducer;
  player: IPlayerReducer;
}

class StoreClass {
  private combinedReducers;
  public dataStore: Store<IStore>;

  constructor() {
    this.combinedReducers = combineReducers({
      playlist: playlistReducer,
      player: playerReducer,
    });

    this.dataStore = createStore(
      this.combinedReducers,
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
}

export default StoreClass;
