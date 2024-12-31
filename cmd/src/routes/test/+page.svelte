<script>
	import fuzzysort from 'fuzzysort';
	let str = $state('f');
	let obj = ['foo', 'baz', 'bar', 'foobar'];
</script>

<input
	bind:value={str}
	onkeydown={() => {
		console.log(fuzzysort.go(str, obj, { limit: 1 })[0]);
	}}
	class="block p-1 text-gray-900"
/>
<pre>str === {str}</pre>
