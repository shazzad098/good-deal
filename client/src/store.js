// client/src/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import authReducer from './reducers/authReducer';
import alertReducer from './reducers/alertReducer';
import cartReducer from './reducers/cartReducer';
import productReducer from './reducers/productReducer'; // ✅ 1. ইম্পোর্ট করুন

const rootReducer = combineReducers({
    auth: authReducer,
    alert: alertReducer,
    cart: cartReducer,
    products: productReducer // ✅ 2. এখানে products reducer যোগ করুন
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;