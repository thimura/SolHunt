import react from 'react';
import Router from 'next/router';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';

import { useAuth } from '../firebase/AuthContext';
import { useState } from 'react';

import styles from '../styles/LoginSignup.module.css';
import Page from '../components/Page/Page';
import { GoogleAuthProvider } from 'firebase/auth';
import { db } from '../firebase/config';
import { doc, getDoc } from "firebase/firestore";

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { login, signupWithGoogle, currentUser } = useAuth();
	const provider = new GoogleAuthProvider();

	async function LoginWithGoogleHandler(event) {
		event.preventDefault();

		try {
			setLoading(true);
			setError('');
			const { currentUser } = await signupWithGoogle(provider);
			Router.push('/userProfile');
		} catch (error) {
			setError(error.message);
		}
	}

	async function loginHandler(event) {
		event.preventDefault();

		try {
			setLoading(true);
			setError('');
			const { temp } = await login(email, password);
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
					<div className={styles.text}>Login</div>
				</div>

				<div>
					<div className={styles.container3}>
						<TextField
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
						<Button
							disabled={loading}
							variant="contained"
							color="primary"
							onClick={loginHandler}
						>
							Login
						</Button>
						<Button
							id="sign_up_google"
							disabled={loading}
							variant="contained"
							color="primary"
							onClick={LoginWithGoogleHandler}
						>
							Login with Google
						</Button>
					</div>
				</div>

				<div className={styles.container3}>
					<Link href="/resetPassword">Forgot Password?</Link>
				</div>

				<Divider variant="middle/">
					<Link href="/sign_up">
						<a>I don&apos;t have an account yet</a>
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
export default Login;
