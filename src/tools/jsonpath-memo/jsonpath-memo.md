## Syntax

Depending on the client used JSONPath expressions do start with `$.` indicating the root element.
Some clients omit the leading `$.`.

| Syntax | Description |
| ------ | :--------- |
| `$.store.book[0].title` | |              
| `store.book[0].title` | With implicit `$.` |
| `$['store']['book'][0]['title']` | Alternative notation similar to scripting languages |

## Tree Traversal

| Syntax | Description |
| ------ | :--------- |
| `$.parentNode.childNode.field`       | XPath: `/parentNode/childNode/@field` (content of "field" of all "childNode"s of "parentNode") |
| `$..anyChildNode`                    | XPath: `//anyChildNode` (all children at any depth named "anyChildNode") |
| `$.parentNode.*`                     | XPath: `/parentNode/*` (all children below) |

## Array Access

| Syntax | Description |
| ------ | :--------- |
| `$.myList[0]` | first element |
| `$.myList[-1]` | last element |
| `$.myList[2:3]` | range |
| `$.myList[0,4,5]` | selection |

## Filtering

| Syntax | Description |
| ------ | :--------- |
| `$.customer[?(@.car)]` |                       Only "customer"s that have attribute "car" |
| `$.customer[?(@.car == 'Ford Fiesta')]` |      Only "customer"s with "Ford Fiesta"s |
| `$.customer[?(@.age > 18)]` |                  Only adults |

## Complex Conditions

| Syntax | Description |
| ------ | :--------- |
| `$.customer[?(@.age > 18 \|\| @.car == 'Ford Fiesta')]` |     logical or |
| `$.customer[?(@.age < 18 && @.hobby == 'Biking' )]` |       logical and |

## Output Mapping

| Syntax | Description |
| ------ | :--------- |
| `$.[].{Name:name, Age:age, Hobbies:details.hobbies}` | Mapping fields/nested fields to new set

## Credits

Original author: https://gist.github.com/mackoj/5786f8b95da0a82e8e003f444c4295bf