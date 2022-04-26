import { useState } from 'react';
import firebase, { auth } from '../firebase/config';

export default function Auth() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const signUpHandler = (event) => {
		event.preventDefault();
		firebase.auth().createUserWithEmailAndPassword(email, password);
	};

	const provider = new firebase.auth.GoogleAuthProvider();
	provider.setCustomParameters({ prompt: 'select_account' });
	const signInWithGoogle = () => auth.signInWithPopup(provider);

	return (
		<div>
			<div>Hello</div>
			<div id="loader">Loading...</div>

			<form onSubmit={signUpHandler}>
				<input
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Sign Up</button>
			</form>
			<button onClick={signInWithGoogle}>gmail sign up</button>
		</div>
	);
}
