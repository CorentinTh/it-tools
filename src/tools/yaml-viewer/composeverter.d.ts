declare module 'composeverter' {
    interface Configuration {
      expandVolumes?: boolean;
      expandPorts?: boolean;
      indent?: number;
    }
    interface DockerComposeValidatioError {
      line?: number;
      message: string;
      helpLink?: string;
    }
    export function validateDockerComposeToCommonSpec(content: string): DockerComposeValidatioError[];
    export function migrateFromV2xToV3x(content: string, configuration?: Configuration = null): string;
    export function migrateFromV3xToV2x(content: string, configuration?: Configuration = null): string;
    export function migrateFromV1ToV2x(content: string, configuration?: Configuration = null): string;
    export function migrateToCommonSpec(content: string, configuration?: Configuration = null): string;
    export function migrateFromV2xToV3x(content: string, configuration?: Configuration = null): string;
    export function getDockerComposeSchemaWithoutFormats(): object;
    export function yamlParse(content: string): object;
    export function yamlCheck(content: string): object;
  }