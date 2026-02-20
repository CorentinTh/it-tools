<script setup lang="ts">
import { useObfuscateJavascript } from './javascript-obfuscator.service';
import { useCopy } from '@/composable/copy';

const code = ref(`function greet(name) {
  console.log('Hello ' + name);
}
greet('World');`);
const method = ref<'base64' | 'rot13'>('base64');
const copied = ref(false);

const obfuscated = useObfuscateJavascript(code, method);
const { copy: originalCopy } = useCopy({ source: obfuscated });

function copy() {
  originalCopy();
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function download() {
  const blob = new Blob([obfuscated.value], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'obfuscated.js';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="obfuscator-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="icon-wrapper">
          <svg
            class="hero-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
        <h1 class="hero-title">
          JavaScript Obfuscator
        </h1>
        <p class="hero-subtitle">
          Transform your code with advanced protection techniques
        </p>
      </div>
    </div>

    <!-- Main Card -->
    <div class="main-card">
      <!-- Input Section -->
      <div class="input-section">
        <label class="input-label">
          <span class="label-text">
            Source Code
          </span>
          <span class="char-count">
            {{ code.length }} characters
          </span>
        </label>

        <div class="textarea-wrapper">
          <c-input-text
            v-model:value="code"
            raw-text
            placeholder="// Enter your JavaScript code here&#10;function example() {&#10;  console.log('Hello World');&#10;}"
            clearable
            multiline
            class="code-input"
          />
        </div>
      </div>

      <!-- Controls Bar -->
      <div class="controls-bar">
        <div class="method-selector">
          <label class="control-label">
            <svg
              class="control-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            Obfuscation Method
          </label>
          <select
            v-model="method"
            class="method-select"
          >
            <option value="base64">
              🔐 Base64 Encoding
            </option>
            <option value="rot13">
              🔄 ROT13 Cipher
            </option>
          </select>
        </div>

        <div class="action-buttons">
          <c-button
            :ghost="!copied"
            class="action-btn copy-btn"
            @click="copy()"
          >
            <svg
              v-if="!copied"
              class="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <svg
              v-else
              class="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            {{ copied ? 'Copied!' : 'Copy' }}
          </c-button>

          <c-button
            class="action-btn download-btn"
            @click="download()"
          >
            <svg
              class="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            Download
          </c-button>
        </div>
      </div>

      <!-- Output Section -->
      <div
        v-if="obfuscated"
        class="output-section"
      >
        <label class="output-label">
          <span class="label-text">
            Obfuscated Output
          </span>
          <span class="badge">
            {{ method === 'base64' ? 'Base64' : 'ROT13' }}
          </span>
        </label>

        <c-card class="output-card">
          <div class="output-content">
            <pre class="output-code">{{ obfuscated }}</pre>
          </div>
        </c-card>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="empty-state"
      >
        <svg
          class="empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <p class="empty-text">
          Your obfuscated code will appear here
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.obfuscator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.hero-section {
  text-align: center;
  margin-bottom: 48px;
}

.hero-content {
  display: inline-block;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hero-icon {
  width: 40px;
  height: 40px;
  color: white;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 18px;
  color: #64748b;
  font-weight: 400;
}

.main-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.input-section {
  margin-bottom: 32px;
}

.input-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.label-text {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.char-count {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

.textarea-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;

  &:focus-within {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
}

.code-input {
  position: relative;
  z-index: 1;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 14px;
  border-radius: 14px;
  transition: all 0.3s;

  :deep(textarea) {
    min-height: 300px;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    color: #1e293b;

    &:focus {
      background: white;
      border-color: transparent;
    }
  }
}
.controls-bar {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.method-selector {
  flex: 1;
  min-width: 250px;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 10px;
}

.control-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.method-select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: white;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.btn-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.copy-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
}

.download-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  }
}

.output-section {
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.output-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.output-card {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid #334155;
  min-height: 500px;
}

.output-content {
  position: relative;
}

.output-code {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-break: break-all;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 2px dashed #cbd5e1;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
  margin: 0 auto 16px;
  stroke-width: 1.5;
}

.empty-text {
  font-size: 16px;
  color: #94a3b8;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 768px) {
  .obfuscator-container {
    padding: 24px 16px;
  }

  .main-card {
    padding: 24px;
  }

  .hero-title {
    font-size: 32px;
  }

  .controls-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    width: 100%;

    button {
      flex: 1;
    }
  }
}
</style>
