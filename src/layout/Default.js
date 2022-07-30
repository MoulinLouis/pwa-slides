import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Default = props => {
	const history = useHistory();
	let { uid } = useSelector(state => state.authUser);

	useEffect(() => {
		if (uid === '' || uid === null) {
			history.push('/auth/sign-in');
		}
	}, [uid]);

	return <>{props.children}</>;
};

export default Default;
