import { useSelector } from 'react-redux';
import { Spinner } from 'reactstrap';

const Loader = () => {
	let { loading } = useSelector(state => state.authUser);
	return (
		<div className='bg-dark'>
			<Spinner active={loading} />;
		</div>
	);
};

export default Loader;
