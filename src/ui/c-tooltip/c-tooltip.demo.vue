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
</template>
