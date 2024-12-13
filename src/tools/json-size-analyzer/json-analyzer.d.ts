declare module 'json-analyzer' {
    export default function analyze({
        json,
        verbose,
        maxDepth,
        target,
      }: {
        json: any,
        verbose: boolean,
        maxDepth: number,
        target: string,
      });
}