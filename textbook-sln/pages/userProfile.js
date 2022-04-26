import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import UserModel from '../models/userModel';
import styles2 from '../styles/UserProfile.module.css';
import Avatar from '@mui/material/Avatar';
import Page from '../components/Page/Page';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { updatePassword } from 'firebase/auth';
import { useAuth } from '../firebase/AuthContext';
import Router from 'next/router';
import styles from '../styles/Home.module.css';


export default function UserProfile() {

	const [formattedBookmarks, setFormattedBookmarks] = useState({});

	// set up for modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = (event) => {
		setOpen(false);
		setNewPassword('');
		setConfirmNewPassword('');
	};

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);


	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	const [user, setUser] = useState('');
	const { currentUser, logout } = useAuth();

	useEffect(() => {
		if (!currentUser){
			Router.push('/login');
			return;
		}
		const unsub = onSnapshot(doc(db, `users/${currentUser.uid}`), (doc) => {
			const user = doc.data();
			const userType = user.type
			// if (userType === "mod") {
			// 	Router.push('/moderator');
			// 	return;
			// }
			const userModel = new UserModel();
			Object.assign(userModel, user);
			setUser(userModel);
		});

		formatBookmarks();

		return () => {
			unsub();
		};
	}, []);


	const formatBookmarks = async () => {
		const users = db.collection('users');
		const user = await users.doc(currentUser.uid).get();
		const userData = user.data();
		const bookmarks = userData.bookMarks;
		const tempFormattedBookmarks = {};

		for (let i = 0; i < bookmarks.length; i++) {
			const path = bookmarks[i];
			const pathList = path.split("/");
			const bookRef = db.doc(`textbooks/${pathList[0]}`);
			var bookTitle;
			await bookRef.get().then(async function(doc) {
				const currTitle = await doc.data().title;
				bookTitle = currTitle;
			});
			
			if (!(bookTitle in tempFormattedBookmarks)) {
				tempFormattedBookmarks[bookTitle] = [];
			}
			// formatting the string to display 
			const bookmarkString = "";
			for (let j = 1; j < pathList.length; j++) {
				if (isNaN(parseInt(pathList[j]))) {
					bookmarkString += pathList[j].charAt(0).toUpperCase() + pathList[j].slice(1, pathList[j].length - 1);
				}
				else {
					bookmarkString += ": " + pathList[j] + ", "
				}
			}
			bookmarkString = bookmarkString.slice(0, bookmarkString.length - 2);
			// creating a dictionary to store questions for easy access later
			const question = {
				id: i,
				string: bookmarkString,
				path: path
			};
			// adding questions to formattedBookmarks, but double checking that it was not already added
			if (!(tempFormattedBookmarks[bookTitle] === [])) {
				var addToList = true;
				for (let k =0; k < tempFormattedBookmarks[bookTitle].length; k++) {
					if (tempFormattedBookmarks[bookTitle][k]["path"] === path) {
						addToList = false;
					}
				}
				if (addToList) {
					tempFormattedBookmarks[bookTitle].push(question);
				}
			}
			else {
				tempFormattedBookmarks[bookTitle].push(question);
			}
		}
		setFormattedBookmarks(tempFormattedBookmarks);
	}

	const handleBookmarkClick = (path) => {
		var pathToGo = "solutions?questionPath=" + path;
		console.log(pathToGo);
		Router.push(pathToGo);
	}
	

	async function logoutHandler(event) {
		event.preventDefault();

		try {
			setLoading(true);
			setError('');
			await logout();
			Router.push('/');
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	}

	async function changePasswordHandler(event) {
		event.preventDefault();

		if (newPassword !== confirmNewPassword) {
			return setError("Passwords don't match");
		}
		if (newPassword === '') {
			return setError('Please input a password');
		}

		updatePassword(currentUser, newPassword)
			.then(() => {
				handleClose(event);
				setSuccess(true);
			})
			.catch((error) => {
				setError(error.message);
			});
	}


	const userView = (usr) => {
		return (
			<div>
				<div className={styles2.container1}>
					<div className={styles2.text1}>{usr.username}</div>
					<Avatar> {usr.name}</Avatar>
					<div className={styles2.text2}>
						{' '}
						Questions Answered: {Array(usr.solutions).length}{' '}
					</div>
					<div className={styles2.text2}> Reputation: {usr.reputation}</div>
					<div className={styles2.text2}> Top Answers: {usr.topAnswers}</div>
					<p>
						{' '}
						<b>Name: </b>
						{usr.name + ' ' + usr.lastName}
					</p>
					<p>
						{' '}
						<b>Username: </b> {usr.username}
					</p>
					<p>
						{' '}
						<b>Email Address: </b> {usr.email}
					</p>
					{Object.keys(formattedBookmarks).length 
						? (
						<div className={styles2.bookmark}>
							<b>Bookmarked Questions: </b>
							<List
								sx={{
									width: '100%',
									maxWidth: 250,
									bgcolor: 'background.paper',
									position: 'relative',
									overflow: 'auto',
									maxHeight: 300,
									'& ul': { padding: 0 },
								}}
								subheader={<li />}
								>
								{Object.keys(formattedBookmarks).map((title) => (
									<li key={`section-${title}`}>
									<ul>
										<ListSubheader>{`${title}`}</ListSubheader>
										{formattedBookmarks[title].map((question) => (
											<ListItemButton 
												key={`item-${title}-${question["id"]}`}
												onClick={() => {
													handleBookmarkClick(question["path"]);
												}}
											>
												<ListItemText primary={`${question["string"]}`} />
											</ListItemButton>
										))}
									</ul>
									</li>
								))}
							</List>
						</div>
					)
					: (null) }
				</div>

				<div className={styles2.button}>
					<Button
						disabled={loading}
						variant="contained"
						color="primary"
						onClick={logoutHandler}
					>
						Logout
					</Button>
				</div>

				<div className={styles2.button}>
					<Button variant="contained" color="primary" onClick={handleOpen}>
						Change Password
					</Button>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box className={styles.modalStyle}>
							<form
								className="changePasswordForm"
								name="changePasswordForm"
								method="POST"
								data-netlify="true"
							>
								<h1>Change Password</h1>
								<p>
									<label htmlFor="newPassword">
										<h3>New Password: </h3>
									</label>
									<input
										className={styles.BrFormInputBox}
										type="password"
										id="newPassword"
										onChange={(event) => {
											setNewPassword(event.target.value);
										}}
										required
									/>
								</p>
								<p>
									<label htmlFor="confirmNewPassword">
										<h3>Confirm new password: </h3>
									</label>
									<input
										className={styles.BrFormInputBox}
										type="password"
										id="confirmNewPassword"
										onChange={(event) => {
											setConfirmNewPassword(event.target.value);
										}}
										required
									/>
								</p>
								<Button
									variant="contained"
									color="primary"
									onClick={changePasswordHandler}
								>
									Change Password
								</Button>
							</form>
						</Box>
					</Modal>
				</div>

				<div>
					{error && (
						<Alert severity="error">
							{' '}
							<AlertTitle>{error}</AlertTitle>{' '}
						</Alert>
					)}
				</div>
				<div>
					{success && (
						<Alert severity="success">
							{' '}
							<AlertTitle>Password change was successful</AlertTitle>{' '}
						</Alert>
					)}
				</div>
			</div>
		);
	};

	return <Page>
		{userView(user)}
	</Page> 
	
}
