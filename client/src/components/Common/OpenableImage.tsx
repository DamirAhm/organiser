import React, { ImgHTMLAttributes, useState, HTMLAttributes } from 'react';
import ReactDOM from 'react-dom';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import ReactModal from 'react-modal';
import { File } from '../../types';
import { fileUrl } from '../../utils/fileUrl';
import styled from 'styled-components';

const ModalImage = styled.img`
	width: 100%;
	margin: auto 0;
`;

const ImageChanger = styled.button`
	position: absolute;
	transform: translateY(-50%);
	top: 50%;
	padding: 500px 30px;
	box-sizing: content-box;
	background-color: transparent;

	&:hover {
		background-color: rgba(0, 0, 0, 0.3);
	}

	svg {
		color: var(--background-color);
	}
`;

const ToNext = styled(ImageChanger)`
	right: 0px;
`;

const ToPrev = styled(ImageChanger)`
	left: 0px;
`;

const Image = styled.img`
	height: 100%;
`;

export const ImageModalContainer = styled.div`
	width: min(90vw, 1400px);
	height: min(90vh, 1200px);
	overflow-y: auto;
	background-color: transparent;
	outline: none;
	display: flex;
	flex-direction: column;
	color: var(--bold-text-color);
	border-radius: 10px;
`;

export type ImageInfo = {
	prevImg?: OpenableImgProps;
	nextImg?: OpenableImgProps;
	file: File;
};

export type OpenableImgProps = {} & ImageInfo &
	ImgHTMLAttributes<HTMLImageElement>;

type ModalImgProps = {
	isOpened: boolean;
	close: () => void;
} & OpenableImgProps;

type changeImg = (
	img: OpenableImgProps,
	e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;

export const ModalImg: React.FC<ModalImgProps> = ({
	close,
	prevImg: initPrevImg,
	nextImg: initNextImg,
	file: initFile,
	isOpened,
	...props
}) => {
	const [{ file, prevImg, nextImg }, setImg] = useState<ImageInfo>({
		file: initFile,
		prevImg: initPrevImg,
		nextImg: initNextImg,
	});

	const toImg: changeImg = (newImg, e) => {
		e.stopPropagation();
		setImg(newImg);
	};

	return (
		<ImageModalContainer
			as={ReactModal}
			isOpen={isOpened}
			parentSelector={() => document.getElementById('photoModal')!}
			onRequestClose={close}
			style={{
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 1,
				},
			}}
		>
			{prevImg && (
				<ToPrev onMouseDown={(e) => toImg(prevImg, e)}>
					<MdNavigateBefore size={40} />
				</ToPrev>
			)}
			<ModalImage
				{...props}
				alt={file.originalName}
				src={fileUrl(file)}
				onMouseDown={(e) => e.stopPropagation()}
				onScroll={(e) => e.stopPropagation()}
			/>
			{nextImg && (
				<ToNext onMouseDown={(e) => toImg(nextImg, e)}>
					<MdNavigateNext size={40} />
				</ToNext>
			)}
		</ImageModalContainer>
	);
};

const OpenableImg: React.FC<OpenableImgProps> = ({
	prevImg,
	nextImg,
	file,
	...props
}) => {
	const [modalOpened, setModalOpened] = useState(false);

	return (
		<>
			<Image
				src={fileUrl(file)}
				alt={file.originalName}
				onClick={() => setModalOpened(true)}
			/>
			<ModalImg
				{...props}
				close={() => setModalOpened(false)}
				isOpened={modalOpened}
				prevImg={prevImg}
				nextImg={nextImg}
				file={file}
			/>
		</>
	);
};

export const ImgStab: React.FC<
	OpenableImgProps & {
		Stab: React.FC<
			HTMLAttributes<HTMLDivElement> & { onClick: () => void }
		>;
	}
> = ({ Stab, ...props }) => {
	const [modalOpened, setModalOpened] = useState(false);

	return (
		<>
			<Stab onClick={() => setModalOpened(true)} />
			<ModalImg
				isOpened={modalOpened}
				close={() => setModalOpened(false)}
				{...props}
			/>
		</>
	);
};

export default OpenableImg;
