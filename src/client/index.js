import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import App from './App';
import rootReducer from './reducers';
import createSagaMiddleWare from 'redux-saga';
import rootSaga from './saga';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleWare();
const middlewares = [sagaMiddleware];

const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(...middlewares)),
);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root')
);
