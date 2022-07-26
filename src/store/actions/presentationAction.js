import firebase, { db } from '../../config/firebase';
import {
	PRESENTATIONS_FETCH,
	PRESENTATION_ADD,
	PRESENTATION_COLLABORATE_FETCH,
	PRESENTATION_FETCH,
} from '../types';

export const addSlide = payload => async dispatch => {
	let { presentationId, presentationTitle, userId, slideContent, slideIdx } =
		payload;
	if (
		!(await db.collection('presentations').doc(presentationId).get()).exists
	) {
		await db.collection('presentations').doc(presentationId).set({
			presentationTitle,
			presentationId,
			userId,
			timeInterval: new Date().getTime(),
			isDelete: false,
		});
	}
	await db.collection('slides').add({
		presentationId,
		slideContent,
		slideIdx,
		timeInterval: new Date().getTime(),
	});
};

export const updatePresentationTitle = payload => async dispatch => {
	await db.collection('presentations').doc(payload.presentationId).update({
		presentationTitle: payload.presentationTitle,
	});
};

export const fetchAllCollaboratorPresentations = () => async dispatch => {
	db.collection('collaborators').onSnapshot(snapshots => {
		let colabs = [];
		for (let doc of snapshots.docs) {
			// if (doc.id != uid && doc.id == uid)
			colabs.push({ id: doc.id, ...doc.data() });
		}
		dispatch({
			type: 'COLABS_FETCH_ALL',
			payload: colabs,
		});
	});
};

export const fetchCollaboratorPresentations = payload => async dispatch => {
	let { userId } = payload;
	db.collection('collaborators')
		.where('userId', '==', userId)
		.onSnapshot(async snapshot => {
			let presentations = [];
			for (let doc of snapshot.docs) {
				// console.log(doc.data());
				let presentationId = doc.data().presentationId;
				let presentationDoc = await db
					.collection('presentations')
					.doc(presentationId)
					.get();

				let presentationData = presentationDoc.data();
				presentationData['permissions'] = doc.data().permissions;
				let userDoc = await db
					.collection('users')
					.doc(presentationData.userId)
					.get();
				presentationData['username'] = 'N/A';
				if (userDoc.exists) {
					presentationData['username'] = userDoc.data().name;
				}
				if (!presentationData.isDelete) {
					let collaborators = [];
					let collaboratorDocs = await db
						.collection('collaborators')
						.where('presentationId', '==', presentationDoc.id)
						.get();

					for (let collaboratorDoc of collaboratorDocs.docs) {
						let userDoc = await db
							.collection('users')
							.doc(collaboratorDoc.data().userId)
							.get();
						if (userDoc.exists)
							collaborators.push({
								id: userDoc.id,
								...userDoc.data(),
							});
					}
					presentations.push({
						id: presentationDoc.id,
						...presentationData,
						collaborators,
					});
				}
			}
			dispatch({
				type: PRESENTATION_COLLABORATE_FETCH,
				payload: presentations,
			});
			payload.onSuccess();
		});
};

export const fetchAllPresentations = () => async dispatch => {
	db.collection('presentations').onSnapshot(snapshots => {
		let pres = [];
		for (let doc of snapshots.docs) {
			// if (doc.id != uid && doc.id == uid)
			pres.push({ id: doc.id, ...doc.data() });
		}
		dispatch({
			type: 'PRES_FETCH_ALL',
			payload: pres,
		});
	});
};

export const updateSlide = payload => async dispatch => {
	let { id, ...rest } = payload;
	// console.log({ payload });
	db.collection('slides')
		.doc(id)
		.update({ ...rest });
};

export const fetchPresentation = payload => async dispatch => {
	let { presentationId } = payload;
	db.collection('slides')
		.where('presentationId', '==', presentationId)
		.onSnapshot(async slideSnapShot => {
			let presentationDoc = await db
				.collection('presentations')
				.doc(presentationId)
				.get();
			let presentationData = {
				id: presentationDoc.id,
				...presentationDoc.data(),
			};
			let slides = [];
			for (let slideDoc of slideSnapShot.docs) {
				slides.push({ id: slideDoc.id, ...slideDoc.data() });
			}
			slides.sort((a, b) => a.slideIdx - b.slideIdx);
			presentationData['slides'] = slides;
			dispatch({
				type: PRESENTATION_FETCH,
				payload: presentationData,
			});
			payload.onSuccess && payload.onSuccess();
		});
};

export const fetchPresentations = payload => async dispatch => {
	let { userId } = payload;
	await db
		.collection('presentations')
		.where('userId', '==', userId)
		.where('isDelete', '==', false)
		.onSnapshot(async presentationSnapshot => {
			let presentations = [];
			for (let doc of presentationSnapshot.docs) {
				let presentationId = doc.data().presentationId;
				let presentationData = doc.data();
				// console.log(presentationData);
				let presentationDoc = await db
					.collection('presentations')
					.doc(presentationId)
					.get();
				let userDoc = await db
					.collection('users')
					.doc(presentationData.userId)
					.get();
				presentationData['username'] = 'N/A';
				if (userDoc.exists) {
					presentationData['username'] = userDoc.data().name;
				}
				let collaborators = [];
				let collaboratorDocs = await db
					.collection('collaborators')
					.where('presentationId', '==', presentationDoc.id)
					.get();

				for (let collaboratorDoc of collaboratorDocs.docs) {
					let userDoc = await db
						.collection('users')
						.doc(collaboratorDoc.data().userId)
						.get();
					if (userDoc.exists)
						collaborators.push({
							id: userDoc.id,
							...userDoc.data(),
						});
				}
				presentations.push({
					id: doc.id,
					...presentationData,
					collaborators,
				});
			}
			presentations.sort((a, b) => b.timeInterval - a.timeInterval);
			payload.onSuccess();
			dispatch({ type: PRESENTATIONS_FETCH, payload: presentations });
		});
};

export const deletePresentation = payload => async dispatch => {
	db.collection('presentations').doc(payload.presentationId).update({
		isDelete: true,
	});
};
