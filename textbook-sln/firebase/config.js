import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, addDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCVicFxm2H0fKCYkUDVcBk5-IL-bdbVJF8',
	authDomain: 'textbooksln.firebaseapp.com',
	projectId: 'textbooksln',
	storageBucket: 'textbooksln.appspot.com',
	messagingSenderId: '579961251236',
	appId: '1:579961251236:web:67e1879c022cd2b9420d31',
	measurementId: 'G-YZSRPYE60N',
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();

export const addToDB = async (collectionName, data) => {
	try {
		const docRef = await addDoc(collection(db, collectionName), data);
		console.log('Document written with ID: ', docRef.id);
		return docRef.id;
	} catch (e) {
		console.error('Error adding document: ', e);
	}
};

//fields: object containing fields to update
export const updateDocument = async (docRef, fields) => {
	await updateDoc(docRef, fields);
};

export const getDocs = async (collectionName) => {
	const docs = (await db.collection(collectionName).get()).docs;
	return docs;
};

export const auth = firebase.auth();

export default firebase;
