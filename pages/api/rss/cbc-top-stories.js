export default async function handler(req, res) {
	try {
		const response = await fetch('https://www.cbc.ca/webfeed/rss/rss-topstories');
		const xml = await response.text();
		res.setHeader('Content-Type', 'application/xml');
		res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
		res.status(200).send(xml);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch feed' });
	}
}
