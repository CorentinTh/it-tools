import { describe, expect, it } from 'vitest';
import { getAuthHeaderCheckResult } from './sip-auth.service';

const message = `REGISTER sip:172.21.169.226 SIP/2.0
Via: SIP/2.0/UDP 172.21.160.1:64712;rport;branch=z9hG4bKPja70ba2f5f4464081a3925196ebd4e7f9
Max-Forwards: 70
From: <sip:1000@172.21.169.226>;tag=8db088f1039e49b691e53e5f172ace98
To: <sip:1000@172.21.169.226>
Call-ID: be95702faee84a8ebc8ccf94c5ca5492
CSeq: 37808 REGISTER
User-Agent: MicroSIP/3.21.3
Contact: <sip:1000@172.21.160.1:64712;ob>
Expires: 300
Allow: PRACK, INVITE, ACK, BYE, CANCEL, UPDATE, INFO, SUBSCRIBE, NOTIFY, REFER, MESSAGE, OPTIONS
Authorization: Digest username="1000", realm="172.21.169.226", nonce="d99a372c-340a-4ec9-91ed-53ad8f318ae0", uri="sip:172.21.169.226", response="7bdeb758d949a3c5e8d125fafbac1d5e", algorit=MD5, cnonce="3a8c445fb7ff48aeb8c422b00afaaddc", qop=auth, nc=00000001
Content-Length:  0`;

describe('getAuthHeaderCheckResult', () => {
  it('should return "check success" for valid authentication', () => {
    const password = '1234';
    const result = getAuthHeaderCheckResult({ message, password });
    expect(result).toBe(true);
  });

  it('should return "check failed" for invalid authentication', () => {
    const password = '12345';
    const result = getAuthHeaderCheckResult({ message, password });
    expect(result).toBe(false);
  });
});
