import { effectScope, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getQrCodeText, useWifiQRCode } from './useQRCode';

afterEach(() => {
  vi.useRealTimers();
});

describe('WiFi QR payload and ordered generation', () => {
  it('escapes reserved fields and enforces the conditional WPA/EAP requirements', () => {
    expect(getQrCodeText({
      ssid: 'office:semicolon;',
      password: 'p,a:ss"word',
      encryption: 'WPA',
      eapMethod: undefined,
      isHiddenSSID: true,
      eapAnonymous: false,
      eapIdentity: '',
      eapPhase2Method: undefined,
    })).toBe('WIFI:S:office\\:semicolon\\;;T:WPA;P:p\\,a\\:ss\\"word;H:true;');

    expect(getQrCodeText({
      ssid: 'enterprise',
      password: 'secret',
      encryption: 'WPA2-EAP',
      eapMethod: 'PEAP',
      isHiddenSSID: false,
      eapAnonymous: false,
      eapIdentity: '',
      eapPhase2Method: undefined,
    })).toBeNull();
  });

  it('encodes WPA3 personal intent with the de-facto scanner-compatible WPA token', () => {
    const common = {
      ssid: 'sae-network',
      password: 'correct horse',
      eapMethod: undefined,
      isHiddenSSID: false,
      eapAnonymous: false,
      eapIdentity: '',
      eapPhase2Method: undefined,
    } as const;
    expect(getQrCodeText({ ...common, encryption: 'WPA3' })).toBe('WIFI:S:sae-network;T:WPA;P:correct horse;;');
    expect(getQrCodeText({ ...common, encryption: 'WPA3-TRANSITION' })).toBe('WIFI:S:sae-network;T:WPA;P:correct horse;;');
  });

  it('debounces field changes and clears an old QR when the current form becomes incomplete', async () => {
    vi.useFakeTimers();
    const ssid = ref('office');
    const password = ref('secret');
    const generate = vi.fn(async (text: string) => `data:${text}`);
    const scope = effectScope();
    const result = scope.run(() => useWifiQRCode({
      ssid,
      password,
      eapMethod: ref(),
      isHiddenSSID: ref(false),
      eapAnonymous: ref(false),
      eapIdentity: ref(),
      eapPhase2Method: ref(),
      color: { background: '#fff', foreground: '#000' },
    }, { debounceMs: 25, generate }));
    if (!result) {
      throw new Error('WiFi QR composable did not initialize.');
    }

    await vi.advanceTimersByTimeAsync(0);
    expect(result.qrcode.value).toContain('WIFI:S:office');
    expect(result.payload.value).toContain('WIFI:S:office');

    ssid.value = 'new';
    await nextTick();
    password.value = 'new-secret';
    await nextTick();
    await vi.advanceTimersByTimeAsync(25);
    expect(generate).toHaveBeenCalledTimes(2);
    expect(generate).toHaveBeenLastCalledWith(
      expect.stringContaining('WIFI:S:new;T:WPA;P:new-secret;'),
      expect.any(Object),
    );

    password.value = '';
    await nextTick();
    expect(result.qrcode.value).toBe('');
    expect(result.payload.value).toBe('');
    expect(result.status.value).toBe('idle');
    scope.stop();
  });
});
