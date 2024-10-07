declare module 'composerize' {
  const composerize: (commands: string, existingDockerComposeFile?: string, conversion?: string, indent?: number) => string;
  export default composerize;
}
