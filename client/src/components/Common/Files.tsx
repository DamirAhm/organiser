import React, { useMemo } from 'react';
import styled from 'styled-components';
import { SERVER_URL } from '../../constants';
import { File as FileType } from '../../types';
import { AiFillFile } from 'react-icons/ai';
import { GoTrashcan } from 'react-icons/go';
import { fileUrl } from '../../utils/fileUrl';
import OpenableImg, { OpenableImgProps } from './OpenableImage';

const FilesContainer = styled.div`
	width: 100%;

	display: flex;
	flex-direction: column;
`;

const ImagesContainer = styled.div`
	overflow-x: auto;
	display: flex;
	flex-wrap: nowrap;
`;

const RestFilesContainer = styled.div`
	margin: 10px 0;
`;

const DeleteButton = styled.button`
	position: absolute;
	display: none;

	background-color: var(--darken-background-color);

	padding: 2px;
	border-radius: 6px;
	border: 1px solid var(--border-color);

	top: 5%;
	right: 2.5%;

	&:hover,
	&:focus {
		background-color: var(--negative);

		svg {
			fill: white;
		}
	}
`;

const ImageContainer = styled.div`
	outline: none;
	position: relative;
	height: 200px;
	width: fit-content;
	display: inline-block;

	border-radius: 6px;

	& + & {
		margin-left: 10px;
	}

	&:hover,
	&:focus-within {
		${DeleteButton} {
			display: inline;
		}
	}
`;

const FileLink = styled.a`
	font-size: 0.7rem;
	color: var(--text-color);
`;

const File = styled.div`
	position: relative;
	display: inline-flex;
	border: 1px solid transparent;
	border-radius: 5px;
	padding: 5px;

	& figure {
		width: fit-content;

		display: inline-flex;
		flex-direction: column;
		align-items: center;

		figcaption {
			display: inline;
		}
	}

	& + & {
		margin-left: 5px;
	}

	&:hover,
	&:focus-within {
		border: 1px solid var(--border-color);
		background-color: var(--text-color);

		${FileLink} {
			color: white;
		}

		${DeleteButton} {
			display: inline;
		}
	}
`;

type Props = {
	files: FileType[];
	onFileRemoved?: (fileName: FileType) => void;
};

const isImage = ({ mimeType }: FileType) => mimeType.startsWith('image');

const parseFileName = (fileName: string) =>
	fileName.match(/(.+)(\..+)$/)!.slice(1, 3);

const shortFileName = ({ originalName }: FileType) => {
	const [name, extension] = parseFileName(originalName);

	if (name.length > 15) {
		return `${name.slice(0, 15)}(...)${extension}`;
	} else {
		return originalName;
	}
};

export const connectImages = (images: FileType[]): OpenableImgProps[] => {
	const parsedAttachments: OpenableImgProps[] = images.map((file) => ({
		file,
	}));

	if (parsedAttachments.length > 1) {
		for (let i = 0; i < images.length; i++) {
			parsedAttachments[i].nextImg =
				parsedAttachments[(i + 1) % images.length];

			parsedAttachments[i].prevImg = parsedAttachments.at(i - 1);
		}
	}

	return parsedAttachments;
};

const Files: React.FC<Props> = ({ files, onFileRemoved }) => {
	const [images, restFiles]: [FileType[], FileType[]] = useMemo(
		() =>
			files.reduce(
				(acc, c) =>
					isImage(c)
						? [[...acc[0], c], acc[1]]
						: [acc[0], [...acc[1], c]],
				[[], []] as [FileType[], FileType[]]
			),
		[files]
	);
	const connectedImages = useMemo(() => connectImages(images), [images]);

	return (
		<FilesContainer>
			<ImagesContainer>
				{connectedImages.map(({ file, prevImg, nextImg }, i) => (
					<ImageContainer key={file.fileName} tabIndex={0}>
						<OpenableImg
							file={file}
							prevImg={prevImg}
							nextImg={nextImg}
						/>
						{onFileRemoved !== undefined && (
							<DeleteButton
								tabIndex={0}
								onClick={() => onFileRemoved(file)}
							>
								<GoTrashcan
									color={'var(--negative)'}
									size={20}
									viewBox='0 0 13 16'
								/>
							</DeleteButton>
						)}
					</ImageContainer>
				))}
			</ImagesContainer>
			<RestFilesContainer>
				{restFiles.map((file, i) => (
					<File key={file.fileName + `${i}`}>
						<FileLink href={fileUrl(file)} target='_blank'>
							<figure>
								<AiFillFile size={30} />
								<figcaption>{shortFileName(file)}</figcaption>
							</figure>
						</FileLink>
						{onFileRemoved !== undefined && (
							<DeleteButton onClick={() => onFileRemoved(file)}>
								<GoTrashcan
									color={'var(--negative)'}
									size={15}
									viewBox='0 0 13 16'
								/>
							</DeleteButton>
						)}
					</File>
				))}
			</RestFilesContainer>
		</FilesContainer>
	);
};

export default Files;
