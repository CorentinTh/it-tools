import type { Component, ParentComponent } from 'solid-js';
import { cn } from '@/modules/ui/utils/cn';

export const ToolHeader: ParentComponent<{ name: string; description: string; icon: string }> = (props) => {
  return (
    <div>
      <div class="w-full bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:48px_48px] pt-12">

        <div class="flex gap-4 mb-8 max-w-1200px mx-auto px-6 items-start flex-col md:flex-row md:items-center">
          <div class="bg-card p-4 rounded-lg">
            <div class={cn(props.icon, 'size-8 md:size-12 text-muted-foreground')} />
          </div>

          <div>
            <h1 class="text-xl font-semibold">
              {props.name}
            </h1>
            <div class="text-muted-foreground text-base">
              {props.description}
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-t dark:from-background to-transparent h-24 mt-12 mb--24"></div>
      </div>

      {props.children}
    </div>
  );
};
