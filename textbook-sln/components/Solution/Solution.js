import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import styles from './Solution.module.css';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlagIcon from '@mui/icons-material/Flag';
import IconButton from '@mui/material/IconButton';
import SolutionModel from '../../models/solutionModel';
import Comments from '../Comments/Comments';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

import Link from 'next/link';
import Latex from 'react-latex';
import 'katex/dist/katex.min.css';

export default function Solution({ aid, currentUser }) {
	const [answer, setAnswer] = useState();

	useEffect(() => {
		const unsub = onSnapshot(doc(db, `answers/${aid}`), (doc) => {
			const answer = doc.data();
			if (answer) {
				const solnModel = new SolutionModel();
				Object.assign(solnModel, answer);
				solnModel['id'] = doc.id;
				const likedList = answer.likedBy;
				const flaggedList = answer.flaggedBy;
				if (likedList !== undefined && currentUser !== null) {
					solnModel.currUserLiked = likedList.includes(currentUser.uid);
				}
				if (flaggedList !== undefined && currentUser !== null) {
					solnModel.currUserFlagged = flaggedList.includes(currentUser.uid);
				}

				setAnswer(solnModel);
			}
		});

		return () => {
			unsub();
		};
	}, [aid]);

	return answer ? (
		<div className={styles.container}>
			<span className={styles.solution}>
				<Latex>{answer.solution}</Latex>
			</span>
			<div>
				<Checkbox
					onClick={() => {
						answer.likeSolution(currentUser);
					}}
					icon={<FavoriteBorder />}
					checkedIcon={<Favorite />}
					checked={answer.currUserLiked}
					color="default"
				/>
				{answer.likes}
				<Checkbox
					onClick={() => {
						answer.flagSolution(currentUser);
					}}
					icon={<FlagOutlinedIcon />}
					checkedIcon={<FlagIcon />}
					checked={answer.currUserFlagged}
					color="default"
				/>
				{answer.flags}

			</div>

			<div className={styles.float_container}>
				<div className={styles.float_child1}>
					<div>Answered By:</div>
				</div>

				<div className={styles.float_child2}>
					<Link href={'/otherUserProfile/' + answer.user} passHref>
						<div> {answer.user}</div>
					</Link>
				</div>
			</div>

			<Comments aid={aid} loggedUser={currentUser} />
		</div> )
		: 
		<></>
}
