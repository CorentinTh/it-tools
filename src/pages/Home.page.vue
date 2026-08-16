<script setup lang="ts">
import ToolCard from '../components/ToolCard.vue';
import { HOME_SEARCH_MAX_LENGTH, createHomeQuery, filterHomeTools, readHomeFilter } from './home-filter';
import { useToolStore } from '@/tools/tools.store';

const toolStore = useToolStore();
const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const favoriteTools = computed(() => toolStore.favoriteTools);
const categories = computed(() => toolStore.toolsByCategory.map(({ name }) => name));
const categoryOptions = computed(() => [
  { label: 'All categories', value: '' },
  ...categories.value.map(category => ({ label: category, value: category })),
]);
const filter = computed(() => readHomeFilter(route.query, categories.value));
const filteredTools = computed(() => filterHomeTools(toolStore.tools, filter.value));
const HOME_RENDER_BATCH_SIZE = 8;
const renderedToolCount = ref(0);
const renderedTools = computed(() => filteredTools.value.slice(0, renderedToolCount.value));
const hasActiveFilter = computed(() => Boolean(filter.value.query || filter.value.category));
const draggedFavoritePath = ref('');
let renderFrame: number | undefined;

function scheduleToolBatches() {
  if (renderFrame !== undefined) {
    cancelAnimationFrame(renderFrame);
  }
  renderedToolCount.value = Math.min(HOME_RENDER_BATCH_SIZE, filteredTools.value.length);

  const renderNextBatch = () => {
    renderedToolCount.value = Math.min(
      renderedToolCount.value + HOME_RENDER_BATCH_SIZE,
      filteredTools.value.length,
    );
    if (renderedToolCount.value < filteredTools.value.length) {
      renderFrame = requestAnimationFrame(renderNextBatch);
    }
    else {
      renderFrame = undefined;
    }
  };

  if (renderedToolCount.value < filteredTools.value.length) {
    renderFrame = requestAnimationFrame(renderNextBatch);
  }
}

watch(filteredTools, scheduleToolBatches, { immediate: true });

onScopeDispose(() => {
  if (renderFrame !== undefined) {
    cancelAnimationFrame(renderFrame);
  }
});

const searchQuery = computed({
  get: () => filter.value.query,
  set: query => updateFilter({ ...filter.value, query }, true),
});
const selectedCategory = computed({
  get: () => filter.value.category,
  set: category => updateFilter({ ...filter.value, category }, false),
});

function updateFilter(nextFilter: { category: string; query: string }, replace: boolean): void {
  const navigation = { name: 'home', query: createHomeQuery(nextFilter) };
  replace ? router.replace(navigation) : router.push(navigation);
}

function moveFavorite(fromIndex: number, toIndex: number): boolean {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= favoriteTools.value.length) {
    return false;
  }

  const reordered = [...favoriteTools.value];
  const [moved] = reordered.splice(fromIndex, 1);
  if (!moved) {
    return false;
  }
  reordered.splice(toIndex, 0, moved);
  toolStore.updateFavoriteTools(reordered);
  return true;
}

function moveFavoriteAndRestoreFocus(
  event: MouseEvent,
  fromIndex: number,
  toIndex: number,
): void {
  const activatedButton = event.target instanceof Element ? event.target.closest('button') : null;
  const alternateAction = activatedButton
    ? Array.from(activatedButton.parentElement?.querySelectorAll<HTMLButtonElement>('button') ?? [])
      .find(action => action !== activatedButton)
    : undefined;
  const alternateWasDisabled = alternateAction?.disabled ?? false;

  if (alternateAction) {
    alternateAction.disabled = false;
    alternateAction.focus({ preventScroll: true });
  }

  if (!moveFavorite(fromIndex, toIndex) && alternateAction) {
    alternateAction.disabled = alternateWasDisabled;
    activatedButton?.focus({ preventScroll: true });
  }
}

function startFavoriteDrag(event: DragEvent, path: string): void {
  draggedFavoritePath.value = path;
  event.dataTransfer?.setData('text/plain', path);
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
}

function dropFavorite(toIndex: number): void {
  const fromIndex = favoriteTools.value.findIndex(tool => tool.path === draggedFavoritePath.value);
  moveFavorite(fromIndex, toIndex);
  draggedFavoritePath.value = '';
}

