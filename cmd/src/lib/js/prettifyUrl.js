export default function prettifyUrl(str) {
    return str.replace(/(^\w+:|^)\/\/(www.)?/, '');
}