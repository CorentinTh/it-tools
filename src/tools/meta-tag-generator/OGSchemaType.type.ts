import type { CSelectOption } from '@/ui/c-select/c-select.types';

export type { OGSchemaType, OGSchemaTypeElementInput, OGSchemaTypeElementInputMultiple, OGSchemaTypeElementSelect };

interface OGSchemaTypeElementBase {
  key: string
  label: string
  placeholder: string
}

interface OGSchemaTypeElementInput extends OGSchemaTypeElementBase {
  type: 'input'
}

interface OGSchemaTypeElementInputMultiple extends OGSchemaTypeElementBase {
  type: 'input-multiple'
}

interface OGSchemaTypeElementSelect extends OGSchemaTypeElementBase {
  type: 'select'
  options: CSelectOption<string>[]
}

interface OGSchemaType {
  name: string
  elements: (OGSchemaTypeElementSelect | OGSchemaTypeElementInput | OGSchemaTypeElementInputMultiple)[]
}