let canCanonicalizeQuery = false;

function canonicalizeQuery(): void {
  if (!canCanonicalizeQuery || route.name !== 'home') {
    return;
  }

  const canonicalQuery = createHomeQuery(filter.value);
  const currentKeys = Object.keys(route.query).sort().join(',');
  const canonicalKeys = Object.keys(canonicalQuery).sort().join(',');
  if (currentKeys !== canonicalKeys || route.query.q !== canonicalQuery.q || route.query.category !== canonicalQuery.category) {
    router.replace({ name: 'home', query: canonicalQuery });
  }
}

watch(() => route.query, canonicalizeQuery);

onMounted(async () => {
  await router.isReady();
  canCanonicalizeQuery = true;
  canonicalizeQuery();
});
</script>

<template>
  <div class="pt-50px">
    <div class="grid-wrapper">
      <c-card aria-label="Tool filters">
        <div grid grid-cols-1 gap-3 md:grid-cols-2>
          <c-input-text
            v-model:value="searchQuery"
            label="Search tools"
            placeholder="Name, description, or keyword"
            :maxlength="HOME_SEARCH_MAX_LENGTH"
            clearable
            raw-text
            data-test-id="home-tool-search"
          />
          <c-select
            v-model:value="selectedCategory"
            label="Category"
            :options="categoryOptions"
            data-test-id="home-tool-category"
          />
        </div>
        <p role="status" aria-live="polite" mb-0 mt-3 text-sm op-70 data-test-id="home-filter-status">
          {{ filteredTools.length }} {{ filteredTools.length === 1 ? 'tool' : 'tools' }} shown.
        </p>
      </c-card>

      <transition name="height">
        <div v-if="!hasActiveFilter && favoriteTools.length > 0">
          <h3 class="mb-5px mt-25px text-neutral-400 font-500">
            {{ $t('home.categories.favoriteTools') }}
          </h3>
          <ul
            aria-label="Favorite tools"
            class="favorite-tools grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
          >
            <li
              v-for="(tool, index) in favoriteTools"
              :key="tool.path"
              draggable="true"
              class="favorite-tool"
              @dragstart="startFavoriteDrag($event, tool.path)"
              @dragend="draggedFavoritePath = ''"
              @dragover.prevent
              @drop.prevent="dropFavorite(index)"
            >
              <ToolCard :tool="tool" />
              <div class="favorite-order-actions" role="group" :aria-label="`Reorder ${tool.name}`">
                <c-button
                  variant="text"
                  circle
                  :disabled="index === 0"
                  :aria-label="`Move ${tool.name} earlier`"
                  @click="moveFavoriteAndRestoreFocus($event, index, index - 1)"
                >
                  ↑
                </c-button>
                <c-button
                  variant="text"
                  circle
                  :disabled="index === favoriteTools.length - 1"
                  :aria-label="`Move ${tool.name} later`"
                  @click="moveFavoriteAndRestoreFocus($event, index, index + 1)"
                >
                  ↓
                </c-button>
              </div>
            </li>
          </ul>
        </div>
      </transition>

      <div v-if="!hasActiveFilter && toolStore.newTools.length > 0">
        <h3 class="mb-5px mt-25px text-neutral-400 font-500">
          {{ t('home.categories.newestTools') }}
        </h3>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in toolStore.newTools" :key="tool.path" :tool="tool" />
        </div>
      </div>

      <h3 class="mb-5px mt-25px text-neutral-400 font-500">
        {{ hasActiveFilter ? 'Filtered tools' : $t('home.categories.allTools') }}
      </h3>
      <div v-if="filteredTools.length" class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard v-for="tool in renderedTools" :key="tool.path" :tool="tool" />
      </div>
      <n-alert v-else type="info" role="status">
        No tools match this filter.
      </n-alert>
    </div>
  </div>
</template>

<style scoped lang="less">
.height-enter-active,
.height-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 500px;
}

.height-enter-from,
.height-leave-to {
  max-height: 42px;
  overflow: hidden;
  opacity: 0;
  margin-bottom: 0;
}

.favorite-tool {
  position: relative;
  list-style: none;
}

.favorite-tools {
  margin: 0;
  padding: 0;
}

.favorite-order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 4px;
}
</style>
