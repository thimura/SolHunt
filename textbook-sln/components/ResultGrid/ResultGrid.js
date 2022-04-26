import { Grid } from '@mui/material';
import TextbookCard from '../TextbookCard/TextbookCard';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const ResultGrid = (books) => {
	const getBookCard = (bookObject) => {
		return (
			<Link href={`/book/${bookObject.id}`} passHref>
				<Grid item xs={12} sm={4}>
					<TextbookCard {...bookObject} />
				</Grid>
			</Link>
		);
	};

	return <>{books.books.map(getBookCard)}</>;
};

export default ResultGrid;
