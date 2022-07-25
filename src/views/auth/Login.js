import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { login, signInGit, signInGoogle } from '../../store/actions/authAction';
import { Link, useHistory } from 'react-router-dom';

const Login = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [mail, setMail] = useState('');
	const [pass, setPass] = useState('');

	return (
		<div className='login-form'>
			<h4 className='fw-700'>S'authentifier</h4>
			{/* <hr /> */}
			{/* <div className='mb-3 d-flex align-items-center justify-content-center'>
				<small>Sign in with Email</small>
			</div> */}
			{/* <Form
				onSubmit={async e => {
					e.preventDefault();
					let obj = {
						mail,
						pass,
					};
					await dispatch(login(obj));
				}}
			>
				<FormGroup>
					<Input
						type='email'
						placeholder='Email'
						value={mail}
						onChange={e => {
							setMail(e.target.value);
						}}
					></Input>
				</FormGroup>
				<FormGroup>
					<Input
						type='password'
						placeholder='Password'
						value={pass}
						onChange={e => {
							setPass(e.target.value);
						}}
					></Input>
				</FormGroup>
				<FormGroup>
					<Button color='dark' block type='submit'>
						Login
					</Button>
				</FormGroup>
			</Form> */}
			{/* <hr /> */}
			{/* <div className='mb-3 d-flex align-items-center justify-content-center'>
				<small>Or</small>
			</div> */}
			<hr />
			<div>
				<Button
					block
					color='outline-dark'
					className='d-flex align-items-center text-left px-3'
					onClick={() => {
						dispatch(signInGoogle(history));
					}}
				>
					<div className='button__icon'>
						<i className='fab fa-google'></i>
					</div>
					<div className='text-center w-100'>S'enregistrer avec Google</div>
				</Button>
				<Button
					block
					color='outline-dark'
					className='d-flex align-items-center text-left px-3'
					onClick={() => {
						dispatch(signInGit(history));
					}}
				>
					<div className='button__icon'>
						<i className='fab fa-github'></i>
					</div>
					<div className='text-center w-100'>S'enregistrer avec Github</div>
				</Button>
			</div>
		</div>
	);
};

export default Login;