<script setup lang="ts">
import { Base64 } from 'js-base64';
import createQPDFModule from 'qpdf-wasm-esm-embedded';
import { useDownloadFileFromBase64Refs } from '@/composable/downloadBase64';

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);

const restrictAccessibility = useStorage('pdf-encrypt:accessibility', false);
const restrictAnnotate = useStorage('pdf-encrypt:annotate', false);
const restrictAssemble = useStorage('pdf-encrypt:assemble', false);
const restrictExtract = useStorage('pdf-encrypt:extract', false);
const restrictForm = useStorage('pdf-encrypt:form', false);
const restrictModifyOther = useStorage('pdf-encrypt:modoth', false);
const clearTextMetadata = useStorage('pdf-encrypt:clearmeta', false);
const restrictModify = useStorage('pdf-encrypt:mod', 'all');
const restrictPrint = useStorage('pdf-encrypt:print', 'full');
const userPassword = ref('');
const ownerPassword = ref('');

const base64OutputPDF = ref('');
const logs = ref<string[]>([]);
const fileName = ref('');
const fileExtension = ref('pdf');
const { download } = useDownloadFileFromBase64Refs(
  {
    source: base64OutputPDF,
    filename: fileName,
    extension: fileExtension,
  });

function onFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  fileName.value = `encrypted_${file.value.name}`;
}

async function onProcessClicked() {
  if (!file.value) {
    return;
  }
  const fileBuffer = await file.value.arrayBuffer();

  status.value = 'processing';
  try {
    const options = [
      '--verbose',
      '--encrypt',
    ];
    options.push(`${userPassword.value}`);
    options.push(`${ownerPassword.value}`);
    options.push('128');
    options.push('--use-aes=y');
    options.push(`--accessibility=${(restrictAccessibility.value ? 'n' : 'y')}`);
    options.push(`--annotate=${(restrictAnnotate.value ? 'n' : 'y')}`);
    options.push(`--assemble=${(restrictAssemble.value ? 'n' : 'y')}`);
    options.push(`--extract=${(restrictExtract.value ? 'n' : 'y')}`);
    options.push(`--form=${(restrictForm.value ? 'n' : 'y')}`);
    options.push(`--modify-other=${(restrictModifyOther.value ? 'n' : 'y')}`);
    options.push(`--modify=${(restrictModify.value)}`);
    options.push(`--print=${(restrictPrint.value)}`);
    if (clearTextMetadata.value) {
      options.push('--cleartext-metadata');
    }
    options.push('--');
    options.push('in.pdf');
    options.push('out.pdf');
    const outPdfBuffer = await callMainWithInOutPdf(fileBuffer,
      options, 0);
    base64OutputPDF.value = `data:application/pdf;base64,${Base64.fromUint8Array(outPdfBuffer)}`;
    status.value = 'done';

    download();
  }
  catch (e) {
    status.value = 'error';
  }
}

async function callMainWithInOutPdf(data: ArrayBuffer, args: string[], expected_exitcode: number) {
  logs.value = [];
  const mod = await createQPDFModule({
    print(text: string) {
      logs.value.push(text);
    },
    printErr(text: string) {
      logs.value.push(text);
    },
  });
  mod.FS.writeFile('in.pdf', new Uint8Array(data));
  const ret = mod.callMain(args);
  if (expected_exitcode !== ret) {
    throw new Error('Process run failed');
  }
  return mod.FS.readFile('out.pdf');
}

const printRestrictionOptions = [{ value: 'none', label: 'Disallow printing' },
  { value: 'low', label: 'Allow only low-resolution printing' },
  { value: 'full', label: 'Allow full printing' },
];
const modificationRestrictionOptions = [
  { value: 'none', label: 'Allow no modifications' },
  { value: 'assembly', label: 'Allow document assembly only' },
  { value: 'form', label: 'Allow document assembly only + filling in form fields and signing' },
  { value: 'annotate', label: 'Allow document assembly only + filling in form fields and signing + commenting and modifying forms' },
  { value: 'all', label: 'Allow full document modification' },
];
</script>

<template>
  <div>
    <div style="flex: 0 0 100%">
      <div mx-auto max-w-600px>
        <c-file-upload
          title="Drag and drop a PDF file here, or click to select a file"
          accept=".pdf"
          @file-upload="onFileUploaded"
        />
        <div mt-2 text-center>
          <strong>Output file:</strong> {{ fileName }}
        </div>
      </div>
    </div>

    <c-card title="Permissions" mb-3 mt-3>
      <n-space>
        <n-checkbox v-model:checked="restrictAccessibility">
          Restrict accessibility (usually ignored)
        </n-checkbox>
        <n-checkbox v-model:checked="restrictAnnotate">
          Restrict commenting/filling form fields
        </n-checkbox>
        <n-checkbox v-model:checked="restrictAssemble">
          Restrict document assembly
        </n-checkbox>
        <n-checkbox v-model:checked="restrictExtract">
          Restrict text/graphic extraction
        </n-checkbox>
        <n-checkbox v-model:checked="restrictForm">
          Restrict filling form fields
        </n-checkbox>
        <n-checkbox v-model:checked="restrictModifyOther">
          Restrict other modifications
        </n-checkbox>
        <n-checkbox v-model:checked="clearTextMetadata">
          Prevent encryption of metadata
        </n-checkbox>
      </n-space>
      <c-select
        v-model:value="restrictModify"
        :options="modificationRestrictionOptions"
        label="Control modify access by level"
        mt-3
      />
      <c-select
        v-model:value="restrictPrint"
        :options="printRestrictionOptions"
        label="Control printing access"
        mt-3
      />
    </c-card>
    <n-form-item
      label="Owner password:"
      label-placement="left"
      mb-1
    >
      <n-input
        :value="ownerPassword"
        type="password"
        placeholder="Owner password (optional)"
      />
    </n-form-item>

    <n-form-item
      label="User password:"
      label-placement="left"
      mb-1
    >
      <n-input
        :value="userPassword"
        type="password"
        placeholder="User password (optional)"
      />
    </n-form-item>

    <div mt-3 flex justify-center>
      <c-button :disabled="!file" @click="onProcessClicked()">
        Encrypt PDF
      </c-button>
    </div>

    <n-divider />

    <div mt-3 flex justify-center>
      <c-alert v-if="status === 'error'" type="error">
        An error occured processing {{ fileName }}
      </c-alert>
      <n-spin
        v-if="status === 'processing'"
        size="small"
      />
    </div>

    <c-card title="Logs">
      <pre>{{ logs.join('\n') }}</pre>
    </c-card>
  </div>
</template>
