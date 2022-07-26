import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Button,
	ButtonGroup,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
} from 'reactstrap';
import {
	deletePresentation
} from '../store/actions/presentationAction';
import { addCollaborator, fetchAllUsers } from '../store/actions/userAction';
import Profile from '../assets/img/profile.jpg';

const PresentationCard = ({
	id,
	title,
	author,
	createdAt,
	collaborators,
	isDeleteBtn = true,
	isViewBtn = true,
	isShareBtn = true,
	isEditBtn = true,
}) => {
	let [isDelete, setIsDelete] = useState(false);
	let [isShare, setIsShare] = useState(false);
	let [searchText, setSearchText] = useState('');
	let [searchedUsers, setSearchedUsers] = useState([]);
	let [_collaborators, setCollaborators] = useState([]);
	let dispatch = useDispatch();

	let [user, setUser] = useState('');
	let { uid } = useSelector(state => state.authUser);
	const [isOpen, setIsOpen] = useState(false);
	let { users, allUsers } = useSelector(state => state.user);
	let {
		presentations,
		presAll,
		presentationsCollaborate,
		presentationsCollaborateAll,
	} = useSelector(state => state.presentation);
	const toggle = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		setSearchText(user.email || '');
	}, [user]);

	// console.log('PRES', presentations);

	return (
		<>
			<div className='presentation-card'>
				<h4 className='m-0'>Title: {title}</h4>
				<small className='d-block m-0 mt-2'>Auteur: {author}</small>
				<small className='d-block m-0'>
					Crée le: {new Date(createdAt).toLocaleString()}
				</small>
				<hr />
				<div className='d-flex justify-content-center mt-3'>
					<ButtonGroup size='sm'>
						{isViewBtn && (
							<Button
								color='dark'
								tag={Link}
								to={`/presentations/${id}`}
							>
								<i className='fa fa-eye'></i>
							</Button>
						)}
						{isEditBtn && (
							<Button
								color='dark'
								tag={Link}
								to={`/presentations/edit/${id}`}
							>
								<i className='fa fa-pen'></i>
							</Button>
						)}
						{collaborators.length > 0 && (
							<Button
								color='dark'
								onClick={() => {
									toggle();
									setCollaborators(collaborators);
								}}
							>
								<i className='fa fa-users'></i>
							</Button>
						)}
						{isDeleteBtn && (
							<Button
								color='dark'
								onClick={() => setIsDelete(true)}
							>
								<i className='fa fa-trash'></i>
							</Button>
						)}
						{isShareBtn && (
							<Button
								color='dark'
								onClick={() => setIsShare(true)}
							>
								<i className='fa fa-share'></i>
							</Button>
						)}
					</ButtonGroup>
				</div>
			</div>
			<Modal isOpen={isDelete} centered>
				<ModalHeader>Confirmation de suprression</ModalHeader>
				<ModalBody>
					Voulez-vous vraiment supprimer la présentation : "{title}" ?
				</ModalBody>
				<ModalFooter>
					<Button
						color='outline-danger'
						onClick={() => setIsDelete(false)}
					>
						Annuler
					</Button>
					<Button
						color='danger'
						onClick={async e => {
							await dispatch(
								deletePresentation({ presentationId: id })
							);
							setIsDelete(false);
						}}
					>
						Supprimer
					</Button>
				</ModalFooter>
			</Modal>
			<Modal isOpen={isShare} centered>
				<ModalHeader>Partage de présentation</ModalHeader>
				<ModalBody>
					<div className='position-relative'>
						<Input
							type='text'
							placeholder='Entrez une adresse mail'
							value={searchText}
							onChange={e => {
								setUser('');
								let filteredUsers = users.filter(
									user =>
										user.email &&
										user.email
											.toLowerCase()
											.includes(
												e.target.value.toLowerCase()
											)
								);
								setSearchedUsers(filteredUsers);
								setSearchText(e.target.value);
							}}
						></Input>
						{user == '' && searchText != '' && (
							<div className='position-absolute w-100 bg-white search__auto-complete'>
								{searchedUsers.map(user => (
									<div
										className='p-2 search__user'
										onClick={() => {
											setUser(user);
										}}
									>
										{user.name || 'N/A'}
									</div>
								))}
							</div>
						)}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						color='outline-danger'
						onClick={() => setIsShare(false)}
					>
						Annuler
					</Button>
					<Button
						color='success'
						onClick={async e => {
							// await dispatch(
							// 	deletePresentation({ presentationId: id })
							// );
							await dispatch(
								addCollaborator({
									presentationId: id,
									userId: user.id,
									permissions: ['view', 'edit', 'share'],
								})
							);
							setIsShare(false);
						}}
					>
						Partager
					</Button>
				</ModalFooter>
			</Modal>
			<Modal isOpen={isOpen}>
				<ModalHeader
					toggle={() => {
						toggle();
					}}
				>
					<h4>Collaborateurs</h4>
				</ModalHeader>
				<ModalBody>
					{_collaborators.map(collaborator => (
						<div className='d-flex align-items-center'>
							<div className='top-bar__profile__avatar'>
								<img
									src={
										collaborator.profile_image == '' ||
										collaborator.profile_image == null
											? Profile
											: collaborator.profile_image
									}
								/>
							</div>
							<div
								className='top-bar__profile__detail ml-2'
								title={collaborator.name}
							>
								{collaborator.name.length > 20 &&
								collaborator.name.length < 23
									? collaborator.name
									: `${collaborator.name.slice(0, 20)}...`}
							</div>
						</div>
					))}
				</ModalBody>
			</Modal>
		</>
	);
};

export default PresentationCard;
