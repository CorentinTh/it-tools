import { type PropType, defineComponent, ref, watch } from 'vue';
import type { ArrayDifference, Difference, ObjectDifference } from '../json-diff.types';
import { useCopy } from '@/composable/copy';

export const DIFF_RENDER_BATCH_SIZE = 200;
const AUTO_EXPAND_MAX_NODES = 100;
const AUTO_EXPAND_MAX_DEPTH = 1;

const DiffNodeViewer = defineComponent({
  name: 'DiffNodeViewer',
  props: {
    depth: { type: Number, required: true },
    diff: { type: Object as PropType<Difference>, required: true },
    showKeys: { type: Boolean, default: true },
  },
  setup(props) {
    const initiallyExpanded = () => props.depth === 0
      || (props.depth <= AUTO_EXPAND_MAX_DEPTH && props.diff.nodeCount <= AUTO_EXPAND_MAX_NODES);
    const expanded = ref(initiallyExpanded());
    const visibleChildren = ref(DIFF_RENDER_BATCH_SIZE);

    watch(() => props.diff, () => {
      expanded.value = initiallyExpanded();
      visibleChildren.value = DIFF_RENDER_BATCH_SIZE;
    });

    return () => {
      const { diff, showKeys } = props;
      if (diff.status === 'updated') {
        return <ComparisonViewer diff={diff} showKeys={showKeys} />;
      }
      if (diff.type === 'array' || diff.type === 'object') {
        return (
          <ChildrenViewer
            diff={diff}
            depth={props.depth}
            expanded={expanded.value}
            visibleChildren={visibleChildren.value}
            showKeys={showKeys}
            onToggle={() => expanded.value = !expanded.value}
            onShowMore={() => visibleChildren.value += DIFF_RENDER_BATCH_SIZE}
          />
        );
      }
      return <LineDiffViewer diff={diff} showKeys={showKeys} />;
    };
  },
});

export function DiffRootViewer({ diff }: { diff: Difference }) {
  return (
    <div class="diffs-viewer">
      <ul><DiffNodeViewer diff={diff} depth={0} showKeys={false} /></ul>
    </div>
  );
}

function LineDiffViewer({ diff, showKeys }: { diff: Difference; showKeys?: boolean }) {
  const { value, key, status, oldValue } = diff;
  const valueToDisplay = status === 'removed' ? oldValue : value;

  return (
    <li>
      <span class={[status, 'result']}>
        {showKeys && (
          <>
            <span class="key">{key}</span>
            {': '}
          </>
        )}
        <Value value={valueToDisplay} status={status} />
      </span>
      ,
    </li>
  );
}

function ComparisonViewer({ diff, showKeys }: { diff: Difference; showKeys?: boolean }) {
  const { value, key, oldValue } = diff;

  return (
    <li class="updated-line">
      {showKeys && (
        <>
          <span class="key">{key}</span>
          {': '}
        </>
      )}
      <Value value={oldValue} status="removed" />
      <Value value={value} status="added" />,
    </li>
  );
}

function ChildrenViewer({
  diff,
  depth,
  expanded,
  visibleChildren,
  showKeys,
  onToggle,
  onShowMore,
}: {
  diff: ArrayDifference | ObjectDifference
  depth: number
  expanded: boolean
  visibleChildren: number
  showKeys: boolean
  onToggle: () => void
  onShowMore: () => void
}) {
  const { children, key, status, type } = diff;
  const openTag = type === 'array' ? '[' : '{';
  const closeTag = type === 'array' ? ']' : '}';
  const renderedChildren = expanded ? children.slice(0, visibleChildren) : [];
  const remainingChildren = children.length - renderedChildren.length;

  return (
    <li>
      <div class={[type, status]} style={{ display: 'inline-block' }}>
        <button
          type="button"
          class="diff-toggle"
          data-test-id="diff-expand"
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${String(key || 'root')} ${type}`}
          onClick={onToggle}
        >
          {expanded ? '▼' : '▶'}
        </button>
        {showKeys && (
          <>
            <span class="key">{key}</span>
            {': '}
          </>
        )}
        {openTag}
        {!expanded && children.length > 0 && <span class="collapsed-summary">… {children.length} entries</span>}
        {expanded && children.length > 0 && (
          <ul>
            {renderedChildren.map((child, index) => (
              <DiffNodeViewer
                key={`${String(child.key)}:${index}`}
                diff={child}
                depth={depth + 1}
                showKeys={type === 'object'}
              />
            ))}
            {remainingChildren > 0 && (
              <li>
                <button
                  type="button"
                  class="diff-show-more"
                  data-test-id="diff-show-more"
                  onClick={onShowMore}
                >
                  Show {Math.min(DIFF_RENDER_BATCH_SIZE, remainingChildren)} more ({remainingChildren} remaining)
                </button>
              </li>
            )}
          </ul>
        )}
        {`${closeTag},`}
      </div>
    </li>
  );
}

function formatValue(value: unknown): string {
  return value === null ? 'null' : JSON.stringify(value);
}

function Value({ value, status }: { value: unknown; status: string }) {
  const formattedValue = formatValue(value);
  const { copy } = useCopy({ source: formattedValue });

  return (
    <span class={['value', status]} onClick={() => copy()}>
      {formattedValue}
    </span>
  );
}
