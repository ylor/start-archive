// +server.js
import { json } from '@sveltejs/kit';

function isValidIpAddress(ipAddress) {
	const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
	return ipRegex.test(ipAddress);
}

export async function GET(event) {
	const ipAddress = isValidIpAddress(event.getClientAddress())
		? event.getClientAddress()
		: '172.70.53.1';
	console.log(ipAddress);
	return json(ipAddress);
}
