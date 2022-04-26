import React from 'react';
import styles from './Popup.module.css';

function Popup({ visible, setVisible, children }) {
	return visible ? (
		<div className={styles.container} onClick={() => setVisible(false)}>
			<div className={styles.children} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	) : (
		<></>
	);
}

export default Popup;
