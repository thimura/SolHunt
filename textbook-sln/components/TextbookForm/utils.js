export const validateTextbook = (textbook) => {
	const { title, edition, author, chapters } = textbook;
	if (!title || !edition || !author || !chapters) {
		alert('Missing information!');
		return false;
	}
	return validationHelper(chapters);
};

const validationHelper = (branch) => {
	const children = Object.keys(branch);

	if (!children.length) {
		alert('Invalid textbook structure!');
		return false;
	} else if (!children.some((child) => isNaN(child))) {
		return children.reduce(
			(acc, curr) => acc && validationHelper(branch[curr]),
			true
		);
	} else if (!branch['title']) {
		alert('Missing title!');
		return false;
	} else if (children.some((child) => child != 'title')) {
		const branchKey = children.find((child) => child != 'title');
		return branchKey == 'questions' || validationHelper(branch[branchKey]);
	} else {
		alert('Invalid textbook structure');
		return false;
	}
};

export const getUpdatedChapters = (branchObject, pathSegments, key, value) => {
	let updatedBranch;
	if (!pathSegments.length) {
		updatedBranch = { ...branchObject, [key]: value };
	} else {
		updatedBranch = { ...branchObject };
		updatedBranch[pathSegments[0]] = getUpdatedChapters(
			branchObject[pathSegments[0]],
			pathSegments.slice(1),
			key,
			value
		);
	}
	return updatedBranch;
};

export const updateBranchName = (
	branchObject,
	pathSegments,
	oldKey,
	newKey
) => {
	let updatedBranch;
	if (!pathSegments.length) {
		updatedBranch = { ...branchObject };
		const content = updatedBranch[oldKey];
		delete updatedBranch[oldKey];
		updatedBranch[newKey] = content;
	} else {
		updatedBranch = { ...branchObject };
		updatedBranch[pathSegments[0]] = updateBranchName(
			branchObject[pathSegments[0]],
			pathSegments.slice(1),
			oldKey,
			newKey
		);
	}
	return updatedBranch;
};

export const removeBranch = (
	branchObject,
	pathSegments,
	branch,
	childrenType
) => {
	let updatedBranch;
	if (!pathSegments.length) {
		const children = { ...branchObject };
		delete children[branch];
		const keysToModify = Object.keys(children).filter(
			(key) => Number(key) > Number(branch)
		);
		return keysToModify.reduce((acc, curr) => {
			const childContent = { ...acc[curr] };
			delete acc[curr];
			return {
				...acc,
				[curr - 1]: childContent,
			};
		}, children);
	} else {
		updatedBranch = { ...branchObject };
		updatedBranch[pathSegments[0]] = removeBranch(
			branchObject[pathSegments[0]],
			pathSegments.slice(1),
			branch,
			childrenType
		);
	}
	return updatedBranch;
};
