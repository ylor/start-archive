export default function findEntryByName(needle, haystack) {
    return haystack.find((x) => x.name.toLowerCase() === needle.toLowerCase());
}