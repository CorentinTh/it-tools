export { raidCalculations };

const raidCalculations = {
  raid_0: {
    about: 'RAID 0 splits data evenly across 2 or more disks without redunancy or fault tolerance creating one large storage space. More info: <a href="https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_0" target="_blank">Wikipedia</a>',
    requirements: 'RAID 0 requires at least 1 disk',
    validate(num, size, stripeSize) {
      return num > 1;
    },
    capacity(num, size, stripeSize, unit) {
      // total disks * size
      return (num * size) * unit;
    },
    efficiency(num, stripeSize) {
      // uses 100% of space
      return 100;
    },
    fault(num, size, unit) {
      return 'None';
    },
  },
  raid_1: {
    about: 'RAID 1 consists of an exact copy of the data (mirror) across two or more disks. The array will operate as long as at least one drive is operational.  More info: <a href="https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_1" target="_blank">Wikipedia</a>',
    requirements: 'RAID 1 requires at least 1 disk',
    validate(num, size, stripeSize) {
      return num > 1;
    },
    capacity(num, size, stripeSize, unit) {
      // total size is size of a single drive
      return size * unit;
    },
    efficiency(num, stripeSize) {
      // 1/N
      return (1 / num) * 100;
    },
    fault(num, size, unit) {
      // FT = total - 1
      return `${num - 1} drive failures`;
    },
  },
  raid_5: {
    about: 'RAID 5 uses block level striping with parity. This allows for fault tolerance with a storage reduction equal to one drive for the parity information. More info: <a href="https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_5" target="_blank">Wikipedia</a>',
    requirements: 'RAID 5 requires at least 3 disks',
    validate(num, size, stripeSize) {
      return num >= 3;
    },
    capacity(num, size, stripeSize, unit) {
      // (N-1) * S (one drive for parity)
      return ((num - 1) * size) * unit;
    },
    efficiency(num, stripeSize) {
      // 1 - (1/N)
      return (1 - (1 / num)) * 100;
    },
    fault(num, size, unit) {
      // always 1 failure
      return '1 drive failure';
    },
  },
  raid_6: {
    about: 'RAID 6 is similiar to RAID 5 but with an additional parity block. This allows for an additional disk failure at the cost of storage reduction equal to two drives. More info: <a href="https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_6" target="_blank">Wikipedia</a>',
    requirements: 'RAID 6 requires at least 4 disks',
    validate(num, size, stripeSize) {
      return num >= 4;
    },
    capacity(num, size, stripeSize, unit) {
      // (N-2) * S (2 parity)
      return ((num - 2) * size) * unit;
    },
    efficiency(num, stripeSize) {
      // 1 - (2/N)
      return (1 - (2 / num)) * 100;
    },
    fault(num, size, unit) {
      // always 2 drive failures
      return '2 drive failures';
    },
  },
  raid_10: {
    about: 'RAID 10 is a stripe of mirrors (RAID 1 + RAID 0). Each set of drives is mirrored and striped together so that each drive in the set is fault tolerant within the group. More info: <a href="https://en.wikipedia.org/wiki/Nested_RAID_levels#RAID_10_(RAID_1+0)" target="_blank">Wikipedia</a>',
    requirements: 'RAID 10 requires an even number of at least 4 disks',
    validate(num, size, stripeSize) {
      return num >= 4 && num % 2 === 0;
    },
    capacity(num, size, stripeSize, unit) {
      // Total disks (stripe)/2 (mirror)
      return ((num * size) / 2) * unit;
    },
    efficiency(num, stripeSize) {
      // 1/2 (1/strips per stripe, 2 in this case)
      return 50;
    },
    fault(num, size, unit) {
      // one per mirror
      return '1 drive failure per mirrored set';
    },
  },
  raid_50: {
    about: 'RAID 50 stripes multiple RAID 5 arrays together (RAID 5 + RAID 0). Each RAID 5 set can sustain a single drive failure. More info: <a href="https://en.wikipedia.org/wiki/Nested_RAID_levels#RAID_50_(RAID_5+0)" target="_blank">Wikipedia</a>',
    requirements: 'RAID 50 requires at least 6 disks total with 3 minimum per stripe. Stripes must contain an equal number of disks.',
    validate(num, size, stripeSize) {
      return num >= 6 && stripeSize >= 3 && num % stripeSize === 0;
    },
    capacity(num, size, stripeSize, unit) {
      // RAID 5 per strip
      const perStripe = ((stripeSize - 1) * size) * unit;

      // sum each stripe
      return perStripe * (num / stripeSize);
    },
    efficiency(num, stripeSize) {
      // 1 - (1 / strips per stripe)
      return (1 - (1 / stripeSize)) * 100;
    },
    fault(num, size, unit) {
      // one per mirror
      return '1 drive failure per RAID 5 set';
    },
  },
};
