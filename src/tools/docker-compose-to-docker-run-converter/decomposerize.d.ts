declare module 'decomposerize' {
  type Configuration = {
    command?: string,
    rm?: boolean,
    detach?: boolean,
    multiline?: boolean,
    'long-args'?: boolean,
    'arg-value-separator'?: ArgValueSeparator,
  };
  const decomposerize: (dockerComposeContent: string, configuration?: Configuration) => string;
  export default decomposerize;
}
