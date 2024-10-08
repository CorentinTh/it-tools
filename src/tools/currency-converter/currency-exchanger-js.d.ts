declare module 'currency-exchanger-js'{
    export function convertOnDate(value: number,fromCurrency: string,toCurrency: string,inputDate: Date): number;
    export function convert(value: number,fromCurrency: string,toCurrency: string): number;
}
