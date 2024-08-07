declare module 'parse-torrent'{
    export default function parseTorrent(content: string | ArrayBufferView): Promise<object>;
    export function toMagnetURI(parsedTorrent: object): string;
}