declare module "chatgpt-prompt-splitter" {
    export default function promptSplitter(options: {
        prompt: string
        splitLength: number
        newLine: boolean
    }): Array<string>;
}