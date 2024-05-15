import { describe, expect, it } from 'vitest';
import { getKeyOrCertificateInfosAsync } from './certificate-key-parser.service';

const encryptedPrivateKey = /* NOSONAR */ `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFHzBJBgkqhkiG9w0BBQ0wPDAbBgkqhkiG9w0BBQwwDgQILjmiBkdY16UCAggA
MB0GCWCGSAFlAwQBAgQQ+sYf2MO9hoZ4F5+LdE2vRgSCBNC6CLgqMJ6fKS3YnMMJ
yc3/iuqRniP/11OllTmOr94/2dl6Xk8TndBqhAacYizxgNCHiPP+NEmwtPqbbE+a
boNqEh0m8NUegxc3qGzon8cJgobgvpw7eml4K1OjgxCw58Y1VQixSKpdHEC1E1o6
RBBwK5bIld97GEi4VPuqYoYvffcD5cDsj9HxqvEWGTXDtu/nKEA0cVe7wI8t1CtR
/kaFoCyYOFu9RE0YprcWT1GpYTHR3TE7+lXYR8vPGdMCMgww1mLCXDAz1G4Y5+1K
WAmiVn3uQqgR9rU/upaM01oOz5LJWtgi5gDV8zX0r41i8pYYQNvGiSvvw1pQJB5Q
sFyuVNU6hOCQ+zLssfmxnhRpgM3hn07gV+LFAg+ly6WQsl9W6m8WpJ7SgLeByb7g
teT+ml7wTuFZIiPbqD3Pq0grRZir3n3NuphUk9YwR2jN4hHXEDiQ9f4D4SY41RT3
lW7roK+oM1K3N4cDin+WyGiFFLyWrwrlXWmHN5A3pOf+0rQUooZdUTGSU0N9v9Ho
17x/+aDAeCMEl7y0GfEoglNxCjoVj70E9oJL21amziZAUOXobhuzeb0dWJmAtXoj
wETYW6QH8m80eEyvKfkLsQ2Sd360ILhRJtyN1HFJAQbsC3C0VYiqA3kjN4S1Zfeg
08/odqdi0a7GSTm/h+iT3rimXXS2TLfSYIzI14LZDCeCz33tX13WQrhGPbYEJBHX
PKc1ws0HHBwdpM8d+liPHm+Czt2/sbcGCNBWSPWWZpL+uzeh9HQYEUoefk88JCPD
xQlANh8BCzq0L1pYNZdOYVNb0fT1XluuP8xtIePsNHIsKRURDlCjaEAY41DwXmTp
DFRd41BLFZztX5jtMGw4lb3RplcaaRhxCEF51hRJQdb5HMpn4cr2Hqy5UP+ke2vV
0DVRi0jp7Mkp/+qdEEotWT1AxSeYoiW7j/GwlC8tqAC9NoMmcHAuOGF5fHshxz/L
lnWSHiPjfLezpfryBwb5D4+3/TFEzc8gPsco/Ip7qU1+wMObTLs9Nq1ROW/aClYU
A/a5DyCQUHaHyYRse/BLTXxr2gsMCm7qaTdCy+pZcL1f+YEISHtITuA38eGfQzTX
cX/k75t7+mKW4nKBBT/SZbBT27gEeZpAn8ORaMixedBQZmoFHLKNlrf+F+fBFfhp
J4NFeBFnEpa3YrPVgLTJY6yN0gummIC8GA7EpggdAcNTbp5EU+IHlHhExhzr+W+f
YCOdD4Zt6LMZjAlpId2APn9NMscpwT59K/61n1CjElpWPwfTW2hyto7/1q0fIgwK
z2E615qLFJa+EFR8hTFz0wjNUOCrDgS7K7STQbGaFfjmAe2LUFZhTm86u6K0fnUY
sNJeDSnvDYEQD1MUiezD06MmzdEHqJHNKztoahqPsQIktH84RGdc1oTPMS4PLwLM
JJmEHqLF7I8T6L+BvMp2LhZTrx3g1qU4wZRC5Rys7J5WR5E+v8XttEcViEO4Lrdr
wNRoroHuXLw4nOzM58DS5cHGliw4BeErQ6XC0aan2EM789Us3Hrx0zerfIOyUdBe
N39sh8X4jo7YHMBH3yqVsAIU3e8c2Z2rayP7+AyUncAfff9EH3BNpIkQIG3xsqh1
oimmuNBEFKy1F1rSP3NQvwcZVw==
-----END ENCRYPTED PRIVATE KEY-----
    `;
