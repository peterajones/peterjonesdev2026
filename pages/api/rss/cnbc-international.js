export default async function handler(req, res) {
	try {
		const response = await fetch('https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100727362');
		const xml = await response.text();
		res.setHeader('Content-Type', 'application/xml');
		res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
		res.status(200).send(xml);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch feed' });
	}
}
