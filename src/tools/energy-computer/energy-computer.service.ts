export function computeCost(wattage: number, durationHours: number, costPerKWh: number): number {
  const kilowatts = wattage / 1000;
  const energyConsumed = kilowatts * durationHours;
  const totalCost = energyConsumed * costPerKWh;
  return totalCost;
}
