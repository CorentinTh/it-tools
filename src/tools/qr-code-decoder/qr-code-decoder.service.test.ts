import { describe, expect, test } from 'vitest';
import { parseQRData } from './qr-code-decoder.service';

describe('qr-code-decoder', () => {
  test('parseQRData should parse content correctly', () => {
    expect(parseQRData(null)).toEqual({
      type: 'Unknown',
      value: '',
    });
    expect(parseQRData('')).toEqual({
      type: 'Unknown',
      value: '',
    });
    expect(parseQRData('TEL:+33123456')).toEqual({
      type: 'Phone',
      value: '+33123456',
    });
    expect(parseQRData('MATMSG:TO: email@example.com;SUB:email subject;BODY:Email text;;')).toEqual({
      type: 'Email',
      value: {
        body: 'Email text',
        subject: 'email subject',
        to: 'email@example.com',
      },
    });
    expect(parseQRData('mailto:email@example.com?subject=email subject&body=Email text')).toEqual({
      type: 'Email',
      value: {
        body: 'Email text',
        subject: 'email subject',
        to: 'email@example.com',
      },
    });
    expect(parseQRData('SMTP:email@example.com:email subject:Email text')).toEqual({
      type: 'Email',
      value: {
        body: 'Email text',
        subject: 'email subject',
        to: 'email@example.com',
      },
    });
    expect(parseQRData('smsto:+33315555:message')).toEqual({
      type: 'SMS',
      value: {
        message: 'message',
        to: '+33315555',
      },
    });
    expect(parseQRData('WIFI:T:nopass;S:ssid;H:true;')).toEqual({
      type: 'Wifi',
      value: {
        authentication: 'nopass',
        hidden: 'true',
        name: 'ssid',
        password: undefined,
      },
    });
    expect(parseQRData('WIFI:T:WPA;S:ssid;P:password;H:false;')).toEqual({
      type: 'Wifi',
      value: {
        authentication: 'WPA',
        hidden: 'false',
        name: 'ssid',
        password: 'password', // NOSONAR
      },
    });
    expect(parseQRData('BEGIN:VCALENDAR\nPRODID:-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN\nVERSION:2.0\nBEGIN:VEVENT\nDTSTAMP:19960704T120000Z\nUID:uid1@example.com\nORGANIZER:mailto:jsmith@example.com\nDTSTART:19960918T143000Z\nDTEND:19960920T220000Z\nSTATUS:CONFIRMED\nCATEGORIES:CONFERENCE\nSUMMARY:Networld+Interop Conference\nDESCRIPTION:Networld+Interop Conference\n  and Exhibit\\nAtlanta World Congress Center\\n\n Atlanta\\, Georgia\nEND:VEVENT\nEND:VCALENDAR'))
      .toEqual({
        type: 'iCal',
        value: [
          'vcalendar',
          [
            [
              'prodid',
              {},
              'text',
              '-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN',
            ],
            [
              'version',
              {},
              'text',
              '2.0',
            ],
          ],
          [
            [
              'vevent',
              [
                [
                  'dtstamp',
                  {},
                  'date-time',
                  '1996-07-04T12:00:00Z',
                ],
                [
                  'uid',
                  {},
                  'text',
                  'uid1@example.com',
                ],
                [
                  'organizer',
                  {},
                  'cal-address',
                  'mailto:jsmith@example.com',
                ],
                [
                  'dtstart',
                  {},
                  'date-time',
                  '1996-09-18T14:30:00Z',
                ],
                [
                  'dtend',
                  {},
                  'date-time',
                  '1996-09-20T22:00:00Z',
                ],
                [
                  'status',
                  {},
                  'text',
                  'CONFIRMED',
                ],
                [
                  'categories',
                  {},
                  'text',
                  'CONFERENCE',
                ],
                [
                  'summary',
                  {},
                  'text',
                  'Networld+Interop Conference',
                ],
                [
                  'description',
                  {},
                  'text',
                  'Networld+Interop Conference and Exhibit\nAtlanta World Congress Center\nAtlanta, Georgia',
                ],
              ],
              [],
            ],
          ],
        ],
      });
  });
});
