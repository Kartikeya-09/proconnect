import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer';
import postReducer from './reducer/postReducer';

/** 
 * STEPS for state management using Redux:
 * Submit action
 * Handle action in it's reducer
 * Register here -> reducers/index.js
 * Provide store to app -> main.jsx
 * Use the state and dispatch action -> in component
 */

export const store = configureStore({
  reducer: {
    auth :  authReducer,
    postReducer: postReducer
  },
});
