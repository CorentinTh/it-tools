import { describe, expect, it } from 'vitest';
import { amountTransferable, transferSpeedRate, transferTimeSeconds } from './data-transfer-rate-converter.service';

describe('data-transfer-converter', () => {
  describe('transferTimeSeconds', () => {
    it('compute transfer time in seconds', () => {
      expect(transferTimeSeconds({
        dataSize: 100,
        dataSizeUnit: 'MB',
        bitRate: 10,
        bitRateUnit: 'Mb',
      })).toBe(80);
    });
  });
  describe('transferSpeedRate', () => {
    it('compute transferSpeedRate', () => {
      expect(transferSpeedRate({
        dataSize: 100,
        dataSizeUnit: 'MB',
        hours: 0,
        minutes: 1,
        seconds: 20,
        bitRateUnit: 'Mb',
      })).toBe(10);
      expect(transferSpeedRate({
        dataSize: 100,
        dataSizeUnit: 'MB',
        hours: 0,
        minutes: 1,
        seconds: 20,
        bitRateUnit: 'MB',
      })).toBe(1.25);
    });
  });
  describe('amountTransferable', () => {
    it('compute amount transfered', () => {
      expect(amountTransferable({
        bitRate: 10,
        bitRateUnit: 'Mb',
        hours: 1,
        minutes: 0,
        seconds: 0,
        dataSizeUnit: 'MB',
      })).toBe(4500);
    });
  });
});
