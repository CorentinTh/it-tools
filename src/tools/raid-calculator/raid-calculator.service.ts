export { raidCalculations };

interface RaidType {
  about: string
  requirements: string
  validate(num: number, size: number, stripeSize: number): boolean
  capacity(num: number, size: number, stripeSize: number, unit: number): number
  efficiency(num: number, stripeSize: number): number
  fault(num: number, size: number, unit: number): string
}

const raidCalculations: { [key: string]: RaidType } = {
  raid_0: {
    about: 'RAID 0 splits data evenly across 2 or more disks without redunancy or fault tolerance creating one large storage space.',
    requirements: 'RAID 0 requires at least 1 disk',
    validate(num: number, size: number, stripeSize: number) {
      return num > 1;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // total disks * size
      return (num * size) * unit;
    },
    efficiency(num: number, stripeSize: number) {
      // uses 100% of space
      return 100;
    },
    fault(num: number, size: number, unit: number) {
      return 'None';
    },
  },
  raid_1: {
    about: 'RAID 1 consists of an exact copy of the data (mirror) across two or more disks. The array will operate as long as at least one drive is operational.',
    requirements: 'RAID 1 requires at least 1 disk',
    validate(num: number, size: number, stripeSize: number) {
      return num > 1;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // total size is size of a single drive
      return size * unit;
    },
    efficiency(num: number, stripeSize: number) {
      // 1/N
      return (1 / num) * 100;
    },
    fault(num: number, size: number, unit: number) {
      // FT = total - 1
      return `${num - 1} drive failures`;
    },
  },
  raid_5: {
    about: 'RAID 5 uses block level striping with parity. This allows for fault tolerance with a storage reduction equal to one drive for the parity information.',
    requirements: 'RAID 5 requires at least 3 disks',
    validate(num: number, size: number, stripeSize: number) {
      return num >= 3;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // (N-1) * S (one drive for parity)
      return ((num - 1) * size) * unit;
    },
    efficiency(num: number, stripeSize: number) {
      // 1 - (1/N)
      return (1 - (1 / num)) * 100;
    },
    fault(num: number, size: number, unit: number) {
      // always 1 failure
      return '1 drive failure';
    },
  },
  raid_6: {
    about: 'RAID 6 is similiar to RAID 5 but with an additional parity block. This allows for an additional disk failure at the cost of storage reduction equal to two drives.',
    requirements: 'RAID 6 requires at least 4 disks',
    validate(num: number, size: number, stripeSize: number) {
      return num >= 4;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // (N-2) * S (2 parity)
      return ((num - 2) * size) * unit;
    },
    efficiency(num: number, stripeSize: number) {
      // 1 - (2/N)
      return (1 - (2 / num)) * 100;
    },
    fault(num: number, size: number, unit: number) {
      // always 2 drive failures
      return '2 drive failures';
    },
  },
  raid_10: {
    about: 'RAID 10 is a stripe of mirrors (RAID 1 + RAID 0). Each set of drives is mirrored and striped together so that each drive in the set is fault tolerant within the group.',
    requirements: 'RAID 10 requires an even number of at least 4 disks',
    validate(num: number, size: number, stripeSize: number) {
      return num >= 4 && num % 2 === 0;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // Total disks (stripe)/2 (mirror)
      return ((num * size) / 2) * unit;
    },
    efficiency(num: number, stripeSize: number) {
      // 1/2 (1/strips per stripe, 2 in this case)
      return 50;
    },
    fault(num: number, size: number, unit: number) {
      // one per mirror
      return '1 drive failure per mirrored set';
    },
  },
  raid_50: {
    about: 'RAID 50 stripes multiple RAID 5 arrays together (RAID 5 + RAID 0). Each RAID 5 set can sustain a single drive failure.',
    requirements: 'RAID 50 requires at least 6 disks with 3 minimum per stripe. Stripes must contain an equal number of disks.',
    validate(num: number, size: number, stripeSize: number) {
      return num >= 6 && stripeSize >= 3 && num % stripeSize === 0;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // RAID 5 per stripe
      const perStripe = ((stripeSize - 1) * size) * unit;

      // sum each stripe
      return perStripe * (num / stripeSize);
    },
    efficiency(num: number, stripeSize: number) {
      // 1 - (1 / strips per stripe)
      return (1 - (1 / stripeSize)) * 100;
    },
    fault(num: number, size: number, unit: number) {
      // one per set
      return '1 drive failure per RAID 5 set';
    },
  },
  raid_60: {
    about: 'RAID 60 stripes multiple RAID 6 arrays together (RAID 6 + RAID 0). Each RAID 6 set can sustain a two drive failures.',
    requirements: 'RAID 60 requires at least 8 disks with 4 minimum per stripe. Stripes must contain an equal number of disks.',
    validate(num: number, size: number, stripeSize: number) {
      return num >= 8 && stripeSize >= 4 && num % stripeSize === 0;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // RAID 6 per stripe
      const perStripe = ((stripeSize - 2) * size) * unit;

      // sum each stripe
      return perStripe * (num / stripeSize);
    },
    efficiency(num: number, stripeSize: number) {
      // 1 - (2 / strips per stripe)
      return (1 - (2 / stripeSize)) * 100;
    },
    fault(num: number, size: number, unit: number) {
      // 2 per set
      return '2 drive failures per RAID 6 set';
    },
  },
};
