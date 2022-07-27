import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
	Button,
	Col,
	Container,
	Nav,
	NavItem,
	NavLink,
	Row,
	Spinner,
} from 'reactstrap';
import PresentationCard from '../components/PresentationCard';
import {
	fetchAllCollaboratorPresentations,
	fetchCollaboratorPresentations,
	fetchPresentations,
} from '../store/actions/presentationAction';
import firebase, { db } from '../config/firebase';
import { fetchAllUsers } from '../store/actions/userAction';

const Presentations = () => {
	let [isLoading, setIsLoading] = useState(false);
	let [isCollaborateLoading, setIsCollaborateLoading] = useState(false);
	let {
		presentations,
		presentationsCollaborate,
		presentationsCollaborateAll,
	} = useSelector(state => state.presentation);
	let { uid, user } = useSelector(state => state.authUser);
	let { users, allUsers } = useSelector(state => state.user);
	let [activeTab, setActiveTab] = useState(0);

	let dispatch = useDispatch();
	let history = useHistory();
	// console.log('PREs', presentations);
	// console.log('USRs', users);
	// console.log('ALL USRs', allUsers);
	console.log('COLAB', presentationsCollaborateAll);

	const findUserName = id => {
		// console.log('ID', id);
		if (id != undefined) {
			let obj = allUsers && allUsers.find(usr => usr.id == id);
			// console.log('OBJ', obj);
			if (obj != undefined) {
				return obj.name;
			}
		}
	};

	const findColabName = id => {
		// console.log('IIIDDD', id);
		if (id != undefined) {
			let obj =
				presentationsCollaborateAll &&
				presentationsCollaborateAll.find(pc => pc.presentationId == id);

			if (obj != undefined) {
				// console.log('OBJ', obj);
				let id = obj.userId;
				let obj1 = users && users.find(us => us.id == id);
				if (obj1 != undefined) {
					return obj1.name;
				}
			}
		}
	};

	useEffect(() => {
		async function _fetchPresentations() {
			setIsLoading(true);
			await dispatch(
				fetchPresentations({
					userId: uid,
					onSuccess: () => {
						setIsLoading(false);
					},
				})
			);
		}
		async function _fetchCollaboratorPresentations() {
			setIsCollaborateLoading(true);
			await dispatch(
				fetchCollaboratorPresentations({
					userId: uid,
					onSuccess: () => {
						setIsCollaborateLoading(false);
					},
				})
			);
		}
		if (presentations.length == 0) _fetchPresentations();
		if (presentationsCollaborate.length == 0)
			_fetchCollaboratorPresentations();
	}, []);
	useEffect(() => {
		console.log({ isLoading });
	}, [isLoading]);

	useEffect(() => {
		if (allUsers && allUsers.length == 0) {
			dispatch(fetchAllUsers());
		}
		if (presentationsCollaborate && presentationsCollaborate.length == 0) {
			dispatch(fetchAllCollaboratorPresentations());
		}
	}, []);
	// console.log('PRE', presentations);
	return (
		<Container className='pb-4'>
			<div className='pt-4 d-flex align-items-center mb-4'>
				<h4 className='m-0'>Présentations</h4>
				<Button
					color='dark'
					className='ml-auto'
					onClick={e => {
						e.preventDefault();
						let id = db.collection('presentation').doc().id;
						history.push(`/presentations/add/${id}`);
					}}
					name='add'
				>
					<i className='fa fa-plus mr-2'></i>
					Créer une présentation
				</Button>
			</div>

			<>
				<Nav tabs>
					<NavItem>
						<NavLink
							active={activeTab == 0}
							onClick={() => setActiveTab(0)}
						>
							Mes présentations
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							active={activeTab == 1}
							onClick={() => setActiveTab(1)}
						>
							Collaboration
						</NavLink>
					</NavItem>
				</Nav>
				{activeTab == 0 && (
					<>
						{isLoading ? (
							<div className='d-flex py-3 align-items-center justify-content-center'>
								<Spinner />
							</div>
						) : presentations.length == 0 ? (
							<div className='d-flex py-3 align-items-center justify-content-center'>
								<small>
									<b>Pas encore de présentations !</b>
								</small>
							</div>
						) : (
							<Row xs={1} lg={2} xl={3}>
								{presentations.map((presentation, idx) => (
									<Col className='mt-4'>
										<PresentationCard
											collaborators={
												presentation.collaborators
											}
											key={'PresentationCard' + idx}
											id={presentation.id}
											title={
												presentation.presentationTitle
											}
											// author={presentation.username}
											author={findUserName(
												presentation.userId
											)}
											createdAt={
												presentation.timeInterval
											}
										/>
									</Col>
								))}
							</Row>
						)}
					</>
				)}
				{activeTab == 1 && (
					<>
						{isCollaborateLoading ? (
							<div className='d-flex py-3 align-items-center justify-content-center'>
								<Spinner />
							</div>
						) : presentationsCollaborate.length == 0 ? (
							<div className='d-flex py-3 align-items-center justify-content-center'>
								<small>
									<b>Pas encore de présentations !</b>
								</small>
							</div>
						) : (
							<Row xs={1} lg={2} xl={3}>
								{presentationsCollaborate.map(
									(presentation, idx) => (
										<Col className='mt-4'>
											<PresentationCard
												collaborators={
													presentation.collaborators
												}
												isDeleteBtn={presentation.permissions.includes(
													'delete'
												)}
												isShareBtn={presentation.permissions.includes(
													'share'
												)}
												isViewBtn={presentation.permissions.includes(
													'view'
												)}
												isEditBtn={presentation.permissions.includes(
													'edit'
												)}
												key={'PresentationCard' + idx}
												id={presentation.id}
												title={
													presentation.presentationTitle
												}
												// author={presentation.username}
												author={findUserName(
													presentation.userId
												)}
												createdAt={
													presentation.timeInterval
												}
											/>
										</Col>
									)
								)}
							</Row>
						)}
					</>
				)}
			</>
		</Container>
	);
};

export default Presentations;
