import styles from './TextbookForm.module.css';
import { useState, createContext } from 'react';
import { validateTextbook } from './utils';
import TreeNavigator from './TreeNavigator';

export const ChaptersContext = createContext({});

export default function TextbookForm({ textbook, setTextbook, submitHandler }) {
	const [chapterCount, setChapterCount] = useState(1);
	const { title, edition, author, chapters } = textbook;

	const setTitle = (title) => setTextbook({ ...textbook, title });
	const setEdition = (edition) => setTextbook({ ...textbook, edition });
	const setAuthor = (author) => setTextbook({ ...textbook, author });
	const setChapters = (chapters) => setTextbook({ ...textbook, chapters });

	const addBranches = (count) => {
		if (!count || isNaN(count)) return;
		let children = {};
		for (let i = 1; i <= count; i++) {
			children = { ...children, [i]: {} };
		}
		setChapters({ ...children });
	};

	const addBranch = () => {
		const updatedChapters = {
			...chapters,
			[Object.keys(chapters).length + 1]: {},
		};
		setChapters(updatedChapters);
	};

	const submit = () => {
		if (validateTextbook(textbook)) {
			submitHandler();
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.textbookInfo}>
				<label>
					Textbook Title:
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder={'Title'}
					/>
				</label>
				<label>
					Textbook Author
					<input
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						placeholder={'Author'}
					/>
				</label>
				<label>
					Textbook Edition:
					<input
						value={edition}
						onChange={(e) => setEdition(e.target.value)}
						placeholder={'Edition'}
					/>
				</label>
			</div>

			{!Object.keys(chapters).length ? (
				<div className={styles.chapterCount}>
					<input
						type="number"
						value={chapterCount}
						onChange={(e) => setChapterCount(e.target.value)}
						min={1}
					/>
					<button
						onClick={() => addBranches(chapterCount)}
						className={`${styles.addChapters} button`}
					>
						Add Chapters
					</button>
				</div>
			) : (
				<></>
			)}

			{Object.keys(chapters).length ? (
				<div className={styles.treeContainer}>
					<ChaptersContext.Provider
						value={{
							chapters,
							setChapters,
						}}
					>
						<TreeNavigator
							branches={chapters}
							branchType={'chapter'}
							path={[]}
						/>
					</ChaptersContext.Provider>

					<button className={styles.addBranch} onClick={() => addBranch()}>
						+ New Chapter
					</button>
				</div>
			) : (
				<></>
			)}

			<button
				className={`${styles.bookSubmit} button`}
				onClick={() => submit()}
			>
				Submit Book
			</button>
		</div>
	);
}
