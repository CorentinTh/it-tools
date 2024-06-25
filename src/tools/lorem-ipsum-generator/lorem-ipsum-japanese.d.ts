declare module 'lorem-ipsum-japanese' {
    export default function lorem(config: {
        count: number,
        units: 'words' | 'sentences' | 'paragraphs',
    }): string;
}