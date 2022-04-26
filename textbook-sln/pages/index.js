import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import title from '../assets/solhunt-title.png';
import { db } from '../firebase/config';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { collection, addDoc } from 'firebase/firestore';
import Page from '../components/Page/Page';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';

export default function Home() {
	const [bookName, setBookName] = useState('');
	const [isbn, setISBN] = useState('');

	// set up for modal
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = (event) => {
		setOpen(false);
		setBookName('');
		setISBN('');
	};

	// handler to submit book request, send it to db
	async function submitRequestHandler(event) {
		event.preventDefault();
		try {
			const docRef = await addDoc(collection(db, 'requests'), {
				title: bookName,
				isbn: isbn,
			});
			setBookName('');
			setISBN('');
			setOpen(false);
		} catch (error) {
			console.log(error);
		}
	}

	const checkISBN = () => {
		const length = isbn.length;
		if (length !== 10 && length !== 13) {
			return 1;
		}

		let sum = 0;
		// check for ISBN with length 10
		if (length === 10) {
			for (let i = 0; i < 9; i++) {
				sum += parseInt(isbn[i]) * (length - i);
			}
			// checking if check digit is "X"
			if (isbn[9] === 'X') {
				sum += 10;
			} else {
				sum += parseInt(isbn[9]);
			}
			return sum % 11;
		}

		// check for ISBN with length 13
		sum = 0;
		for (let i = 0; i < 13; i++) {
			if (i % 2 === 0) {
				sum += parseInt(isbn[i]);
			} else {
				sum += parseInt(isbn[i]) * 3;
			}
		}
		return sum % 10;
	};

	// making sure all fields are filled to allow submission
	const checkAllFilled = () => {
		if (bookName === '' || isbn === '' || checkISBN() !== 0) {
			return ['disabled', ''];
		}
		return ['', 'enabled'];
	};

	const textbooks = db.collection('textbooks');
	const [bookResults, setBookResults] = useState([]);
	const [query, setQuery] = useState('');

	// useRouter is a hook and can only be called inside the body of a fxn component
	const router = useRouter();
	const enterHandler = (key) => {
		if (key == 'Enter' && query) {
			router.push(`results?query=${query}`);
		}
	};

	const searchHandler = async (keyword) => {
		setQuery(keyword);
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

	return (
		<Page className={styles.container}>
			<Head>
				<title>SolHunt</title>
				<meta name="description" content="Sol Hunt Application" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Image
				src={title}
				alt="SolHunt Title"
				layout="intrinsic"
				width={525}
				height={150}
			/>

			<div className={styles.searchContainer}>
				<input
					className={styles.searchBar}
					placeholder="Search for textbooks"
					onChange={(e) => searchHandler(e.target.value)}
					onKeyDown={(keyEvent) => enterHandler(keyEvent.code)}
				/>
				{!!bookResults.length && (
					<div className={styles.bookResults}>
						{bookResults.map((book) => (
							<Link key={book.id} href={`/book/${book.id}`} passHref>
								<div className={styles.book}>
									<div className={styles.bookTitle}>
										{book.title} (Edition {book.edition})
									</div>
									<div>{book.author}</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>

			<div>
				<button className={styles.bookRequestButton} onClick={handleOpen}>
					Request a book
				</button>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box className={styles.modalStyle}>
						<form
							className="bookRequestForm"
							name="bookRequestForm"
							method="POST"
							data-netlify="true"
						>
							<h1>Book Request</h1>
							<p>
								<label htmlFor="bookName">
									<h3>Book Name: </h3>
								</label>
								<TextField
									required
									className={styles.BrFormInputBox}
									name="bookName"
									id="outlined-required"
									label="Required"
									onChange={(event) => {
										setBookName(event.target.value);
									}}
									error={bookName === ''}
								/>
							</p>
							<p>
								<label htmlFor="ISBN">
									<h3>ISBN: </h3>
								</label>
								<TextField
									required
									className={styles.BrFormInputBox}
									name="isbn"
									id="outlined-required"
									label="Required"
									onChange={(event) => {
										setISBN(event.target.value.replace(/-/g, ''));
									}}
									error={checkISBN() !== 0}
									helperText={checkISBN() !== 0 ? 'Invalid ISBN.' : ''}
								/>
							</p>
							<button
								onClick={submitRequestHandler}
								id="submitRequest"
								className={styles.bookRequestButton}
								type="submit"
								disabled={checkAllFilled()[0]}
								enabled={checkAllFilled()[1]}
							>
								Send
							</button>
						</form>
					</Box>
				</Modal>
			</div>
		</Page>
	);
}
