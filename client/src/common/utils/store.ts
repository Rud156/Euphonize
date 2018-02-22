import { createStore, combineReducers, Store } from 'redux';
import PlaylistReducer from '../reducers/playlist-reducer';

class StoreClass {
  private combinedReducers;
  public store: Store<{}>;

  constructor() {
    this.combinedReducers = combineReducers({
      playlist: PlaylistReducer,
    });

    this.store = createStore(
      this.combinedReducers,
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
}

export default StoreClass;
