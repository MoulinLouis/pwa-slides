import draftToHtml from 'draftjs-to-html';
import { useEffect } from 'react';
import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, Form, Input, Spinner } from 'reactstrap';
import { RevealJS, Slide } from '@gregcello/revealjs-react';
import { Markup } from 'interweave';
import htmlToDraft from 'html-to-draftjs';
import { useDispatch } from 'react-redux';
import {
	addSlide,
	fetchPresentation,
	updatePresentationTitle,
	updateSlide,
} from '../store/actions/presentationAction';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddNewPresentation = () => {

	let [editorState, setEditorState] = useState('');
	let [isAddNew, setIsAddNew] = useState(false);
	let [editSlide, setEditSlide] = useState(null);
	let [slides, setSlides] = useState([]);
	let [presentationId, setPresentationId] = useState('');
	let [isLoading, setIsLoading] = useState(false);
	let [presentationTitle, setPresentationTitle] = useState('');
	let [isTitleEdit, setIsTitleEdit] = useState(false);
	let [tempPresentationTitle, setTempPresentationTitle] = useState('');
	let [uploadedImages, setUploadedImages] = useState([]);

	let { uid } = useSelector(state => state.authUser);
	let { slides: _slides } = useSelector(state => state.presentation);

	const [autoSave, setAutosave] = useState(null);

	let dispatch = useDispatch();
	let params = useParams();
	useEffect(() => {
		if (presentationTitle == "autosave") {
			if (autoSave) {
				clearTimeout(autoSave);
				setAutosave(null);
			}

			if (editorState != '') {
				let rawEditorContent = draftToHtml(
					convertToRaw(editorState.getCurrentContent())
				);
				const autoSaveTimeout = setTimeout(() => {
					handleAutoSave(true);
				}, 1000);
				setAutosave(autoSaveTimeout);
			}
		} else {
			if (editorState != '') {
				let rawEditorContent = draftToHtml(
					convertToRaw(editorState.getCurrentContent())
				);
			}
		}
	}, [editorState]);

	useEffect(() => {
		setPresentationId(params.id);
	}, []);

	useEffect(() => {
		async function _fetchPresentation() {
			if (presentationId != '') {
				setIsLoading(true);
				await dispatch(
					fetchPresentation({
						presentationId,
						userId: uid,
						onSuccess: () => {
							setIsLoading(false);
						},
					})
				);
			}
		}
		_fetchPresentation();
	}, [presentationId]);

	const handleSubmit = async e => {
		e.preventDefault();
		if (
			e.target.presentationTitle.value
				.length <= 20
		)
			if (isTitleEdit) {
				setIsTitleEdit(false);
				setPresentationTitle(
					e.target.presentationTitle.value
				);
				if (
					slides.slides &&
					slides.slides.length > 0
				)
					await dispatch(
						updatePresentationTitle({
							presentationId,
							presentationTitle:
								e.target
									.presentationTitle
									.value,
						})
					);
			} else {
				setPresentationTitle(
					e.target.presentationTitle.value
				);
			}
		else
			toast.error(
				'Le titre doit faire 20 caract??res ou moins'
			);
	}

	const handleSave = () => {
		setIsAddNew(false);
		setEditorState('');
		setIsLoading(true);
		if (editSlide == null) {
			dispatch(
				addSlide({
					presentationTitle,
					presentationId,
					userId: uid,
					slideContent: draftToHtml(
						convertToRaw(
							editorState.getCurrentContent()
						)
					),
					slideIdx:
						slides.slides.length,
				})
			);
		} else {
			editSlide.slideContent =
				draftToHtml(
					convertToRaw(
						editorState.getCurrentContent()
					)
				);
			dispatch(updateSlide(editSlide));
		}
		setEditSlide(null);
	}


	const handleAutoSave = (autosave = false) => {
		if (!autosave) {
			setIsAddNew(false);
			setEditorState('');
			setIsLoading(true);
		}
		console.log(editSlide);
		if (editSlide == null) {
			setEditSlide(true)
			dispatch(
				addSlide({
					presentationTitle,
					presentationId,
					userId: uid,
					slideContent: draftToHtml(
						convertToRaw(
							editorState.getCurrentContent()
						)
					),
					slideIdx:
						slides.slides.length,
				})
			);
		} else {
			editSlide.slideContent =
				draftToHtml(
					convertToRaw(
						editorState.getCurrentContent()
					)
				);
			dispatch(updateSlide(editSlide));
		}
		if (!autosave) {
			setEditSlide(null);
		}
	}

	const handleAddNewSlide = (slide) => {
		const blocksFromHtml = htmlToDraft(
			slide.slideContent
		);
		const { contentBlocks, entityMap } =
			blocksFromHtml;
		const contentState =
			ContentState.createFromBlockArray(
				contentBlocks,
				entityMap
			);
		setEditorState(
			EditorState.createWithContent(
				contentState
			)
		);
		setIsAddNew(true);
		setEditSlide(slide);
	}

	useEffect(() => {
		setSlides(_slides);
		setPresentationTitle(_slides.presentationTitle || '');
		setTempPresentationTitle(_slides.presentationTitle || '');
		if (editSlide != null) {
			let { id } = editSlide;
			let latestSlide = _slides.slides.find(slide => slide.id == id);
			// console.log({ latestSlide });
			if (latestSlide) {
				const blocksFromHtml = htmlToDraft(latestSlide.slideContent);
				const { contentBlocks, entityMap } = blocksFromHtml;
				const contentState = ContentState.createFromBlockArray(
					contentBlocks,
					entityMap
				);
				setEditorState(EditorState.createWithContent(contentState));
				setEditSlide(latestSlide);
			} else setEditSlide(null);
		}
	}, [_slides]);

	function _uploadImageCallBack(file) {

		const imageObject = {
			file: file,
			localSrc: URL.createObjectURL(file),
		}

		uploadedImages.push(imageObject);

		setUploadedImages(uploadedImages);

		return new Promise(
			(resolve, reject) => {
				resolve({ data: { link: imageObject.localSrc } });
			}
		);
	}

	return (
		<>
			<div className='d-flex align-items-center add-new-presentation__wrapper'>
				<div className='add-new-presentation'>
					{isLoading ? (
						<div className='add-new-presentation__new justify-content-center'>
							<Spinner size={'sm'} />
						</div>
					) : (
						<>
							<Button
								className='mr-2 mb-3 d-block d-md-none'
								size='sm'
								onClick={() =>
									document.body.classList.remove('open')
								}
								name='close'
							>
								<i className='fa fa-times'></i>
							</Button>
							<Form
								onSubmit={handleSubmit}
							>
								<div className='d-flex '>
									<Input
										placeholder='Titre de la pr??sentation'
										name='presentationTitle'
										className='w-100'
										required
										value={tempPresentationTitle}
										readOnly={
											presentationTitle != '' &&
											isTitleEdit == false
										}
										onChange={e =>
											setTempPresentationTitle(
												e.target.value
											)
										}
										invalid={
											tempPresentationTitle.length > 20
										}
									/>
									{(presentationTitle == '' ||
										isTitleEdit == true) && (
											<Button className='ml-1' type='submit' name='save'>
												<i className='fa fa-save'></i>
											</Button>
										)}
									{presentationTitle != '' && !isTitleEdit && (
										<Button
											onClick={() => setIsTitleEdit(true)}
											className='ml-1'
											type='button'
											name='edit'
										>
											<i className='fa fa-pen'></i>
										</Button>
									)}
								</div>

								<small
									className={`d-block mt-2 mb-3 justify-content-end text-right ${tempPresentationTitle.length > 20
										? 'text-danger'
										: ''
										}`}
								>
									{tempPresentationTitle.length}/20
								</small>
							</Form>
							{slides.slides &&
								slides.slides.map((slide, idx) => (
									<div
										key={'Slide' + slide.id}
										className='add-new-presentation__card mb-3'
										onClick={() => handleAddNewSlide(slide)}
									>
										<RevealJS>
											<Slide>
												<Markup
													content={slide.slideContent}
												/>
											</Slide>
										</RevealJS>
									</div>
								))}
							{presentationTitle != '' && (
								<div
									className='add-new-presentation__new'
									onClick={() => {
										setIsAddNew(true);
										setEditorState('');
										setEditSlide(null);
									}}
								>
									<i className='fa fa-plus'></i>
								</div>
							)}
						</>
					)}
				</div>
				<div className='add-new-presentation__editor'>
					<div className='p-3'>
						<Button
							className='mr-2 d-inline-block d-md-none'
							size='sm'
							onClick={() => document.body.classList.add('open')}
							name='close'
						>
							<i className='fa fa-bars'></i>
						</Button>
						<div className='d-flex mt-2 mt-md-0 justify-content-between'>
							<Button size='sm' tag={Link} to='/presentations' name='back_to_presentation'>
								<i className='fa fa-angle-left'></i>
								<span className='ml-2'>
									Retour aux pr??sentations
								</span>
							</Button>
							{params.mode == 'edit' && (
								<Button
									size='sm'
									tag={Link}
									to={`/presentations/${params.id}`}
									name='play_presentation'
								>
									<span className=''>Lecture</span>
									<i className='fa fa-solid fa-play ml-2'></i>
								</Button>
							)}
						</div>
					</div>
					{isAddNew && (
						<>
							<Editor
								editorState={editorState}
								toolbarClassName='toolbarClassName'
								wrapperClassName='wrapperClassName'
								editorClassName='editorClassName'
								onEditorStateChange={setEditorState}
								toolbar={{
									inline: { inDropdown: true },
									list: { inDropdown: true },
									textAlign: { inDropdown: true },
									link: { inDropdown: true },
									history: { inDropdown: true },
									image: { uploadCallback: _uploadImageCallBack },
									inputAccept: 'application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel'
								}}
							/>
							<div className={(presentationTitle == "autosave" ? 'd-none' : 'd-flex') + ' p-4 justify-content-end'}>
								<Button
									disabled={editorState == ''}
									color='dark'
									onClick={handleSave}
									name='save'
								>
									Sauvegarder
								</Button>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default AddNewPresentation;
