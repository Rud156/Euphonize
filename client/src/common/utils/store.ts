import { createStore, combineReducers, Store } from 'redux';

import { nowPlayingReducer, INowPlayingReducer } from '../reducers/now-playing-reducer';
import { playerReducer, IPlayerReducer } from '../reducers/player-reducer';
import { playlistReducer, IPlaylistReducer } from '../reducers/playlist-reducer';

interface IStore {
  playlist: IPlaylistReducer;
  player: IPlayerReducer;
  nowPlaying: INowPlayingReducer;
}

class StoreClass {
  private combinedReducers;
  public dataStore: Store<IStore>;

  constructor() {
    this.combinedReducers = combineReducers({
      playlist: playlistReducer,
      player: playerReducer,
      nowPlaying: nowPlayingReducer,
    });

    this.dataStore = createStore(
      this.combinedReducers,
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
}

export default StoreClass;
