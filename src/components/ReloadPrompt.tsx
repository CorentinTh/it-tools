/* eslint-disable vue/one-component-per-file */
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { useNotification, type NotificationReactive } from 'naive-ui';
import { defineComponent } from 'vue';
import { whenever } from '@vueuse/core';

export default defineComponent({
  setup() {
    const notificationBuilder = useNotification();

    const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW();

    let notification: NotificationReactive | null = null;

    const onUpdateClicked = () => {
      if (notification) {
        notification.action = () => (
          <n-button loading type="primary" secondary>
            Reloading
          </n-button>
        );
      }

      updateServiceWorker();
    };

    whenever(
      needRefresh,
      () => {
        notification = notificationBuilder.create({
          title: 'A new version is out!',
          content: 'Update to get the latest version of it-tools',
          closable: true,
          onClose: () => {
            needRefresh.value = false;
            return true;
          },
          action: () => (
            <n-button onClick={onUpdateClicked} type="primary" secondary>
              Reload
            </n-button>
          ),
        });
      },
      { immediate: true },
    );

    whenever(offlineReady, () => notification?.destroy(), { immediate: true });

    return () => '';
  },
});
