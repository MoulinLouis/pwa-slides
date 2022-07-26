import firebase, { db } from '../../config/firebase';
import { AUTH_SET_LOADING, LOGIN, LOGOUT } from '../types';

export const setAuthLoading = val => async dispatch => {
	dispatch({ type: AUTH_SET_LOADING, payload: val });
};

// export const register = (credentials, password, history) => async dispatch => {
// 	// await dispatch(setAuthLoading(true));
// 	firebase
// 		.auth()
// 		.createUserWithEmailAndPassword(credentials.email, password)
// 		.then(data => {
// 			firebase
// 				.firestore()
// 				.collection('users')
// 				.doc(data.user.uid)
// 				.set({
// 					...credentials,
// 					role: 'admin',
// 				})
// 				.then(res => {
// 					alert('Acount created Sucessfully');
// 					// dispatch(setAuthLoading(true));
// 					history.push('/auth/login');
// 				})
// 				.catch(err => {
// 					alert(err.message);
// 					// dispatch(setAuthLoading(true));
// 				});
// 		})
// 		.catch(err => {
// 			alert(err.message);
// 			// dispatch(setAuthLoading(true));
// 		});
// };

// export const login = credentials => async dispatch => {
// 	// await dispatch(setAuthLoading(true));
// 	firebase
// 		.auth()
// 		.signInWithEmailAndPassword(credentials.email, credentials.password)
// 		.then(res => {
// 			firebase
// 				.firestore()
// 				.collection('users')
// 				.doc(res.user.uid)
// 				.onSnapshot(async doc => {
// 					var tempUser = {};
// 					tempUser = { id: doc.id, ...doc.data() };
// 					dispatch({
// 						type: 'LOGIN_SUCCESS',
// 						payload: res.user.uid,
// 					});
// 					dispatch({
// 						type: 'SET_USER_DATA',
// 						payload: tempUser,
// 					});
// 				});
// 		})
// 		.catch(err => {
// 			alert(err.message);
// 			dispatch(setAuthLoading(false));
// 		});
// };

// export const logout = id => async dispatch => {
// 	localStorage.clear();
// 	firebase
// 		.auth()
// 		.signOut()
// 		.then(res => {
// 			firebase
// 				.firestore()
// 				.collection('users')
// 				.doc(id)
// 				.onSnapshot(doc => {
// 					// let user_id = id;
// 					// dispatch(
// 					// 	addActivity({
// 					// 		user_id,
// 					// 		sentence: 'User Logged Out',
// 					// 	})
// 					// );
// 				});
// 		});
// 	dispatch({ type: LOGOUT });
// };

export const signInGit = history => async dispatch => {
	// dispatch(loginLoading(true));
	var provider = new firebase.auth.GithubAuthProvider();
	firebase
		.auth()
		.signInWithPopup(provider)
		.then(async query => {
			// var FreshUser = await firebase
			// 	.firestore()
			// 	.collection('users')
			// 	.doc(query.user.uid)
			// 	.get();
			// console.log('QRY', query.user.email);
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
			// console.log('QRY', query);
			// var FreshUser = await firebase
			// 	.firestore()
			// 	.collection('users')
			// 	.doc(query.user.uid)
			// 	.get();
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
