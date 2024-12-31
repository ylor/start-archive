<script>
	const fakeButton = (node) => {
		node.setAttribute('role', 'button');
	};

	let dialog;
	const openDialog = () => dialog.showModal();
	const closeDialog = () => dialog.close();

	let value;

	const updateValue = () => (value = dialog.returnValue);

	const outClick = (node) => {
		node.addEventListener('click', (e) => {
			if (e.target === node) closeDialog();
		});

		return {
			destroy: () => node.removeEventListener('click')
		};
	};

	$: console.log(value);
</script>

<h1>Ready to open a dialog modal?</h1>

<dialog bind:this={dialog} on:close={updateValue} use:outClick>
	<!--
		This 'inner-dialog' prevents clicks within the dialog
	  To register as 'clicking outside', preventing unwanted close
	-->
	<div class="inner-dialog">
		Do you really want to eat that pizza?

		<div>
			<button on:click={closeDialog}>Cancel</button>
			<form>
				<button formmethod="dialog" value="yes">I want pizza! 🍕</button>
			</form>
		</div>
	</div>
</dialog>

<a href="svelte.dev" on:click|preventDefault={openDialog} use:fakeButton> Let's go </a>

<style>
	button:focus {
		outline: 2px solid black;
	}
	a {
		text-decoration: underline;
	}
	dialog {
		padding: 0;
		border: solid red 3px;
	}
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.9);
	}
	.inner-dialog {
		padding: 1rem;
	}
</style>
