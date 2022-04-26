import React from 'react';
import styles from './Page.module.css';
import Navbar from '../Navbar/Navbar';

function Page({ children, className }) {
	return (
		<div className={styles.container}>
			<Navbar />
			<div className={styles.childrenContainer}>
				<div className={className}>{children}</div>
			</div>
		</div>
	);
}

export default Page;
