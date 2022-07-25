// Root Reducer
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import authUserReducer from './authUser';
import userReducer from './userReducer';
import presentationReducer from './presentationReducer';
import { LOGOUT } from '../types';

// export let rootReducer = combineReducers({
// 	authUser: authUserReducer,
// 	auth: authReducer,
// 	presentation: presentationReducer,
// 	user: userReducer,
// });
export let appReducer = combineReducers({
	authUser: authUserReducer,
	auth: authReducer,
	presentation: presentationReducer,
	user: userReducer,
});

const rootReducer = (state, action) => {
	if (action.type === LOGOUT || action.type === 'LOGOUT_SUCCESS') {
		return appReducer(undefined, action);
	}

	return appReducer(state, action);
};

export default rootReducer;
