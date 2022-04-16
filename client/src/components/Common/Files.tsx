import React, { useMemo } from 'react';
import styled from 'styled-components';
import { SERVER_URL } from '../../constants';
import { File as FileType } from '../../types';
import { AiFillFile } from 'react-icons/ai';
import { GoTrashcan } from 'react-icons/go';

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
	border-radius: 4px;

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

const Image = styled.img`
	height: 100%;
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

const fileUrl = ({ fileName }: FileType) => `${SERVER_URL}/uploads/${fileName}`;

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

	return (
		<FilesContainer>
			<ImagesContainer>
				{images.map((image, i) => (
					<ImageContainer key={image.fileName} tabIndex={0}>
						<Image src={fileUrl(image)} alt={image.originalName} />
						{onFileRemoved !== undefined && (
							<DeleteButton
								tabIndex={0}
								onClick={() => onFileRemoved(image)}
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
