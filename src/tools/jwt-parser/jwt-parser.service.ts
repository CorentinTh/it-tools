import jwt_decode, { InvalidTokenError } from 'jwt-decode';

interface JWT {
  header: Map<string, unknown>;
  payload: Map<string, unknown>;
}

export function safeJwtDecode(rawJwt: string): JWT {
  try {
    const header = jwt_decode(rawJwt, { header: true }) as Map<string, unknown>;
    const payload = jwt_decode(rawJwt) as Map<string, unknown>;
    return { header, payload };
  } catch (e) {
    if (e instanceof InvalidTokenError) {
      return { header: new Map<string, unknown>(), payload: new Map<string, unknown>() };
    } else {
      throw e;
    }
  }
}

export function getClaimLabel(claim: string): { label: string; ref: string } {
  const infos = STANDARD_CLAIMS.find((info) => info.name === claim);
  if (infos) {
    return { label: infos.long_name, ref: infos.ref };
  }
  switch (claim) {
    case 'typ':
      return { label: 'Type', ref: '' };
    case 'alg':
      return { label: 'Algorithm', ref: '' };
  }
  return { label: claim, ref: '' };
}

export function parseClaimValue(claim: string, value: unknown): { value: unknown; extension?: unknown } {
  switch (claim) {
    case 'exp':
    case 'nbf':
    case 'iat': {
      // Convert to milliseconds, JWT specs says it should be in seconds, JS
      // works with milliseconds
      value = typeof value === 'string' ? parseInt(value) : value;
      const date = new Date((value as number) * 1000);
      return { value: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, extension: value };
    }
    case 'alg':
      return { value: AlgorithmKeyDescriptionMapping[value as string], extension: value };
    default:
      if (typeof value === 'boolean') {
        // Perhaps there's a better way to do this?
        return { value: value ? 'true' : 'false' };
      }
      return { value: value };
  }
}

// From https://datatracker.ietf.org/doc/html/rfc7518#section-3.1
const AlgorithmKeyDescriptionMapping: { [k: string]: string } = {
  HS256: 'HMAC using SHA-256',
  HS384: 'HMAC using SHA-384',
  HS512: 'HMAC using SHA-512',
  RS256: 'RSASSA-PKCS1-v1_5 using SHA-256',
  RS384: 'RSASSA-PKCS1-v1_5 using SHA-384',
  RS512: 'RSASSA-PKCS1-v1_5 using SHA-512',
  ES256: 'ECDSA using P-256 and SHA-256',
  ES384: 'ECDSA using P-384 and SHA-384',
  ES512: 'ECDSA using P-521 and SHA-512',
  PS256: 'RSASSA-PSS using SHA-256 and MGF1 with SHA-256',
  PS384: 'RSASSA-PSS using SHA-384 and MGF1 with SHA-384',
  PS512: 'RSASSA-PSS using SHA-512 and MGF1 with SHA-512',
  none: 'No digital signature or MAC performed',
};

