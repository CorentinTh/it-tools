<script setup lang="ts">
import { v1 as generateUuidV1, v3 as generateUuidV3, v4 as generateUuidV4, v5 as generateUuidV5, NIL as nilUuid } from 'uuid';
import { useCopy } from '@/composable/copy';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { withDefaultOnError } from '@/utils/defaults';

const versions = ['NIL', 'v1', 'v3', 'v4', 'v5'] as const;

const versions_info = {
  NIL: '字符串全为零，用于测试占位。',
  v1: '基于时间戳，由 MAC 地址（主机物理地址）、当前时间戳、随机数生成，可以保证全球范围内的唯一性。',
  v3: '基于命名空间的MD5散列值，通过计算自定义名称和命名空间的MD5散列值得到，保证了同一命名空间中不同自定义名称的唯一性， 和不同命名空间的唯一性，但同一命名空间的同一名字生成相同的uuid。',
  v4: '基于随机数，由伪随机数得到，有一定的重复概率，该概率可以计算出来。',
  v5: '基于命名空间的SHA-1散列值，算法与v3相同。',
} as const;

const version = useStorage<typeof versions[number]>('uuid-generator:version', 'v4');
const count = useStorage('uuid-generator:quantity', 5);
const v35Args = ref({
  namespace: useStorage('uuid-generator:v35Args.namespace', '6ba7b811-9dad-11d1-80b4-00c04fd430c8'),
  name: useStorage('uuid-generator:v35Args.name', ''),
});

const multiline = ref(true);

const validUuidRules = [
  {
    message: '无效的UUID',
    validator: (value: string) => {
      if (value === nilUuid) {
        return true;
      }

      return Boolean(value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/));
    },
  },
];

const generators = {
  NIL: () => nilUuid,
  v1: (index: number) => generateUuidV1({
    clockseq: index,
    msecs: Date.now(),
    nsecs: Math.floor(Math.random() * 10000),
    node: Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)),
  }),
  v3: () => generateUuidV3(v35Args.value.name, v35Args.value.namespace),
  v4: () => generateUuidV4(),
  v5: () => generateUuidV5(v35Args.value.name, v35Args.value.namespace),
};

const [uuids, refreshUUIDs] = computedRefreshable(() => withDefaultOnError(() =>
  Array.from({ length: count.value }, (_ignored, index) => {
    const generator = generators[version.value] ?? generators.NIL;
    return generator(index);
  }).join('\n'), ''));

const randomString = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:!?./-"\'#{([-|\\@)]=}*+';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const refreshV35Name = () => {
  v35Args.value.name = randomString(32);
};

const { copy } = useCopy({ source: uuids, text: '已复制到剪贴板' });

watch(version, async (newVersion, oldVersion) => {
  if (['NIL', 'v3', 'v5'].includes(newVersion)) {
    count.value = 1;
    multiline.value = true;
  }else{
    count.value = 5;
    multiline.value = false;
  }
})

onMounted(() => {
  if(v35Args.value.name===''){
    refreshV35Name();
  }
})
</script>

<template>
  <div>
    <c-buttons-select v-model:value="version" :options="versions" label="UUID 版本" label-width="100px" mb-2 />

    <div mb-2>
      <span text-12px style="opacity: 0.8">{{ versions_info[version] }}</span>
    </div>

    <div mb-2 flex items-center v-if="version === 'v1' || version === 'v4'">
      <span w-100px>生成数量</span>
      <n-input-number v-model:value="count" flex-1 :min="1" :max="50" placeholder="UUID 数量" />
    </div>

    <div v-if="version === 'v3' || version === 'v5'">
      <div>
        <c-buttons-select
          v-model:value="v35Args.namespace"
          :options="{
            DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
            URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
            OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
            X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
          }"
          label="命名空间"
          label-width="100px"
          mb-2
        />
      </div>
      <div flex-1>
        <c-input-text
          v-model:value="v35Args.namespace"
          placeholder="命名空间，格式：00000000-0000-0000-0000-000000000000"
          label-width="100px"
          label-position="left"
          label=" "
          :validation-rules="validUuidRules"
          mb-2
        />
      </div>

      <c-input-text
        v-model:value="v35Args.name"
        placeholder="自定义名称"
        label="自定义名称"
        label-width="100px"
        label-position="left"
        mb-2
      >
        <template #suffix>
          <c-tooltip tooltip="生成一个新的随机名称">
            <c-button circle variant="text" size="small" @click="refreshV35Name">
              <icon-mdi-refresh />
            </c-button>
          </c-tooltip>
        </template>
      </c-input-text>
    </div>

    <c-card my-3>
      <div text-center v-for="uuid in uuids.split('\n')" :key="uuid">
        {{ uuid }}
      </div>
    </c-card>

    <div flex justify-center gap-3>
      <c-button autofocus @click="copy()">
        复制
      </c-button>
      <c-button @click="refreshUUIDs" v-if="version === 'v1' || version === 'v4'">
        刷新
      </c-button>
      <c-button @click="refreshV35Name" v-if="!(version === 'v1' || version === 'v4')">
        刷新
      </c-button>
    </div>
  </div>
</template>

<style scoped lang="less">
</style>
