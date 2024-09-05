import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import ChatPage from './pages/ChatPage';
import PromptEdit from './pages/PromptEdit';
import React from 'react';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/edit-prompt" element={<PromptEdit />} />
				<Route path="/" element={<ChatPage />} />
			</Routes>
		</Router>
	);
}

export default App;
