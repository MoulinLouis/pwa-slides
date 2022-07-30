import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { fetchUsers } from '../store/actions/userAction';

const Main = props => {
	const history = useHistory();
	let { uid } = useSelector(state => state.authUser);
	let { users } = useSelector(state => state.user);

	useEffect(() => {
		if (uid === '' || uid === null) {
			history.push('/auth/sign-in');
		}
	}, [uid]);

	let dispatch = useDispatch();
	useEffect(() => {
		if (users.length === 0) dispatch(fetchUsers(uid));
	}, []);

	return (
		<>
			<TopBar />
			{props.children}
		</>
	);
};

export default Main;
