import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'SQL 格式化',
  path: '/sql-prettify',
  description: '在线格式化和美化 SQL 查询语句（支持各种 SQL 语句）。',
  keywords: [
    'sql',
    '格式化',
    '美化',
    'GCP BigQuery',
    'IBM DB2',
    'Apache Hive',
    'MariaDB',
    'MySQL',
    'Couchbase N1QL',
    'Oracle PL/SQL',
    'PostgreSQL',
    'Amazon Redshift',
    'Spark',
    'SQL Server Transact-SQL',
  ],
  component: () => import('./sql-prettify.vue'),
  icon: Database,
});
