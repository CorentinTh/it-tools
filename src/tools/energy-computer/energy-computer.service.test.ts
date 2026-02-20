import { describe, expect, it } from 'vitest';

import { computeCost } from './energy-computer.service'; // Adjust the import path as needed

describe('computeCost', () => {
  it('should calculate the correct cost for valid inputs', () => {
    const wattage = 1000; // 1000 watts = 1 kW
    const duration = 5; // 5 hours
    const kWhCost = 0.12; // $0.12 per kWh
    const result = computeCost(wattage, duration, kWhCost);
    expect(result).toBeCloseTo(0.60); // 1 kW * 5h * 0.12 = 0.60
  });

  it('should return 0 when the duration is 0', () => {
    const wattage = 1000;
    const duration = 0;
    const kWhCost = 0.12;
    const result = computeCost(wattage, duration, kWhCost);
    expect(result).toBe(0);
  });

  it('should return 0 when the wattage is 0', () => {
    const wattage = 0;
    const duration = 5;
    const kWhCost = 0.12;
    const result = computeCost(wattage, duration, kWhCost);
    expect(result).toBe(0);
  });

  it('should return 0 when the cost per kWh is 0', () => {
    const wattage = 1000;
    const duration = 5;
    const kWhCost = 0;
    const result = computeCost(wattage, duration, kWhCost);
    expect(result).toBe(0);
  });

  it('should handle fractional wattage and duration correctly', () => {
    const wattage = 750; // 0.75 kW
    const duration = 2.5; // 2.5 hours
    const kWhCost = 0.10; // $0.10 per kWh
    const result = computeCost(wattage, duration, kWhCost);
    expect(result).toBeCloseTo(0.1875); // 0.75 kW * 2.5h * 0.10 = 0.1875
  });

  it('should handle large numbers correctly', () => {
    const wattage = 1000000; // 1 MW
    const duration = 24; // 24 hours
    const kWhCost = 0.15; // $0.15 per kWh
    const result = computeCost(wattage, duration, kWhCost);
    expect(result).toBe(3600); // 1000 kW * 24h * 0.15 = 3600
  });
});
