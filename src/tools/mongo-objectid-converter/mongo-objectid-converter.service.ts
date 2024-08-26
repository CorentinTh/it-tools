export function objectIdFromDate(date: Date) {
  return `${Math.floor(date.getTime() / 1000).toString(16)}0000000000000000`;
};

export function objectIdSyntaxFromDate(date: Date) {
  return `ObjectId("${objectIdFromDate(date)}")`;
};

export function generateMongoFilter(
  {
    tableName, date, operator = 'gt',
  }:
  {
    tableName: string
    date: Date
    operator?: 'gt' | 'lt'
  }) {
  return `db.${tableName}.find({_id: {$${operator}: ObjectId("${objectIdFromDate(date)}")}})`;
}

export function dateFromObjectId(objectId: string) {
  return new Date(Number.parseInt(objectId.substring(0, 8), 16) * 1000);
};
