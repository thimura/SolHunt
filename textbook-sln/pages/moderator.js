import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { db } from '../firebase/config';
import RemoveBookPopup from '../components/RemoveBookPopup/RemoveBookPopup';
import Popup from '../components/Popup/Popup';
import Page from '../components/Page/Page';
import styles from '../styles/Moderator.module.css';
import EditBook from '../components/EditBook/EditBook';
import { useAuth } from '../firebase/AuthContext';
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTrashCan,
	faPencil,
	faTimes,
	faFlag,
} from '@fortawesome/free-solid-svg-icons';
import AddBook from '../components/AddBook/AddBook';
import Latex from 'react-latex';
import 'katex/dist/katex.min.css';

export default function Moderator() {
	const [showRemoveBook, setShowRemoveBook] = useState(false);
	const [showEditBook, setShowEditBook] = useState(false);
	const [showAddBook, setShowAddBook] = useState(false);

	const textbooks = db.collection('textbooks');
	const requests = db.collection('requests');
	const answers = db.collection('answers');
	const [bookResults, setBookResults] = useState([]);
	const [bookDeleted, setBookDeleted] = useState({});
	const [booksRequested, setBooksRequested] = useState([]);
	const [flaggedAnswers, setFlaggedAnswers] = useState([]);
	const FLAGS_THRESHOLD = 4;
	const [editBookId, setEditBookId] = useState('');
	const { currentUser } = useAuth();

	useEffect(() => {
		getDocs();
	}, [getDocs]);

	useEffect(() => {
		if (!currentUser) {
			Router.push('/login');
			return;
		}
		getRequests();
	}, [getRequests, currentUser]);

	const getDocs = useCallback(async () => {
		const answersSnapshot = await answers.get();
		setFlaggedAnswers(
			answersSnapshot.docs
				.filter((doc) => doc.data().flags >= FLAGS_THRESHOLD)
				.map((filteredDoc) => ({
					id: filteredDoc.id,
					...filteredDoc.data(),
				}))
		);
	}, [answers]);

  const searchHandler = async (keyword) => {
		if (!keyword.length) {
			setBookResults([]);
			return;
		}
		const docsSnapshot = await textbooks.get();
		const foundBooks = docsSnapshot.docs.filter((book) => {
			return book.data().title.toLowerCase().includes(keyword.toLowerCase());
		});
		setBookResults(
			foundBooks.map((book) => ({
				id: book.id,
				...book.data(),
			}))
		);
	};

	const deleteBook = async (book, boolVal) => {
		setShowRemoveBook(boolVal);
		await textbooks.doc(book.id).delete();
	};

	const loadRemoveBookPopup = async (book) => {
		setBookDeleted(book);
		setShowRemoveBook(true);
	};

	const loadEditBookPopup = (bid) => {
		setEditBookId(bid);
		setShowEditBook(true);
	};


	const getRequests = useCallback(async () => {
		const docsSnapshot = await requests.get();
		const requestsFound = docsSnapshot.docs.filter((book) => {
			return book.data();
		});
		setBooksRequested(
			requestsFound.map((book) => ({
				id: book.id,
				...book.data(),
			}))
		);
	}, [requests, setBooksRequested]);

	const deleteRequest = async (book) => {
		await requests.doc(book.id).delete();
		getRequests();
	};

	return (
		<Page className={styles.container}>
			<Head>
				<title>Moderator Page</title>
			</Head>

			<div className={styles.updateContainer}>
				<h2>Update Textbooks</h2>
				<input
					className={styles.searchBar}
					placeholder="Search for textbooks"
					onChange={(e) => searchHandler(e.target.value)}
				/>
				{!!bookResults.length && (
					<div className={styles.bookResults}>
						{bookResults.map((book) => (
							<div className={styles.book} key={book.id}>
								<div className={styles.bookInfo}>
									<div className={styles.bookTitle}>
										{book.title} (Edition {book.edition})
									</div>
									<div>{book.author}</div>
								</div>

								<div className={styles.bookActions}>
									<button
										className={styles.editBook}
										onClick={() => loadEditBookPopup(book.id)}
									>
										<FontAwesomeIcon icon={faPencil} />
									</button>
									<button
										className={styles.deleteBook}
										onClick={() => loadRemoveBookPopup(book)}
									>
										<FontAwesomeIcon icon={faTrashCan} />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
				<button
					className={`${styles.addBook} button`}
					onClick={() => setShowAddBook(true)}
				>
					Add New Textbook
				</button>
			</div>

			<div className={styles.itemLists}>
				<div className={styles.requestedBooks}>
					<h2>Requested Books</h2>
					{booksRequested.length ? (
						<ul>
							{booksRequested.map((reqBook) => (
								<li key={reqBook.id} className={styles.requestedBook}>
									<button
										className={styles.deleteRequestedBook}
										onClick={() => deleteRequest(reqBook)}
									>
										<FontAwesomeIcon icon={faTimes} />
									</button>
									<div className={styles.bookInfo}>
										<strong>Name:</strong> {reqBook.title}
										<br></br>
										<strong>ISBN:</strong> {reqBook.isbn}
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className={styles.emptyText}>
							<h4>No Requested Books</h4>
						</div>
					)}
				</div>

				<div className={styles.flaggedAnswers}>
					<h3 className={styles.h3}>Flagged Answers</h3>

					{flaggedAnswers.length ? (
						<ul>
							{flaggedAnswers.map((ans) => (
								<li className={styles.flaggedAnswer} key={ans.id}>
										<Latex>
											{ans.solution.length < 50
												? ans.solution
												: ans.solution.slice(0, 50).concat(' ...')}
										</Latex>
									<div className={styles.flaggedBtns}>
										<span className={styles.flagCount}>
											<FontAwesomeIcon icon={faFlag} />
											{ans.flags}
										</span>
										
										<Link href={`/book/${ans.textbook}`} passHref>
											<span className={styles.bookLink}>
												Go to textbook
											</span>
										</Link>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className={styles.emptyText}>
							<h4>No Flagged Answers</h4>
						</div>
					)}
				</div>
			</div>

			<RemoveBookPopup
				visible={showRemoveBook}
				setVisible={setShowRemoveBook}
				deleteBook={deleteBook}
				book={bookDeleted}
			/>

			<Popup visible={showAddBook} setVisible={setShowAddBook}>
				<AddBook />
			</Popup>

			<Popup visible={showEditBook} setVisible={setShowEditBook}>
				<EditBook bid={editBookId} />
			</Popup>
		</Page>
	);
}
