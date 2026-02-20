<script setup lang="ts">
import hexArray from 'hex-array';
import { packArray, packString, unpackArray, unpackString } from 'byte-data';
import JSON5 from 'json5';
import { type Conversion, cleanHex, decodeNumber, decodeStruct, encodeStruct } from './hex-converter.service';
import { useValidation } from '@/composable/validation';

const mode = ref<'simple' | 'struct'>('simple');

const bits = ref(32);
const floatingPoint = ref(false);
const signed = ref(false);
const bigEndian = ref(false);
const decodeAs = ref<'dec' | 'bin' | 'hexa' | 'char' | 'utf8'>('dec');

const uppercase = ref(false);
const grouping = ref(1);
const rowlength = ref(0);

const hexInput = ref('');
const decodedOutput = computed(() => {
  try {
    const buffer = hexArray.fromString(cleanHex(hexInput.value));
    if (decodeAs.value === 'utf8') {
      return unpackString(buffer);
    }
    else {
      return unpackArray(buffer, {
        bits: bits.value,
        fp: floatingPoint.value,
        signed: signed.value,
        be: bigEndian.value,
      }, 0, buffer.length, true).map(n => decodeNumber(n, bits.value, decodeAs.value as Conversion)).join(' ');
    }
  }
  catch (e: any) {
    return e.toString();
  }
});
const numberInput = ref('');
const encodedOutput = computed(() => {
  try {
    const values = numberInput.value.split(/\s+/).map(Number);
    return hexArray.toString(
      new Uint8Array(
        packArray(values, {
          bits: bits.value,
          fp: floatingPoint.value,
          signed: signed.value,
          be: bigEndian.value,
        })),
      {
        uppercase: uppercase.value,
        grouping: grouping.value,
        rowlength: rowlength.value,
      },
    );
  }
  catch (e: any) {
    return e.toString();
  }
});

const stringInput = ref('');
const utf8Output = computed(() => {
  try {
    return hexArray.toString(
      new Uint8Array(packString(stringInput.value)),
      {
        uppercase: uppercase.value,
        grouping: grouping.value,
        rowlength: rowlength.value,
      },
    );
  }
  catch (e: any) {
    return e.toString();
  }
});

const structDefinition = ref(`{
  x: "int32",
  y: "int32",
}`);
const structDefinitionValidation = useValidation({
  source: structDefinition,
  rules: [
    {
      message: 'Struct definition is not a valid JSON',
      validator: value => JSON5.parse(value.trim()),
    },
  ],
});
const hexStructInput = ref('');
const decodedStructOutput = computed(() => {
  try {
    return JSON.stringify(
      decodeStruct({
        struct: JSON5.parse(structDefinition.value),
        hexArray: hexArray.fromString(cleanHex(hexStructInput.value)),
      }),
      null, 2);
  }
  catch (e: any) {
    return e.toString();
  }
});

