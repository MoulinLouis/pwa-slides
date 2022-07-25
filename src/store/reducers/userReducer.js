import { USER_FETCH } from '../types';

const initialState = {
	users: [],
	allUsers: [],
};

/*
    Any action related to Profile will go here.
*/

export default function authUserReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case USER_FETCH:
			return {
				...state,
				users: payload,
			};
		case 'USER_FETCH_ALL':
			return {
				...state,
				allUsers: payload,
			};
		default:
			return { ...state };
	}
}
