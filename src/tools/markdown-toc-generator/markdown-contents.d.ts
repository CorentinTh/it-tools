declare module 'markdown-contents'{
    declare class MarkdownContents {
        markdown(): string;
      }
    export default function Create(markdown: string):MarkdownContents;
}