// client/src/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import authReducer from './reducers/authReducer';
import alertReducer from './reducers/alertReducer';
import cartReducer from './reducers/cartReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    alert: alertReducer,
    cart: cartReducer
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;