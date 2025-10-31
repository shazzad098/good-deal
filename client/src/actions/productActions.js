import axios from 'axios';
import { getProductsStart, getProductsSuccess, getProductsFailure } from '../reducers/productReducer';

// === PORIBORTON EKHANE ===
// 'filters' parameter-ti remove kora hoyeche.
export const getProducts = () => async (dispatch) => {
    try {
        dispatch(getProductsStart());

        // Kono filter query chara direct '/api/products'-e call kora hocche
        // Fole backend shobshomoy shob product pathabe
        const res = await axios.get('/api/products');
        
        dispatch(getProductsSuccess(res.data.products));
    } catch (error) {
        dispatch(getProductsFailure(error.response?.data?.message || 'Error fetching products'));
    }
};