import fuzzysort from "fuzzysort";

export default function fuzzySearchDb(needle, haystack) {
    return fuzzysort.go(needle, haystack, { key: 'name', limit: 1 });
}