import { useRegisterSW } from 'virtual:pwa-register/vue';
import { NButton, useNotification } from 'naive-ui';
import { h, type Component } from 'vue';
import { whenever } from '@vueuse/core';

export default function () {
  const notification = useNotification();

  const { needRefresh, updateServiceWorker } = useRegisterSW();

  whenever(
    needRefresh,
    () => {
      notification.create({
        title: 'A new version is out!',
        content: 'Reload the page to refresh the cache and get the newest version of it-tools',
        closable: true,
        onClose: () => {
          needRefresh.value = false;
          return true;
        },
        action: () =>
          h(
            NButton as Component,
            { onClick: updateServiceWorker, type: 'primary', secondary: true },
            { default: () => 'Reload' },
          ),
      });
    },
    { immediate: true },
  );
}
