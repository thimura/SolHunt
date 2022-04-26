import react from 'react';
import Router from 'next/router';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { AlertTitle } from '@mui/material';
import { useAuth } from '../firebase/AuthContext';
import { useEffect, useState } from 'react';
import styles from '../styles/LoginSignup.module.css';
import Page from '../components/Page/Page';
import { GoogleAuthProvider } from 'firebase/auth';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

function Sign_up() {
	const [name, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password_confirmed, setPassowordConfirm] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [usernames, setUsernames] = useState([]);

	const { signup, signupWithGoogle, currentUser } = useAuth();
	const provider = new GoogleAuthProvider();

	useEffect(() => {
		const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
            snapshot.docs.forEach((doc) => {
				
				setUsernames(prevArray => [...prevArray, doc.data().username])
            })
        });

		return () => {
			unsub();
		}
	}, []);
	

	async function hookUpDB(user) {
		const userRef = db.doc(`users/${user.uid}`);
		const snapshot = await userRef.get();

		if (!snapshot.exists) {
			userRef.set({
				name: name,
				lastName: lastName,
				email: user.email,
				type: "user",
				bookMarks: [],
				username: username,
			});
		}
	}

	async function signUpWithGoogleHandler(event) {
		event.preventDefault();

		if (name === '' || lastName === '' || username  === '') {
			return setError('Please input Name and Last Name and a username');
		}
		
		if (usernames.includes(username)) {
			return setError("Username already in use. Please try again!");
		}

		try {
			setLoading(true);
			setError('');
			const { user } = await signupWithGoogle(provider);

			try {
				await hookUpDB(user);
			} catch (error) {
				setError(error.message);
				return;
			}

			Router.push('/userProfile');
		} catch (error) {
			setError(error.message);
		}
	}

	async function signUpHandler(event) {
		event.preventDefault();

		if (password !== password_confirmed) {
			return setError("Passwords don't match");
		}
		if (name === '' || lastName === '' || username  === '') {
			return setError('Please input Name and Last Name and a username');
		}
		
		if (usernames.includes(username)) {
			return setError("Username already in use. Please try again!");
		}
		try {
			setLoading(true);
			setError('');
			const { user } = await signup(email, password);

			try {
				await hookUpDB(user);
			} catch (error) {
				setError(error.message);
				return;
			}
			Router.push('/userProfile');
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	}
	return (
		<Page>
			<div className={styles.container1}>
				<div className={styles.container2}>
					<div className={styles.text}>Sign Up</div>
				</div>

				<div>
					<div className={styles.container3}>
						<TextField
							id="first_name"
							type="text"
							variant="outlined"
							label="Enter First Name"
							onChange={(event) => {
								setName(event.target.value);
							}}
							fullWidth
						/>
					</div>

					<div className={styles.container3}>
						<TextField
							id="last_name"
							type="text"
							variant="outlined"
							label="Enter Last Name"
							onChange={(event) => {
								setLastName(event.target.value);
							}}
							fullWidth
						/>
					</div>

					<div className={styles.container3}>
						<TextField
							id="username"
							type="username"
							variant="outlined"
							label="Enter username"
							onChange={(event) => {
								setUsername(event.target.value);
							}}
							fullWidth
						/>
					</div>

					<div className={styles.container3}>
						<TextField
							required
							id="email"
							type="email"
							variant="outlined"
							label="Enter email"
							onChange={(event) => {
								setEmail(event.target.value);
							}}
							fullWidth
						/>
					</div>

					<div className={styles.container3}>
						<TextField
							required
							id="password"
							type="password"
							variant="outlined"
							label="Enter Password"
							onChange={(event) => {
								setPassword(event.target.value);
							}}
							fullWidth
						/>
					</div>

					<div className={styles.container3}>
						<TextField
							required
							id="password-confirm"
							type="password"
							variant="outlined"
							label="Confirm Password"
							onChange={(event) => {
								setPassowordConfirm(event.target.value);
							}}
							fullWidth
						/>
					</div>

					<div className={styles.container3}>
						<Button
							id="sign_up"
							disabled={loading}
							type="submit"
							variant="contained"
							color="primary"
							onClick={signUpHandler}
						>
							Sign Up
						</Button>
						<Button
							id="sign_up_google"
							disabled={loading}
							variant="contained"
							color="primary"
							onClick={signUpWithGoogleHandler}
						>
							Sign Up with Google
						</Button>
					</div>
				</div>
				<Divider variant="middle/">
					<Link href="/login">
						<a>I already have an account </a>
					</Link>
				</Divider>
				<div>
					{error && (
						<Alert severity="error">
							{' '}
							<AlertTitle>{error}</AlertTitle>{' '}
						</Alert>
					)}
				</div>
			</div>
		</Page>
	);
}

export default Sign_up;
