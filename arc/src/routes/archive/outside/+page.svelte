<script>
	import { clickOutside } from './clickOutside.js';
	let dialog;
	let name = 'world';

	function handleClickOutside(event) {
		// alert('Click outside!');
		dialog.close();
	}
</script>

<button onclick={() => dialog.showModal()}>adsf</button>
<dialog bind:this={dialog}>
	<div use:clickOutside on:click_outside={handleClickOutside}>Click outside me!</div>
</dialog>

<style>
	dialog {
		padding: 0;
	}
	div {
		padding: 12px;
		color: white;
		background-color: steelblue;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