const openSSHPrivateKey = /* NOSONAR */ `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABFwAAAAdzc2gtcn
NhAAAAAwEAAQAAAQEA4r66AJdnJBwsKDyTr4QizQYMVhaFtcBcMcVuJHbKW/DtG985oA2V
hJRfcBz8MKNS9iTLRkgq4yoTVCIi5FDVU4EnQbLMoLfN2og6PpgSSL59bPUvYoenp6RS1i
R606eVakH/J6IIiadHMWBrLjCiChf5U/bvuSkUQWi0YLH9hI6Nw+S9MdwzBofshZZdww9Y
4udrWEVdfGrxWv5gjlaquxYZAnfaYCI0Pgh9v1nEALFufOVi1onUZaxduyvsLoQnXiwP2c
fWXsBYmjfViTTADTvHTLCF9IH+6heGk2WJkosgiajmMlc+1U7Xs+r5ZJ0ikt0ioydPN8Hi
LnVih6lENwAAA7hrsy+Ha7MvhwAAAAdzc2gtcnNhAAABAQDivroAl2ckHCwoPJOvhCLNBg
xWFoW1wFwxxW4kdspb8O0b3zmgDZWElF9wHPwwo1L2JMtGSCrjKhNUIiLkUNVTgSdBssyg
t83aiDo+mBJIvn1s9S9ih6enpFLWJHrTp5VqQf8nogiJp0cxYGsuMKIKF/lT9u+5KRRBaL
Rgsf2Ejo3D5L0x3DMGh+yFll3DD1ji52tYRV18avFa/mCOVqq7FhkCd9pgIjQ+CH2/WcQA
sW585WLWidRlrF27K+wuhCdeLA/Zx9ZewFiaN9WJNMANO8dMsIX0gf7qF4aTZYmSiyCJqO
YyVz7VTtez6vlknSKS3SKjJ083weIudWKHqUQ3AAAAAwEAAQAAAQBmKTj0+0JlaqwalPCV
rBth9M+qGgu0kC753dJ6a2tRcYPjgvgbvQMY8SDvCqA16eB/NqS/zdRE9bgvuBGwfRsgvJ
hLaZv47de6FpbnjOzwCaPJa88lvak0Rz1rbpRIuMEBVyr3WHIwU0YoYSDpdtALbDHSOvhX
nMKblelvh8KJ7jelix2R3llvcYexKdS66zzP7nPj5x8d1FDo2cxqWsy2aQxMlbZGTd3ujQ
ABzZGvI3L0tJRf4sPph/eLS28/teAExp5Uo9DuehqgU33iAYOaO2vZGqQJxBbaVtiarVK1
kRQLBrhieMIUJ9XHSwDn74VHWtBNfocTSPe6vbVMjLpBAAAAgGBTluv8WHqG1JTauYNjBI
EhSKL96MrIZR+fytEg3gcxitPnpQiPTP6XHXpQ7fxVk25bYvCj4QNi00jW6kBR46Zh90NI
nKgYvxdYoA5A7L6JvvByy00SbLssiM7kf3ByT/4EA8S911Q4cks8lKrwEUw+UzqTBR6QdG
JyZQQcUJa+AAAAgQDyIYjECyG91/X+zFYcecW+wWyLBzyEvOxFlRd4tZnvWknQTdtFqTlN
orTT+un1ygKe0DkfwXSbbjE69+xxlMtPQ2X6wd2mUruvtyBv1R8Kfj+doY5lFUfCEKj88u
ck1+Ol1K+KDnvlYZVnb5eCvMxmEMqyD+eTQ2EcNAJtjNmuDQAAAIEA77uU45tseIe9E6OZ
Hum2bUxQmqkpjrNCECiTJR99NUx+22sBZwrMAt3QzBwgSogQhLKAw+keEUG6zAl7UA6Lsc
vJdDllY2vYMRW9LZ1XNCxvl0i6QUsT8l9hwA9GuMQN1m6NRU+cnEU87KIXVBb+DRyZwo21
4WRkAc1Ru/KtrlMAAAAAAQID
-----END OPENSSH PRIVATE KEY-----      
    `;

