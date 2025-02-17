<template>
  <div>
    <h1>Contact QR Code Generator</h1>
    <form @submit.prevent="generateQRCode">
      <input v-model="contact.firstName" placeholder="First Name" required />
      <input v-model="contact.lastName" placeholder="Last Name" required />
      <input v-model="contact.jobRole" placeholder="Job Role" required />
      <input v-model="contact.phoneNumber" placeholder="Phone Number" required />
      <input v-model="contact.emailAddress" placeholder="Email Address" required />
      <input v-model="contact.companyName" placeholder="Company Name" required />
      <input v-model="contact.companyWebsite" placeholder="Company Website" required />
      <input v-model="contact.companyAddress" placeholder="Company Address" required />
      <input v-model="foregroundColor" placeholder="Foreground Color" />
      <input v-model="backgroundColor" placeholder="Background Color" />
      <button type="submit">Generate QR Code</button>
    </form>
    <div v-if="qrCodeDataUrl">
      <img :src="qrCodeDataUrl" alt="Contact QR Code" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { generateContactQRCode } from './qr-contact-info-generator';

export default defineComponent({
  name: 'ContactQRCodeGenerator',
  setup() {
    const contact = ref({
      firstName: '',
      lastName: '',
      jobRole: '',
      phoneNumber: '',
      emailAddress: '',
      companyName: '',
      companyWebsite: '',
      companyAddress: ''
    });
    const foregroundColor = ref('#000000ff');
    const backgroundColor = ref('#ffffffff');
    const qrCodeDataUrl = ref<string | null>(null);

    const generateQRCode = async () => {
      qrCodeDataUrl.value = await generateContactQRCode(contact.value, {
        foregroundColor: foregroundColor.value,
        backgroundColor: backgroundColor.value
      });
    };

    return {
      contact,
      foregroundColor,
      backgroundColor,
      qrCodeDataUrl,
      generateQRCode
    };
  }
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  margin-top: 10px;
}

img {
  margin-top: 20px;
  max-width: 100%;
}
</style>