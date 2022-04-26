import { useRouter } from 'next/router';
import { db } from '../firebase/config';
import { useEffect, useState } from 'react';
import styles from '../styles/Solutions.module.css';
import Page from '../components/Page/Page';
import Solution from '../components/Solution/Solution';
import { doc, onSnapshot } from 'firebase/firestore';
import IconButton from '@mui/material/IconButton';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useAuth } from '../firebase/AuthContext';
import firebase from 'firebase/compat/app';
import UserModel from '../models/userModel';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';

export default function Solutions() {
	const [book, setBook] = useState({});
	const [questionSegments, setQuestionSegments] = useState([]);
	const router = useRouter();
	const { questionPath } = router.query;
	const [newSolution, setNewSolution] = useState('');
	const { currentUser } = useAuth(); // currentUser is null if there is no logged user 
	const [user, setUser] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (questionPath) {
			const segments = questionPath.split('/');
			const bid = segments[0];
			setQuestionSegments(segments.slice(1));
			const unsub = onSnapshot(doc(db, `textbooks/${bid}`), (doc) => {
				const book = doc.data();
				if (book) {
					setBook(book);
				}
			});

			return () => {
				unsub();
			};
		}
	}, [questionPath]);

	useEffect(() => {
		if (!currentUser) {
			return;
		}
		const unsub = onSnapshot(doc(db, `users/${currentUser.uid}`), (doc) => {
			const user = doc.data();
			const userModel = new UserModel();
			Object.assign(userModel, user);
			setUser(userModel);
		});

		return () => {
			unsub();
		};
	}, []);

	const createFormattedPath = (pathSegments) => {
		const formatPathHelper = (pathSegments) => {
			return pathSegments.length
				? `${pathSegments[0]} ${pathSegments[1]}, ${formatPathHelper(
					pathSegments.slice(2)
				)}`
				: '';
		};

		return formatPathHelper(pathSegments).slice(0, -2);
	};

	const getAnswerIds = (branchObject, questionSegments) => {
		return !questionSegments.length
			? branchObject
			: getAnswerIds(
				branchObject[questionSegments[0]],
				questionSegments.slice(1)
			);
	};
	
	const getUpdatedBook = (branchObject, questionSegments, value) => {
		let updatedBranch;
		if (!questionSegments.length) {
			updatedBranch = [...branchObject, value];
		} else {
			updatedBranch = { ...branchObject };
			updatedBranch[questionSegments[0]] = getUpdatedBook(
				branchObject[questionSegments[0]],
				questionSegments.slice(1),
				value
			);
		}
		return updatedBranch;
	};

	const submitSolution = async () => {
		if (!currentUser) {
			setMessage("Please login or create an account to post solutions");
			return;
		}
		const bid = questionPath.split('/')[0];
		let submission;
		try {
			const answers = db.collection('answers');
			submission = await answers.add({
				flags: 0,
				likes: 0,
				solution: newSolution,
				user: user.username,
				textbook: bid,
				likedBy: [],
				flaggedBy: [],
			});
		} catch (e) {
			console.error('Error adding new solution:', e);
			return;
		}

		const textbooks = db.collection('textbooks');
		const bookDoc = await textbooks.doc(bid).get();
		const updatedBook = getUpdatedBook(book, questionSegments, submission.id);
		bookDoc.ref.update(updatedBook);
	};

	const bookmarkQuestion = () => {
		const path = questionPath;
		// printing the user 
		// save the path into the logged user bookmark
		if (currentUser !== null) {
			const userRef = db.doc(`users/${currentUser.uid}`);
			userRef.update({
				bookMarks: firebase.firestore.FieldValue.arrayUnion(path)
			});
		}
	};

	return (
		<Page className={styles.container}>
			<h1>{book.title}</h1>
			{questionSegments.length && (
				<>
					<h2>
						Solutions for {createFormattedPath(questionSegments)}
						{currentUser !== null &&
							<IconButton
								onClick={() => {
									bookmarkQuestion();
								}}
							>
								<BookmarkIcon></BookmarkIcon>
							</IconButton>
						}
					</h2>
					{!!book && !!book.chapters && (
						<div className={styles.solutions}>
							{getAnswerIds(book, questionSegments).map((aid) => (
								<Solution key={aid} aid={aid} currentUser={currentUser} />
							))}
						</div>
					)}
				</>
			)}
			<h2>Add Your Solution</h2>
			<div className={styles.solutionInputContainer}>
				<textarea
					className={styles.solutionBox}
					placeholder="Type your solution here. To use Latex surround your text with $."
					value={newSolution}
					onChange={(e) => setNewSolution(e.target.value)}
				></textarea>
				<button
					className={styles.solutionSubmit}
					onClick={() => submitSolution()}
				>
					Submit Solution
				</button>
			</div>
			<div>
				{message && (
					<Alert severity="error">
						{' '}
						<AlertTitle>{message}</AlertTitle>{' '}
					</Alert>
				)}
			</div>
		</Page>
	);
}
