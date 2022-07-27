import firebase, { db } from '../../config/firebase';
import { AUTH_SET_LOADING, LOGIN, LOGOUT } from '../types';

export const setAuthLoading = val => async dispatch => {
	dispatch({ type: AUTH_SET_LOADING, payload: val });
};

export const signInGit = history => async dispatch => {
	// dispatch(loginLoading(true));
	var provider = new firebase.auth.GithubAuthProvider();
	firebase
		.auth()
		.signInWithPopup(provider)
		.then(async query => {
			await db
				.collection('users')
				.doc(query.user.uid)
				.onSnapshot(async userQuery => {
					db.collection('users')
						.doc(query.user.uid)

						.set({
							name: query.additionalUserInfo.profile.name,
							email: query.user.email,
							profile_image: query.additionalUserInfo.profile
								.picture
								? query.additionalUserInfo.profile.picture
								: '',
						})
						.then(() => {
							dispatch({
								type: LOGIN,
								payload: {
									id: query.user.uid,
									name: query.additionalUserInfo.profile.name,
									profile_image: query.additionalUserInfo
										.profile.picture
										? query.additionalUserInfo.profile
												.picture
										: '',
								},
							});
							dispatch({
								type: 'SIGN_IN',
								payload: {
									id: query.user.uid,
								},
							});
						});
				});
		})
		.catch(error => {
			// console.log('RR', error.message);
			alert(error.message);
			// dispatch(loginLoading(false));
		});
};

export const signInGoogle = history => async dispatch => {
	// dispatch(loginLoading(true));
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase
		.auth()
		.signInWithPopup(provider)
		.then(async query => {
			await db
				.collection('users')
				.doc(query.user.uid)
				.onSnapshot(async userQuery => {
					db.collection('users')
						.doc(query.user.uid)

						.set({
							name: query.additionalUserInfo.profile.name,
							email: query.additionalUserInfo.profile.email,
							profile_image: query.additionalUserInfo.profile
								.picture
								? query.additionalUserInfo.profile.picture
								: '',
						})
						.then(() => {
							dispatch({
								type: LOGIN,
								payload: {
									id: query.user.uid,
									name: query.additionalUserInfo.profile.name,
									profile_image: query.additionalUserInfo
										.profile.picture
										? query.additionalUserInfo.profile
												.picture
										: '',
								},
							});
							dispatch({
								type: 'SIGN_IN',
								payload: {
									id: query.user.uid,
								},
							});
						});
				});
		})
		.catch(error => {
			// dispatch(loginLoading(false));
		});
};

export const logout = () => async dispatch => {
	dispatch(setAuthLoading(true));
	setTimeout(() => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				localStorage.clear();
				dispatch({ type: 'LOGOUT_SUCCESS', payload: { id: '' } });
				dispatch({ type: LOGOUT });
				dispatch(setAuthLoading(false));
			});
	}, 1500);
};
