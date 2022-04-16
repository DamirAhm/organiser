import React from 'react';
type Props = {
	onChange: (files: FileList | null) => void;
};

const FileUploader: React.FC<Props> = ({ onChange }) => {
	const onFilesAdded: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		onChange(e.target.files);
	};

	return (
		<label>
			<input
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
