/* eslint-disable prefer-regex-literals */
import type { Cookie, Har, Header, Param, QueryString } from 'har-format';

export interface PossibleScrubItems {
  headers: string[]
  cookies: string[]
  queryArgs: string[]
  postParams: string[]
  mimeTypes: string[]
}

const defaultMimeTypesList = ['application/javascript', 'text/javascript'];

const defaultWordList = [
  'Authorization',
  'SAMLRequest',
  'SAMLResponse',
  'access_token',
  'appID',
  'assertion',
  'auth',
  'authenticity_token',
  'challenge',
  'client_id',
  'client_secret',
  'code',
  'code_challenge',
  'code_verifier',
  'email',
  'facetID',
  'fcParams',
  'id_token',
  'password',
  'refresh_token',
  'serverData',
  'shdf',
  'state',
  'token',
  'usg',
  'vses2',
  'x-client-data',
];

export const defaultScrubItems = [...defaultMimeTypesList, ...defaultWordList];

// The default list of regexes that aren't word dependent
// Uses double list so it matches format of word regex
const defaultRegex = [
  [
    // Redact signature on JWTs
    {
      regex: new RegExp(
        '\\b(ey[A-Za-z0-9-_=]+)\\.(ey[A-Za-z0-9-_=]+)\\.[A-Za-z0-9-_.+/=]+\\b',
        'g',
      ),
      replacement: '$1.$2.redacted',
    },
  ],
];

function buildRegex(word: string) {
  return [
    {
      // [full word]=[capture]
      regex: new RegExp(
        `([\\s";,&?]+${word}=)([\\w+-_/=#|.%&:!*()\`~'"]+?)(&|\\\\",|",|"\\s|"}}|;){1}`,
        'g',
      ),
      replacement: `$1[${word} redacted]$3`,
    },
    // Set up this way in case "value" isn't directly after "name"
    // {
    //    "name": "[word]",
    //    "something": "not wanted",
    //    "value": "[capture]"
    // }
    {
      regex: new RegExp(
    `("name": "${word}",[\\s\\w+:"-\\%!*()\`~'.,#]*?"value": ")((?:\\\\"|[^"])*?)(")`,
    'g',
      ),
      replacement: `$1[${word} redacted]$3`,
    },
    // "name" comes after "value"
    // {
    //    "value": "[capture]",
    //    "something": "not wanted",
    //    "name": "[word]"
    // }
    {
      regex: new RegExp(
    `("value": ")([\\w+-_:&+=#$~/()\\\\.\\,*!|%"\\s;]+)("[,\\s}}]+)([\\s\\w+:"-\\\\%!*\`()~'#.]*"name": "${word}")`,
    'g',
      ),
      replacement: `$1[${word} redacted]$3$4`,
    },
  ];
}

function removeContentForMimeTypes(input: string, scrubList: string[]) {
  const harJSON = JSON.parse(input);

  const entries = harJSON.log.entries;
  if (!entries) {
    throw new Error('failed to find entries in HAR file');
  }

  for (const entry of entries) {
    const response = entry.response;
    if (response && scrubList.includes(response.content.mimeType)) {
      response.content.text = `[${response.content.mimeType} redacted]`;
    }
  }

  return JSON.stringify(harJSON, null, 2);
}

export function getHarInfo(input: string): PossibleScrubItems {
  const output = {
    headers: new Set<string>(),
    queryArgs: new Set<string>(),
    cookies: new Set<string>(),
    postParams: new Set<string>(),
    mimeTypes: new Set<string>(),
  };
  const harJSON: Har = JSON.parse(input);

  const entries = harJSON.log.entries;
  if (!entries) {
    throw new Error('failed to find entries in HAR file');
  }

  for (const entry of entries) {
    const response = entry.response;
    response.headers.map((header: Header) => output.headers.add(header.name));
    response.cookies.map((cookie: Cookie) => output.cookies.add(cookie.name));
    output.mimeTypes.add(response.content.mimeType);

    const request = entry.request;
    request.headers.map((header: Header) => output.headers.add(header.name));
    request.queryString.map((arg: QueryString) =>
      output.queryArgs.add(arg.name),
    );
    request.cookies.map((cookie: Cookie) => output.cookies.add(cookie.name));
    if (request.postData) {
      request.postData.params?.map((param: Param) =>
        output.postParams.add(param.name),
      );
    }
  }

  return {
    headers: [...output.headers].sort((a, b) => a.localeCompare(b)),
    queryArgs: [...output.queryArgs].sort((a, b) => a.localeCompare(b)),
    cookies: [...output.cookies].sort((a, b) => a.localeCompare(b)),
    postParams: [...output.postParams].sort((a, b) => a.localeCompare(b)),
    mimeTypes: [...output.mimeTypes].sort((a, b) => a.localeCompare(b)),
  };
}

function getScrubMimeTypes(
  options?: SanitizeOptions,
  possibleScrubItems?: PossibleScrubItems,
) {
  if (options?.allMimeTypes && !!possibleScrubItems) {
    return possibleScrubItems.mimeTypes;
  }
  return options?.scrubMimetypes || defaultMimeTypesList;
}

function getScrubWords(
  options?: SanitizeOptions,
  possibleScrubItems?: PossibleScrubItems,
) {
  let scrubWords = options?.scrubWords || [];
  if (options?.allCookies && !!possibleScrubItems) {
    scrubWords = scrubWords.concat(possibleScrubItems.cookies);
  }
  if (options?.allHeaders && !!possibleScrubItems) {
    scrubWords = scrubWords.concat(possibleScrubItems.headers);
  }
  if (options?.allQueryArgs && !!possibleScrubItems) {
    scrubWords = scrubWords.concat(possibleScrubItems.queryArgs);
  }
  if (options?.allPostParams && !!possibleScrubItems) {
    scrubWords = scrubWords.concat(possibleScrubItems.postParams);
  }

  return scrubWords || defaultScrubItems;
}

interface SanitizeOptions {
  scrubWords?: string[]
  scrubMimetypes?: string[]
  allCookies?: boolean
  allHeaders?: boolean
  allQueryArgs?: boolean
  allMimeTypes?: boolean
  allPostParams?: boolean
}

export function sanitize(input: string, options?: SanitizeOptions) {
  let possibleScrubItems: PossibleScrubItems | undefined;
  if (
    options?.allCookies
  || options?.allHeaders
  || options?.allMimeTypes
  || options?.allQueryArgs
  || options?.allPostParams
  ) {
    // we have to parse the HAR to get the full list of things we could scrub
    possibleScrubItems = getHarInfo(input);
  }

  // Remove specific mime responses first
  input = removeContentForMimeTypes(
    input,
    getScrubMimeTypes(options, possibleScrubItems),
  );

  // trim the list of words we are looking for down to the ones actually in the HAR file
  const wordList = getScrubWords(options, possibleScrubItems).filter(val =>
    input.includes(val),
  );

  // build list of regexes needed to actually scrub the file
  const wordSpecificScrubList = wordList.map(word => buildRegex(word));
  const allScrubList = defaultRegex.concat(wordSpecificScrubList);

  for (const scrubList of allScrubList) {
    for (const scrub of scrubList) {
      input = input.replace(scrub.regex, scrub.replacement);
    }
  }

  return input;
}
