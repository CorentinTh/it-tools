import jsonAnalyzer from 'json-analyzer';

export interface Meta {
  __meta__: {
    size?: {
      value: number
      raw: string
      gzip: string
    }
    number_of_childs?: number
    parent_relative_percentage?: string
    biggest_node_child: string
  }
}
export type AnalysisNode = {
  [key: string]: object & Meta
} & Meta;

export type TreeNode = {
  key: string
  label: string
  children: Array<TreeNode>
} & Record<string, unknown>;

function getTreeNodes(obj: AnalysisNode, parentName: string): TreeNode {
  const childNodes = Object.entries(obj)
    .filter(([key, v]) => key !== '__meta__' && typeof v === 'object')
    .map(([k, v]) => ({
      key: (Number.isNaN(Number.parseInt(k, 10)) ? `.${k}` : `.[${k}]`),
      value: v as AnalysisNode,
    }));
  const biggest_child_node = obj.__meta__.biggest_node_child ? ` ; biggest child node: '${obj.__meta__.biggest_node_child}'` : '';
  const parent_relative_percentage = obj.__meta__.parent_relative_percentage ? ` ; ${obj.__meta__.parent_relative_percentage} of parent` : '';
  return {
    key: parentName,
    label: obj.__meta__
      ? `${parentName}: ${obj.__meta__.size?.raw}(${obj.__meta__.size?.gzip} gzip)${parent_relative_percentage}${biggest_child_node}`
      : parentName,
    children: childNodes.map(childNode => getTreeNodes(childNode.value, parentName + childNode.key)),
  };
}

export function getJsonUsageTreeNodes(jsonObj: any, maxDepth: number = 100, targetNode: string = ''): TreeNode {
  const analysis = jsonAnalyzer({
    json: jsonObj,
    verbose: true,
    maxDepth,
    target: targetNode,
  });
  return getTreeNodes(analysis, '$');
}
