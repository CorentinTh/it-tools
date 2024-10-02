import { Toaster as Sonner, toast } from 'solid-sonner';

export { toast };

export function Toaster(props: Parameters<typeof Sonner>[0]) {
  return (
    <Sonner
      class="toaster group"
      toastOptions={{
        classes: {
          toast: 'group toast group-[.toaster]:(bg-background text-foreground border-border shadow-lg)',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:(bg-primary text-primary-foreground)',
          cancelButton: 'group-[.toast]:(bg-muted text-muted-foreground)',
        },
      }}
      {...props}
    />
  );
}
