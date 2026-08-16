export type LicenseFamily = 'permissive' | 'weak-copyleft' | 'strong-copyleft' | 'network-copyleft' | 'public-domain';

export interface CommonLicense {
  id: string
  name: string
  family: LicenseFamily
  osi: boolean
  summary: string
  obligations: string[]
}

export const SPDX_LIST_VERSION = '3.28.0 (2026-02-20)';
export const COMMON_LICENSES: CommonLicense[] = [
  { id: '0BSD', name: 'BSD Zero Clause License', family: 'permissive', osi: true, summary: 'Very short permissive license without attribution condition.', obligations: ['Keep any separate notices that apply.'] },
  { id: 'Apache-2.0', name: 'Apache License 2.0', family: 'permissive', osi: true, summary: 'Permissive license with an express patent grant and NOTICE rules.', obligations: ['Include license text.', 'Preserve notices and mark changed files.', 'Include attributable NOTICE content when present.'] },
  { id: 'BSD-2-Clause', name: 'BSD 2-Clause “Simplified” License', family: 'permissive', osi: true, summary: 'Permissive source/binary redistribution with attribution.', obligations: ['Retain copyright, conditions, and disclaimer.'] },
  { id: 'BSD-3-Clause', name: 'BSD 3-Clause “New” or “Revised” License', family: 'permissive', osi: true, summary: 'BSD-2-Clause plus a non-endorsement condition.', obligations: ['Retain copyright, conditions, and disclaimer.', 'Do not imply endorsement.'] },
  { id: 'BSL-1.0', name: 'Boost Software License 1.0', family: 'permissive', osi: true, summary: 'Permissive software license with a compact notice rule.', obligations: ['Include the license for source distributions.'] },
  { id: 'ISC', name: 'ISC License', family: 'permissive', osi: true, summary: 'Concise permissive license similar to MIT.', obligations: ['Retain copyright and permission notice.'] },
  { id: 'MIT', name: 'MIT License', family: 'permissive', osi: true, summary: 'Broad permission with attribution and warranty disclaimer.', obligations: ['Include copyright and permission notice in substantial copies.'] },
  { id: 'MPL-2.0', name: 'Mozilla Public License 2.0', family: 'weak-copyleft', osi: true, summary: 'File-level copyleft; larger works may combine differently licensed files.', obligations: ['Publish source for covered modified files.', 'Preserve notices and make license text available.'] },
  { id: 'LGPL-2.1-only', name: 'GNU Lesser General Public License v2.1 only', family: 'weak-copyleft', osi: true, summary: 'Library-oriented copyleft with relinking/replacement conditions.', obligations: ['Preserve license/notices.', 'Provide covered source and required relinking ability when distributing.'] },
  { id: 'LGPL-3.0-only', name: 'GNU Lesser General Public License v3.0 only', family: 'weak-copyleft', osi: true, summary: 'GPL-3.0 terms plus additional permissions for library use.', obligations: ['Preserve license/notices.', 'Provide corresponding source and required installation/relinking information.'] },
  { id: 'GPL-2.0-only', name: 'GNU General Public License v2.0 only', family: 'strong-copyleft', osi: true, summary: 'Strong copyleft for distributed derivative/combined works, version 2 only.', obligations: ['License covered distributed work compatibly.', 'Provide complete corresponding source and notices.'] },
  { id: 'GPL-2.0-or-later', name: 'GNU General Public License v2.0 or later', family: 'strong-copyleft', osi: true, summary: 'GPL v2 with the recipient option to use a later GPL version.', obligations: ['License covered distributed work under the applicable GPL option.', 'Provide complete corresponding source and notices.'] },
  { id: 'GPL-3.0-only', name: 'GNU General Public License v3.0 only', family: 'strong-copyleft', osi: true, summary: 'Strong copyleft with patent and anti-tivoization provisions.', obligations: ['License covered distributed work compatibly.', 'Provide corresponding source, notices, and required installation information.'] },
  { id: 'GPL-3.0-or-later', name: 'GNU General Public License v3.0 or later', family: 'strong-copyleft', osi: true, summary: 'GPL v3 with the recipient option to use a later GPL version.', obligations: ['License covered distributed work under the applicable GPL option.', 'Provide corresponding source and notices.'] },
  { id: 'AGPL-3.0-only', name: 'GNU Affero General Public License v3.0 only', family: 'network-copyleft', osi: true, summary: 'GPL-3.0 plus a source-offer condition for modified network interaction.', obligations: ['Meet GPL source/notices conditions.', 'Offer corresponding source to remote users of a modified network service.'] },
  { id: 'CC0-1.0', name: 'Creative Commons Zero v1.0 Universal', family: 'public-domain', osi: false, summary: 'Public-domain dedication with a permissive fallback.', obligations: ['Check jurisdiction, patents, trademarks, and third-party material separately.'] },
  { id: 'Unlicense', name: 'The Unlicense', family: 'public-domain', osi: true, summary: 'Public-domain dedication with warranty disclaimer.', obligations: ['Review jurisdiction and third-party rights separately.'] },
];

export function searchCommonLicenses(query: string) {
  const normalized = query.trim().toLocaleLowerCase('en-US').slice(0, 100);
  if (!normalized) {
    return COMMON_LICENSES;
  }
  return COMMON_LICENSES.filter(license => `${license.id} ${license.name} ${license.family}`.toLocaleLowerCase('en-US').includes(normalized));
}

export function assessLicenseCombination(projectId: string, dependencyIds: string[]) {
  const project = COMMON_LICENSES.find(license => license.id === projectId);
  if (!project) {
    throw new TypeError('Choose a supported project license.');
  }
  const uniqueIds = [...new Set(dependencyIds.map(id => id.trim()).filter(Boolean))];
  if (uniqueIds.length > 100) {
    throw new RangeError('At most 100 dependency license identifiers are supported.');
  }
  if (uniqueIds.some(id => id.length > 100)) {
    throw new RangeError('Each dependency license identifier must not exceed 100 characters.');
  }
  return uniqueIds.map((id) => {
    const dependency = COMMON_LICENSES.find(license => license.id.toLowerCase() === id.toLowerCase());
    if (!dependency) {
      return { id, level: 'unknown' as const, message: 'Not in the curated common-license subset; consult the canonical SPDX entry and legal review.' };
    }
    if (project.id === 'GPL-2.0-only' && dependency.id === 'Apache-2.0') {
      return { id: dependency.id, level: 'conflict' as const, message: 'Apache-2.0 patent terms are generally treated as incompatible with GPL-2.0-only for one combined work.' };
    }
    if (dependency.family === 'network-copyleft') {
      return { id: dependency.id, level: 'review' as const, message: 'Network copyleft may require source availability even without binary distribution; architecture and modification scope matter.' };
    }
    if (dependency.family === 'strong-copyleft' && project.family !== 'strong-copyleft' && project.family !== 'network-copyleft') {
      return { id: dependency.id, level: 'review' as const, message: 'Strong copyleft may require a combined distributed work to use compatible GPL terms; mere aggregation and process boundaries can differ.' };
    }
    if (dependency.family === 'weak-copyleft') {
      return { id: dependency.id, level: 'review' as const, message: 'Weak copyleft usually focuses on covered files or libraries, but modification, linking, relinking, and distribution details matter.' };
    }
    return { id: dependency.id, level: 'notice' as const, message: 'No obvious family-level conflict detected; still preserve the exact license, copyright, attribution, NOTICE, and source obligations.' };
  });
}
