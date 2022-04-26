import { useState } from 'react';
import TextbookForm from '../TextbookForm/TextbookForm';
import styles from './AddBook.module.css';
import { db } from '../../firebase/config';

export default function AddBook() {
	const [textbook, setTextbook] = useState({
		title: '',
		edition: '',
		author: '',
		chapters: {},
	});

	const addTextbook = async () => {
		const textbooks = db.collection('textbooks');
		await textbooks.add(textbook);
		alert('Successfully added textbook!');
	};

	return (
		<div className={styles.container}>
			<h3>Add Textbook</h3>
			<TextbookForm
				textbook={textbook}
				setTextbook={setTextbook}
				submitHandler={addTextbook}
			/>
		</div>
	);
}
