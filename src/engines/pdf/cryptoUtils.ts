import forge from 'node-forge';

/**
 * Generates a self-signed PKCS#12 (PFX) certificate on the fly in the browser.
 * This is used when the user wants to digitally sign a PDF but doesn't have their own .p12 file.
 * 
 * @param password The password to encrypt the PFX file
 * @param commonName The name to appear on the certificate (e.g. "Anonymous User")
 * @returns ArrayBuffer containing the .p12/.pfx data
 */
export async function generateSelfSignedP12(password: string, commonName: string = 'HandleMyFile User'): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    try {
      // 1. Generate RSA Key Pair (2048-bit is standard)
      forge.pki.rsa.generateKeyPair({ bits: 2048, workers: -1 }, (err, keys) => {
        if (err) {
          reject(err);
          return;
        }

        // 2. Create a self-signed certificate
        const cert = forge.pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.serialNumber = '01';
        
        // Valid for 1 year
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

        const attrs = [
          { name: 'commonName', value: commonName },
          { name: 'organizationName', value: 'HandleMyFile' },
          { shortName: 'OU', value: 'E-Sign' }
        ];

        cert.setSubject(attrs);
        cert.setIssuer(attrs);

        // Extensions for Digital Signature
        cert.setExtensions([{
          name: 'basicConstraints',
          cA: true
        }, {
          name: 'keyUsage',
          keyCertSign: true,
          digitalSignature: true,
          nonRepudiation: true,
          keyEncipherment: true,
          dataEncipherment: true
        }, {
          name: 'extKeyUsage',
          serverAuth: true,
          clientAuth: true,
          codeSigning: true,
          emailProtection: true,
          timeStamping: true
        }, {
          name: 'subjectAltName',
          altNames: [{
            type: 6, // URI
            value: 'https://handlemyfile.com'
          }]
        }, {
          name: 'subjectKeyIdentifier'
        }]);

        // Self-sign the certificate
        cert.sign(keys.privateKey, forge.md.sha256.create());

        // 3. Create PKCS#12 (PFX) container
        const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
          keys.privateKey, 
          [cert], 
          password, 
          {
            generateLocalKeyId: true,
            friendlyName: commonName,
            algorithm: '3des'
          }
        );

        const p12Der = forge.asn1.toDer(p12Asn1).getBytes();

        // Convert binary string to ArrayBuffer
        const buffer = new ArrayBuffer(p12Der.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < p12Der.length; i++) {
          view[i] = p12Der.charCodeAt(i);
        }

        resolve(buffer);
      });
    } catch (e) {
      reject(e);
    }
  });
}
