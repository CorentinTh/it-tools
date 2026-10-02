<script setup lang="ts">
import { generateEd25519SshPair, generateRsaSshPair } from './ssh-key-pair-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';
import { withDefaultOnErrorAsync } from '@/utils/defaults';

const keyType = ref<'ed25519' | 'rsa'>('ed25519');
const rsaBits = ref<2048 | 3072 | 4096>(3072);
const comment = ref('');

const emptyPair = { publicKey: '', privateKey: '' };

const [pair, refreshPair] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(
    async () => (keyType.value === 'ed25519'
      ? generateEd25519SshPair(comment.value)
      : generateRsaSshPair(comment.value, rsaBits.value)),
    emptyPair,
  ),
  emptyPair,
);

function downloadPrivateKey() {
  const extension = keyType.value === 'ed25519' ? 'ed25519' : `rsa_${rsaBits.value}`;
  const blob = new Blob([pair.value.privateKey], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `id_${extension}`;
  link.click();
  URL.revokeObjectURL(link.href);
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <div item-style="flex: 1 1 0" style="max-width: 640px" mx-auto flex flex-col gap-3>
      <c-buttons-select v-model:value="keyType" :options="['ed25519', 'rsa']" label="Key type" label-width="120px" />

      <n-form-item v-if="keyType === 'rsa'" label="Bits :" label-placement="left" label-width="120">
        <n-radio-group v-model:value="rsaBits">
          <n-radio-button :value="2048">
            2048
          </n-radio-button>
          <n-radio-button :value="3072">
            3072
          </n-radio-button>
          <n-radio-button :value="4096">
            4096
          </n-radio-button>
        </n-radio-group>
      </n-form-item>

      <c-input-text
        v-model:value="comment"
        label="Comment (optional, usually an email)"
        placeholder="user@host"
        clearable
      />

      <c-button @click="refreshPair">
        Refresh key-pair
      </c-button>
    </div>
  </div>

  <div mt-4>
    <h3>Public key (authorized_keys format)</h3>
    <TextareaCopyable :value="pair.publicKey" />
  </div>

  <div mt-3>
    <div flex items-center justify-between>
      <h3>Private key (OpenSSH format, no passphrase)</h3>
      <c-button variant="text" @click="downloadPrivateKey()">
        Download private key
      </c-button>
    </div>
    <TextareaCopyable :value="pair.privateKey" />
  </div>

  <div mt-2 text-sm op-60>
    The private key is generated in your browser and never leaves it. Keep it safe — it is displayed
    only here.
  </div>
</template>
