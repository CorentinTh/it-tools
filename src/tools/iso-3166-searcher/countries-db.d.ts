declare module 'countries-db'{
    export interface CountryInfo {
        id: string
        name: string
        officialName: string
        emoji: string
        emojiUnicode: string
        iso2: string
        iso3: string
        isoNumeric: string
        geonameId: number
        continentId: string
        population: number
        elevation: number
        areaSqKm: number
        coordinates: {
          latitude: number
          longitude: number
        },
        timezones: Array<string>
        domain: string
        currencyCode: string
        currencyName: string
        postalCodeFormat: string
        postalCodeRegex: string
        phoneCode: string
        neighborCountryIds: Array<string>
        languages: Array<string>
        locales: Array<string>
    }

    export function getAllCountries(): {[id:string]: CountryInfo};
    export function getCountry(id: string, property: string): string | Array<string> | number;
    export function getCountry(id: string): CountryInfo;
}