const formatsData = [
  {
    input: `
-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZkHgaRYJKwYBBAHaRw8BAQdAdCmEzdpkjMzOoNkzgDFk/CHd+6uYAWkZ
BPbjEzTJWtfNAMKMBBAWCgA+BYJmQeBpBAsJBwgJkEDKj7jnGr9wAxUICgQW
AAIBAhkBApsDAh4BFiEExfkkog7+aHz7TqepQMqPuOcav3AAAJaaAQCayvFQ
jxFbC7oOzX+8wOV8gmXVXXqI5dtLQYY3SeyqmwD/ftVwwe6Prl0vVFyLB/5y
lIpAti8AK1Lv8hIezzOx4QDOOARmQeBpEgorBgEEAZdVAQUBAQdA2jU3Rmt7
nMFvqyjgKdVjK5o2CQI2vJiSzn8cfV1piEgDAQgHwngEGBYKACoFgmZB4GkJ
kEDKj7jnGr9wApsMFiEExfkkog7+aHz7TqepQMqPuOcav3AAABI0AQCMW4Hg
FuIaZk9LVQsUmNknj4a70fzwDYWUYvq0C1iy/QD+KXvLKfcmky5OXJA7RsRV
SN2a4SE4c8FH22uyirzyUww=
=w51K
-----END PGP PUBLIC KEY BLOCK-----      
    `,
    pass: '',
    type: 'PGP Public Key',
  },
  {
    // NOSONAR
    input: `
-----BEGIN PGP PRIVATE KEY BLOCK-----

xVgEZkHgaRYJKwYBBAHaRw8BAQdAdCmEzdpkjMzOoNkzgDFk/CHd+6uYAWkZ
BPbjEzTJWtcAAQDXcDgEziqd9ZO/OpoyblRRxAOgPq2y8zTitwTz+ixX7RCe
zQDCjAQQFgoAPgWCZkHgaQQLCQcICZBAyo+45xq/cAMVCAoEFgACAQIZAQKb
AwIeARYhBMX5JKIO/mh8+06nqUDKj7jnGr9wAACWmgEAmsrxUI8RWwu6Ds1/
vMDlfIJl1V16iOXbS0GGN0nsqpsA/37VcMHuj65dL1Rciwf+cpSKQLYvACtS
7/ISHs8zseEAx10EZkHgaRIKKwYBBAGXVQEFAQEHQNo1N0Zre5zBb6so4CnV
YyuaNgkCNryYks5/HH1daYhIAwEIBwAA/2PxYHVWBmkLD9eiFDLJ0EtspWQ+
JKui86xylduxQWngEIrCeAQYFgoAKgWCZkHgaQmQQMqPuOcav3ACmwwWIQTF
+SSiDv5ofPtOp6lAyo+45xq/cAAAEjQBAIxbgeAW4hpmT0tVCxSY2SePhrvR
/PANhZRi+rQLWLL9AP4pe8sp9yaTLk5ckDtGxFVI3ZrhIThzwUfba7KKvPJT
DA==
=hSgY
-----END PGP PRIVATE KEY BLOCK-----      
    `,
    pass: '',
    type: 'PGP Private Key',
  },
  {
    input: `
-----BEGIN CERTIFICATE REQUEST-----
MIIClTCCAX0CAQAwUDERMA8GA1UEAxMIdGVzdC5jb20xDzANBgNVBAYTBkZyYW5j
ZTELMAkGA1UECBMCRlIxDjAMBgNVBAcTBVBhcmlzMQ0wCwYDVQQKEwRUZXN0MIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnIUCiMFffkHGuAhwTaW84uh7
/03KcfQAZB/bZKqLaxtcBGryTB1gHFSsl3uFlW+tIcjsboWnQ2JB0J1Z5Fp4a6IA
/62S6GTo6dAd9f73TR+P2vQghZOtiCoc7CN2KlosIx/EWMcMjq+CBzLRjjOOR8tX
Yn4ZAhPInO1ZGPMEpfEEfn44aJFRGaMy4KEU+RpTzFKFW6bialvKC3yGPegQ4wcz
AqvyUc9WUwG53HYLSJHldg8tZnpiJBNUh8mXiIiw51MFJ4Q9RVnz9vuoHgC6FmUv
qlg/R4gjGGfjDhAIUtz+Y98Dl+xfLmD+EzY7KQ1ur412BvQ8rXankNGLA2ea+wID
AQABoAAwDQYJKoZIhvcNAQEFBQADggEBABdtkhFSwgaXZWTcKrz6oarvuaQkrjvs
Nk9lUs1h/dfhJpnE3iZA0CuNp5PVQRdC2g+/37r21/udjNFdrX1Rm6/ldG0b2xDu
nQYZcLpIVB0fZ2TB+FHthmGw175I2niWIfNJQhIqnWJXi8unkGTMP2cD6j3axtMi
K8MUVPhWmL11ojEXItG35AU79G6GhFxel9wIByqsXreCUyOcrpYCHy2Fv85ivdE1
JyEQ2tE/f+cKwNg4yJNFoCoHSSFRn61F12J4m2nwpQ77VfD66oVkWtk/gYMrwx0d
4FlJNs+NtZDlcM7fJLNo7YsMdne7hl4aL6WG96kdWdxYEt/2dl3WXbY=
-----END CERTIFICATE REQUEST-----
    `,
    pass: '',
    type: 'Certificate Signing Request',
  },
  {
    input: `
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDivroAl2ckHCwoPJOvhCLNBgxWFoW1wFwxxW4kdspb8O0b3zmgDZWElF9wHPwwo1L2JMtGSCrjKhNUIiLkUNVTgSdBssygt83aiDo+mBJIvn1s9S9ih6enpFLWJHrTp5VqQf8nogiJp0cxYGsuMKIKF/lT9u+5KRRBaLRgsf2Ejo3D5L0x3DMGh+yFll3DD1ji52tYRV18avFa/mCOVqq7FhkCd9pgIjQ+CH2/WcQAsW585WLWidRlrF27K+wuhCdeLA/Zx9ZewFiaN9WJNMANO8dMsIX0gf7qF4aTZYmSiyCJqOYyVz7VTtez6vlknSKS3SKjJ083weIudWKHqUQ3
    `,
    pass: '',
    type: 'Public Key',
    title: 'ssh-rsa Public Key',
  },
  {
    input: openSSHPrivateKey,
    pass: '',
    type: 'Private Key',
    title: 'Unencrypted Private Key',
  },
  {
    input: `
SHA256:qflg623OemnYEHDwUafq+XuMoB0UdJ+Ks44kHcWxDyM
    `,
    pass: '',
    type: 'Fingerprint',
  },
  {
    input: `
-----BEGIN CERTIFICATE-----
MIIDQDCCAiigAwIBAgIJK59gK0GUbZO3MA0GCSqGSIb3DQEBBQUAMFAxETAPBgNV
BAMTCHRlc3QuY29tMQ8wDQYDVQQGEwZGcmFuY2UxCzAJBgNVBAgTAkZSMQ4wDAYD
VQQHEwVQYXJpczENMAsGA1UEChMEVGVzdDAeFw0yNDA1MTMwOTQ4MTVaFw0yNTA1
MTMwOTQ4MTVaMFAxETAPBgNVBAMTCHRlc3QuY29tMQ8wDQYDVQQGEwZGcmFuY2Ux
CzAJBgNVBAgTAkZSMQ4wDAYDVQQHEwVQYXJpczENMAsGA1UEChMEVGVzdDCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMKrE3C9tUtmvHZkIwEBf1h5N7KC
FoXowfNZxKK7SHWcnQjBdv0ziqsU+GmcUqUD1GymMcBweqw4TQVg0a/UwdYIUTuQ
GXGx4ULCXKHv/NfmVSWcMsOZHAR4m/yEzTB/ZjKMSrqnIWyOdusDMRn4VRoAtrKO
/FM+SDJ6wvnJ/jNoZJXktq9avYduEi+heNekIF6NYM9clzm9Ff3Evf89KuigBcsu
rgL+S8PjotCwxMgzOWV4/paeeQluqYeU94prWIASS/D3elH7qFTAUnafBICFN2zs
XWY6ZFCR8QrDI5F/8KELq/3BaLQBxpIi9SmADLWqnPOu+6H5rzr2YV8LaxMCAwEA
AaMdMBswDAYDVR0TBAUwAwEB/zALBgNVHQ8EBAMCAvQwDQYJKoZIhvcNAQEFBQAD
ggEBAKhrUNnWe0VmgefvfwsAqrbk0Z6PwaibIl/l5I9oh1qM01J9BFHpvomhcLxu
cmIpD6nAqtkNyvsXtFAnZG3WNaf45yyd153wSa0QnrNo2GRH9quktm4DaRIIP7qq
EdtApYCeT16LvAGYUH3ubCdom8w6DkukLg8qMrXMywSZlx85jlJfifPvMKsJmm/a
QAq1H3cYaaj0DocF1rCP+hLzvsuM7UwS2JOK8Mw49kYPBTbCVmRDOE1rhlDIO8Kw
V7CCFr4NXsyRlM0TpKdspOmxJiyxmk6DoVgp9PeqfoyDAC9TJU0VJ6A2x+AfjK4O
Wg6xDXMx6dk6Rhh8yqGrmx05QM8=
-----END CERTIFICATE-----
    `,
    pass: '',
    type: 'Certificate',
  },
  {
    input: `
c6:b9:73:b8:68:49:33:ad:27:51:bb:6c:16:e7:9c:da:dd:e3:92:15
    `,
    pass: '',
    type: 'Fingerprint',
    title: 'HEX Fingerprint',
  },
  {
    input: encryptedPrivateKey,
    pass: 'test',
    type: 'Private Key',
    title: 'Encrypted Private Key',
  },
];

describe('certificate-key-parser', () => {
  for (const format of formatsData) {
    const { input, pass, type, title } = format;
    it(`Parse '${title ?? type}' format with right type (${type})`, async () => {
      const { values } = await getKeyOrCertificateInfosAsync(input, pass);
      const result_type = values.find(v => v.label === 'Type:')?.value;

      expect(result_type).toBe(type);
    });
  }
});
