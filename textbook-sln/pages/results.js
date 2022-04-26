import { useRouter } from 'next/router';
import { useState, useEffect, Fragment } from 'react';
import Page from '../components/Page/Page';
import { Grid, Box, Button, Drawer, List, ListItem, IconButton } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import ResultGrid from '../components/ResultGrid/ResultGrid';
import { db } from '../firebase/config';
import TuneIcon from '@mui/icons-material/Tune';
import styles from "../styles/Results.module.css"

//credit: https://codesandbox.io/s/infallible-snyder-lve92i

export default function Results() {
	const router = useRouter();
	const textbooks = db.collection('textbooks');
	const query = router.query.query;

	const [author, setAuthor] = useState();
	const [edition, setEdition] = useState();
	const [bookResults, setBookResults] = useState([]);

	// Use state to keep track of filtered results so that if a User wants to remove filters
	// We can return to the original results
	const [filteredBookResults, setFilteredBookResults] = useState([]);
	
	const getBooks = useEffect(() => {
		const searchHandler = async (keyword) => {
			if (!keyword) {
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

			setFilteredBookResults(
				foundBooks.map((book) => ({
					id: book.id,
					...book.data(),
				}))
			);
		};
		searchHandler(query);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const filterBooks = () => {
		let filteredBooks = bookResults;
		if (author) {
			filteredBooks = filteredBooks.filter((book) => {
				return book.author.toLowerCase().includes(author.toLowerCase());
			});
		}

		if (edition) {
			filteredBooks = filteredBooks.filter((book) => {
				return book.edition == edition;
			});
		}
		setFilteredBookResults([...filteredBooks]);
	};
	const [drawerState, setDrawerState] = useState(false)
	const list =
		(<Box role="presentation">
			<List>
				<ListItem>
					<label htmlFor="author" className={styles.spacing}>
						<p>Author</p>
					</label>
					<input
						type="text"
						id="author"
						onChange={(event) => {
							setAuthor(event.target.value);
						}}
						value={author}
					/>
				</ListItem>
				<ListItem>
					<label htmlFor="edition" className={styles.spacing}>
						<p>Edition</p>
					</label>
					<input
						type="number"
						id="edition"
						onChange={(event) => {
							setEdition(event.target.value);
						}}
						value={edition}
					/>
				</ListItem>
			</List>
		</Box>);


	return (
		<Page>
			<CssBaseline />
			<Fragment key="left">
				<IconButton onClick={() => { setDrawerState(true) }}>
					<TuneIcon className={styles.iconColor} fontSize="large"/>
				</IconButton>
				<Drawer
					className={styles.drawerStyle}
					anchor="left"
					open={drawerState}
					onClose={() => {
						setDrawerState(false)
						filterBooks()
					}
					}
					onKeyDown={(event)=>{
						console.log(event.key)
						if (event.key === 'Esc') {
							setDrawerState(false)
						}
					}}
				>
					{list}
				</Drawer>
			</Fragment>
			<Grid container direction="column">
				<Grid container item xs={12} sx={{ padding: '10px 40px' }}>
					<ResultGrid books={filteredBookResults} />
				</Grid>
			</Grid>
		</Page>
	);
}
