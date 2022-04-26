import React, { useContext, useState, useEffect } from 'react';
import firebase from './config';

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrenUser] = useState();
	const [loading, setLoading] = useState(true);

	function signup(email, password) {
		return firebase.auth().createUserWithEmailAndPassword(email, password);
	}

	function signupWithGoogle(provider) {
		return firebase.auth().signInWithPopup(provider);
	}

	function login(email, password) {
		return firebase.auth().signInWithEmailAndPassword(email, password);
	}

	function logout() {
		return firebase.auth().signOut();
	}

	function resetPassword(email) {
		return firebase.auth().sendPasswordResetEmail(email);
	}

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			setCurrenUser(user);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		login,
		signup,
		logout,
		resetPassword,
		signupWithGoogle,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
