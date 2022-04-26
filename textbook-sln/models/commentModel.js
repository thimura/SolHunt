import { updateDocument, db, getDocs } from '../firebase/config';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

export default class Comment {
	constructor(comment, solutionId, username) {
		this.comment = comment;
		this.flags = 0;
		this.likes = 0;
		// Unique reference to a solution, subject to change based on
		// how we render pages
		this.id = '';
		this.username = username;
		this.solutionId = solutionId;
		this.currUserLiked = false;
		this.currUserFlagged = false;
	}

	async likeComment(aid, currentUser) {
		// this.likes+=1
		//const commentDocs = await getDocs(`answers/${this.solutionid}/comments`)
		//console.log(commentDocs[0].id,this.id)
		//const index = commentDocs.findIndex((commentDoc) => {return commentDoc.id == this.id})
		if (currentUser !== null && currentUser) {
			const commentDocRef = db.doc(
				`answers/${this.solutionId}/comments/${this.id}`
			);

			const updateDocument = async (docRef, fields) => {
				await updateDoc(docRef, fields);
			};

			// checking if the field likedBy exists
			const comment = await commentDocRef.get();
			var likedList = comment.data().likedBy;
			if (likedList === undefined) {
				await updateDocument(commentDocRef, { likedBy: [] });
				likedList = [];
			}

			// checking if user already liked the question
			if (!(likedList.includes(currentUser.uid))) {
				this.likes += 1;
				commentDocRef.update({
					likedBy: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
				});
			}
			else {
				this.likes -= 1;
				commentDocRef.update({
					likedBy: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
				});
			}

			await updateDocument(commentDocRef, { likes: this.likes });
			//commentDocs[index]
		}
	}

	async deleteComment() {
		const commentDocRef = doc(db, 
			`answers/${this.solutionId}/comments/${this.id}`
		);
		await deleteDoc(commentDocRef);
	}

	dislikeComment() {
		this.likes -= 1;
	}

	async flagComment(currentUser) {
		if (currentUser !== null) {
			const commentDocRef = db.doc(
				`answers/${this.solutionId}/comments/${this.id}`
			);

			const updateDocument = async (docRef, fields) => {
				await updateDoc(docRef, fields);
			};

			// checking if the field flaggedBy exists
			const comment = await commentDocRef.get();
			var flaggedList = comment.data().flaggedBy;
			if (flaggedList === undefined) {
				await updateDocument(commentDocRef, { flaggedBy: [] });
				flaggedList = [];
			}

			// checking if user already liked the question
			if (!(flaggedList.includes(currentUser.uid))) {
				this.flags += 1;
				commentDocRef.update({
					flaggedBy: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
				});
			}
			else {
				this.flags -= 1;
				commentDocRef.update({
					flaggedBy: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
				});
			}

			await updateDocument(commentDocRef, { flags: this.flags });
		}
	}
}
