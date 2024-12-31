import findEntryByName from './findEntryByName.js'
import findEntryByAka from './findEntryByAka.js'
import {isUrl, normalizeUrl} from './isUrl.js'


export default function parseSearch(str) {
    if (findEntryByName(str)) {
        return findEntryByName(str.toLowerCase()).url;
    }

    if (findEntryByaka(str)){
        return findEntryByAka(str).url
    }

    if (siteSearch) {
        if (findEntryByName(siteSearch).search_url) {
            return findEntryByName(siteSearch).search_url.replace('{}', str);
        }
    }

    if (isUrl(str)) {
        return normalizeUrl(str);
    }

    return findEntryByName('Google').search_url.replace('{}', str);
}