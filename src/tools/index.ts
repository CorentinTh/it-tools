import { tool as base64FileConverter } from './base64-file-converter';
import { tool as base64StringConverter } from './base64-string-converter';
import { tool as basicAuthGenerator } from './basic-auth-generator';
import { tool as emailNormalizer } from './email-normalizer';
import { tool as gzipConverter } from './gzip-converter';
import { tool as idnSafetyConverter } from './idn-safety-converter';
import { tool as httpRequestCodeBuilder } from './http-request-code-builder';
import { tool as aesGcmEnvelope } from './aes-gcm-envelope';
import { tool as devopsSecretHelper } from './devops-secret-helper';
import { tool as spdxLicenseGuidance } from './spdx-license-guidance';

import { tool as asciiTextDrawer } from './ascii-text-drawer';

import { tool as textToUnicode } from './text-to-unicode';
import { tool as safelinkDecoder } from './safelink-decoder';
import { tool as sensitiveDataMasker } from './sensitive-data-masker';
import { tool as markdownTableGenerator } from './markdown-table-generator';
import { tool as markdownDiff } from './markdown-diff';
import { tool as mermaidDiagram } from './mermaid-diagram';
import { tool as parquetReader } from './parquet-reader';
import { tool as xlsxReader } from './xlsx-reader';
import { tool as tabularDataInspector } from './tabular-data-inspector';
import { tool as xmlToJson } from './xml-to-json';
import { tool as jsonToXml } from './json-to-xml';
import { tool as regexTester } from './regex-tester';
import { tool as regexMemo } from './regex-memo';
import { tool as markdownToHtml } from './markdown-to-html';
import { tool as pdfSignatureChecker } from './pdf-signature-checker';
import { tool as numeronymGenerator } from './numeronym-generator';
import { tool as macAddressGenerator } from './mac-address-generator';
import { tool as textToBinary } from './text-to-binary';
import { tool as ulidGenerator } from './ulid-generator';
import { tool as ibanValidatorAndParser } from './iban-validator-and-parser';
import { tool as stringObfuscator } from './string-obfuscator';
import { tool as textDiff } from './text-diff';
import { tool as emojiPicker } from './emoji-picker';
import { tool as passwordStrengthAnalyser } from './password-strength-analyser';
import { tool as yamlToToml } from './yaml-to-toml';
import { tool as jsonToToml } from './json-to-toml';
import { tool as tomlToYaml } from './toml-to-yaml';
import { tool as tomlToJson } from './toml-to-json';
import { tool as jsonToCsv } from './json-to-csv';
import { tool as cameraRecorder } from './camera-recorder';
import { tool as barcodeGeneratorReader } from './barcode-generator-reader';
import { tool as faviconAppIconGenerator } from './favicon-app-icon-generator';
import { tool as imageMetadataRemover } from './image-metadata-remover';
import { tool as listConverter } from './list-converter';
import { tool as listComparison } from './list-comparison';
import { tool as phoneParserAndFormatter } from './phone-parser-and-formatter';
import { tool as jsonDiff } from './json-diff';
import { tool as ipv4RangeExpander } from './ipv4-range-expander';
import { tool as httpStatusCodes } from './http-status-codes';
import { tool as yamlToJson } from './yaml-to-json-converter';
import { tool as jsonToYaml } from './json-to-yaml-converter';
import { tool as ipv6UlaGenerator } from './ipv6-ula-generator';
import { tool as ipv6Calculator } from './ipv6-calculator';
import { tool as networkCalculationSuite } from './network-calculation-suite';
import { tool as dnsOverHttpsQuery } from './dns-over-https-query';
import { tool as ipv4AddressConverter } from './ipv4-address-converter';
import { tool as benchmarkBuilder } from './benchmark-builder';
import { tool as userAgentParser } from './user-agent-parser';
import { tool as ipv4SubnetCalculator } from './ipv4-subnet-calculator';
import { tool as dockerRunToDockerComposeConverter } from './docker-run-to-docker-compose-converter';
import { tool as htmlWysiwygEditor } from './html-wysiwyg-editor';
import { tool as rsaKeyPairGenerator } from './rsa-key-pair-generator';
import { tool as ed25519KeyWorkspace } from './ed25519-key-workspace';
import { tool as certificateInspector } from './certificate-inspector';
import { tool as samlEnterpriseInspector } from './saml-enterprise-inspector';
import { tool as textToNatoAlphabet } from './text-to-nato-alphabet';
import { tool as slugifyString } from './slugify-string';
import { tool as keycodeInfo } from './keycode-info';
import { tool as jsonMinify } from './json-minify';
import { tool as jsonRepairQuery } from './json-repair-query';
import { tool as jsonCodeGenerator } from './json-code-generator';
import { tool as bcrypt } from './bcrypt';
import { tool as argon2idHashVerify } from './argon2id-hash-verify';
import { tool as bip39 } from './bip39-generator';
import { tool as caseConverter } from './case-converter';
import { tool as chmodCalculator } from './chmod-calculator';
import { tool as chronometer } from './chronometer';
import { tool as colorConverter } from './color-converter';
import { tool as crontabGenerator } from './crontab-generator';
import { tool as cliCommandEditor } from './cli-command-editor';
import { tool as devopsConfigWorkspace } from './devops-config-workspace';
import { tool as developerTextWorkspace } from './developer-text-workspace';
import { tool as conventionalCommitHelper } from './conventional-commit-helper';
import { tool as localFileInspector } from './local-file-inspector';
import { tool as dateTimeConverter } from './date-time-converter';
import { tool as timezoneDurationCalculator } from './timezone-duration-calculator';
import { tool as deviceInformation } from './device-information';
import { tool as cypher } from './encryption';
import { tool as etaCalculator } from './eta-calculator';
import { tool as percentageCalculator } from './percentage-calculator';
import { tool as ieee754Inspector } from './ieee754-inspector';
import { tool as gitMemo } from './git-memo';
import { tool as fileHash } from './file-hash';
import { tool as hashText } from './hash-text';
import { tool as hmacGenerator } from './hmac-generator';
import { tool as htmlEntities } from './html-entities';
import { tool as baseConverter } from './integer-base-converter';
import { tool as jsonViewer } from './json-viewer';
import { tool as jsonSchemaValidator } from './json-schema-validator';
import { tool as jwtParser } from './jwt-parser';
import { tool as loremIpsumGenerator } from './lorem-ipsum-generator';
import { tool as mathEvaluator } from './math-evaluator';
import { tool as metaTagGenerator } from './meta-tag-generator';
import { tool as mimeTypes } from './mime-types';
import { tool as otpCodeGeneratorAndValidator } from './otp-code-generator-and-validator';
import { tool as qrCodeGenerator } from './qr-code-generator';
import { tool as qrDecoderOtpImport } from './qr-decoder-otp-import';
import { tool as wifiQrCodeGenerator } from './wifi-qr-code-generator';
import { tool as randomPortGenerator } from './random-port-generator';
import { tool as romanNumeralConverter } from './roman-numeral-converter';
import { tool as sqlPrettify } from './sql-prettify';
import { tool as svgPlaceholderGenerator } from './svg-placeholder-generator';
import { tool as temperatureConverter } from './temperature-converter';
import { tool as textStatistics } from './text-statistics';
import { tool as tokenGenerator } from './token-generator';
import { tool as passphraseGenerator } from './passphrase-generator';
import { tool as nanoidGenerator } from './nanoid-generator';
import { tool as mockDataGenerator } from './mock-data-generator';
import type { ToolCategory } from './tools.types';
import { tool as urlEncoder } from './url-encoder';
import { tool as urlParser } from './url-parser';
import { tool as uuidGenerator } from './uuid-generator';
import { tool as dataUnitsConverter } from './data-units-converter';
import { tool as raidStorageCalculator } from './raid-storage-calculator';
import { tool as dateCalendarUtilities } from './date-calendar-utilities';
import { tool as macAddressLookup } from './mac-address-lookup';
import { tool as xmlFormatter } from './xml-formatter';
import { tool as yamlViewer } from './yaml-viewer';
import { tool as unicodeGsmInspector } from './unicode-gsm-inspector';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Crypto',
    components: [tokenGenerator, passphraseGenerator, nanoidGenerator, uuidGenerator, ulidGenerator, hashText, fileHash, bcrypt, argon2idHashVerify, devopsSecretHelper, aesGcmEnvelope, cypher, bip39, hmacGenerator, rsaKeyPairGenerator, ed25519KeyWorkspace, certificateInspector, passwordStrengthAnalyser, pdfSignatureChecker],
  },
  {
    name: 'Converter',
    components: [
      dateTimeConverter,
      baseConverter,
      romanNumeralConverter,
      base64StringConverter,
      base64FileConverter,
      gzipConverter,
      idnSafetyConverter,
      colorConverter,
      caseConverter,
      textToNatoAlphabet,
      textToBinary,
      textToUnicode,
      yamlToJson,
      yamlToToml,
      jsonToYaml,
      jsonToToml,
      listConverter,
      tomlToJson,
      tomlToYaml,
      xmlToJson,
      jsonToXml,
      markdownToHtml,
    ],
  },
  {
    name: 'Web',
    components: [
      urlEncoder,
      htmlEntities,
      urlParser,
      deviceInformation,
      basicAuthGenerator,
      metaTagGenerator,
      otpCodeGeneratorAndValidator,
      mimeTypes,
      jwtParser,
      keycodeInfo,
      slugifyString,
      htmlWysiwygEditor,
      userAgentParser,
      httpStatusCodes,
      jsonDiff,
      safelinkDecoder,
      sensitiveDataMasker,
      httpRequestCodeBuilder,
    ],
  },
  {
    name: 'Images and videos',
    components: [qrCodeGenerator, qrDecoderOtpImport, wifiQrCodeGenerator, barcodeGeneratorReader, imageMetadataRemover, faviconAppIconGenerator, svgPlaceholderGenerator, cameraRecorder],
  },
  {
    name: 'Development',
    components: [
      gitMemo,
      conventionalCommitHelper,
      cliCommandEditor,
      devopsConfigWorkspace,
      developerTextWorkspace,
      spdxLicenseGuidance,
      markdownTableGenerator,
      mermaidDiagram,
      tabularDataInspector,
      localFileInspector,
      samlEnterpriseInspector,
      randomPortGenerator,
      crontabGenerator,
      jsonViewer,
      jsonSchemaValidator,
      jsonMinify,
      jsonRepairQuery,
      jsonCodeGenerator,
      jsonToCsv,
      sqlPrettify,
      chmodCalculator,
      dockerRunToDockerComposeConverter,
      xmlFormatter,
      yamlViewer,
      emailNormalizer,
      regexTester,
      regexMemo,
    ],
  },
  {
    name: 'Network',
    components: [ipv4SubnetCalculator, ipv4AddressConverter, ipv4RangeExpander, ipv6Calculator, networkCalculationSuite, dnsOverHttpsQuery, macAddressLookup, macAddressGenerator, ipv6UlaGenerator],
  },
  {
    name: 'Math',
    components: [mathEvaluator, ieee754Inspector, etaCalculator, percentageCalculator],
  },
  {
    name: 'Measurement',
    components: [chronometer, timezoneDurationCalculator, dateCalendarUtilities, temperatureConverter, dataUnitsConverter, raidStorageCalculator, benchmarkBuilder],
  },
  {
    name: 'Text',
    components: [
      mockDataGenerator,
      loremIpsumGenerator,
      textStatistics,
      listComparison,
      unicodeGsmInspector,
      markdownDiff,
      emojiPicker,
      stringObfuscator,
      textDiff,
      numeronymGenerator,
      asciiTextDrawer,
    ],
  },
  {
    name: 'Data',
    components: [parquetReader, xlsxReader, phoneParserAndFormatter, ibanValidatorAndParser],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) =>
  components.map(tool => ({ category: name, ...tool })),
);
