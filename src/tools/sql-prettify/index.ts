import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.sql-prettify.title'),
  path: '/sql-prettify',
  description: t('tools.sql-prettify.description'),
  keywords: [
    'sql',
    'prettify',
    'beautify',
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
