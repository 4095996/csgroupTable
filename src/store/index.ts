import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer, { initialState } from './reducers';
import { thunk } from 'redux-thunk';

const persistedState = localStorage.getItem('reduxState')
    ? JSON.parse(localStorage.getItem('reduxState') || '{}')
    : {};

const preloadedState =
    Object.keys(persistedState).length === 0 ? initialState : persistedState;

const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk))
);

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export default store;