import { db } from '../firebase/config';
import { updateDoc, doc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';


export default class SolutionModel {
	constructor() {
		this.comments = [];
		this.flags = 0;
		this.likes = 0;
		this.id = 1;
		this.user = 1;
		this.solution = '';
		this.currUserLiked = false;
		this.currUserFlagged = false;

		//potential fields
		//this.chapter
		//this.question
		//this.textbook
	}

	async likeSolution(currentUser) {
		// only registered users are allowed to like answers
		if (currentUser !== null) {
			const solnDocRef = db.doc(`answers/${this.id}`);

			//TODO: import when comment branch merged
			const updateDocument = async (docRef, fields) => {
				await updateDoc(docRef, fields);
			};

			// checking if the field likedBy exists
			const answer = await solnDocRef.get();
			var likedList = answer.data().likedBy;
			if (likedList === undefined) {
				await updateDocument(solnDocRef, { likedBy: [] });
				likedList = [];
			}

			// checking if user already liked the question
			if (!(likedList.includes(currentUser.uid))) {
				this.likes += 1;
				solnDocRef.update({
					likedBy: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
				});
			}
			else {
				this.likes -= 1;
				solnDocRef.update({
					likedBy: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
				});
			}

			await updateDocument(solnDocRef, { likes: this.likes });
		}
	}

	// Maybe refactor like and flag
	async flagSolution(currentUser) {
		// only registered users are allowed to flag answers
		if (currentUser !== null) {
			const solnDocRef = db.doc(`answers/${this.id}`);

			//TODO: import when comment branch merged
			const updateDocument = async (docRef, fields) => {
				await updateDoc(docRef, fields);
			};

			// checking if the field flaggedBy exists
			const answer = await solnDocRef.get();
			var flaggedList = answer.data().flaggedBy;
			if (flaggedList === undefined) {
				await updateDocument(solnDocRef, { flaggedBy: [] });
				flaggedList = [];
			}

			// checking if user already liked the question
			if (!(flaggedList.includes(currentUser.uid))) {
				this.flags += 1;
				solnDocRef.update({
					flaggedBy: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
				});
			}
			else {
				this.flags -= 1;
				solnDocRef.update({
					flaggedBy: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
				});
			}

			await updateDocument(solnDocRef, { flags: this.flags });
		}
	}

	dislikeComment() {
		this.likes -= 1;
	}

	unflagSolution() {
		this.flags -= 1;
	}
}
