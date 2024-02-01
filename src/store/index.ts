// import { applyMiddleware, compose } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
// import thunk from 'redux-thunk';
import counterReducer from '../pages/basicManage/counterSlice';
import systemReducer from './systemSlice';

// const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default configureStore({
	reducer: {
		counter: counterReducer,
		system: systemReducer
	},
	// middleware: [composeEnhancers, applyMiddleware, thunk],
	devTools: process.env.NODE_ENV !== 'production'
});
