export function prettyDate(dateStr) {
    return (new Date(dateStr).toLocaleString('pt-br').replace(/\//g, '-').replace(',', ''));
}