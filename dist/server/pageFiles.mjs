// Generatead by node/plugin/plugins/virtualFiles/index.ts

const pageFilesLazy = {};
const pageFilesEager = {};
const pageFilesExportNamesLazy = {};
const pageFilesExportNamesEager = {};
const pageFilesList = [];
const neverLoaded = {};
const isGeneratedFile = true;

const pageConfigs = [
];
const pageConfigGlobal = {
  ["onBeforeRoute"]: null,
  ["onPrerenderStart"]: null,
};

const pageFilesLazyIsomorph1 = /* #__PURE__ */ Object.assign({"/src/pages/404.page.vue": () => import('./entries/src_pages_404-page.mjs'),"/src/pages/Home.page.vue": () => import('./entries/src_pages_Home-page.mjs').then(n => n.H),"/src/ui/demo/demo-home.page.vue": () => import('./entries/src_ui_demo_demo-home-page.mjs').then(n => n.a)});
const pageFilesLazyIsomorph = {...pageFilesLazyIsomorph1};
pageFilesLazy['.page'] = pageFilesLazyIsomorph;
const pageFilesLazyServer1 = /* #__PURE__ */ Object.assign({});
const pageFilesLazyServer = {...pageFilesLazyServer1};
pageFilesLazy['.page.server'] = pageFilesLazyServer;
const pageFilesEagerRoute1 = /* #__PURE__ */ Object.assign({});
const pageFilesEagerRoute = {...pageFilesEagerRoute1};
pageFilesEager['.page.route'] = pageFilesEagerRoute;
const pageFilesExportNamesEagerClient1 = /* #__PURE__ */ Object.assign({});
const pageFilesExportNamesEagerClient = {...pageFilesExportNamesEagerClient1};
pageFilesExportNamesEager['.page.client'] = pageFilesExportNamesEagerClient;

export { isGeneratedFile, neverLoaded, pageConfigGlobal, pageConfigs, pageFilesEager, pageFilesExportNamesEager, pageFilesExportNamesLazy, pageFilesLazy, pageFilesList };
