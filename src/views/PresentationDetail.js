import {
	HighlightPlugin,
	MarkdownPlugin,
	ZoomPlugin,
	RevealJS,
	Slide,
	H1,
	NotesPlugin,
} from '@gregcello/revealjs-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchPresentation } from '../store/actions/presentationAction';
import { Markup } from 'interweave';
import { Button } from 'reactstrap';

// then in the source

const plugins = [HighlightPlugin, NotesPlugin, MarkdownPlugin, ZoomPlugin];

function MyPresentation() {
	let param = useParams();
	let dispatch = useDispatch();
	let { slides } = useSelector(state => state.presentation);
	useEffect(() => {
		dispatch(
			fetchPresentation({
				presentationId: param.id,
			})
		);
	}, []);
	return (
		<div className='presentation-slider__container'>
			<div className='ml-5 mt-3'>
				<Button size='sm' tag={Link} to='/presentations' name='back_to_presentation'>
					<i className='fa fa-angle-left'></i>
					<span className='ml-2'>Retour aux présentations</span>
				</Button>
			</div>
			<RevealJS plugins={[...plugins]}>
				{slides.slides &&
					slides.slides.map(slide => (
						<Slide>
							<Markup content={slide.slideContent} />
						</Slide>
					))}
			</RevealJS>
		</div>
	);
}

export default MyPresentation;
