import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Auth = props => {
	const history = useHistory();
	let { uid } = useSelector(state => state.authUser);

	useEffect(() => {
		if (uid != '' && uid != null) {
			history.push('/presentations');
		}
	}, [uid]);

	return (
		<>
			<div className='auth-container'>{props.children}</div>
		</>
	);
};

export default Auth;
