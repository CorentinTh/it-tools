import QRCode from 'qrcode';

interface ContactInfo {
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  email: string;
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
}

const generateContactInfoQRCode = (contactInfo: ContactInfo): void => {
  const vCard = `
BEGIN:VCARD
VERSION:3.0
N:${contactInfo.lastName};${contactInfo.firstName}
FN:${contactInfo.firstName} ${contactInfo.lastName}
ORG:${contactInfo.companyName}
TITLE:${contactInfo.role}
TEL;TYPE=WORK,VOICE:${contactInfo.phoneNumber}
EMAIL;TYPE=PREF,INTERNET:${contactInfo.email}
URL:${contactInfo.companyWebsite}
ADR;TYPE=WORK,PREF:;;${contactInfo.companyAddress}
END:VCARD
  `;

  QRCode.toDataURL(vCard, { errorCorrectionLevel: 'H' }, (err: Error | null, url: string) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(url);
  });
};

const contactInfo: ContactInfo = {
  firstName: 'John',
  lastName: 'Doe',
  role: 'Software Engineer',
  phoneNumber: '+1234567890',
  email: 'john.doe@example.com',
  companyName: 'Example Inc.',
  companyWebsite: 'https://www.example.com',
  companyAddress: '123 Example Street, City, Country'
};

generateContactInfoQRCode(contactInfo);