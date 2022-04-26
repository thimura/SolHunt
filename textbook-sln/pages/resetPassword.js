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

function ResetPassword() {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const { resetPassword } = useAuth();

	async function resetHandler(event) {
		event.preventDefault();

		try {
			setMessage('');
			setLoading(true);
			setError('');
			await resetPassword(email);
			setMessage('Check email inbox for further instructions');
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	}

	return (
		<Page>
			<div className={styles.container1}>
				<div className={styles.container2}>
					<div className={styles.text}>Password Reset</div>
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
						<Button
							disabled={loading}
							variant="contained"
							color="primary"
							onClick={resetHandler}
						>
							Reset
						</Button>
					</div>
				</div>

				<div className={styles.container3}>
					<Link href="/login">Back to Login</Link>
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

				<div>
					{message && (
						<Alert severity="success">
							{' '}
							<AlertTitle>{message}</AlertTitle>{' '}
						</Alert>
					)}
				</div>
			</div>
		</Page>
	);
}
export default ResetPassword;
