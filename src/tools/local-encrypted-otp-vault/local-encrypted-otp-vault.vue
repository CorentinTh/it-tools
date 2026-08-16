<script setup lang="ts">
import { useTimestamp } from '@vueuse/core';
import { generateSecret, generateTOTP } from '../otp-code-generator-and-validator/otp.service';
import {
  MAX_OTP_VAULT_ENTRIES,
  type OtpVaultEntry,
  createOtpVaultEntry,
  decryptOtpVault,
  encryptOtpVault,
} from './local-encrypted-otp-vault.service';
import { OtpVaultRepository } from './local-encrypted-otp-vault.repository';
import { useCopy } from '@/composable/copy';

const AUTO_LOCK_MS = 5 * 60 * 1000;
const repository = new OtpVaultRepository();
const now = useTimestamp({ interval: 1_000 });
const hasVault = ref(false);
const isUnlocked = ref(false);
const isBusy = ref(true);
const passphrase = ref('');
const confirmation = ref('');
const entries = ref<OtpVaultEntry[]>([]);
const error = ref('');
const status = ref('Checking local encrypted storage…');
const issuer = ref('');
const label = ref('');
const secret = ref(generateSecret());
const digits = ref<6 | 8>(6);
const period = ref(30);
const copySource = ref('');
let lockTimer: ReturnType<typeof globalThis.setTimeout> | undefined;

const { copy } = useCopy({ source: copySource, text: 'OTP code copied to the clipboard' });

function scheduleLock() {
  if (!isUnlocked.value) {
    return;
  }
  if (lockTimer !== undefined) {
    globalThis.clearTimeout(lockTimer);
  }
  lockTimer = globalThis.setTimeout(() => lock('Vault auto-locked after 5 minutes of inactivity.'), AUTO_LOCK_MS);
}

function lock(message = 'Vault locked. Decrypted entries and passphrase were removed from memory.') {
  if (lockTimer !== undefined) {
    globalThis.clearTimeout(lockTimer);
    lockTimer = undefined;
  }
  entries.value = [];
  passphrase.value = '';
  confirmation.value = '';
  isUnlocked.value = false;
  error.value = '';
  status.value = message;
}

async function createVault() {
  error.value = '';
  if (passphrase.value !== confirmation.value) {
    error.value = 'Passphrase confirmation does not match.';
    return;
  }
  isBusy.value = true;
  try {
    const envelope = await encryptOtpVault([], passphrase.value);
    await repository.write(envelope);
    entries.value = [];
    hasVault.value = true;
    isUnlocked.value = true;
    confirmation.value = '';
    status.value = 'Created and unlocked an empty encrypted vault.';
    scheduleLock();
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The encrypted vault could not be created.';
  }
  finally {
    isBusy.value = false;
  }
}

async function unlock() {
  error.value = '';
  isBusy.value = true;
  try {
    const envelope = await repository.read();
    if (!envelope) {
      hasVault.value = false;
      throw new Error('No local encrypted OTP vault was found.');
    }
    entries.value = await decryptOtpVault(envelope, passphrase.value);
    isUnlocked.value = true;
    status.value = `Unlocked ${entries.value.length} encrypted OTP entries locally.`;
    scheduleLock();
  }
  catch (caught) {
    entries.value = [];
    error.value = caught instanceof Error ? caught.message : 'The encrypted vault could not be unlocked.';
  }
  finally {
    isBusy.value = false;
  }
}

async function persistEntries(nextEntries: OtpVaultEntry[], successMessage: string) {
  isBusy.value = true;
  error.value = '';
  try {
    const envelope = await encryptOtpVault(nextEntries, passphrase.value);
    await repository.write(envelope);
    entries.value = nextEntries;
    status.value = successMessage;
    scheduleLock();
    return true;
  }
  catch (caught) {
    error.value = `${caught instanceof Error ? caught.message : 'Saving failed.'} The previous encrypted vault remains intact.`;
    return false;
  }
  finally {
    isBusy.value = false;
  }
}

async function addEntry() {
  if (entries.value.length >= MAX_OTP_VAULT_ENTRIES) {
    error.value = `The vault is limited to ${MAX_OTP_VAULT_ENTRIES} entries.`;
    return;
  }
  try {
    const entry = createOtpVaultEntry({
      digits: digits.value,
      issuer: issuer.value,
      label: label.value,
      period: period.value,
      secret: secret.value,
    });
    if (await persistEntries([...entries.value, entry], `Encrypted and saved ${entry.issuer} / ${entry.label}.`)) {
      label.value = '';
      issuer.value = '';
      secret.value = generateSecret();
    }
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The OTP entry is invalid.';
  }
}

async function removeEntry(entry: OtpVaultEntry) {
  await persistEntries(entries.value.filter(({ id }) => id !== entry.id), `Removed ${entry.issuer} / ${entry.label}.`);
}

