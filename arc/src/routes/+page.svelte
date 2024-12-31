<script>
	import { isUrl, normalizeUrl } from './utils.svelte';
	import { db } from '$lib/runes.svelte.js';
	import { focusable_children, trap } from '$lib/actions/trapFocus.js';
	import { browser } from '$app/environment';
	import fuzzysort from 'fuzzysort';

	console.log(db.entries);

	let input;

	let search = $state('');
	// $effect(() => console.log(search));
	// $effect(() => console.log(fuzzySearchDb(search)[0]));

	let siteSearch = $state('');
	// $effect(() => console.log(siteSearch));

	let suggestions = $state([]);
	// $effect(() => console.log(suggestions));

	function fuzzySearchDb(str) {
		return fuzzysort.go(str, db.entries, { key: 'name', limit: 1 });
	}

	async function fetchSuggestions(str) {
		return fetch('/api/suggest?q=' + str)
			.then((res) => res.json())
			.then((d) => d ?? []);
	}

	function findDbEntry(str) {
		return db.entries.find((x) => x.name.toLowerCase() === str.toLowerCase());
	}

	function findDiff(a, b) {
		return b.startsWith(a) ? b.replace(a, '') : '';
	}

	function parseSearch(str) {
		if (findDbEntry(str)) {
			return findDbEntry(str.toLowerCase()).url;
		}

		if (siteSearch) {
			if (findDbEntry(siteSearch).search_url) {
				return findDbEntry(siteSearch).search_url.replace('{}', str);
			}
		}

		if (isUrl(str)) {
			return normalizeUrl(str);
		}

		return findDbEntry('Google').search_url.replace('{}', str);
	}

	function prettifyUrl(str) {
		return str.replace(/(^\w+:|^)\/\/(www.)?/, '');
	}

	function handleKeydown(e) {
		const { key } = e;
		const group = focusable_children(form);
		const selectors = 'a, input';

		switch (key) {
			case 'Escape':
				if (siteSearch) {
					siteSearch = undefined;
					return;
				}

				if (document.activeElement !== input) {
					input.select();
					return;
				}

				if (document.getSelection().focusNode[0].value === search) {
					search = '';
					suggestions = [];
					return;
				}
				break;
			case 'Tab':
				if (
					!siteSearch &&
					// findDbEntry(document.activeElement.innerText) &&
					findDbEntry(document.activeElement.innerText).search_url
				) {
					e.preventDefault();
					// console.log(findDbEntry(document.activeElement.innerText).search_url);
					siteSearch = findDbEntry(document.activeElement.innerText).name;
					search = '';
					suggestions = [];
				}
				break;
			case 'ArrowDown':
				group.next(selectors);
				console.log;
				break;
			case 'ArrowUp':
				group.prev(selectors);
				break;
			case 'Tab':
				break;
			default:
				if (document.activeElement !== input) input.focus();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<form
	autocapitalize="none"
	autocomplete="off"
	autocorrect="off"
	spellcheck="false"
	on:submit|preventDefault={() => (location.href = parseSearch(search))}
>
	{#if browser}
		<input
			autofocus
			bind:this={input}
			bind:value={search}
			class="input input-bordered input-primary w-full max-w-xs"
			oninput={() => {
				fetchSuggestions(search).then((data) => (suggestions = data));
			}}
		/>
	{/if}

	<!-- {#if fuzzySearchDb(search)[0]}
		{fuzzySearchDb(search)[0].target}
	{/if} -->

	{#if suggestions.length > 0}
		<ul>
			{#each suggestions as suggestion}
				<li>
					<a href={normalizeUrl(parseSearch(suggestion))} on:focus={() => (search = suggestion)}
						>{@html fuzzysort.highlight(fuzzysort.single(search, suggestion)) ?? suggestion}</a
					>
					{#if fuzzySearchDb(suggestion).length > 0}
						<!-- {#if suggestion === fuzzySearchDb(suggestion)[0].obj.name.toLowerCase()}
							<span>{prettifyUrl(fuzzySearchDb(suggestion)[0].obj.url)}</span>
						{/if} -->
						{#if !siteSearch}
							{#if suggestion === fuzzySearchDb(suggestion)[0].obj.name.toLowerCase() && fuzzySearchDb(suggestion)[0].obj.search_url}
								<span>🔍</span>
								<!-- <button
								on:click={() => {
									search = '';
									siteSearch = fuzzySearchDb(suggestion)[0].target;
									input.focus();
								}}>Search</button
							> -->
							{/if}
						{/if}
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if siteSearch}
		<span style="text-align:center">Searching <b>{siteSearch}</b></span>
		<!-- <button onclick={() => (siteSearch = undefined)}>Reset</button> -->
	{/if}
</form>
