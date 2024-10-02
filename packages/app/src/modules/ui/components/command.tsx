import type {
  CommandDialogProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandInputProps,
  CommandItemProps,
  CommandListProps,
  CommandRootProps,
} from 'cmdk-solid';
import type { ComponentProps, VoidProps } from 'solid-js';
import { cn } from '@/modules/ui/utils/cn';
import { Command as CommandPrimitive } from 'cmdk-solid';
import { splitProps } from 'solid-js';
import { Dialog, DialogContent } from './dialog';

export function Command(props: CommandRootProps) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <CommandPrimitive
      class={cn(
        'flex size-full flex-col overflow-hidden bg-popover text-popover-foreground',
        local.class,
      )}
      {...rest}
    />
  );
}

export function CommandList(props: CommandListProps) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <CommandPrimitive.List
      class={cn(
        'max-h-[300px] overflow-y-auto overflow-x-hidden p-1',
        local.class,
      )}
      {...rest}
    />
  );
}

export function CommandInput(props: VoidProps<CommandInputProps>) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <div class="flex items-center border-b px-3" cmdk-input-wrapper="">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="mr-2 h-4 w-4 shrink-0 opacity-50"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"
        />
        <title>Search</title>
      </svg>
      <CommandPrimitive.Input
        class={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:(cursor-not-allowed opacity-50)',
          local.class,
        )}
        {...rest}
      />
    </div>
  );
}

export function CommandItem(props: CommandItemProps) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <CommandPrimitive.Item
      class={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5! text-sm outline-none aria-selected:(bg-accent text-accent-foreground) aria-disabled:(pointer-events-none opacity-50)',
        local.class,
      )}
      {...rest}
    />
  );
}

export function CommandShortcut(props: ComponentProps<'span'>) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <span
      class={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        local.class,
      )}
      {...rest}
    />
  );
}

export function CommandDialog(props: CommandDialogProps) {
  const [local, rest] = splitProps(props, ['children']);

  return (
    <Dialog {...rest}>
      <DialogContent class="overflow-hidden p-0">
        <Command class="[&_[cmdk-group-heading]]:(px-2 font-medium text-muted-foreground) [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:(px-2 py-3) [&_[cmdk-item]_svg]:size-5">
          {local.children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function CommandEmpty(props: CommandEmptyProps) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <CommandPrimitive.Empty
      class={cn('py-6 text-center text-sm', local.class)}
      {...rest}
    />
  );
}

export function CommandGroup(props: CommandGroupProps) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <CommandPrimitive.Group
      class={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:(px-2 py-1.5 text-xs font-medium text-muted-foreground)',
        local.class,
      )}
      {...rest}
    />
  );
}

export function CommandSeparator(props: CommandEmptyProps) {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <CommandPrimitive.Separator
      class={cn('-mx-1 h-px bg-border', local.class)}
      {...rest}
    />
  );
}
