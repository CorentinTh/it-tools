<template>
    <div class="qr-code-generator">
      <h1>Contact Info QR Code Generator</h1>
      <form @submit.prevent="generateQRCode">
        <div>
          <label for="firstName">First Name:</label>
          <input type="text" v-model="contactInfo.firstName" required />
        </div>
        <div>
          <label for="lastName">Last Name:</label>
          <input type="text" v-model="contactInfo.lastName" required />
        </div>
        <div>
          <label for="role">Role:</label>
          <input type="text" v-model="contactInfo.role" required />
        </div>
        <div>
          <label for="phoneNumber">Phone Number:</label>
          <input type="tel" v-model="contactInfo.phoneNumber" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="contactInfo.email" required />
        </div>
        <div>
          <label for="companyName">Company Name:</label>
          <input type="text" v-model="contactInfo.companyName" required />
        </div>
        <div>
          <label for="companyWebsite">Company Website:</label>
          <input type="url" v-model="contactInfo.companyWebsite" required />
        </div>
        <div>
          <label for="companyAddress">Company Address:</label>
          <input type="text" v-model="contactInfo.companyAddress" required />
        </div>
        <button type="submit">Generate QR Code</button>
      </form>
      <div v-if="qrCodeUrl">
        <h2>QR Code:</h2>
        <img :src="qrCodeUrl" alt="Contact Info QR Code" />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import QRCode from 'qrcode';
  
  interface ContactInfo {
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber: string;
    email: string;
    companyName: string;
    companyWebsite: string;
    companyAddress: string;
  }
  
  export default defineComponent({
    name: 'ContactInfoQRCodeGenerator',
    setup() {
      const contactInfo = ref<ContactInfo>({
        firstName: '',
        lastName: '',
        role: '',
        phoneNumber: '',
        email: '',
        companyName: '',
        companyWebsite: '',
        companyAddress: ''
      });
  
      const qrCodeUrl = ref<string | null>(null);
  
      const generateQRCode = () => {
        const vCard = `
  BEGIN:VCARD
  VERSION:3.0
  N:${contactInfo.value.lastName};${contactInfo.value.firstName}
  FN:${contactInfo.value.firstName} ${contactInfo.value.lastName}
  ORG:${contactInfo.value.companyName}
  TITLE:${contactInfo.value.role}
  TEL;TYPE=WORK,VOICE:${contactInfo.value.phoneNumber}
  EMAIL;TYPE=PREF,INTERNET:${contactInfo.value.email}
  URL:${contactInfo.value.companyWebsite}
  ADR;TYPE=WORK,PREF:;;${contactInfo.value.companyAddress}
  END:VCARD
        `;
  
        QRCode.toDataURL(vCard, { errorCorrectionLevel: 'H' }, (err: Error | null, url: string) => {
          if (err) {
            console.error(err);
            return;
          }
          qrCodeUrl.value = url;
        });
      };
  
      return {
        contactInfo,
        qrCodeUrl,
        generateQRCode
      };
    }
  });
  </script>
  
  <style scoped>
  .qr-code-generator {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .qr-code-generator h1 {
    text-align: center;
  }
  
  .qr-code-generator form {
    display: flex;
    flex-direction: column;
  }
  
  .qr-code-generator form div {
    margin-bottom: 10px;
  }
  
  .qr-code-generator form label {
    margin-bottom: 5px;
  }
  
  .qr-code-generator form input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .qr-code-generator button {
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  
  .qr-code-generator button:hover {
    background-color: #0056b3;
  }
  
  .qr-code-generator img {
    display: block;
    margin: 20px auto;
  }
  </style>