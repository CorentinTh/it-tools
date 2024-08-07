<script setup lang="ts">
import { XmlParser, Xslt } from 'xslt-processor';
import { formatXml } from '../xml-formatter/xml-formatter.service';
import { useValidation } from '@/composable/validation';

const xslt = ref(`<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
  <html>
  <body>
    <h2>My CD Collection</h2>
    <table border="1">
      <tr bgcolor="#9acd32">
        <th>Title</th>
        <th>Artist</th>
      </tr>
      <tr>
        <td>.</td>
        <td>.</td>
      </tr>
    </table>
  </body>
  </html>
</xsl:template>
</xsl:stylesheet>`);
const xmlInput = ref(`<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <cd>
    <title>Empire Burlesque</title>
    <artist>Bob Dylan</artist>
    <country>USA</country>
    <company>Columbia</company>
    <price>10.90</price>
    <year>1985</year>
  </cd>
  <cd>
    <title>Hide your heart</title>
    <artist>Bonnie Tyler</artist>
    <country>UK</country>
    <company>CBS Records</company>
    <price>9.90</price>
    <year>1988</year>
  </cd>
</catalog>`);

const formatted = ref(false);
const xmlOutput = computedAsync(async () => {
  const xmlString = xmlInput.value;
  const xsltString = xslt.value;
  const formatResult = formatted.value;

  const xsltProcessor = new Xslt();
  const xmlParser = new XmlParser();

  try {
    let xmlOutput = await xsltProcessor.xsltProcess(
      xmlParser.xmlParse(xmlString),
      xmlParser.xmlParse(xsltString),
    );
    if (formatResult) {
      xmlOutput = formatXml(xmlOutput);
    }
    return xmlOutput;
  }
  catch (e: any) {
    return e.toString();
  }
});

const xsltValidation = useValidation({
  source: xslt,
  rules: [
    {
      validator: (v) => {
        const xmlParser = new XmlParser();
        xmlParser.xmlParse(v);
        return true;
      },
      message: 'Provided XSLT is not valid.',
    },
  ],
});
const xmlInputValidation = useValidation({
  source: xmlInput,
  rules: [
    {
      validator: (v) => {
        const xmlParser = new XmlParser();
        xmlParser.xmlParse(v);
        return true;
      },
      message: 'Provided XML is not valid.',
    },
  ],
});
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Input" mb-2>
      <c-input-text
        v-model:value="xslt"
        label="XLST"
        multiline
        placeholder="Put your XSLT here..."
        rows="5"
        :validation="xsltValidation"
        mb-2
      />

      <c-input-text
        v-model:value="xmlInput"
        label="XML"
        multiline
        placeholder="Put your XML here..."
        rows="5"
        :validation="xmlInputValidation"
        mb-2
      />

      <n-checkbox v-model:checked="formatted">
        Format XML Output?
      </n-checkbox>
    </c-card>

    <c-card title="Output">
      <TextareaCopyable :value="xmlOutput" language="xml" />
    </c-card>
  </div>
</template>
