import { OuiWorkerClient } from './mac-address-lookup.worker-client';

export function getOuiPrefix(address: string): string {
  const compactAddress = address.trim().replace(/[.:-]/g, '').toUpperCase();
  const prefix = compactAddress.slice(0, 6);
  return /^[0-9A-F]{6}$/.test(prefix) ? prefix : '';
}

export function createOuiDatabase(client: OuiWorkerClient = new OuiWorkerClient()) {
  return {
    start(): void {
      client.start();
    },

    retry(): void {
      client.retry();
    },

    cancel(): void {
      client.cancel();
    },

    dispose(): void {
      client.dispose();
    },

    async lookup(address: string): Promise<string | undefined> {
      const prefix = getOuiPrefix(address);
      if (!prefix) {
        client.cancel();
        return undefined;
      }
      return client.lookup({ operation: 'lookup', prefix });
    },
  };
}