function currentCode(entry: OtpVaultEntry) {
  return generateTOTP({ key: entry.secret, digits: entry.digits, timeStep: entry.period, now: now.value });
}

function copyCode(entry: OtpVaultEntry) {
  copySource.value = currentCode(entry);
  copy();
  scheduleLock();
}

onMounted(async () => {
  try {
    hasVault.value = Boolean(await repository.read());
    status.value = hasVault.value ? 'Encrypted vault found. Enter its passphrase to unlock.' : 'No vault found. Create one with a strong passphrase.';
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Local encrypted storage is unavailable.';
  }
  finally {
    isBusy.value = false;
  }
});

onScopeDispose(() => lock('Vault closed.'));
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-alert title="Local encrypted OTP vault">
      Opt-in storage only: entries are encrypted with Web Crypto AES-256-GCM and PBKDF2-HMAC-SHA-256 (600,000 iterations) before one versioned record is written to IndexedDB. The passphrase is never stored, there are no accounts or sync, and losing it makes recovery impossible.
    </c-alert>

    <c-card v-if="!isUnlocked" class="c-tool-panel" :title="hasVault ? 'Unlock vault' : 'Create vault'">
      <c-input-text
        v-model:value="passphrase"
        label="Vault passphrase (12+ characters)"
        type="password"
        :maxlength="1024"
        test-id="otp-vault-passphrase"
        raw-text
        autocomplete="off"
      />
      <c-input-text
        v-if="!hasVault"
        v-model:value="confirmation"
        label="Confirm passphrase"
        type="password"
        :maxlength="1024"
        test-id="otp-vault-confirmation"
        raw-text
        autocomplete="off"
        mt-3
      />
      <div class="c-task-actions" mt-3>
        <c-button v-if="hasVault" type="primary" :loading="isBusy" data-test-id="otp-vault-unlock" @click="unlock">
          Unlock locally
        </c-button>
        <c-button v-else type="primary" :loading="isBusy" data-test-id="otp-vault-create" @click="createVault">
          Create encrypted vault
        </c-button>
      </div>
    </c-card>

    <template v-else>
      <div class="c-task-actions">
        <c-button data-test-id="otp-vault-lock" @click="lock()">
          Lock now
        </c-button>
      </div>

      <c-card class="c-tool-panel" title="Add TOTP entry">
        <div grid grid-cols-1 gap-3 md:grid-cols-2>
          <c-input-text v-model:value="issuer" label="Issuer" :maxlength="100" test-id="otp-vault-issuer" raw-text />
          <c-input-text v-model:value="label" label="Account label" :maxlength="100" test-id="otp-vault-label" raw-text />
          <c-input-text v-model:value="secret" label="RFC 4648 Base32 secret" :maxlength="512" test-id="otp-vault-secret" raw-text monospace />
          <c-select v-model:value="digits" label="Code length" :options="[{ label: '6 digits', value: 6 }, { label: '8 digits', value: 8 }]" />
          <c-input-number v-model:value="period" label="Period (seconds)" :min="15" :max="300" :step="1" />
        </div>
        <div class="c-task-actions" mt-3>
          <c-button type="primary" :loading="isBusy" data-test-id="otp-vault-add" @click="addEntry">
            Encrypt and save entry
          </c-button>
        </div>
      </c-card>

      <c-card class="c-tool-panel" :title="`OTP entries (${entries.length}/${MAX_OTP_VAULT_ENTRIES})`">
        <div v-if="entries.length === 0" op-60 data-test-id="otp-vault-empty">
          The encrypted vault is empty.
        </div>
        <div v-else class="entry-list" data-test-id="otp-vault-entries">
          <article v-for="entry in entries" :key="entry.id" class="entry-row">
            <div min-w-0>
              <strong>{{ entry.issuer }}</strong>
              <div op-70>
                {{ entry.label }}
              </div>
            </div>
            <code>{{ currentCode(entry) }}</code>
            <div class="c-task-actions">
              <c-button size="small" @click="copyCode(entry)">
                Copy code
              </c-button>
              <c-button size="small" type="warning" :disabled="isBusy" @click="removeEntry(entry)">
                Remove
              </c-button>
            </div>
          </article>
        </div>
      </c-card>
    </template>

    <c-alert v-if="error" title="Encrypted vault error" data-test-id="otp-vault-error">
      {{ error }}
    </c-alert>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
  </div>
</template>

<style scoped>
.entry-list {
  display: grid;
  gap: var(--ui-space-3);
}

.entry-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--ui-space-3);
  padding: var(--ui-space-3);
  border: 1px solid var(--ui-border-color);
  border-radius: var(--ui-radius-md);
}

.entry-row code {
  font-size: 1.35rem;
  letter-spacing: 0.12em;
}

@media (max-width: 700px) {
  .entry-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
