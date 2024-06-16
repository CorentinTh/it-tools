<script setup lang="ts">
import {
  toAnsible, toAnsibleWarn, toCFML, toCFMLWarn, toCSharp, toCSharpWarn,
  toClojure, toClojureWarn, toDart, toDartWarn, toElixir, toElixirWarn, toGo, toGoWarn,
  toHTTP, toHTTPWarn, toHarString, toHarStringWarn, toHttpie, toHttpieWarn, toJava, toJavaHttpUrlConnection,
  toJavaHttpUrlConnectionWarn, toJavaJsoup, toJavaJsoupWarn, toJavaOkHttp, toJavaOkHttpWarn,
  toJavaScript, toJavaScriptJquery, toJavaScriptJqueryWarn, toJavaScriptWarn, toJavaScriptXHR, toJavaScriptXHRWarn,
  toJavaWarn, toJsonString, toJsonStringWarn, toJulia, toJuliaWarn, toKotlin, toKotlinWarn, toLua, toLuaWarn,
  toMATLAB, toMATLABWarn, toNode, toNodeAxios, toNodeAxiosWarn, toNodeGot, toNodeGotWarn, toNodeHttp, toNodeHttpWarn,
  toNodeKy, toNodeKyWarn, toNodeRequest, toNodeRequestWarn, toNodeSuperAgent, toNodeSuperAgentWarn, toNodeWarn,
  toOCaml, toOCamlWarn, toObjectiveC, toObjectiveCWarn, toPerl, toPerlWarn, toPhp, toPhpGuzzle, toPhpGuzzleWarn,
  toPhpRequests, toPhpRequestsWarn, toPhpWarn, toPowershellRestMethod, toPowershellRestMethodWarn,
  toPowershellWebRequest, toPowershellWebRequestWarn, toPython, toPythonHttp, toPythonHttpWarn, toPythonWarn, toR,
  toRWarn, toRuby, toRubyWarn, toRust, toRustWarn, toSwift, toSwiftWarn, toWget, toWgetWarn,
} from 'curlconverter';

const translate = {
  'ansible': [toAnsible, toAnsibleWarn],
  'cfml': [toCFML, toCFMLWarn],
  'clojure': [toClojure, toClojureWarn],
  'csharp': [toCSharp, toCSharpWarn],
  'c#': [toCSharp, toCSharpWarn],
  'browser': [toJavaScript, toJavaScriptWarn],
  'dart': [toDart, toDartWarn],
  'elixir': [toElixir, toElixirWarn],
  'go': [toGo, toGoWarn],
  'golang': [toGo, toGoWarn],
  'har': [toHarString, toHarStringWarn],
  'http': [toHTTP, toHTTPWarn],
  'httpie': [toHttpie, toHttpieWarn],
  'java': [toJava, toJavaWarn],
  'java-httpurlconnection': [
    toJavaHttpUrlConnection,
    toJavaHttpUrlConnectionWarn,
  ],
  'java-jsoup': [toJavaJsoup, toJavaJsoupWarn],
  'java-okhttp': [toJavaOkHttp, toJavaOkHttpWarn],
  'javascript': [toJavaScript, toJavaScriptWarn],
  'javascript-axios': [toNodeAxios, toNodeAxiosWarn],
  'javascript-fetch': [toJavaScript, toJavaScriptWarn],
  'javascript-got': [toNodeGot, toNodeGotWarn],
  'javascript-ky': [toNodeKy, toNodeKyWarn],
  'javascript-jquery': [toJavaScriptJquery, toJavaScriptJqueryWarn],
  'javascript-request': [toNodeRequest, toNodeRequestWarn],
  'javascript-superagent': [toNodeSuperAgent, toNodeSuperAgentWarn],
  'javascript-xhr': [toJavaScriptXHR, toJavaScriptXHRWarn],
  'json': [toJsonString, toJsonStringWarn],
  'julia': [toJulia, toJuliaWarn],
  'kotlin': [toKotlin, toKotlinWarn],
  'lua': [toLua, toLuaWarn],
  'matlab': [toMATLAB, toMATLABWarn],
  'node': [toNode, toNodeWarn],
  'node-axios': [toNodeAxios, toNodeAxiosWarn],
  'node-fetch': [toNode, toNodeWarn],
  'node-got': [toNodeGot, toNodeGotWarn],
  'node-http': [toNodeHttp, toNodeHttpWarn],
  'node-ky': [toNodeKy, toNodeKyWarn],
  'node-jquery': [toJavaScriptJquery, toJavaScriptJqueryWarn],
  'node-request': [toNodeRequest, toNodeRequestWarn],
  'node-superagent': [toNodeSuperAgent, toNodeSuperAgentWarn],
  'node-xhr': [toJavaScriptXHR, toJavaScriptXHRWarn],
  'nodejs': [toNode, toNodeWarn],
  'nodejs-axios': [toNodeAxios, toNodeAxiosWarn],
  'nodejs-fetch': [toNode, toNodeWarn],
  'nodejs-got': [toNodeGot, toNodeGotWarn],
  'nodejs-http': [toNodeHttp, toNodeHttpWarn],
  'nodejs-ky': [toNodeKy, toNodeKyWarn],
  'nodejs-jquery': [toJavaScriptJquery, toJavaScriptJqueryWarn],
  'nodejs-request': [toNodeRequest, toNodeRequestWarn],
  'nodejs-superagent': [toNodeSuperAgent, toNodeSuperAgentWarn],
  'nodejs-xhr': [toJavaScriptXHR, toJavaScriptXHRWarn],
  'objc': [toObjectiveC, toObjectiveCWarn],
  'objectivec': [toObjectiveC, toObjectiveCWarn],
  'objective-c': [toObjectiveC, toObjectiveCWarn],
  'ocaml': [toOCaml, toOCamlWarn],
  'perl': [toPerl, toPerlWarn],
  'php': [toPhp, toPhpWarn],
  'php-curl': [toPhp, toPhpWarn],
  'php-guzzle': [toPhpGuzzle, toPhpGuzzleWarn],
  'php-requests': [toPhpRequests, toPhpRequestsWarn],
  'powershell': [toPowershellRestMethod, toPowershellRestMethodWarn],
  'powershell-restmethod': [
    toPowershellRestMethod,
    toPowershellRestMethodWarn,
  ],
  'powershell-webrequest': [
    toPowershellWebRequest,
    toPowershellWebRequestWarn,
  ],
  'python': [toPython, toPythonWarn],
  'python-http': [toPythonHttp, toPythonHttpWarn],
  'python-httpclient': [toPythonHttp, toPythonHttpWarn],
  'r': [toR, toRWarn],
  'ruby': [toRuby, toRubyWarn],
  'rust': [toRust, toRustWarn],
  'swift': [toSwift, toSwiftWarn],
  'wget': [toWget, toWgetWarn],
};

const language = ref('python');
const curl = ref('');
const inlang = computed(() => {
  return translate[language.value as (keyof typeof translate)][1](curl.value);
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="curl"
      size="large"
      placeholder="Your curl command"
      mb-3
    />

    <c-select
      v-model:value="language"
      searchable
      label="Language:"
      :options="Object.keys(translate)"
    />

    <n-divider />

    <n-form-item label="Curl language equivalent:">
      <TextAreaCopyable :value="inlang" />
    </n-form-item>
  </div>
</template>
