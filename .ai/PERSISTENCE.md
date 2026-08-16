# Persistence and Privacy

Tool content is potentially secret and ephemeral by default. Passwords,
tokens, OTP secrets, private keys, JWTs, certificates, documents, diffs, and
pasted configuration must not enter general local persistence, logs, analytics,
CDNs, or third-party services.

Harmless preferences use namespaced, versioned, size-bounded storage. Approved
content persistence must be opt-in, documented, clearable, and resilient to
migration, quota, parse, write, and rollback failures. Large state belongs in
IndexedDB rather than synchronous per-keystroke `localStorage`.

The Local Encrypted OTP Vault is the deliberate exception: encrypted records
live in IndexedDB, keys are derived/unwrapped with Web Crypto, plaintext stays
in memory only while unlocked, and there are no accounts or synchronization.
Locking, timeout, close, migration failure, or cryptographic failure clears
decrypted state.

Development PWA cleanup may unregister only the root IT Tools `sw.js` and delete
only `workbox-precache-*`, `it-tools-lazy-assets-*`, and `figlet-fonts-*`. It
must not clear local/session content or unrelated origins/caches.
