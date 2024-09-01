<script setup lang="ts">
import WSC from 'w-websocket-client/dist/w-websocket-client.umd.js';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const url = useQueryParamOrStorage({ name: 'url', storageName: 'ws-tester:url', defaultValue: 'ws://host:port' });
const token = useQueryParamOrStorage({ name: 'token', storageName: 'ws-tester:token', defaultValue: '*' });
const logs = ref<string[]>([]);
const message = ref('');
const connected = ref(false);
let wsc: WSC;

function send() {
  logs.value.push(`Sent: ${message.value}`);
  wsc.send(message.value);
}
function connect() {
  wsc = new WSC({
    url: url.value,
    token: token.value,
    open() {
      logs.value.push('WebSocket Connection opened');
      connected.value = true;
    },
    close() {
      connected.value = false;
      logs.value.push('WebSocket Connection closed');
    },
    message(data: any) {
      logs.value.push(`Received: ${JSON.stringify(data)}`);
    },
    error(err: any) {
      logs.value.push(`Error: ${err}`);
    },
  });
}
</script>

<template>
  <div>
    <c-card title="Connection">
      <c-input-text
        v-model:value="url"
        placeholder="Enter url of WebSocket server here"
        label="Url"
        raw-text
      />
      <c-input-text
        v-model:value="token"
        placeholder="Enter token here"
        label="Token"
        raw-text
      />
      <div v-if="!connected" mt-5 flex justify-center>
        <c-button @click="connect()">
          Connect
        </c-button>
      </div>
    </c-card>
    <c-card v-if="connected" title="Send">
      <c-input-text
        v-model:value="message"
        placeholder="Enter message to send here"
        label="Message"
        rows="5"
        autosize
        raw-text
        multiline
        monospace
      />
      <div mt-5 flex justify-center>
        <c-button @click="send()">
          Send
        </c-button>
      </div>
    </c-card>
    <c-card title="Logs">
      <ul>
        <li v-for="(line, index) in logs" :key="index">
          {{ line }}
        </li>
      </ul>
    </c-card>
  </div>
</template>
