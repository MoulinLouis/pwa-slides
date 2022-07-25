import { AUTH_NOTIFICATION, AUTH_SET_LOADING } from '../types';

const initialState = {
	user: null,
	notification: {
		message: '',
		type: '',
	},
	loading: false,
};

export default function authReducer(state = initialState, { action, payload }) {
	switch (action) {
		case AUTH_NOTIFICATION:
			return {
				...state,
				notification: payload,
			};
		case AUTH_SET_LOADING:
			return {
				...state,
				loading: payload,
			};
		case 'SIGN_IN':
			return {
				...state,
				user: action.payload,
			};
		case 'LOGOUT_SUCCESS':
			return {
				...state,
				user: payload,
				notification: {
					message: '',
					type: '',
				},
				loading: false,
			};
		default:
			return {
				...state,
			};
	}
}
