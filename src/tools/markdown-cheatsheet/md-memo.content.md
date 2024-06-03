---
layout: default
title: Markdown Cheat Sheet
description: A quick reference to the Markdown syntax.
last_modified_at: 2021-12-05
---

## Overview

This Markdown cheat sheet provides a quick overview of all the Markdown syntax elements. It can't cover every edge case, so if you need more information about any of these elements, refer to the reference guides for <n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/">basic-syntax</n-a> and <n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/">extended-syntax</n-a>.

## Basic Syntax

These are the elements outlined in John Gruber's original design document. All Markdown applications support these elements.

<n-table :single-line="false">
  <thead>
    <tr>
      <th>Element</th>
      <th>Markdown Syntax</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#headings">Heading</n-a></td>
      <td><code># H1<br>
          ## H2<br>
          ### H3</code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#bold">Bold</n-a></td>
      <td><code>**bold text**</code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#italic">Italic</n-a></td>
      <td><code>*italicized text*</code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#blockquotes-1">Blockquote</n-a></td>
      <td><code>> blockquote</code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#ordered-lists">Ordered List</n-a></td>
      <td><code>
        1. First item<br>
        2. Second item<br>
        3. Third item<br>
      </code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#unordered-lists">Unordered List</n-a></td>
      <td>
        <code>
          - First item<br>
          - Second item<br>
          - Third item<br>
        </code>
      </td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#code">Code</n-a></td>
      <td><code>`code`</code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#horizontal-rules">Horizontal Rule</n-a></td>
      <td><code>---</code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#links">Link</n-a></td>
      <td><code>[title](https://www.example.com)</code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/basic-syntax/#images-1">Image</n-a></td>
      <td><code>![alt text](image.jpg)</code></td>
    </tr>
  </tbody>
</n-table>

## Extended Syntax

These elements extend the basic syntax by adding additional features. Not all Markdown applications support these elements.

<n-table :single-line="false">
  <thead>
    <tr>
      <th>Element</th>
      <th>Markdown Syntax</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#tables">Table</n-a></td>
      <td><code>
          | Syntax      | Description |<br>
          | ----------- | ----------- |<br>
          | Header      | Title       |<br>
          | Paragraph   | Text        |
      </code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#fenced-code-blocks">Fenced Code Block</n-a></td>
      <td><code>```<br>
      {<br>
      &nbsp;&nbsp;"firstName": "John",<br>
      &nbsp;&nbsp;"lastName": "Smith",<br>
      &nbsp;&nbsp;"age": 25<br>
      }<br>
      ```
      </code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#footnotes">Footnote</n-a></td>
      <td><code>
        Here's a sentence with a footnote. [^1]<br><br>
        [^1]: This is the footnote.
      </code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#heading-ids">Heading ID</n-a></td>
      <td><code>### My Great Heading {#custom-id}</code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#definition-lists">Definition List</n-a></td>
      <td><code>
        term<br>
        : definition
      </code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#strikethrough">Strikethrough</n-a></td>
      <td><code>~~The world is flat.~~</code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#task-lists">Task List</n-a></td>
      <td><code>
        - [x] Write the press release<br>
        - [ ] Update the website<br>
        - [ ] Contact the media
      </code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#emoji">Emoji</n-a><br>(see also <n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#copying-and-pasting-emoji">Copying and Pasting Emoji</n-a>)</td>
      <td><code>
        That is so funny! :joy:
      </code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#highlight">Highlight</n-a></td>
      <td><code>
        I need to highlight these ==very important words==.
      </code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#subscript">Subscript</n-a></td>
      <td><code>
        H~2~O
      </code></td>
    </tr>
    <tr>
      <td><n-a target="_blank" href="https://www.markdownguide.org/extended-syntax/#superscript">Superscript</n-a></td>
      <td><code>
        X^2^
      </code></td>
    </tr>
  </tbody>
</n-table>