import { useEffect, useState } from 'react';
import styles from './Comments.module.css';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import CommentModel from '../../models/commentModel';
import { addToDB } from '../../firebase/config';
import { db } from '../../firebase/config';
import { collection, query, onSnapshot, doc } from 'firebase/firestore';
import UserModel from '../../models/userModel';
import { useAuth } from '../../firebase/AuthContext';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';


export default function Comments({ aid, loggedUser }) {
	const [comments, setComments] = useState([]);
	const [currComment, setCurrComment] = useState('');
	const [user, setUser] = useState('');
	const { currentUser } = useAuth();
	const [message, setMessage] = useState('');


	useEffect(() => {
		if (!currentUser){
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
	useEffect(() => {
		const docDataQuery = query(collection(db, `answers/${aid}/comments`));

		//adds listener to the comments collection
		const unsubscribe = onSnapshot(docDataQuery, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				const data = change.doc.data();
				const docId = change.doc.id;
				data.id = docId;

				switch (change.type) {
					case 'added': {
						const commentModel = new CommentModel(data.comment, aid);
						Object.assign(commentModel, data);
						setComments(comments.concat(commentModel));
						break;
					}
					case 'removed':
						setComments(comments.filter((comment) => comment.id !== docId));
						break;
					default:
						break;
				}
			});

			const commentModels = snapshot.docs.map((doc) => {
				const commentData = doc.data();
				if (commentData) {
					const comment = commentData.comment;
					const commentModel = new CommentModel(comment);
					Object.assign(commentModel, commentData);
					commentModel.id = doc.id;
					commentModel.solutionId = aid;
					const likedList = commentData.likedBy;
					const flaggedList = commentData.flaggedBy;
					if (likedList !== undefined && loggedUser !== null) {
						commentModel.currUserLiked = likedList.includes(loggedUser.uid);
					}
					if (flaggedList !== undefined && loggedUser !== null) {
						commentModel.currUserFlagged = flaggedList.includes(loggedUser.uid);
					}
					return commentModel;
				}
			});

			setComments(commentModels.filter((comment) => !!comment));
		});

		return () => {
			unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [aid]);

	const addCommentToDB = (comment) => {
		if (!currentUser){
			setMessage("Please login or create an account to post solutions");
			return;
		}
		const commentModel = new CommentModel(comment, aid, user.username);
		const { username, flags, likes } = commentModel;
		const id = addToDB(`answers/${aid}/comments`, {
			comment,
			user: username,

			flags,
			likes,
		});
		commentModel.id = id;
	};

	// comment: a CommentModel obj
	const commentView = (comment) => {
		//credit: https://codesandbox.io/s/comment-box-with-material-ui-10p3c
		 const imgLink = ''
		// 	'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260';
		return (
			<Grid container wrap="nowrap" spacing={2} key={comment.id}>
				<Grid item>
					<Avatar alt="Remy Sharp" src={imgLink} />
				</Grid>
				<Grid justifyContent="left" item xs zeroMinWidth>
					<Link href={'/otherUserProfile/' + comment.user} passHref>
						<h4 style={{ margin: 0, textAlign: 'left', cursor: "pointer"}}>{comment.user}</h4>
					</Link>
					<p style={{ textAlign: 'left' }}>{comment.comment}</p>
				</Grid>
				<Grid justifyContent="right" item xs zeroMinWidth>
					<Checkbox 
						onClick={() => {
								comment.likeComment(aid, loggedUser);
						}}
						icon={<FavoriteBorder />} 
						checkedIcon={<Favorite />} 
						checked={comment.currUserLiked}
						color="default"
					/>
					{comment.likes}
					<IconButton
						onClick={() => {
							comment.deleteComment();
						}}
					>
						<DeleteIcon />
					</IconButton>
					<Checkbox 
						onClick={() => {
								comment.flagComment(loggedUser);
						}}
						icon={<FlagOutlinedIcon />} 
						checkedIcon={<FlagIcon />} 
						checked={comment.currUserFlagged}
						color="default"
					/>
					{comment.flags}
				</Grid>
			</Grid>
		);
	};

	return (
		<div className={styles.container}>
			<Divider variant="fullWidth" />
			<h3>Comments</h3>

			{comments.map((comment) => commentView(comment))}

			<div>
				<input
					value={currComment}
					onChange={(event) => {
						setCurrComment(event.target.value);
					}}
				></input>
				<button
					onClick={() => {
						addCommentToDB(currComment);
					}}
				>
					Add Comment
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
		</div>
	);
}
