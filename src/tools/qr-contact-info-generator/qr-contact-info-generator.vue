<script setup lang="ts">
import { useContactQRCode } from "./useContactQRCode";
import { useDownloadFileFromBase64 } from "@/composable/downloadBase64";

const fullName = ref("");
const jobRole = ref("");
const phoneNumber = ref("");
const email = ref("");
const website = ref("");
const address = ref("");

const foreground = ref("#000000ff");
const background = ref("#ffffffff");

const { qrcode } = useContactQRCode({
  fullName,
  jobRole,
  phoneNumber,
  email,
  website,
  address,
  color: { foreground, background },
  options: { width: 1024 },
});

const { download } = useDownloadFileFromBase64({
  source: qrcode,
  filename: "contact-info-qr.png",
});
</script>

<template>
  <c-card>
    <div grid grid-cols-1 gap-12>
      <div>
        <c-input-text v-model:value="fullName" label="Full Name" placeholder="John Doe" mb-4 />
        <c-input-text v-model:value="jobRole" label="Job Role" placeholder="Software Engineer" mb-4 />
        <c-input-text v-model:value="phoneNumber" label="Phone Number" placeholder="+1 234 567 8901" mb-4 />
        <c-input-text v-model:value="email" label="Email Address" placeholder="john.doe@example.com" mb-4 />
        <c-input-text v-model:value="website" label="Website" placeholder="https://acme.com" mb-4 />
        <c-input-text v-model:value="address" label="Company Address" placeholder="123 Main St, City" mb-4 />

        <n-form label-width="130" label-placement="left">
          <n-form-item label="Foreground color:">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="Background color:">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
        </n-form>
      </div>

      <div v-if="qrcode">
        <div flex flex-col items-center gap-3>
          <img alt="contact-info-qrcode" :src="qrcode" width="200" />
          <c-button @click="download">Download QR Code</c-button>
        </div>
      </div>
    </div>
  </c-card>
</template>
