import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const channel = url.searchParams.get('channel');

	if (!channel) {
		return json('Please provide a channel', { status: 400 });
	}

	const res = await fetch(
		'https://static-cdn.jtvnw.net/previews-ttv/live_user_' + channel + '-1x1.jpg',
		{
			method: 'HEAD',
			redirect: 'manual'
		}
	);

	return json({ live: res.ok }, { status: 200 });
};
