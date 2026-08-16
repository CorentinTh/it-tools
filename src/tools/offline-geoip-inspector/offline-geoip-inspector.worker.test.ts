import { describe, expect, it } from 'vitest';
import { handleGeoIpWorkerRequest } from './offline-geoip-inspector.worker';

describe('offline GeoIP worker', () => {
  it('returns a bounded result envelope', async () => {
    const response = await handleGeoIpWorkerRequest(
      { jobId: 7, task: { address: '1.1.1.1' } },
      async () => ({ address: '1.1.1.1', family: 4, countryCode: 'AU', rangeStart: '1.1.1.0', rangeEnd: '1.1.1.255' }),
    );
    expect(response).toMatchObject({ jobId: 7, type: 'result' });
  });

  it('rejects malformed requests before loading data', async () => {
    const response = await handleGeoIpWorkerRequest({ jobId: 2, task: { address: '' } });
    expect(response).toMatchObject({ jobId: 2, type: 'error', code: 'validation' });
  });
});
