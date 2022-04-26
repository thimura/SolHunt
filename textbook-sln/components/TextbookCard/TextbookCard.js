import { Card } from '@mui/material';
import { CardContent } from '@mui/material';
import { CardMedia } from '@mui/material';

//credit: https://codesandbox.io/s/infallible-snyder-lve92i?file=/src/theme.js:0-58

export default function TextbookCard({
	title,
	author,
	edition,
	chapters,
	imgUrl,
}) {
	return (
		<Card sx={{ margin: '10px 40px' }}>
			<CardContent>
				<CardMedia
					style={{ height: '300px', paddingTop: '56.25%' }}
					image={imgUrl}
				/>
			</CardContent>
		</Card>
	);
}
