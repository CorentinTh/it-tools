import { type MaybeRef, get } from '@vueuse/core';
import type { QRCodeToDataURLOptions } from 'qrcode';
import { type WatchSource, isRef, ref } from 'vue';
import {
  type QrCodeGenerationDependencies,
  useLatestQRCode,
} from '../qr-code-generator/useQRCode';

export const wifiEncryptions = ['WEP', 'WPA', 'WPA3', 'WPA3-TRANSITION', 'nopass', 'WPA2-EAP'] as const;
export type WifiEncryption = typeof wifiEncryptions[number];

// @see https://en.wikipedia.org/wiki/Extensible_Authentication_Protocol
export const EAPMethods = [
  'MD5',
  'POTP',
  'GTC',
  'TLS',
  'IKEv2',
  'SIM',
  'AKA',
  'AKA\'',
  'TTLS',
  'PWD',
  'LEAP',
  'PSK',
  'FAST',
  'TEAP',
  'EKE',
  'NOOB',
  'PEAP',
] as const;
export type EAPMethod = typeof EAPMethods[number];

export const EAPPhase2Methods = [
  'None',
  'MSCHAPV2',
] as const;
export type EAPPhase2Method = typeof EAPPhase2Methods[number];

interface IWifiQRCodeOptions {
  ssid: MaybeRef<string | undefined>
  password: MaybeRef<string | undefined>
  eapMethod: MaybeRef<EAPMethod | undefined>
  isHiddenSSID: MaybeRef<boolean>
  eapAnonymous: MaybeRef<boolean>
  eapIdentity: MaybeRef<string | undefined>
  eapPhase2Method: MaybeRef<EAPPhase2Method | undefined>
  color: { foreground: MaybeRef<string>; background: MaybeRef<string> }
  options?: QRCodeToDataURLOptions
}

export interface GetQrCodeTextOptions {
  ssid: string
  password: string
  encryption: WifiEncryption
  eapMethod: EAPMethod | undefined
  isHiddenSSID: boolean
  eapAnonymous: boolean
  eapIdentity: string
  eapPhase2Method: EAPPhase2Method | undefined
}

function reactiveSources(values: unknown[]): WatchSource<unknown>[] {
  return values.filter(isRef) as WatchSource<unknown>[];
}

function escapeString(str: string): string {
  return str.replace(/([\\;,:"])/g, '\\$1');
}

export function getQrCodeText(options: GetQrCodeTextOptions): string | null {
  const { ssid, password, encryption, eapMethod, isHiddenSSID, eapAnonymous, eapIdentity, eapPhase2Method } = options;
  if (!ssid) {
    return null;
  }
  if (encryption === 'nopass') {
    return `WIFI:S:${escapeString(ssid)};;`;
  }
  if (encryption !== 'WPA2-EAP' && password) {
    const compatibleType = encryption === 'WPA3' || encryption === 'WPA3-TRANSITION' ? 'WPA' : encryption;
    return `WIFI:S:${escapeString(ssid)};T:${compatibleType};P:${escapeString(password)};${isHiddenSSID ? 'H:true' : ''};`;
  }
  if (encryption === 'WPA2-EAP' && password && eapMethod) {
    if (!eapIdentity && !eapAnonymous) {
      return null;
    }
    if (eapMethod === 'PEAP' && !eapPhase2Method) {
      return null;
    }
    const identity = eapAnonymous ? 'A:anon' : `I:${escapeString(eapIdentity)}`;
    const phase2 = eapPhase2Method && eapPhase2Method !== 'None' ? `PH2:${eapPhase2Method};` : '';
    return `WIFI:S:${escapeString(ssid)};T:WPA2-EAP;P:${escapeString(password)};E:${eapMethod};${phase2}${identity};${isHiddenSSID ? 'H:true' : ''};`;
  }
  return null;
}

export function useWifiQRCode({
  ssid,
  password,
  eapMethod,
  isHiddenSSID,
  eapAnonymous,
  eapIdentity,
  eapPhase2Method,
  color: { background, foreground },
  options,
}: IWifiQRCodeOptions, dependencies: QrCodeGenerationDependencies = {}) {
  const encryption = ref<WifiEncryption>('WPA');
  const task = useLatestQRCode(
    reactiveSources([
      ssid,
      password,
      encryption,
      eapMethod,
      isHiddenSSID,
      eapAnonymous,
      eapIdentity,
      eapPhase2Method,
      background,
      foreground,
    ]),
    () => {
      const text = getQrCodeText({
        ssid: get(ssid) ?? '',
        password: get(password) ?? '',
        encryption: get(encryption),
        eapMethod: get(eapMethod),
        isHiddenSSID: get(isHiddenSSID),
        eapAnonymous: get(eapAnonymous),
        eapIdentity: get(eapIdentity) ?? '',
        eapPhase2Method: get(eapPhase2Method),
      });
      if (!text) {
        return null;
      }

      return {
        text,
        options: {
          ...options,
          color: {
            ...options?.color,
            dark: get(foreground),
            light: get(background),
          },
          errorCorrectionLevel: options?.errorCorrectionLevel ?? 'M',
        },
      };
    },
    dependencies,
  );

  return { ...task, encryption, payload: task.encodedText };
}
