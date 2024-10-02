import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import type {
  TextFieldDescriptionProps,
  TextFieldErrorMessageProps,
  TextFieldInputProps,
  TextFieldLabelProps,
  TextFieldRootProps,
} from '@kobalte/core/text-field';
import type { ValidComponent, VoidProps } from 'solid-js';
import { cn } from '@/modules/ui/utils/cn';
import { TextField as TextFieldPrimitive } from '@kobalte/core/text-field';
import { cva } from 'class-variance-authority';
import { splitProps } from 'solid-js';

type textFieldProps<T extends ValidComponent = 'div'> =
  TextFieldRootProps<T> & {
    class?: string;
  };

export function TextFieldRoot<T extends ValidComponent = 'div'>(props: PolymorphicProps<T, textFieldProps<T>>) {
  const [local, rest] = splitProps(props as textFieldProps, ['class']);

  return <TextFieldPrimitive class={cn('space-y-1', local.class)} {...rest} />;
}

export const textfieldLabel = cva(
  'text-sm data-[disabled]:(cursor-not-allowed opacity-70) font-medium',
  {
    variants: {
      label: {
        true: 'data-[invalid]:text-destructive',
      },
      error: {
        true: 'text-destructive text-xs',
      },
      description: {
        true: 'font-normal text-muted-foreground',
      },
    },
    defaultVariants: {
      label: true,
    },
  },
);

type textFieldLabelProps<T extends ValidComponent = 'label'> =
  TextFieldLabelProps<T> & {
    class?: string;
  };

export function TextFieldLabel<T extends ValidComponent = 'label'>(props: PolymorphicProps<T, textFieldLabelProps<T>>) {
  const [local, rest] = splitProps(props as textFieldLabelProps, ['class']);

  return (
    <TextFieldPrimitive.Label
      class={cn(textfieldLabel(), local.class)}
      {...rest}
    />
  );
}

type textFieldErrorMessageProps<T extends ValidComponent = 'div'> =
  TextFieldErrorMessageProps<T> & {
    class?: string;
  };

export function TextFieldErrorMessage<T extends ValidComponent = 'div'>(props: PolymorphicProps<T, textFieldErrorMessageProps<T>>) {
  const [local, rest] = splitProps(props as textFieldErrorMessageProps, [
    'class',
  ]);

  return (
    <TextFieldPrimitive.ErrorMessage
      class={cn(textfieldLabel({ error: true }), local.class)}
      {...rest}
    />
  );
}

type textFieldDescriptionProps<T extends ValidComponent = 'div'> =
  TextFieldDescriptionProps<T> & {
    class?: string;
  };

export function TextFieldDescription<T extends ValidComponent = 'div'>(props: PolymorphicProps<T, textFieldDescriptionProps<T>>) {
  const [local, rest] = splitProps(props as textFieldDescriptionProps, [
    'class',
  ]);

  return (
    <TextFieldPrimitive.Description
      class={cn(textfieldLabel({ description: true }), local.class)}
      {...rest}
    />
  );
}

type textFieldInputProps<T extends ValidComponent = 'input'> = VoidProps<
  TextFieldInputProps<T> & {
    class?: string;
  }
>;

export function TextField<T extends ValidComponent = 'input'>(props: PolymorphicProps<T, textFieldInputProps<T>>) {
  const [local, rest] = splitProps(props as textFieldInputProps, ['class']);

  return (
    <TextFieldPrimitive.Input
      class={cn(
        'flex h-9 w-full rounded-md border border-input bg-inherit px-3 py-1 text-sm shadow-sm file:(border-0 bg-transparent text-sm font-medium) placeholder:text-muted-foreground focus-visible:(outline-none ring-1.5 ring-ring) disabled:(cursor-not-allowed opacity-50) transition-shadow',
        local.class,
      )}
      {...rest}
    />
  );
}
