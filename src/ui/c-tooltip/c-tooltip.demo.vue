<script lang="ts" setup>
const positions = ['top', 'bottom', 'left', 'right'] as const;
</script>

<template>
  <div>
    <c-tooltip>
      Hover me

      <template #tooltip>
        Tooltip content
      </template>
    </c-tooltip>
  </div>

  <div mt-5>
    <c-tooltip tooltip="Tooltip content">
      Hover me
    </c-tooltip>
  </div>

  <div mt-5>
    <h2>Tooltip positions</h2>

    <div class="flex flex-wrap gap-4">
      <div v-for="position in positions" :key="position">
        <c-tooltip :position="position" :tooltip="`Tooltip ${position}`">
          <c-button>
            {{ position }}
          </c-button>
        </c-tooltip>
      </div>
    </div>
  </div>
</template>
