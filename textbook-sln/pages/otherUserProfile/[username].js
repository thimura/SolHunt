import { useEffect, useState } from 'react';
import Router from 'next/router';

import Avatar from '@mui/material/Avatar';
import UserModel from '../../models/userModel';
import { useRouter } from 'next/router';
import Page from '../../components/Page/Page';

import styles2 from '../../styles/UserProfile.module.css';
import { db } from '../../firebase/config';
import { doc, onSnapshot, collection } from 'firebase/firestore';


export default function OtherUserProfile() {
	const router = useRouter();
	const { username } = router.query;
	const [user, setUser] = useState('');


	useEffect(() => {
		const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
            snapshot.docs.forEach((doc) => {
				if (doc.data().username === username) {
					user = doc.data();
					const userModel = new UserModel();
					Object.assign(userModel, user);
					setUser(userModel);
				}
            })
        });
		return () => {
			unsub();
		}
	}, []);


    const userView = (usr) => {
		return (
            <div>
				<div className={styles2.container1}>
					<div className={styles2.text1}>{usr.username}</div>
					<Avatar> {usr.name}</Avatar>
					<div className={styles2.text2}>
						{' '}
						Questions Answered: {Array(usr.solutions).length}{' '}
					</div>
					<div className={styles2.text2}> Reputation: {usr.reputation}</div>
					<div className={styles2.text2}> Top Answers: {usr.topAnswers}</div>
					<p>
						{' '}
						<b>Name: </b>
						{usr.name + ' ' + usr.lastName}
					</p>
					<p>
						{' '}
						<b>Username: </b> {usr.username}
					</p>
					<p>
						{' '}
						<b>Email Address: </b> {usr.email}
					</p>

				</div>

			</div>
        );
        };

	return <Page>
		{userView(user)}
	</Page> 
}