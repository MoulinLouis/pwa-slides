import firebase, { db } from '../../config/firebase';
import { USER_FETCH } from '../types';

export const fetchUsers = uid => async dispatch => {
	db.collection('users').onSnapshot(snapshots => {
		let users = [];
		for (let doc of snapshots.docs) {
			if (doc.id != uid) users.push({ id: doc.id, ...doc.data() });
		}
		dispatch({
			type: USER_FETCH,
			payload: users,
		});
	});
};

export const fetchAllUsers = () => async dispatch => {
	db.collection('users').onSnapshot(snapshots => {
		let users = [];
		for (let doc of snapshots.docs) {
			// if (doc.id != uid && doc.id == uid)
			users.push({ id: doc.id, ...doc.data() });
		}
		dispatch({
			type: 'USER_FETCH_ALL',
			payload: users,
		});
	});
};

export const addCollaborator = payload => async dispatch => {
	let { presentationId, userId, permissions } = payload;
	await db.collection('collaborators').add({
		presentationId,
		userId,
		permissions,
		timeInterval: new Date().getTime(),
	});
};
