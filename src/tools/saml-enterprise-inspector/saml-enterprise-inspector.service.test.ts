import { Blob as NodeBlob } from 'node:buffer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { convertEnterpriseTimestamp, decodeSamlBase64, inspectSamlMessage } from './saml-enterprise-inspector.service';

const directSaml = 'PHNhbWxwOkF1dGhuUmVxdWVzdCB4bWxuczpzYW1scD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIiBJRD0iX2FiYyIgVmVyc2lvbj0iMi4wIiBJc3N1ZUluc3RhbnQ9IjIwMjYtMDgtMTZUMDA6MDA6MDBaIj48c2FtbDpJc3N1ZXIgeG1sbnM6c2FtbD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiI+aHR0cHM6Ly9pZHAuZXhhbXBsZTwvc2FtbDpJc3N1ZXI+PC9zYW1scDpBdXRoblJlcXVlc3Q+';
const redirectSaml = 'fY8/C8IwFMS/Snl725ihyKMpCC4FXVQcXCTWQAPNH/NeoB9frEtdhFuOO+7HtaTdFHGXefQn88qGuJjd5AmXQEFOHoMmS+i1M4Q84Hl3PKCsBMYUOAxhgqLfK7jrxwDF1SSywSuQlYCiJ8qm98TaswIpZFOKbblpLkLgoht07YeESzOt2P/RmsgktsFDNzJHwrq2z1iZWbs4mbZebXZf93uyewM=';

describe('SAML and enterprise timestamp inspection', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('decodes Base64 POST messages into plain-text metadata and XML', async () => {
    const report = await inspectSamlMessage(directSaml, 'auto');
    expect(report).toContain('Signature verification: NOT PERFORMED');
    expect(report).toContain('Root element: samlp:AuthnRequest');
    expect(report).toContain('Issuer: https://idp.example');
    expect(report).toContain('ID: _abc');
  });

  it('extracts a URL-encoded SAML parameter and rejects DTD content', async () => {
    const url = `https://sp.example/login?SAMLRequest=${encodeURIComponent(directSaml)}`;
    expect(new TextDecoder().decode(decodeSamlBase64(url))).toContain('AuthnRequest');
    const dangerous = btoa('<!DOCTYPE x [<!ENTITY e SYSTEM "file:///etc/passwd">]><x>&e;</x>');
    await expect(inspectSamlMessage(dangerous, 'base64')).rejects.toThrow('without DTD');
  });

  it('inflates a raw DEFLATE Redirect-binding message when supported', async () => {
    if (typeof DecompressionStream === 'undefined') {
      return;
    }
    vi.stubGlobal('Blob', NodeBlob);
    const report = await inspectSamlMessage(redirectSaml, 'redirect');
    expect(report).toContain('Root element: samlp:AuthnRequest');
  });

  it('converts FILETIME without losing integer precision', () => {
    expect(convertEnterpriseTimestamp('filetime-to-iso', '116444736000000000')).toContain('1970-01-01T00:00:00.000Z');
    expect(convertEnterpriseTimestamp('iso-to-filetime', '1970-01-01T00:00:00.000Z')).toContain('116444736000000000');
  });

  it('keeps pre-Unix FILETIME remainders positive and rejects normalized calendar dates', () => {
    expect(convertEnterpriseTimestamp('filetime-to-iso', '116444735999999999')).toContain('Sub-millisecond 100 ns ticks: 9999');
    expect(() => convertEnterpriseTimestamp('iso-to-filetime', '2026-02-30T00:00:00Z')).toThrow(/ISO 8601/u);
    expect(() => convertEnterpriseTimestamp('ldap-to-iso', '20260230000000Z')).toThrow(/ISO 8601/u);
  });

  it('normalizes LDAP GeneralizedTime offsets and UTC output', () => {
    expect(convertEnterpriseTimestamp('ldap-to-iso', '20260816063000+0200')).toContain('2026-08-16T04:30:00.000Z');
    expect(convertEnterpriseTimestamp('iso-to-ldap', '2026-08-16T04:30:00.125Z')).toContain('20260816043000.125Z');
  });
});
