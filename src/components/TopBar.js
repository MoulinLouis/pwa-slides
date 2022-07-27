import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import Profile from '../assets/img/profile.jpg';
import Logo from '../assets/img/logo_slides.png';

const TopBar = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	let { user } = useSelector(state => state.authUser);
	return (
		<div className='d-flex top-bar'>
			<Container>
				<div className='d-flex'>
					<Link to='/presentations' className='top-bar__logo'>
						<img src={Logo} alt='logo copyright beamy' alt='logo'/>
					</Link>
					<div className='ml-auto d-flex align-items-center'>
						<div className='top-bar__profile d-flex align-items-center'>
							<div className='top-bar__profile__avatar'>
								<img
									src={
										user.profile_image == '' ||
										user.profile_image == null
											? Profile
											: user.profile_image
									}
									alt='avatar'
								/>
							</div>
							<div
								className='top-bar__profile__detail ml-2'
								title={user.name}
							>
								{user.name.length > 5 && user.name.length < 8
									? user.name
									: `${user.name.slice(0, 5)}...`}
							</div>
						</div>
						<Button
							color='dark'
							size='sm'
							className='ml-4 py-2 px-4'
							tag={Link}
							to='/logout'
							name='logout'
						>
							Déconnexion
						</Button>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default TopBar;
