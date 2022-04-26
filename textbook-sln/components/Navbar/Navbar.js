import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '../../firebase/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { navConfig } from './navConfig';
import { db } from '../../firebase/config';

import styles from './Navbar.module.css';
import title from '../../assets/solhunt-title.png';
import Router from 'next/router';

function Navbar() {
	const [loggedInUser, setLoggedInUser] = useState();
	const [isMod, setIsMod] = useState(false);
	const { currentUser, logout } = useAuth();

  useEffect(() => {
		getUser();
	}, [getUser]);

	const getUser = useCallback(async () => {
		const userRef = db.collection('users').doc(currentUser?.uid);
		const doc = await userRef.get();

		if (!doc.exists) {
			setLoggedInUser(null);
		} else {
			setLoggedInUser(doc.data());
			if (doc.data().type == 'user') {
				setIsMod(false);
			} else if (doc.data().type == 'mod') {
				setIsMod(true);
			}
		}
	}, [currentUser?.uid]);

	const logoutHandler = async function (event) {
		event.preventDefault();

		try {
			await logout();
			Router.push('/');
			Router.reload();
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<div className={styles.container}>
			<Link href="/" passHref>
				{/* <a> tags needed due to NextJS React.forwardRef issue */}
				<a>
					<Image
						src={title}
						alt="SolHunt Logo"
						layout="intrinsic"
						width={210}
						height={60}
						className={styles.logo}
					/>
				</a>
			</Link>
			{!loggedInUser && (
				<div className={styles.links}>
					{!isMod &&
						navConfig.map(({ link, name }) => (
							<Link key={link} href={link} passHref>
								<div className={styles.navItem}>{name}</div>
							</Link>
						))}
				</div>
			)}

			{loggedInUser && (
				<div className={styles.links}>
					<Link href={'/userProfile'} passHref>
						<div className={styles.navItem}>User: {loggedInUser?.email}</div>
					</Link>
					<br></br>
					{isMod && (
						<Link href={'/moderator'} passHref>
							<div className={styles.navItem}>Moderator</div>
						</Link>
					)}
					<Link href={'/'} passHref>
						<div
							className={styles.navItem}
							onClick={(event) => {
								logoutHandler(event);
							}}
						>
							Logout
						</div>
					</Link>
				</div>
			)}
		</div>
	);
}

export default Navbar;
