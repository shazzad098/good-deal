import axios from 'axios';
import { getProductsStart, getProductsSuccess, getProductsFailure } from '../reducers/productReducer';

export const getProducts = (filters = {}) => async (dispatch) => {
    try {
        dispatch(getProductsStart());

        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });

        const res = await axios.get(`/api/products?${params}`);
        dispatch(getProductsSuccess(res.data.products));
    } catch (error) {
        dispatch(getProductsFailure(error.response?.data?.message || 'Error fetching products'));
    }
};