const jsonStructInput = ref('');
const encodedStructOutput = computed(() => {
  try {
    return hexArray.toString(
      encodeStruct({
        struct: JSON5.parse(structDefinition.value),
        jsonObject: JSON5.parse(jsonStructInput.value),
      }), {
        uppercase: uppercase.value,
        grouping: grouping.value,
        rowlength: rowlength.value,
      });
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <n-radio-group v-model:value="mode" name="radiogroup" mb-2 flex justify-center>
      <n-space>
        <n-radio
          value="simple"
          label="Simple Encoder/Decoder"
        />
        <n-radio
          value="struct"
          label="C/C++ typed struct"
        />
      </n-space>
    </n-radio-group>

    <div v-if="mode === 'simple'">
      <c-card title="Hex Options" mb-1>
        <c-select
          v-model:value="decodeAs"
          label="Decode/Encode As:"
          label-position="left" mb-1
          :options="[{ value: 'dec', label: 'Decimal' }, { value: 'bin', label: 'Binary' }, { value: 'hex', label: 'Hexadecimal' }, { value: 'char', label: 'Char/ASCII' }, { value: 'utf8', label: 'UTF8 string' }]"
        />
        <n-space v-if="decodeAs !== 'utf8'" align="baseline" justify="center">
          <n-form-item label="Bits:" label-placement="left">
            <n-input-number v-model:value="bits" :min="1" style="width: 6em" />
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="floatingPoint">
              Floating Point
            </n-checkbox>
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="signed">
              Signed
            </n-checkbox>
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="bigEndian">
              Big Endian
            </n-checkbox>
          </n-form-item>
        </n-space>
      </c-card>
      <c-card title="Hex Data Decoder" mb-3>
        <c-input-text
          v-model:value="hexInput"
          multiline
          placeholder="Put your Hex data here..."
          rows="2"
          label="Hex Data to decode"
          raw-text
          mb-5
        />

        <n-form-item label="Your decoded values:">
          <textarea-copyable :value="decodedOutput" />
        </n-form-item>
      </c-card>
      <c-card v-if="decodeAs !== 'utf8'" title="Hex Data Encoder" mt-3>
        <c-input-text
          v-model:value="numberInput"
          multiline
          placeholder="Put your Numbers array here..."
          rows="2"
          label="Numbers array to encode"
          raw-text
          mb-5
        />

        <n-form-item label="Your encoded numbers array as Hex:">
          <textarea-copyable :value="encodedOutput" />
        </n-form-item>
      </c-card>
      <c-card v-if="decodeAs === 'utf8'" title="Hex UTF8 String Encoder" mt-3>
        <c-input-text
          v-model:value="stringInput"
          multiline
          placeholder="Put your text here..."
          rows="5"
          label="String to encode"
          raw-text
          mb-5
        />

        <n-form-item label="Your encoded string as UTF8 Hex:">
          <textarea-copyable :value="utf8Output" />
        </n-form-item>
      </c-card>
      <c-card title="Hex Encoding Output" mt-1>
        <n-space align="baseline" justify="center">
          <n-form-item label="Uppercase" label-placement="left">
            <n-switch v-model:value="uppercase" />
          </n-form-item>
          <n-form-item label="Group by" label-placement="left">
            <n-input-number v-model:value="grouping" :min="0" style="width: 6em" mr-1 /> digits (0 = no grouping)
          </n-form-item>
          <n-form-item label="Split as rows by" label-placement="left">
            <n-input-number v-model:value="rowlength" :min="0" style="width: 6em" mr-1 /> group of digits (0 = no rows)
          </n-form-item>
        </n-space>
      </c-card>
    </div>

    <div v-if="mode === 'struct'">
      <c-card title="Struct Definition">
        <c-input-text
          v-model:value="structDefinition"
          multiline
          placeholder="Put your Struct defintion here..."
          rows="5"
          label="C/C+ like struct definition"
          raw-text
          mb-5
          :validation="structDefinitionValidation"
        />

        <details>
          <summary>Instructions</summary>
          <n-p>
            Define you struct definition in JSON format: keys = struct member names ; value = type
            <br>
            Types syntax: u?int{size}(be)? | float(be)? | double(be)? | char | wchar(be)? | &lt;type&gt;[{array size}]
            <br>
            where "u" means "unsigned" ; "be" means "Big Endian" ; {size} is number of bits ; {array size} fixed size for arrays
            <br>
            can prefix integer with 0x or 0b to display as hex and binary
          </n-p>
        </details>
      </c-card>
      <c-card title="Hex Struct Decoder" m-t-1>
        <c-input-text
          v-model:value="hexStructInput"
          multiline
          placeholder="Put your Hex data here..."
          rows="5"
          label="Hex Data to decode"
          raw-text
          mb-5
        />

        <n-form-item label="Your decoded values:">
          <textarea-copyable :value="decodedStructOutput" />
        </n-form-item>
      </c-card>
      <c-card title="Hex Struct Encoder" m-t-1>
        <c-input-text
          v-model:value="jsonStructInput"
          multiline
          placeholder="Put your Struct to encode here..."
          rows="5"
          label="Struct json to encode"
          raw-text
          mb-5
        />

        <n-form-item label="Your encoded struct as Hex:">
          <textarea-copyable :value="encodedStructOutput" />
        </n-form-item>
      </c-card>
      <c-card title="Hex Encoding Output" mt-1>
        <n-space align="baseline" justify="center">
          <n-form-item label="Uppercase" label-placement="left">
            <n-switch v-model:value="uppercase" />
          </n-form-item>
          <n-form-item label="Group by" label-placement="left">
            <n-input-number v-model:value="grouping" :min="0" style="width: 6em" mr-1 /> digits (0 = no grouping)
          </n-form-item>
          <n-form-item label="Split as rows by" label-placement="left">
            <n-input-number v-model:value="rowlength" :min="0" style="width: 6em" mr-1 /> group of digits (0 = no rows)
          </n-form-item>
        </n-space>
      </c-card>
    </div>
  </div>
</template>
