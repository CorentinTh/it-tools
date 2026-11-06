export interface SignatureInfo {
  verified: boolean
  authenticity: boolean
  integrity: boolean
  expired: boolean
  meta: {
    certs: {
      clientCertificate?: boolean
      issuedBy: {
        commonName: string
        organizationalUnitName?: string
        organizationName: string
        countryName?: string
        localityName?: string
        stateOrProvinceName?: string
      }
      issuedTo: {
        commonName: string
        serialNumber?: string
        organizationalUnitName?: string
        organizationName: string
        countryName?: string
        localityName?: string
        stateOrProvinceName?: string
      }
      validityPeriod: {
        notBefore: string
        notAfter: string
      }
      pemCertificate: string
    }[]
    signatureMeta: {
      reason: string
      contactInfo: string | null
      location: string
      name: string | null
    }
  }
}
