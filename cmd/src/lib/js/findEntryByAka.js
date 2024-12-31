export default function findEntryByAka(needle, haystack) {
    return haystack.find(x=>x.aka.includes((needle.toLowerCase()).toLowerCase()));
}