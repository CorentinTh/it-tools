<script setup lang="ts">
import { computed, ref } from 'vue';
import markdownDocx, { Packer } from 'markdown-docx';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const inputMarkdown = ref('');
const dataUrl = ref('');
const isLoading = ref(false);
const lastExportTime = ref<Date | null>(null);

// 计算按钮是否禁用
const isExportDisabled = computed(() => {
  return isLoading.value || !inputMarkdown.value.trim();
});

// Markdown 预览
const previewHtml = computed(() => {
  if (!inputMarkdown.value) {
    return '';
  }
  const rawHtml = marked(inputMarkdown.value);
  return DOMPurify.sanitize(rawHtml);
});

async function convertMarkdownToDocx() {
  if (!inputMarkdown.value.trim()) {
    return;
  }

  isLoading.value = true;
  try {
    const doc = await markdownDocx(inputMarkdown.value);
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    dataUrl.value = url;

    // 自动下载
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.docx';
    a.click();
    URL.revokeObjectURL(url);
    lastExportTime.value = new Date();
  }
  catch (error) {
    console.error('转换失败:', error);
    dataUrl.value = '';
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="markdown-to-word-container">
    <!-- 顶部标题和按钮区 -->
    <div class="header">
      <h1 class="title">{{ t('tools.markdown-to-word.title') }}</h1>
      <p class="subtitle">{{ t('tools.markdown-to-word.description') }}</p>
      <button
        class="export-button"
        :disabled="isExportDisabled"
        @click="convertMarkdownToDocx"
      >
        {{ isLoading ? '生成中...' : t('tools.markdown-to-word.export.button') }}
      </button>
    </div>

    <!-- 主内容区 -->
    <div class="content">
      <!-- 左侧输入区 -->
      <section class="input-section">
        <textarea
          v-model="inputMarkdown"
          :placeholder="t('tools.markdown-to-word.input.placeholder')"
          class="markdown-input"
        />
      </section>

      <!-- 右侧预览区 -->
      <section class="preview-section">
        <!-- Markdown 预览 -->
        <div class="markdown-preview">
          <div v-if="isLoading" class="loading">
            <div class="loading-spinner" />
            <div class="loading-text">{{ t('tools.markdown-to-word.export.disabled') }}</div>
          </div>
          <div v-else-if="inputMarkdown" v-html="previewHtml" class="preview-content" />
          <div v-else class="empty-state">
            {{ t('tools.markdown-to-word.input.placeholder') }}<br>
            {{ t('tools.markdown-to-word.export.disabled') }}
          </div>
        </div>
        <!-- 导出成功提示 -->
        <div v-if="lastExportTime" class="export-success">
          <div class="success-icon">✓</div>
          {{ t('tools.markdown-to-word.notification.success') }}
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.markdown-to-word-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  min-width: 100%;
  background: #fafbfc;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.header {
  padding: 20px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0;
}

.export-button {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 20px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.export-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.7;
}

.content {
  display: flex;
  flex: 1;
  min-height: 0;
  height: calc(100vh - 85px); /* 减去header的高度 */
}

.input-section {
  width: 48%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid #e5e7eb;
  background: #fff;
  min-width: 500px;
  height: 100%;
}

.markdown-input {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 0;
  resize: none;
  font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 15px;
  padding: 24px 32px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #f7f7fa;
  box-sizing: border-box;
  line-height: 1.6;
}

.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
  min-width: 500px;
  position: relative;
  height: 100%;
}

.markdown-preview {
  flex: 1;
  height: 100%;
  padding: 24px 32px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  line-height: 1.6;
  font-size: 16px;
  min-height: 0;
  position: relative;
}

.preview-content {
  width: 100%;
  height: 100%;
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 16px;
}

.export-success {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #166534;
  font-size: 14px;
  animation: fadeIn 0.3s ease;
}

.success-icon {
  color: #22c55e;
  font-size: 18px;
  font-weight: bold;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

<style>
/* Markdown 预览样式 */
.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3,
.markdown-preview h4,
.markdown-preview h5,
.markdown-preview h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-preview h1 { font-size: 2em; }
.markdown-preview h2 { font-size: 1.5em; }
.markdown-preview h3 { font-size: 1.25em; }

.markdown-preview p {
  margin-bottom: 16px;
  line-height: 1.6;
}

.markdown-preview code {
  padding: 0.2em 0.4em;
  background: #f1f5f9;
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
}

.markdown-preview pre {
  padding: 16px;
  overflow: auto;
  background: #f8fafc;
  border-radius: 6px;
  margin-bottom: 16px;
}

.markdown-preview pre code {
  padding: 0;
  background: transparent;
}

.markdown-preview ul,
.markdown-preview ol {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-preview blockquote {
  padding: 0 1em;
  color: #666;
  border-left: 0.25em solid #ddd;
  margin: 0 0 16px 0;
}

.markdown-preview img {
  max-width: 100%;
  height: auto;
}

.markdown-preview table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-preview th,
.markdown-preview td {
  padding: 6px 13px;
  border: 1px solid #ddd;
}

.markdown-preview tr:nth-child(2n) {
  background: #f8fafc;
}
</style>
