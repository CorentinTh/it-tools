import ICAL from 'ical.js';

export function parseQRData(qrContent: string | null) {
  if (!qrContent) {
    return { type: 'Unknown', value: '' };
  }
  if (qrContent.startsWith('BEGIN:VCALENDAR')) {
    return { type: 'iCal', value: ICAL.parse(qrContent?.trim()) };
  }
  if (qrContent.startsWith('TEL:')) {
    return { type: 'Phone', value: qrContent.substring(4)?.trim() };
  }
  if (qrContent.startsWith('MATMSG:')) {
    // MATMSG:TO: email@example.com;SUB:email subject;BODY:Email text;;
    const parsing = /^MATMSG:(?:TO:([^;]*);)?(?:SUB:([^;]*);)?(?:BODY:([^;]*))?;;$/.exec(qrContent) || [];
    return {
      type: 'Email',
      value: {
        to: parsing[1]?.trim(),
        subject: parsing[2]?.trim(),
        body: parsing[3]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('mailto:')) {
    // mailto:email@example.com?subject=email subject&body=Email text
    const parsing = /^mailto:([^\?]+)\?subject=([^\&]*)(?:&body=(.*))$/.exec(qrContent) || [];
    return {
      type: 'Email',
      value: {
        to: parsing[1]?.trim(),
        subject: parsing[2]?.trim(),
        body: parsing[3]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('SMTP:')) {
    // SMTP:email@example.com:email subject:Email text
    const parsing = /^SMTP:([^:]+)(?::([^:]*))(?::([^:]*))?$/.exec(qrContent) || [];
    return {
      type: 'Email',
      value: {
        to: parsing[1]?.trim(),
        subject: parsing[2]?.trim(),
        body: parsing[3]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('smsto:')) {
    // smsto:${phoneNumber}:${message}
    const parsing = /^smsto:([^:]+)(?::(.+))$/.exec(qrContent) || [];
    return {
      type: 'SMS',
      value: {
        to: parsing[1]?.trim(),
        message: parsing[2]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('WIFI:')) {
    // WIFI:T:${authentication};S:${name};${authentication !== 'nopass' ? `P:${password};` : ''}H:${hidden};
    const parsing = /^WIFI:T:([^;]+);S:([^;]+);(?:P:([^;]+);)?(?:H:([^;]+);)?$/.exec(qrContent) || [];
    return {
      type: 'Wifi',
      value: {
        authentication: parsing[1]?.trim(),
        name: parsing[2]?.trim(),
        password: parsing[3]?.trim(),
        hidden: parsing[4]?.trim(),
      },
    };
  }
  if (/^(?:https?|ftp):\/\//.test(qrContent)) {
    return {
      type: 'Url',
      value: qrContent,
    };
  }
  return {
    type: 'Text',
    value: qrContent,
  };
}
