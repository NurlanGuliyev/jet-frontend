import React, { useEffect, useRef, useState } from 'react';
import { generateUserAuthCookie, getUserAuthToken } from '../utils/auth';

import axios from 'axios';
import classNames from 'classnames';
import { routes } from '../utils/constants';

const ChatPage = () => {
	const [message, setMessage] = useState('');

	const [chatHistory, setChatHistory] = useState([]);

	const chatContainerRef = useRef(null);

	const bottomRef = useRef(null);

	const [userToken, setUserToken] = useState(null);

	useEffect(() => {
		let token = getUserAuthToken();

		if (!token) {
			token = generateUserAuthCookie();
		}

		setUserToken(token);
	}, []);

	useEffect(() => {
		if (userToken) {
			const savedChatHistory = localStorage.getItem(userToken);

			if (savedChatHistory) {
				setChatHistory(JSON.parse(savedChatHistory));
			}
		}
	}, [userToken]);

	const sendMessage = async () => {
		if (!message) return;

		const userMessage = { role: 'user', content: message };

		setChatHistory((prevChatHistory) => {
			const updatedChatHistory = [...prevChatHistory, userMessage];

			localStorage.setItem(userToken, JSON.stringify(updatedChatHistory));

			return updatedChatHistory;
		});

		setMessage('');

		try {
			const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/${routes.chat}`, {
				messages: [...chatHistory, userMessage],
				userToken,
			});

			const botMessage = { role: 'assistant', content: data.response };

			setChatHistory((prevChatHistory) => {
				const updatedChatHistory = [...prevChatHistory, botMessage];

				localStorage.setItem(userToken, JSON.stringify(updatedChatHistory));

				return updatedChatHistory;
			});
		} catch (error) {
			console.error('Error:', error.response ? error.data : error.message);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') sendMessage();
	};

	useEffect(() => {
		if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
	}, [chatHistory]);

	const renderMessageContent = ({ content, role }) => {
		const urlRegex = /(https?:\/\/[^\s]+)/g;

		const agentRegex = /\n?for agent1:([\s\S]*?)for agent2\n?/g;

		const cleanedContent = content.replace(agentRegex, '');

		return cleanedContent.split('\n').map((line, index) => (
			<div className={classNames('d-flex', 'px-3', role === 'user' && 'justify-content-end')}>
				<p
					style={{ maxWidth: '500px' }}
					className={classNames(
						role === 'user' ? 'bg-secondary ms-5' : 'bg-success me-5',
						'font-size-17',
						'font-weight-500',
						'px-2',
						'py-2',
						'd-inline-block',
						'text-white',
						'rounded'
					)}
				>
					<React.Fragment key={index}>
						{line.split(urlRegex).map((part, partIndex) => {
							if (part.match(urlRegex)) {
								return (
									<a
										key={partIndex}
										href={part}
										target="_blank"
										rel="noopener noreferrer"
									>
										{part}
									</a>
								);
							}
							return part;
						})}
						<br />
					</React.Fragment>
				</p>
			</div>
		));
	};

	return (
		<div className="d-flex flex-column vh-100 p-5 container">
			<div ref={chatContainerRef} className="flex-grow-1 overflow-y-scroll my-4 card py-3">
				{chatHistory.map((chat, index) => (
					<div key={index} className={`chat-message ${chat.role}`}>
						{renderMessageContent(chat)}
					</div>
				))}
				<div ref={bottomRef} />
			</div>
			<div className="d-flex align-items-center">
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Type your message"
					class="form-control me-3 form-control-lg font-size-17"
					onKeyDown={handleKeyPress}
				/>
				<button
					onClick={sendMessage}
					className="btn btn-lg btn-success d-flex align-items-center font-size-17"
				>
					<i class="fa-regular fa-paper-plane font-size-16" />
					<div className="ms-2">Send</div>
				</button>
			</div>
		</div>
	);
};

export default ChatPage;
