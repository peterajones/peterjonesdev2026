import {useState, useEffect} from 'react'
import Image from 'next/image'

const Banner = (props) => {
	const [scroll, setScroll] = useState('');

	useEffect(() => {
		window.scrollTo(0, 0);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	function handleScroll() {
		let scroll = window.scrollY;
		setScroll(scroll);
	}

	return (
		<div className='banner'>
			<Image
				src={props.src}
				alt='banner'
				width={1200}
				height={400}
				style={{
					transform:
						'translate3d(0, 0, 0)  scale(' + (100 + scroll / 5) / 100 + ')'
				}}
			/>
		</div>
	);
};

export default Banner;