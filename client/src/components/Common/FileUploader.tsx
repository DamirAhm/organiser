import React from 'react';
import { MdUpload } from 'react-icons/md';
import styled from 'styled-components';

const UploadIcon = styled.span`
	cursor: pointer;
`;

const FileInput = styled.input`
	display: none;
`;

type Props = {
	onChange: (files: FileList | null) => void;
};

const FileUploader: React.FC<Props> = ({ onChange }) => {
	const onFilesAdded: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		onChange(e.target.files);
	};

	return (
		<label>
			<UploadIcon>
				<MdUpload color='var(--text-color)' size={25} />
			</UploadIcon>
			<FileInput
				type='file'
				onChange={(e) => {
					onFilesAdded(e);
					e.target.value = '';
				}}
				multiple
			/>
		</label>
	);
};

export default FileUploader;
