import { readable, writable } from "svelte/store";

const data = import.meta.glob("$lib/db/*.json", { eager: true });

let combined = [];
Object.values(data).forEach((obj) => {
  combined = combined.concat(obj.default).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
});

export const db = readable(combined);
export let search = writable("");
export let suggestions = writable([]);
