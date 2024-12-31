<script>
	import { focusable_children, trap } from '$lib/actions/focus.js';
	import { isUrl, normalizeUrl } from '$lib/js/isUrl.js';

	import { scale, slide, fade } from 'svelte/transition';
	import { Globe, Search } from 'lucide-svelte';
	import fuzzysort from 'fuzzysort';

	let { data } = $props();
	let { db } = data;
	// console.log(db);

	let dialog, form, input;

	let search = $state('');
	let siteSearch = $state('');
	let siteSearchColor = $state('');
	let suggestions = $state([]);

	async function fetchSuggestions(str) {
		return fetch('/api/suggest?q=' + str)
			.then((res) => res.json())
			.then((d) => d ?? []);
	}

	function findEntryByName(str) {
		return db.find((x) => x.name.toLowerCase() === str.toLowerCase());
	}
	// console.log(findEntryByName('youtube'));

	function findEntryByAka(str) {
		return db.find((x) => x.aka.toLowerCase() === str.toLowerCase());
	}
	//console.log(findEntryByAka('gb'));

	function fuzzySearchDb(str) {
		return fuzzysort.go(str, db, { key: 'aka', limit: 1, threshold: -50000 })[0];
	}
	// console.log(fuzzySearchDb('y'));

	function parseSearch(str) {
		str = str.toLowerCase();
		let encodedStr = encodeURIComponent(str);

		if (findEntryByName(str)) {
			return findEntryByName(str).url;
		}

		if (findEntryByAka(str)) {
			return findEntryByAka(str).url;
		}

		if (str.includes('/') && findEntryByAka(str.split('/')[0])) {
			return findEntryByAka(str.split('/')[0]).url + '/' + str.split('/').slice(1).join('/');
		}

		if (siteSearch) {
			if (findEntryByName(siteSearch).search_url) {
				return findEntryByName(siteSearch).search_url.replace('{}', encodedStr);
			}
		}

		if (str.startsWith('r/') && !str.includes(' ')) {
			return 'https://www.reddit.com/' + str;
		}

		if (isUrl(str)) {
			return normalizeUrl(str);
		}

		return findEntryByName('Google').search_url.replace('{}', encodedStr);
	}

	function prettifyUrl(str) {
		let domain = new URL(str);
		return domain.hostname.replace('www.', '');
	}

	function handleKeydown(e) {
		// const group = focusable_children(e.currentTarget);
		const group = focusable_children(form);
		// const selector = 'a, input';

		switch (e.key) {
			case 'Escape':
				if (document.activeElement !== input) {
					return input.select();
				}

				search = '';
				siteSearch = '';
				siteSearchColor = '';
				suggestions = [];
				break;
			case 'Backspace':
				input.focus();

				if (input.selectionStart === 0) {
					siteSearch = '';
					siteSearchColor = '';
					suggestions = [];
					return;
				}
				break;
			case 'Tab':
				e.preventDefault();
				if (!siteSearch && fuzzySearchDb(search) && fuzzySearchDb(search).obj.search_url) {
					siteSearch = fuzzySearchDb(search).obj.name;
					siteSearchColor = fuzzySearchDb(search).obj.color;
					search = '';
					suggestions = [];
				}
				break;
			case 'ArrowUp':
				group.prev();
				break;
			case 'ArrowDown':
				group.next();
				break;
			default:
				if (e.altKey || e.shiftKey) return;
				if (document.activeElement !== input) input.focus();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	bind:this={dialog}
	id="dialog"
	class="fixed inset-0 overflow-y-auto p-4 pt-[10svh] md:pt-[25svh]"
>
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<div id="dialog-backdrop" class="fixed inset-0 -z-10" />

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<form
		id="combobox"
		class="mx-auto max-w-2xl divide-y divide-white/20 overflow-hidden rounded-lg border-2 outline-none md:border-white/25"
		autocapitalize="none"
		autocomplete="off"
		autocorrect="off"
		spellcheck="false"
		bind:this={form}
		onsubmit={(e) => (e.preventDefault(), (window.location = parseSearch(input.value)))}
	>
		<div id="combobox-input" class="flex items-center">
			<Search color="#fff" size="16" class="ml-4 mr-1 flex-none" />

			{#if siteSearch}
				<span
					class="mx-0.5 whitespace-pre rounded-full bg-neutral-500 px-3 py-1 text-xs font-medium"
					style:background={siteSearchColor ?? undefined}
					in:scale={{ duration: 100 }}
					out:slide={{ axis: 'x', duration: 300 }}
					>{siteSearch}
				</span>
			{/if}

			<!-- svelte-ignore a11y_autofocus -->
			<input
				autofocus
				class="selectionbg-neutral-500 ml-1 h-14 w-full bg-transparent text-xl font-medium outline-none placeholder:text-lg placeholder:text-neutral-500"
				placeholder="Search..."
				bind:this={input}
				bind:value={search}
				oninput={() => {
					fetchSuggestions(search).then((data) => (suggestions = data));
				}}
			/>

			{#if !siteSearch && fuzzySearchDb(search) && fuzzySearchDb(search).obj.search_url}
				<button
					class="mr-3 whitespace-pre text-xs font-semibold"
					type="button"
					transitionfade={{ duration: 100 }}
					onclick={() => {
						if (!siteSearch && fuzzySearchDb(search) && fuzzySearchDb(search).obj.search_url) {
							siteSearch = fuzzySearchDb(search).obj.name;
							siteSearchColor = fuzzySearchDb(search).obj.color;
							search = '';
							suggestions = [];
							input.focus();
						}
					}}
				>
					<span class="p-1 text-neutral-500">Search {fuzzySearchDb(search).obj.name}</span>
					<span class="rounded bg-neutral-800 p-1 text-neutral-400">Tab</span>
				</button>
			{/if}
		</div>
		{#if search && suggestions.length > 0}
			<ul
				id="combobox-options"
				class="max-h-96 overflow-y-auto py-2"
				in:slide={{ duration: 75 }}
				out:slide={{ duration: 200 }}
			>
				{#each suggestions as suggestion}
					<li id={'comobobx-option-' + suggestion} class="px-2">
						<a
							href={parseSearch(suggestion)}
							class="flex items-center space-x-1 rounded p-2 text-white outline-none focus:bg-neutral-800"
							onblur={(event) => (event.target.style.background = null)}
							onfocus={(event) => (
								(input.value = suggestion), (event.target.style.background = siteSearchColor)
							)}
							onmousemove={(event) => event.target.focus()}
						>
							<Globe color="#fff" size="16" class="mr-1 flex-none" />
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<span class="text-white">
								{@html fuzzysort
									.single(search, suggestion) === null ? suggestion : fuzzysort
									.single(search, suggestion).highlight('<span style="font-weight:700;">', '</span>')
									}
							</span>

							{#if !siteSearch}
								{#if !parseSearch(suggestion).includes('google')}
									<span class="pl-1 text-sm text-neutral-500">
										— {prettifyUrl(parseSearch(suggestion))}</span
									>
								{/if}
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</form>
</div>
