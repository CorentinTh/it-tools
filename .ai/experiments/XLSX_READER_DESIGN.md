# XLSX Spreadsheet Reader Feasibility and Design

Decision date: 2026-08-16

## Decision

Proceed with a deliberately narrow, local, read-only XLSX surface. The accepted
implementation does not use a general spreadsheet engine or a general ZIP
package. It combines a repository-owned bounded ZIP reader, the browser's
native `DecompressionStream('deflate-raw')`, and exact zero-dependency MIT
`saxen@11.1.1` inside one disposable route-owned worker.

This is a reader for macro-free SpreadsheetML metadata and one selected
worksheet page. It is not Excel emulation, formula evaluation, workbook
conversion, editing, style rendering, or whole-workbook export.

## Candidate review

| Candidate | Observed package surface | Decision |
|---|---:|---|
| `read-excel-file@9.3.10` | MIT; about 2.47 MB unpacked; browser path expands XML parts through `fflate` before parsing | Rejected because its broad unzip-first memory shape does not provide the required application-owned ZIP-bomb boundary |
| `@zip.js/zip.js@2.8.51` | BSD-3-Clause; about 6.65 MB unpacked; zero dependencies | Rejected for the first release because the robust general ZIP surface is substantially broader than the seven bounded OOXML parts required here |
| `exceljs@4.4.0` | MIT; about 21.83 MB unpacked; broad ZIP/archive/UUID/temp dependencies | Rejected for payload, dependency, and spreadsheet-engine scope |
| SheetJS `xlsx` | Apache-2.0; npm channel remains at 0.18.5 while official distribution documents 0.20.3 through a separate CDN | Rejected because the broad multi-format engine and split distribution/update channel are unnecessary for this bounded reader |
| `fflate@0.8.3` | MIT; about 797 kB unpacked | Rejected as an additional decompressor because supported browsers already expose bounded streaming DEFLATE; ZIP policy would still remain application-owned |
| `fast-xml-parser@5.11.0` | MIT; about 1.29 MB unpacked plus dependencies | Rejected because tree construction and the package surface are unnecessary for selected-part streaming callbacks |
| `@xmldom/xmldom@0.9.11` | MIT; about 416 kB unpacked | Rejected because DOM materialization is a worse fit for attacker-controlled bounded XML and the package has recent serializer advisories, even though this use would be parse-only |
| `saxen@11.1.1` | MIT; about 160 kB unpacked, about 2.6 kB min+gzip upstream claim, zero dependencies | Accepted exact. Namespace-aware SAX callbacks keep workbook, relationship, shared-string, and worksheet processing narrow and worker-local |

No implementation code was copied from upstream IT Tools pull requests. Issues
and pull requests supplied requirements only.

## Delivered scope

- explicit local `.xlsx` selection followed by a separate Inspect action;
- macro-free workbook/package validation and metadata;
- visible/hidden/veryHidden sheet inventory and supported worksheet selection;
- 1900/1904 date-system metadata, with stored serials kept raw;
- one selected page: at most 200 rows by 32 columns;
- stored scalar lexemes, inline strings, shared strings, booleans, errors, and
  cached formula results;
- formula count and missing-cached-result disclosure; formulas are never
  evaluated or returned as export content;
- conservative selected-page JSON and CSV copy/download, with `_row` identity
  and spreadsheet-formula prefix protection in CSV;
- external-link declaration count without reading or fetching external parts.

Excluded: `.xls`, `.xlsm`, macros, macro sheets, encrypted packages, ZIP64,
non-UTF-8 XML, styles/number-format interpretation, date inference, images,
charts, pivots, comments, embedded objects, data connections, external-link
resolution, formula execution, editing, and whole-workbook export.

## ZIP and decompression boundary

The archive reader scans only the bounded end-of-central-directory suffix and
then the declared central directory. It requires one disk, a central directory
contiguous with EOCD, at most 512 entries, a 2 MiB central directory, safe
UTF-8/ASCII paths, unique names, matching local/central names and methods, and
non-overlapping local/data ranges. Split archives, ZIP64 sentinels/extras,
encryption/masking, unsafe paths, and unsupported compression methods for
required parts are rejected.

Required stored or DEFLATE parts are read from `Blob.slice()` ranges. Streaming
DEFLATE output cannot exceed the entry's declaration, its part limit, or the
32 MiB aggregate required-part budget. The final byte count and CRC-32 must
match central-directory metadata before XML parsing. A 32 MiB file limit also
bounds local-header and unprocessed package storage. Inspection does not inflate
worksheets, shared strings, styles, images, or other optional parts.

