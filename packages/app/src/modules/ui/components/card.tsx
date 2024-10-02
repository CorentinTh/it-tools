import type { ComponentProps, ParentComponent } from 'solid-js';
import { cn } from '@/modules/ui/utils/cn';
import { splitProps } from 'solid-js';

export function Card(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <div
      class={cn(
        'rounded-xl border bg-card text-card-foreground shadow',
        local.class,
      )}
      {...rest}
    />
  );
}

export function CardHeader(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <div class={cn('flex flex-col space-y-1.5 p-6', local.class)} {...rest} />
  );
}

export const CardTitle: ParentComponent<ComponentProps<'h1'>> = (props) => {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <h1
      class={cn('font-semibold leading-none tracking-tight', local.class)}
      {...rest}
    />
  );
};

export const CardDescription: ParentComponent<ComponentProps<'h3'>> = (
  props,
) => {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <h3 class={cn('text-sm text-muted-foreground', local.class)} {...rest} />
  );
};

export function CardContent(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class']);

  return <div class={cn('p-6 pt-0', local.class)} {...rest} />;
}

export function CardFooter(props: ComponentProps<'div'>) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <div class={cn('flex items-center p-6 pt-0', local.class)} {...rest} />
  );
}
