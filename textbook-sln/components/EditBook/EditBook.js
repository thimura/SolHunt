import styles from '../AddBook/AddBook.module.css';
import { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase/config';
import TextbookForm from '../TextbookForm/TextbookForm';

export default function EditBook({ bid }) {
	const [textbook, setTextbook] = useState({
		title: '',
		edition: '',
		author: '',
		chapters: {},
	});

	useEffect(() => {
		fetchBook();
	}, [fetchBook]);

	const fetchBook = useCallback(async () => {
		const textbooks = db.collection('textbooks');
		const book = await textbooks.doc(bid).get();
		setTextbook(book.data());
	}, [bid]);

	const editTextbook = async () => {
		const textbooks = db.collection('textbooks');
		await textbooks.doc(bid).update(textbook);
		alert('Successfully updated textbook!');
	};

	return (
		<div className={styles.container} style={{ width: '60vw' }}>
			<h3>Edit Textbook</h3>
			<TextbookForm
				textbook={textbook}
				setTextbook={setTextbook}
				submitHandler={editTextbook}
			/>
		</div>
	);
}
