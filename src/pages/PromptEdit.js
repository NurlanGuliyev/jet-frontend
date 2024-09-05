import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { routes } from '../utils/constants';

const PromptEdit = () => {
	const [content, setContent] = useState('');

	const [isLoading, setIsLoading] = useState(true);

	const [error, setError] = useState('');

	const getContent = async () => {
		try {
			const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/${routes.content}`);

			setError(null);

			setContent(data?.prompt);
		} catch (error) {
			setError('An error occurred while loading the content');

			console.error('Error loading content:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const submit = async () => {
		try {
			await axios.put(`${process.env.REACT_APP_API_URL}/${routes.content}`, {
				content,
			});

			setContent(content);

			setError(null);

			alert('Content updated successfully.');
		} catch (error) {
			setError('An error occurred while updating content');

			console.error('Error when updating content:', error);
		}
	};

	useEffect(() => {
		getContent();
	}, []);

	if (isLoading) return null;

	return (
		<div className="d-flex flex-column vh-100 p-5 container">
			<div className="d-flex align-items-center mb-2">
				<i class="fa-regular fa-edit font-size-20 me-3" />
				<h3 className="flex-grow-1 m-0">Edit prompt</h3>
				<button onClick={submit} className="btn btn-success d-flex align-items-center">
					<i class="fa-regular fa-save font-size-16" />
					<div className="ms-2">Save</div>
				</button>
			</div>
			<div className="text-danger">{error}</div>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				className="flex-grow-1 form-control mt-2"
				placeholder="Enter prompt content here..."
			/>
		</div>
	);
};

export default PromptEdit;
