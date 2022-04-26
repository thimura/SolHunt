import { useRouter } from 'next/router';
import Link from 'next/link';
import { db } from '../../firebase/config';
import { useEffect, useState } from 'react';
import styles from '../../styles/books.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import Page from '../../components/Page/Page';

export default function Book() {
	const router = useRouter();
	const { bid } = router.query;
	const [book, setBook] = useState({});

	useEffect(() => {
		const fetchBook = async () => {
			const textbooks = db.collection('textbooks');
			const book = await textbooks.doc(bid).get();
			setBook(book.data());
		};
		fetchBook();
	}, [bid]);

	return (
		<Page className={styles.container}>
			<h1>Choose a Chapter:</h1>
			{!!book && !!book.chapters && (
				<div className={styles.navigatorContainer}>
					<TreeNavigator
						branches={book.chapters}
						branchType={'Chapter'}
						questionPath={`${bid}/chapters`}
					/>
				</div>
			)}
		</Page>
	);
}

function TreeNavigator({ branches, branchType, questionPath }) {
	return (
		<div className={styles.branches}>
			{Object.entries(branches).map(([branch, contents]) => {
				return (
					<Branch
						key={branch}
						contents={contents}
						branchType={branchType}
						branch={branch}
						questionPath={`${questionPath}/${branch}`}
					/>
				);
			})}
		</div>
	);
}

function Branch({ branch, contents, branchType, questionPath }) {
	const { title } = contents;
	const [visible, setVisible] = useState(false);
	const sectionKeys = Object.keys(contents).filter(
		(section) => section !== 'title'
	);

	return (
		<div className={styles.branch}>
			<span
				className={styles.branchHeader}
				onClick={() => setVisible(!visible)}
			>
				<FontAwesomeIcon icon={visible ? faAngleDown : faAngleRight} />
				<span className={styles.branchTitle}>
					{branchType} {branch}:
				</span>
				{' ' + title}
			</span>

			{visible &&
				(sectionKeys.includes('questions') ? (
					//Base case
					<div className={styles.questions}>
						{Object.entries(contents['questions']).map(
							([question, answers]) => (
								<Link
									key={question}
									href={`/solutions?questionPath=${questionPath}/questions/${question}`}
									passHref
								>
									<div className={styles.question}>Question {question}</div>
								</Link>
							)
						)}
					</div>
				) : (
					//Continue rendering
					<TreeNavigator
						branchType={sectionKeys[0]}
						branches={contents[sectionKeys[0]]}
						questionPath={`${questionPath}/${sectionKeys[0]}`}
					/>
				))}
		</div>
	);
}
