import React from 'react';
import styles from './RemoveBookPopup.module.css';
import Popup from '../Popup/Popup';

function RemoveBookPopup({ visible, setVisible, deleteBook, book }) {
	return (
		<Popup visible={visible} setVisible={setVisible}>
			<div className={styles.container}>
				<h3 className={styles.question}>Remove this textbook?</h3>

				<p className={styles.message}>
					{book.title} (Edition {book.edition}) will be removed from the
					database
				</p>

				<div className={styles.btnsContainer}>
					<button
						className={styles.cancelBtn}
						onClick={() => setVisible(false)}
					>
						Cancel
					</button>

					<button
						className={styles.removeBtn}
						onClick={() => deleteBook(book, false)}
					>
						Remove
					</button>
				</div>
			</div>
		</Popup>
	);
}

export default RemoveBookPopup;
