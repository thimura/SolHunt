import { db } from '../firebase/config';
import { updateDoc, doc } from 'firebase/firestore';

export default class UserModel {
	constructor() {
		this.bookmarks = [];
		this.email = '';
		this.name = '';
		this.username = '';
		this.reputation = 0;
		this.solutions = [];
		this.topAnswers = 0;
	}
}
