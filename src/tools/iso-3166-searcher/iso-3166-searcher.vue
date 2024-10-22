<script setup lang="ts">
import CountriesDB from 'countries-db';
import ISO6391 from 'iso-639-1';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import useDebouncedRef from '@/composable/debouncedref';

const searchQuery = useDebouncedRef('', 500);
const countriesSearchData = Object.entries(CountriesDB.getAllCountries()).map(([_, info]) => {
  return {
    iso2: info.iso2,
    iso3: info.iso3,
    domain: info.domain,
    name: `${info.name} ${info.officialName}`,
    info,
  };
});
const { searchResult } = useFuzzySearch({
  search: searchQuery,
  data: countriesSearchData,
  options: {
    keys: ['name', { name: 'iso3', weight: 3 }, { name: 'iso2', weight: 2 }, 'domain'],
    threshold: 0.3,
    isCaseSensitive: false,
    useExtendedSearch: true,
  },
});

function langToName(code: string) {
  const name = ISO6391.getName(code);
  if (!name) {
    return code;
  }
  return `${code} (${name})`;
}
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <div flex items-center gap-3>
      <c-input-text
        v-model:value="searchQuery"
        placeholder="Search Countries by name, iso2, iso3..."
        mx-auto max-w-600px
      >
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
    </div>

    <div v-if="searchQuery.trim().length > 0">
      <div
        v-if="searchResult.length === 0"
        mt-4
        text-20px
        font-bold
      >
        No results
      </div>

      <div v-else>
        <div mt-4 text-20px font-bold>
          Search result
        </div>

        <n-table>
          <thead>
            <th>Iso2/Iso3</th>
            <th>Name and Info</th>
          </thead>
          <tbody>
            <tr v-for="(result, ix) in searchResult" :key="ix">
              <td style="vertical-align: top">
                <input-copyable :value="result.iso2" />
                <input-copyable :value="result.iso3" />
              </td>
              <td>
                <input-copyable label-width="150px" label="Name" label-position="left" :value="result.name" mb-1 />
                <input-copyable label-width="150px" label="Official Name" label-position="left" :value="result.info.officialName" mb-1 />
                <input-copyable label-width="150px" label="Domain" label-position="left" :value="result.info.domain" mb-1 />
                <input-copyable label-width="150px" label="Emoji" label-position="left" :value="`${result.info.emoji} (${result.info.emojiUnicode})`" mb-1 />
                <input-copyable label-width="150px" label="ISO Num" label-position="left" :value="result.info.isoNumeric" mb-1 />
                <input-copyable label-width="150px" label="Continent" label-position="left" :value="result.info.continentId" mb-1 />
                <input-copyable label-width="150px" label="Elevation (m)" label-position="left" :value="result.info.elevation" mb-1 />
                <input-copyable label-width="150px" label="Population" label-position="left" :value="result.info.population" mb-1 />
                <input-copyable label-width="150px" label="Area (km²)" label-position="left" :value="result.info.areaSqKm" mb-1 />
                <input-copyable label-width="150px" label="Timezones" label-position="left" :value="result.info.timezones.join('\n')" mb-1 />
                <input-copyable label-width="150px" label="Currency" label-position="left" :value="`${result.info.currencyCode} / ${result.info.currencyName}`" mb-1 />
                <input-copyable label-width="150px" label="Postal Code" label-position="left" :value="`${result.info.postalCodeFormat} / ${result.info.postalCodeRegex}`" mb-1 />
                <input-copyable label-width="150px" label="Phone Code" label-position="left" :value="result.info.phoneCode" mb-1 />
                <input-copyable label-width="150px" label="Neighbor Countries" label-position="left" :value="result.info.neighborCountryIds.map(id => CountriesDB.getCountry(id, 'name')?.toString() || id).join(', ')" mb-1 />
                <input-copyable label-width="150px" label="Languages" label-position="left" :value="result.info.languages.map(langToName).join(', ')" mb-1 />
                <input-copyable label-width="150px" label="Locales" label-position="left" :value="result.info.locales.map(langToName).join(', ')" mb-1 />
                <!-- //NOSONAR --><n-a :href="`https://www.openstreetmap.org/#map=5/${result.info.coordinates.latitude}/${result.info.coordinates.longitude}`" target="_blank">
                  &gt; See on OpenStreetMap
                </n-a>
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </div>
</template>
