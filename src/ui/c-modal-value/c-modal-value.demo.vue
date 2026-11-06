<template>
  <div flex gap-2>
    <c-modal-value value="lorem ipsum" label="test" />
    <c-modal-value>
      <template #label="{ toggleModal }">
        <c-button class="text-left" size="small" @click="toggleModal">
          Bonjour
        </c-button>
      </template>

      <template #value>
        <pre>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Molestias, quisquam vitae saepe dolores quas debitis ab r
          ecusandae suscipit ex dignissimos minus quam repellat sunt.
          Molestiae culpa blanditiis totam sapiente dignissimos.
        </pre>
      </template>
    </c-modal-value>
  </div>
</template>