// List extracted from IANA: https://www.iana.org/assignments/jwt/jwt.xhtml
const STANDARD_CLAIMS = [
  {
    name: 'iss',
    long_name: 'Issuer',
    ref: '[RFC7519 - Section 4.1.1]',
  },
  {
    name: 'sub',
    long_name: 'Subject',
    ref: '[RFC7519 - Section 4.1.2]',
  },
  {
    name: 'aud',
    long_name: 'Audience',
    ref: '[RFC7519 - Section 4.1.3]',
  },
  {
    name: 'exp',
    long_name: 'Expiration Time',
    ref: '[RFC7519 - Section 4.1.4]',
  },
  {
    name: 'nbf',
    long_name: 'Not Before',
    ref: '[RFC7519 - Section 4.1.5]',
  },
  {
    name: 'iat',
    long_name: 'Issued At',
    ref: '[RFC7519 - Section 4.1.6]',
  },
  {
    name: 'jti',
    long_name: 'JWT ID',
    ref: '[RFC7519 - Section 4.1.7]',
  },
  {
    name: 'name',
    long_name: 'Full name',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'given_name',
    long_name: 'Given name(s) or first name(s)',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'family_name',
    long_name: 'Surname(s) or last name(s)',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'middle_name',
    long_name: 'Middle name(s)',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'nickname',
    long_name: 'Casual name',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'preferred_username',
    long_name: 'Shorthand name by which the End-User wishes to be referred to',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'profile',
    long_name: 'Profile page URL',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'picture',
    long_name: 'Profile picture URL',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'website',
    long_name: 'Web page or blog URL',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'email',
    long_name: 'Preferred e-mail address',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'email_verified',
    long_name: 'True if the e-mail address has been verified; otherwise false',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'gender',
    long_name: 'Gender',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'birthdate',
    long_name: 'Birthday',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'zoneinfo',
    long_name: 'Time zone',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'locale',
    long_name: 'Locale',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'phone_number',
    long_name: 'Preferred telephone number',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'phone_number_verified',
    long_name: 'True if the phone number has been verified; otherwise false',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'address',
    long_name: 'Preferred postal address',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'updated_at',
    long_name: 'Time the information was last updated',
    ref: '[OpenID Connect Core 1.0 - Section 5.1]',
  },
  {
    name: 'azp',
    long_name: 'Authorized party - the party to which the ID Token was issued',
    ref: '[OpenID Connect Core 1.0 - Section 2]',
  },
  {
    name: 'nonce',
    long_name: 'Value used to associate a Client session with an ID Token',
    ref: '[OpenID Connect Core 1.0 - Section 2]',
  },
  {
    name: 'auth_time',
    long_name: 'Time when the authentication occurred',
    ref: '[OpenID Connect Core 1.0 - Section 2]',
  },
  {
    name: 'at_hash',
    long_name: 'Access Token hash value',
    ref: '[OpenID Connect Core 1.0 - Section 2]',
  },
  {
    name: 'c_hash',
    long_name: 'Code hash value',
    ref: '[OpenID Connect Core 1.0 - Section 3.3.2.11]',
  },
  {
    name: 'acr',
    long_name: 'Authentication Context Class Reference',
    ref: '[OpenID Connect Core 1.0 - Section 2]',
  },
  {
    name: 'amr',
    long_name: 'Authentication Methods References',
    ref: '[OpenID Connect Core 1.0 - Section 2]',
  },
  {
    name: 'sub_jwk',
    long_name: 'Public key used to check the signature of an ID Token',
    ref: '[OpenID Connect Core 1.0 - Section 7.4]',
  },
  {
    name: 'cnf',
    long_name: 'Confirmation',
    ref: '[RFC7800 - Section 3.1]',
  },
  {
    name: 'sip_from_tag',
    long_name: 'SIP From tag header field parameter value',
    ref: '[RFC8055][RFC3261]',
  },
  {
    name: 'sip_date',
    long_name: 'SIP Date header field value',
    ref: '[RFC8055][RFC3261]',
  },
  {
    name: 'sip_callid',
    long_name: 'SIP Call-Id header field value',
    ref: '[RFC8055][RFC3261]',
  },
  {
    name: 'sip_cseq_num',
    long_name: 'SIP CSeq numeric header field parameter value',
    ref: '[RFC8055][RFC3261]',
  },
  {
    name: 'sip_via_branch',
    long_name: 'SIP Via branch header field parameter value',
    ref: '[RFC8055][RFC3261]',
  },
  {
    name: 'orig',
    long_name: 'Originating Identity String',
    ref: '[RFC8225 - Section 5.2.1]',
  },
  {
    name: 'dest',
    long_name: 'Destination Identity String',
    ref: '[RFC8225 - Section 5.2.1]',
  },
  {
    name: 'mky',
    long_name: 'Media Key Fingerprint String',
    ref: '[RFC8225 - Section 5.2.2]',
  },
  {
    name: 'events',
    long_name: 'Security Events',
    ref: '[RFC8417 - Section 2.2]',
  },
  {
    name: 'toe',
    long_name: 'Time of Event',
    ref: '[RFC8417 - Section 2.2]',
  },
  {
    name: 'txn',
    long_name: 'Transaction Identifier',
    ref: '[RFC8417 - Section 2.2]',
  },
  {
    name: 'rph',
    long_name: 'Resource Priority Header Authorization',
    ref: '[RFC8443 - Section 3]',
  },
  {
    name: 'sid',
    long_name: 'Session ID',
    ref: '[OpenID Connect Front-Channel Logout 1.0 - Section 3]',
  },
  {
    name: 'vot',
    long_name: 'Vector of Trust value',
    ref: '[RFC8485]',
  },
  {
    name: 'vtm',
    long_name: 'Vector of Trust trustmark URL',
    ref: '[RFC8485]',
  },
  {
    name: 'attest',
    long_name: 'Attestation level as defined in SHAKEN framework',
    ref: '[RFC8588]',
  },
  {
    name: 'origid',
    long_name: 'Originating Identifier as defined in SHAKEN framework',
    ref: '[RFC8588]',
  },
  {
    name: 'act',
    long_name: 'Actor',
    ref: '[RFC8693 - Section 4.1]',
  },
  {
    name: 'scope',
    long_name: 'Scope Values',
    ref: '[RFC8693 - Section 4.2]',
  },
  {
    name: 'client_id',
    long_name: 'Client Identifier',
    ref: '[RFC8693 - Section 4.3]',
  },
  {
    name: 'may_act',
    long_name: 'Authorized Actor - the party that is authorized to become the actor',
    ref: '[RFC8693 - Section 4.4]',
  },
  {
    name: 'jcard',
    long_name: 'jCard data',
    ref: '[RFC8688][RFC7095]',
  },
  {
    name: 'at_use_nbr',
    long_name: 'Number of API requests for which the access token can be used',
    ref: '[ETSI GS NFV-SEC 022 V2.7.1]',
  },
  {
    name: 'div',
    long_name: 'Diverted Target of a Call',
    ref: '[RFC8946]',
  },
  {
    name: 'opt',
    long_name: 'Original PASSporT (in Full Form)',
    ref: '[RFC8946]',
  },
  {
    name: 'vc',
    long_name: 'Verifiable Credential as specified in the W3C Recommendation',
    ref: '[W3C Recommendation Verifiable Credentials Data Model 1.0 - Expressing verifiable information on the Web (19 November 2019) - Section 6.3.1]',
  },
  {
    name: 'vp',
    long_name: 'Verifiable Presentation as specified in the W3C Recommendation',
    ref: '[W3C Recommendation Verifiable Credentials Data Model 1.0 - Expressing verifiable information on the Web (19 November 2019) - Section 6.3.1]',
  },
  {
    name: 'sph',
    long_name: 'SIP Priority header field',
    ref: '[RFC9027]',
  },
  {
    name: 'ace_profile',
    long_name: 'The ACE profile a token is supposed to be used with.',
    ref: '[RFC-ietf-ace-oauth-authz-46 - Section 5.10]',
  },
  {
    name: 'cnonce',
    long_name:
      'client-nonce. A nonce previously provided to the AS by the RS via the client. Used to verify token freshness when the RS cannot synchronize its clock with the AS.',
    ref: '[RFC-ietf-ace-oauth-authz-46 - Section 5.10]',
  },
  {
    name: 'exi',
    long_name:
      'Expires in. Lifetime of the token in seconds from the time the RS first sees it. Used to implement a weaker from of token expiration for devices that cannot synchronize their internal clocks.',
    ref: '[RFC-ietf-ace-oauth-authz-46 - Section 5.10.3]',
  },
  {
    name: 'roles',
    long_name: 'Roles',
    ref: '[RFC7643 - Section 4.1.2][RFC9068 - Section 2.2.3.1]',
  },
  {
    name: 'groups',
    long_name: 'Groups',
    ref: '[RFC7643 - Section 4.1.2][RFC9068 - Section 2.2.3.1]',
  },
  {
    name: 'entitlements',
    long_name: 'Entitlements',
    ref: '[RFC7643 - Section 4.1.2][RFC9068 - Section 2.2.3.1]',
  },
  {
    name: 'token_introspection',
    long_name: 'Token introspection response',
    ref: '[RFC-ietf-oauth-jwt-introspection-response-12 - Section 5]',
  },
];
