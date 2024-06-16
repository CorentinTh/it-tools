declare module 'generate-schema' {
    function generic(jsonObject: object);
    function mongoose(jsonObject: object);
    function bigquery(jsonObject: object);
    function json(title: string, jsonObject: object);
    function mysql(tableName: string, jsonObject: object);
    function clickhouse(tableName: string, jsonObject: object, dateField: string);
}