import {
	PRESENTATIONS_FETCH,
	PRESENTATION_COLLABORATE_FETCH,
	PRESENTATION_FETCH,
} from '../types';

const initialState = {
	presentations: [],
	presentationsCollaborate: [],
	presentationsCollaborateAll: [],
	presAll: [],
	slides: {},
};

export default function presentationReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case PRESENTATIONS_FETCH:
			return {
				...state,
				presentations: payload,
			};
		case PRESENTATION_COLLABORATE_FETCH:
			return {
				...state,
				presentationsCollaborate: payload,
			};
		case 'COLABS_FETCH_ALL':
			return {
				...state,
				presentationsCollaborateAll: payload,
			};
		case 'PRES_FETCH_ALL':
			return {
				...state,
				presAll: payload,
			};
		case PRESENTATION_FETCH:
			return {
				...state,
				slides: payload,
			};
		default:
			return {
				...state,
			};
	}
}
