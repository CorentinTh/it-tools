| Selector              | Example                 | Example   description                                                                                    |
|-----------------------|-------------------------|----------------------------------------------------------------------------------------------------------|
| `.class`              | `.intro`                | Selects all elements with   class="intro"                                                                |
| `.class1.class2`      | `.name1.name2`          | Selects all elements with   both name1 and name2 set within its class attribute                          |
| `.class1   .class2`   | `.name1 .name2`         | Selects all elements   with name2 that is a descendant of an element with name1                          |
| `#id`                 | `#firstname`            | Selects the element with   id="firstname"                                                                |
| `*`                   | `*`                     | Selects all elements                                                                                     |
| `element`             | `p`                     | Selects all \<p\> elements                                                                                 |
| `element.class`       | `p.intro`               | Selects all \<p\> elements   with class="intro"                                                            |
| `element,element`     | `div, p`                | Selects all \<div\> elements   and all \<p\> elements                                                        |
| `element element`     | `div p`                 | Selects all \<p\> elements   inside \<div\> elements                                                         |
| `element>element`     | `div > p`               | Selects all \<p\> elements   where the parent is a \<div\> element                                           |
| `element+element`     | `div + p`               | Selects the first \<p\>   element that is placed immediately after \<div\> elements                          |
| `element1~element2`   | `p ~ ul`                | Selects every \<ul\> element   that is preceded by a \<p\> element                                           |
| `[attribute]`         | `[target]`              | Selects all elements with a target   attribute                                                           |
| `[attribute=value]`   | `[target="_blank"]`     | Selects all elements with   target="_blank"                                                              |
| `[attribute~=value]`  | `[title~="flower"]`     | Selects all elements with a title   attribute containing the word "flower"                               |
| `[attribute\|=value]` | `[lang\|="en"]`         | Selects all elements with a lang   attribute value equal to "en" or starting with "en-"                  |
| `[attribute^=value]`  | `a[href^="https"]`      | Selects every \<a\> element   whose href attribute value begins with "https"                               |
| `[attribute$=value]`  | `a[href$=".pdf"]`       | Selects every \<a\> element   whose href attribute value ends with ".pdf"                                  |
| `[attribute*=value]`  | `a[href*="w3schools"]`  | Selects every \<a\> element   whose href attribute value contains the substring "w3schools"                |
| `:active`             | `a:active`              | Selects the active link                                                                                  |
| `::after`             | `p::after`              | Insert something after the content   of each \<p\> element                                                 |
| `::before`            | `p::before`             | Insert something before the   content of each \<p\> element                                                |
| `:checked`            | `input:checked`         | Selects every checked   \<input\> element                                                                  |
| `:default`            | `input:default`         | Selects the default \<input\>   element                                                                    |
| `:disabled`           | `input:disabled`        | Selects every disabled   \<input\> element                                                                 |
| `:empty`              | `p:empty`               | Selects every \<p\> element   that has no children (including text nodes)                                  |
| `:enabled`            | `input:enabled`         | Selects every enabled   \<input\> element                                                                  |
| `:first-child`        | `p:first-child`         | Selects every \<p\> element   that is the first child of its parent                                        |
| `::first-letter`      | `p::first-letter`       | Selects the first letter of every   \<p\> element                                                          |
| `::first-line`        | `p::first-line`         | Selects the first line of every   \<p\> element                                                            |
| `:first-of-type`      | `p:first-of-type`       | Selects every \<p\> element   that is the first \<p\> element of its parent                                  |
| `:focus`              | `input:focus`           | Selects the input element which   has focus                                                              |
| `:fullscreen`         | `:fullscreen`           | Selects the element that is in   full-screen mode                                                        |
| `:has()`              | `h2:has(+p)`            | Selects h2 elements that are   immediately followed by a p element, and applies the style to h2          |
| `:hover`              | `a:hover`               | Selects links on mouse over                                                                              |
| `:in-range`           | `input:in-range`        | Selects input elements with a   value within a specified range                                           |
| `:indeterminate`      | `input:indeterminate`   | Selects input elements that are in   an indeterminate state                                              |
| `:invalid`            | `input:invalid`         | Selects all input elements with an   invalid value                                                       |
| `:lang()`             | `p:lang(it)`            | Selects every \<p\> element   with a lang attribute equal to "it" (Italian)                                |
| `:last-child`         | `p:last-child`          | Selects every \<p\> element   that is the last child of its parent                                         |
| `:last-of-type`       | `p:last-of-type`        | Selects every \<p\> element   that is the last \<p\> element of its parent                                   |
| `:link`               | `a:link`                | Selects all unvisited links                                                                              |
| `::marker`            | `::marker`              | Selects the markers of list items                                                                        |
| `:not()`              | `:not(p)`               | Selects every element that is not   a \<p\> element                                                        |
| `:nth-child()`        | `p:nth-child(2)`        | Selects every \<p\> element   that is the second child of its parent                                       |
| `:nth-last-child()`   | `p:nth-last-child(2)`   | Selects every \<p\> element   that is the second child of its parent, counting from the last child         |
| `:nth-last-of-type()` | `p:nth-last-of-type(2)` | Selects every \<p\> element   that is the second \<p\> element of its parent, counting from the last   child |
| `:nth-of-type()`      | `p:nth-of-type(2)`      | Selects every \<p\> element   that is the second \<p\> element of its parent                                 |
| `:only-of-type`       | `p:only-of-type`        | Selects every \<p\> element   that is the only \<p\> element of its parent                                   |
| `:only-child`         | `p:only-child`          | Selects every \<p\> element   that is the only child of its parent                                         |
| `:optional`           | `input:optional`        | Selects input elements with no   "required" attribute                                                    |
| `:out-of-range`       | `input:out-of-range`    | Selects input elements with a   value outside a specified range                                          |
| `::placeholder`       | `input::placeholder`    | Selects input elements with the   "placeholder" attribute specified                                      |
| `:read-only`          | `input:read-only`       | Selects input elements with the   "readonly" attribute specified                                         |
| `:read-write`         | `input:read-write`      | Selects input elements with the   "readonly" attribute NOT specified                                     |
| `:required`           | `input:required`        | Selects input elements with the   "required" attribute specified                                         |
| `:root`               | `:root`                 | Selects the document's root   element                                                                    |
| `::selection`         | `::selection`           | Selects the portion of an element   that is selected by a user                                           |
| `:target`             | `#news:target`          | Selects the current active #news   element (clicked on a URL containing that anchor name)                |
| `:valid`              | `input:valid`           | Selects all input elements with a   valid value                                                          |
| `:visited`            | `a:visited`             | Selects all visited links                                                                                |