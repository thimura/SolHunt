import styles from './TextbookForm.module.css';
import { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAngleRight,
	faAngleDown,
	faTrashCan,
	faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { getUpdatedChapters, updateBranchName, removeBranch } from './utils';
import { ChaptersContext } from './TextbookForm';

export default function TreeNavigator({ branches, branchType, path }) {
	return (
		!!branches && (
			<div className={styles.branches}>
				{Object.entries(branches).map(([key, content]) => {
					return (
						<Branch
							key={key}
							branchType={branchType}
							branches={content}
							path={path.concat(key)}
						/>
					);
				})}
			</div>
		)
	);
}

function Branch({ branchType, branches, path }) {
	const [visible, setVisible] = useState(false);
	const [childrenType, setChildrenType] = useState('');
	const [branchCount, setBranchCount] = useState(1);
	const branch = path[path.length - 1];
	const { chapters, setChapters } = useContext(ChaptersContext);
	const { title } = branches;
	const sectionKey = Object.keys(branches).find(
		(section) => section !== 'title'
	);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		setChildrenType(sectionKey || '');

		if (sectionKey) {
			setBranchCount(Object.keys(branches[sectionKey]).length);
		}
	}, [sectionKey, branches]);

	const addTitle = (event) => {
		updateChapters('title', event.target.value);
	};

	const addBranches = (count, type) => {
		if (!count || isNaN(count) || !type) return;

		let children = { ...branches[childrenType] };
		for (let i = 1; i <= count; i++) {
			children = {
				...children,
				[i]: type == 'questions' ? [] : {},
			};
		}
		updateChapters(type, children);
	};

	const addChild = () => {
		const newBranchCount = Number(branchCount) + 1;
		const children = {
			...branches[childrenType],
			[newBranchCount]: childrenType == 'questions' ? [] : {},
		};
		updateChapters(childrenType, children);
	};

	const updateChapters = (key, value) => {
		const updatedChapters = getUpdatedChapters(chapters, path, key, value);
		setChapters(updatedChapters);
	};

	const updateChildrenType = () => {
		const updatedChapters = updateBranchName(
			chapters,
			path,
			sectionKey,
			childrenType
		);
		setChapters(updatedChapters);
	};

	const removeChild = () => {
		const updatedChapters = removeBranch(
			chapters,
			path.slice(0, path.length - 1),
			branch,
			childrenType
		);
		setChapters(updatedChapters);
	};

	return (
		<div className={styles.branch}>
			<span className={styles.branchHeader}>
				{branchType == 'questions' ? (
					<span>
						{branchType} {branch}
					</span>
				) : (
					<>
						<span
							className={styles.branchTitle}
							onClick={() => setVisible(!visible)}
						>
							<FontAwesomeIcon icon={visible ? faAngleDown : faAngleRight} />{' '}
							{branchType} {branch}:
						</span>
						<input
							type="text"
							placeholder="Title"
							value={title || ''}
							onChange={(event) => addTitle(event)}
						/>
						{sectionKey && (
							<button onClick={() => setEdit(!edit)} className={styles.setEdit}>
								<FontAwesomeIcon icon={faPencil} />
							</button>
						)}
					</>
				)}
				<button onClick={() => removeChild()} className={styles.deleteBranch}>
					<FontAwesomeIcon icon={faTrashCan} />
				</button>
			</span>

			{visible && (
				<div className={styles.branchChildren}>
					{sectionKey && Object.keys(branches).length ? (
						<>
							{edit && (
								<span className={styles.editChildren}>
									<input
										placeholder={'Rename Children'}
										value={childrenType}
										onChange={(e) => setChildrenType(e.target.value)}
									/>
									<button
										onClick={() => updateChildrenType()}
										className={`${styles.renameBranch} button`}
									>
										Rename Branches
									</button>
								</span>
							)}

							<TreeNavigator
								branches={branches[sectionKey]}
								branchType={sectionKey}
								path={path.concat(sectionKey)}
							/>
							<button className={styles.addBranch} onClick={() => addChild()}>
								+ New Branch
							</button>
						</>
					) : (
						<div className={styles.branchForm}>
							<div className={styles.branchInputs}>
								<input
									placeholder="Branch Type"
									type="text"
									value={childrenType}
									onChange={(e) => setChildrenType(e.target.value)}
								/>
								<input
									placeholder="# of Branches"
									type="number"
									value={branchCount}
									onChange={(e) => setBranchCount(e.target.value)}
									min={1}
								/>
							</div>
							<div className={`${styles.addBranches}`}>
								<button
									onClick={() => addBranches(branchCount, childrenType)}
									className="button"
								>
									+ Add Branches
								</button>
								<button
									onClick={() => {
										setChildrenType('questions');
										addBranches(branchCount, 'questions');
									}}
									className="button"
								>
									+ Add Questions
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
