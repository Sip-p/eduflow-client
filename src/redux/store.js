import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import paymentReducer from './paymentSlice.js'
export const store=configureStore({
    reducer:{
        auth:authReducer,
        payment:paymentReducer

    }
})

export default store