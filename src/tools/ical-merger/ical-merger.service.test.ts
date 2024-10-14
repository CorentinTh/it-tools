import { describe, expect, it } from 'vitest';
import { mergeIcals } from './ical-merger.service';

describe('ical-merger', () => {
  describe('mergeIcals', () => {
    it('merge correctly', () => {
      expect(mergeIcals([
`BEGIN:VCALENDAR
PRODID:-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN
VERSION:2.0
BEGIN:VEVENT
DTSTAMP:19960704T120000Z
UID:uid1@example.com
ORGANIZER:mailto:jsmith@example.com
DTSTART:19960918T143000Z
DTEND:19960920T220000Z
STATUS:CONFIRMED
CATEGORIES:CONFERENCE
SUMMARY:Networld+Interop Conference
DESCRIPTION:Networld+Interop Conference
  and Exhibit\\nAtlanta World Congress Center\\n
 Atlanta\\, Georgia
END:VEVENT
END:VCALENDAR`,
 `BEGIN:VCALENDAR
METHOD:xyz
VERSION:2.0
PRODID:-//ABC Corporation//NONSGML My Product//EN
BEGIN:VEVENT
DTSTAMP:19970324T120000Z
SEQUENCE:0
UID:uid3@example.com
ORGANIZER:mailto:jdoe@example.com
ATTENDEE;RSVP=TRUE:mailto:jsmith@example.com
DTSTART:19970324T123000Z
DTEND:19970324T210000Z
CATEGORIES:MEETING,PROJECT
CLASS:PUBLIC
SUMMARY:Calendaring Interoperability Planning Meeting
DESCRIPTION:Discuss how we can test c&s interoperability\\n
 using iCalendar and other IETF standards.
LOCATION:LDB Lobby
ATTACH;FMTTYPE=application/postscript:ftp://example.com/pub/
 conf/bkgrnd.ps
END:VEVENT
END:VCALENDAR`,
      ])).to.eq(
`BEGIN:VCALENDAR
PRODID:it-tools-ical-merger
VERSION:1.0
BEGIN:VEVENT
DTSTAMP:19960704T120000Z
UID:uid1@example.com
ORGANIZER:mailto:jsmith@example.com
DTSTART:19960918T143000Z
DTEND:19960920T220000Z
STATUS:CONFIRMED
CATEGORIES:CONFERENCE
SUMMARY:Networld+Interop Conference
DESCRIPTION:Networld+Interop Conference and Exhibit\\nAtlanta World Congress
  Center\\nAtlanta\\, Georgia
END:VEVENT
BEGIN:VEVENT
DTSTAMP:19970324T120000Z
SEQUENCE:0
UID:uid3@example.com
ORGANIZER:mailto:jdoe@example.com
ATTENDEE;RSVP=TRUE:mailto:jsmith@example.com
DTSTART:19970324T123000Z
DTEND:19970324T210000Z
CATEGORIES:MEETING,PROJECT
CLASS:PUBLIC
SUMMARY:Calendaring Interoperability Planning Meeting
DESCRIPTION:Discuss how we can test c&s interoperability\\nusing iCalendar a
 nd other IETF standards.
LOCATION:LDB Lobby
ATTACH;FMTTYPE=application/postscript:ftp://example.com/pub/conf/bkgrnd.ps
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n'));
    });
  });
});
