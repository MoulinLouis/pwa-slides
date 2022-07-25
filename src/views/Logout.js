import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Spinner } from 'reactstrap';
import { logout } from '../store/actions/authAction';
const Logout = () => {
	let dispatch = useDispatch();
	useEffect(() => {
		dispatch(logout());
	}, []);
	return (
		<div
			className='d-flex align-items-center justify-content-center'
			style={{ height: '100vh' }}
		>
			<div className='d-flex flex-column align-items-center'>
				<Spinner />
				<h4 className='mt-3'>Déconnexion en cours...</h4>
			</div>
		</div>
	);
};

export default Logout;
