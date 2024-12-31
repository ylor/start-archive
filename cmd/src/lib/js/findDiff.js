export default function findDiff(a, b) {
    return b.startsWith(a) ? b.replace(a, '') : '';
}