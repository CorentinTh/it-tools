import { Hono } from 'hono';
import { isValidIBAN, validateIBAN, extractIBAN, electronicFormatIBAN, friendlyFormatIBAN } from 'ibantools';
import { parsePhoneNumber, isValidPhoneNumber, getCountries, getCountryCallingCode } from 'libphonenumber-js/max';
import { getFriendlyErrors } from '@/tools/iban-validator-and-parser/iban-validator-and-parser.service.js';

const router = new Hono();

// IBAN validator and parser
router.post('/iban/validate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { iban = '' } = body;
  const clean = iban.replace(/\s/g, '').toUpperCase();
  const validation = validateIBAN(clean);
  const extracted = isValidIBAN(clean) ? extractIBAN(clean) : null;
  return c.json({
    result: {
      isValid: validation.valid,
      errors: getFriendlyErrors(validation.errorCodes),
      electronicFormat: electronicFormatIBAN(clean) ?? null,
      friendlyFormat: friendlyFormatIBAN(clean) ?? null,
      bban: extracted?.bban ?? null,
      countryCode: extracted?.countryCode ?? null,
    },
  });
});

// Phone number parser
router.post('/phone/parse', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { phone = '', defaultCountry } = body;
  try {
    const parsed = parsePhoneNumber(phone, defaultCountry as any);
    return c.json({
      result: {
        isValid: parsed.isValid(),
        isPossible: parsed.isPossible(),
        country: parsed.country,
        countryCallingCode: parsed.countryCallingCode,
        nationalNumber: parsed.nationalNumber,
        number: parsed.number,
        e164: parsed.format('E.164'),
        international: parsed.format('INTERNATIONAL'),
        national: parsed.format('NATIONAL'),
        type: parsed.getType(),
      },
    });
  } catch (e: any) {
    return c.json({ error: `Invalid phone number: ${e.message}` }, 400);
  }
});

// List supported countries (for phone)
router.get('/phone/countries', (c) => {
  const result = getCountries().map((code) => ({
    code,
    callingCode: `+${getCountryCallingCode(code)}`,
  }));
  return c.json({ result });
});

export default router;