## XML and OOXML boundary

Only fatal UTF-8 decode is accepted. DTDs, entity declarations, XML stylesheets,
NUL bytes, and processing instructions other than one initial XML declaration
are rejected. The SAX layer caps depth at 32, elements at 400,000, attributes
at 32 per element, attributes at 8 KiB, relationships at 512, sheets at 128,
shared strings at 200,000, and individual stored cell/formula strings at 4 KiB.
Only the five predefined XML entities and valid numeric character references
are decoded.

OPC relationship targets are normalized inside the package root. Encoded path
separators, traversal above root, schemes, query/fragment targets, duplicates,
missing required parts, and ambiguous workbook relationships are rejected.
External relationships are counted but never normalized into a fetch path.
The workbook content type must be the macro-free SpreadsheetML main type, and
VBA/macro-sheet parts or relationships cause rejection.

## Memory, lifecycle, and privacy

The application never calls `arrayBuffer()` on the complete file. Central
metadata and each required bounded part are materialized independently in the
worker. Preview requires only the selected worksheet and referenced entries
from the bounded shared-string table. UI output is capped at 512 KiB and each
JSON/CSV representation at 1 MiB.

Every Inspect or Preview creates a worker that is terminated after success,
failure, cancellation, replacement, timeout, Clear, or route disposal. The
deadline is 15 seconds. File bytes, filename, workbook metadata, preview, and
exports remain session-only and are absent from URL/history, local/session
storage, network requests, analytics, application logs, and static error text.

## Measured result

- exact new runtime dependency: `saxen@11.1.1`;
- production worker: 29,240 B raw / 10,717 B gzip;
- full additional route closure: 135,961 B raw / 47,458 B gzip;
- artifact delta from Parquet checkpoint: +3 files / +51,035 B raw /
  +17,925 B gzip;
- shell and mandatory Workbox delta: +1,668 B raw / +236 B gzip;
- final artifact: 642 files / 18,151,938 B raw / 5,303,777 B gzip;
- shell including document: 844,594 B raw / 247,458 B gzip;
- mandatory Workbox: 9 files / 898,442 B raw / 297,820 B gzip, leaving
  101,558 B raw headroom;
- build: 24,163 transformed modules;
- audit: zero advisory paths through `saxen`; 57 unrelated existing production
  findings remain in the separately deferred dependency-security track.

## Acceptance evidence

- zero-warning full lint and dual-project typecheck;
- 1,417/1,417 unit tests across 245 files;
- ZIP traversal/duplicate/encryption/ZIP64/overlap, CRC, declared-DEFLATE,
  macro, DTD/entity/processing-instruction, exact-large-integer, shared-string,
  cached-formula, CSV-protection, protocol, and generic worker-lifecycle tests;
- 16/16 build-stat infrastructure tests and 404/404 artifact-budget checks;
- 2/2 Chromium source-dev XLSX privacy/layout/lifecycle scenarios against
  verified `127.0.0.1:8091` with `Cache-Control: no-store`,
  `X-IT-Tools-Mode: development`, `/@vite/client`, and `/src/main.ts`;
- all 129 registry routes pass sequential desktop/mobile, light/dark,
  accessible-control, overflow, runtime, and chunk-load smoke in 5.2 minutes.

Chromium is the measured feature acceptance browser. Other engines use explicit
capability detection for raw-DEFLATE; broad cross-browser XLSX compatibility is
not claimed.

## Primary references

- ECMA-376 Office Open XML: https://ecma-international.org/publications-and-standards/standards/ecma-376/
- Microsoft Open Packaging Conventions overview: https://learn.microsoft.com/previous-versions/windows/desktop/opc/open-packaging-conventions-overview
- PKWARE ZIP AppNote: https://support.pkware.com/pkzip/appnote
- MDN `DecompressionStream`: https://developer.mozilla.org/docs/Web/API/DecompressionStream
- `saxen`: https://github.com/nikku/saxen
- `read-excel-file`: https://github.com/catamphetamine/read-excel-file
- `exceljs`: https://github.com/exceljs/exceljs
- SheetJS installation guidance: https://docs.sheetjs.com/docs/getting-started/installation/
- `zip.js`: https://github.com/gildas-lormeau/zip.js
- `fflate`: https://github.com/101arrowz/fflate
