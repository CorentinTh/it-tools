import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const baseUrl = process.env.BASE_URL || 'http://localhost:5050';
const useWebServer = process.env.NO_WEB_SERVER !== 'true';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src',
  testMatch: /\.e2e\.(spec\.)?ts$/,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: baseUrl,
    trace: 'on-first-retry',
    testIdAttribute: 'data-test-id',
    locale: 'en-GB',
    timezoneId: 'Europe/Paris',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'gfx.webrender.force-disabled': true,
            'gfx.x11-egl.force-disabled': true,
            'media.hardware-video-decoding.enabled': false,
            'layers.acceleration.disabled': true,
          },
        },
      },
    },
  ],

  ...(useWebServer && {
    webServer: {
      command: 'npm run preview',
      url: 'http://localhost:5050',
      reuseExistingServer: !isCI,
    },
  }),
});
