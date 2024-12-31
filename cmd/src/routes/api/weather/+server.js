import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';

import * as VERCEL from '$lib/vercel/headers.js';
import fauxcast from './fauxcast.json';

async function fetchWeather(lat, long) {
	if (dev) {
		return fauxcast;
	} else {
		const response = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&temperature_unit=fahrenheit&timezone=auto`
		);
		const data = await response.json();
		return data;
	}
}

export async function GET({ request }) {
	// const city = request.headers.get(VERCEL.HEADER_CITY) ?? 'Kakariko Village';
	// const country = request.headers.get(VERCEL.HEADER_COUNTRY) ?? 'JP';
	// const ip = request.headers.get(VERCEL.HEADER_IP) ?? '127.0.0.1';
	const lat = request.headers.get(VERCEL.HEADER_LATITUDE) ?? '25.7689';
	const long = request.headers.get(VERCEL.HEADER_LONGITUDE) ?? '-80.1946';
	const tz = request.headers.get(VERCEL.HEADER_TIMEZONE) ?? 'America/New_York';

	return json({
		lat,
		long,
		tz,
		weather: await fetchWeather(lat, long)
	});
}
