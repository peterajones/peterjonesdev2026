import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from "next/legacy/image";
import cbc from '../../public/images/news/cbc.jpg';
import cnbc from '../../public/images/news/cnbc.jpg';
import euronews from '../../public/images/news/euronews.jpg';
import Banner from '../../Components/Banner';

const News = () => {
	const [didMount, setDidMount] = useState(false);
	const [scroll, setScroll] = useState(0);

	useEffect(() => {
		window.scrollTo(0, 0);
		setDidMount(true);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	function handleScroll() {
		let scroll = window.scrollY;
		setScroll(scroll);
	}

	return (
		<>
			<Head>
				<title>Peter Jones | News Feeds</title>
			</Head>
			<Banner src='/images/banners/News.jpg' />
			<div className='content' style={{ minHeight: '2000px' }}>
				<div className={`fade-in ${didMount && 'visible'}`}>
					<h1 className='news page'>RSS News Feeds</h1>
					<ul className='items-container'>
						<li className='news item'>
							<Link href='/news/cbc-world-news'>
								<div className='item-content'>
									<Image src={cbc} width={100} height={100} alt='banner' />
									<div className='item-title'>CBC World News</div>
								</div>
							</Link>
						</li>
						<li className='news item'>
							<Link href='/news/cbc-top-stories'>
								<div className='item-content'>
									<Image src={cbc} width={100} height={100} alt='' />
									<div className='item-title'>CBC News Top Stories</div>
								</div>
							</Link>
						</li>
						<li className='news item'>
							<Link href='/news/cbc-toronto-news'>
								<div className='item-content'>
									<Image src={cbc} width={100} height={100} alt='' />
									<div className='item-title'>CBC Toronto News</div>
								</div>
							</Link>
						</li>
						<li className='news item'>
							<Link href='/news/cbc-technology-news'>
								<div className='item-content'>
									<Image src={cbc} width={100} height={100} alt='' />
									<div className='item-title'>CBC Technology News</div>
								</div>
							</Link>
						</li>
						<li className='news item'>
							<Link
								href='/news/cnbc-international-news'
							>
								<div className='item-content'>
									<Image src={cnbc} width={100} height={100} alt='' />
									<div className='item-title'>CNBC International News</div>
								</div>
							</Link>
						</li>
						<li className='news item'>
							<Link href='/news/euro-news'>
								<div className='item-content'>
									<Image src={euronews} width={100} height={100} alt='' />
									<div className='item-title'>CNBC Euro News</div>
								</div>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default News;
