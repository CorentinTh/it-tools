export { raidCalculations };

const raidCalculations = {
  raid_0: {
    about: 'RAID 0 splits data evenly across 2 or more disks with redunancy or fault tolerance. More info: <a href="https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_0">Wikipedia</a>',
    requirements: 'RAID 0 requires at least 1 disk',
    validate: function(num, size){
      return num > 1
    },
    capacity: function(num, size, unit){
      // total disks * size
      return (num * size) * unit;
    },
    speed: function(num, size, unit){
      return `${num}x read and ${num}x write speed gain`;
    },
    fault: function(num, size, unit){
      return "None";
    }
  },
  raid_1: {
    about: 'RAID 1 consists of an exact copy of the data across two or moe disks. The array will operate as long as at least one drive is operational.  More info: <a href="https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_1">Wikipedia</a>',
    requirements: 'RAID 1 requires at least 1 disk',
    validate: function(num, size){
      return num > 1
    },
    capacity: function(num, size, unit){
      // total size is size of a single drive
      return size * unit;
    },
    speed: function(num, size, unit){
      // potential for all drives read at once
      return `Potential ${num}x read and no write speed gain`;
    },
    fault: function(num, size, unit){
      // FT = total - 1
      return `${num -1} drive failures`;
    }
  },
  raid_5: {
    about: 'This is RAID 5',
    requirements: 'RAID 5 requires at least 3 disks',
    validate: function(num, size){
      return num >= 3
    },
    capacity: function(num, size, unit){
      // (N-1) * S (one drive for parity)
      return ((num - 1) * size) * unit;
    },
    speed: function(num, size, unit){
      return `${num - 1}x read speed gain and write speed penalty (due to parity calculations)`;
    },
    fault: function(num, size, unit){
      // always 1 failure
      return "1 drive failure";
    }
  },
  raid_6: {
    about: 'This is RAID 6',
    requirements: 'RAID 6 requires at least 4 disks',
    validate: function(num, size){
      return num >= 4
    },
    capacity: function(num, size, unit){
      // (N-2) * S (2 parity)
      return ((num - 2) * size) * unit;
    },
    speed: function(num, size, unit){
      return `${num - 2}x read speed gain and write speed penalty (due to parity calculations)`;
    },
    fault: function(num, size, unit){
      // always 2 drive failures
      return "2 drive failures";
    }
  },
  raid_10: {
    about: 'RAID 10 is generally recognized as a stripe of mirrors (RAID 1 + RAID 2). Each set of drives is mirrored and striped together so that each drive in the set is fault tolerant within the group. More info: <a href="https://en.wikipedia.org/wiki/Nested_RAID_levels#RAID_10_(RAID_1+0)">Wikipedia</a>',
    requirements: 'RAID 10 requires an even number of at least 4 disks',
    validate: function(num, size){
      return num >= 4 && num % 2 == 0
    },
    capacity: function(num, size, unit){
      // Total disks (stripe)/2 (mirror)
      return ((num * size) / 2) * unit;
    },
    speed: function(num, size, unit){
      return `${num - 2}x read speed gain and write speed penalty (due to parity calculations)`;
    },
    fault: function(num, size, unit){
      // always 2 drive failures
      return "At least 1 drive failure per mirrored set";
    }
  }
}
