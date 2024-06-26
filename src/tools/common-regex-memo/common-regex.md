
### Commonly used Regex
 
#### 1\. Digits

* [Whole Numbers](https://www.regexpal.com/?fam=104020) – `/^\d+$/`
* [Decimal Numbers](https://www.regexpal.com/?fam=104021) – `/^\d*\.\d+$/`
* [Whole + Decimal Numbers](https://www.regexpal.com/?fam=104022) – `/^\d*(\.\d+)?$/`
* [Negative, Positive Whole + Decimal Numbers](https://www.regexpal.com/?fam=104023) – `/^-?\d*(\.\d+)?$/`
* [Whole + Decimal + Fractions](https://www.regexpal.com/94462) – `/[-]?[0-9]+[,.]?[0-9]*([\/][0-9]+[,.]?[0-9]*)*/`

#### 2\. Alphanumeric Characters

* [Alphanumeric without space](https://www.regexpal.com/?fam=104024) – `/^[a-zA-Z0-9]*$/`
* [Alphanumeric with space](https://www.regexpal.com/?fam=104025) – `/^[a-zA-Z0-9 ]*$/`

#### 3\. Email

* [Common email Ids](https://www.regexpal.com/?fam=104026) – `/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/`
* [Uncommon email ids](https://www.regexpal.com/?fam=104027) – `/^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/`

#### 4\. Password Strength

* [Complex](https://www.regexpal.com/?fam=104028): Should have 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long 

    /(?=(.\*\[0-9\]))(?=.\*\[\\!@#$%^&\*()\\\\\[\\\]{}\\-\_+=~\`|:;"'<>,./?\])(?=.\*\[a-z\])(?=(.\*\[A-Z\]))(?=(.\*)).{8,}/

* [Moderate](https://www.regexpal.com/?fam=104029): Should have 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 8 characters long

    /(?=(.\*\[0-9\]))((?=.\*\[A-Za-z0-9\])(?=.\*\[A-Z\])(?=.\*\[a-z\]))^.{8,}$/

#### 5\. Username

* [Alphanumeric string](https://www.regexpal.com/?fam=104030) that may include \_ and – having a length of 3 to 16 characters – `/^[a-z0-9_-]{3,16}$/`

#### 6\. URL

* Include [http(s) Protocol](https://www.regexpal.com/?fam=104034)

```
/https?:\\/\\/(www\\.)?\[-a-zA-Z0-9@:%.\_\\+~#=\]{2,256}\\.\[a-z\]{2,6}\\b(\[-a-zA-Z0-9@:%\_\\+.~#()?&//=\]\*)/
```

* [Protocol Optional](https://www.regexpal.com/?fam=104035)

```
/(https?:\\/\\/)?(www\\.)?\[-a-zA-Z0-9@:%.\_\\+~#=\]{2,256}\\.\[a-z\]{2,6}\\b(\[-a-zA-Z0-9@:%\_\\+.~#?&//=\]\*)/
```

#### 7\. IP Address

* [IPv4 address](https://www.regexpal.com/?fam=104036) 
```
/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
```
* [IPv6 address](https://www.regexpal.com/?fam=104037)
```
/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
```

* Both [IPv4, IPv6 addresses](https://www.regexpal.com/?fam=104038)
```
/((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/`
```

#### 8\. Dates

* Date Format [YYYY-MM-dd](https://www.regexpal.com/?fam=104039) using separator `-` 
`/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/`
* Date Format [dd-MM-YYYY](https://regexr.com/?346hf) using separators `-` or `.` or `/` 
`/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/`
* Date Format [dd-mmm-YYYY](https://regexr.com/39tr1) using separators `-` or `.` or `/` 
`/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/`
 
#### 9\. Time

* Time Format [HH:MM 12-hour](https://www.regexpal.com/?fam=104040), optional leading 0

`/^(0?[1-9]|1[0-2]):[0-5][0-9]$/`

* Time Format HH:MM 12-hour, optional leading 0, **[Meridiems (AM/PM)](https://www.regexpal.com/?fam=104041)**

`/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/`

* Time Format [HH:MM 24-hour](https://www.regexpal.com/?fam=104042) with leading 0

`/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/`

* Time Format [HH:MM 24-hour, optional leading 0](https://www.regexpal.com/?fam=104043)

`/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/`

* Time Format [HH:MM:SS 24-hour](https://www.regexpal.com/?fam=104044)

`/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/`

#### 10\. HTML Tags

* [Elements with Attributes](https://www.regexpal.com/95941) `/<\/?[\w\s]*>|<.+[\W]>/`

#### 11\. Javascript Handlers

* [Inline JS handler](https://www.regexpal.com/?fam=104055) `/\bon\w+=\S+(?=.*>)/`
* [Inline JS handler with element](https://www.regexpal.com/94641) `/(?:<[^>]+\s)(on\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/`

#### 12\. Slug

* [Slug](https://www.regexpal.com/?fam=104056) `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`

#### 13\. Match Duplicates in a String

* [Search Duplicates](https://www.regexpal.com/?fam=104060) `/(\b\w+\b)(?=.*\b\1\b)/`

#### 14\. Phone Numbers

* [International Phone Numbers](https://www.regexpal.com/?fam=99127) – with optional country code/extension
```
`/* International Phone Numbers */`
/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:``#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/
```

_Note:_ Use regex for validating phone numbers **only** if you don’t have the choice to use a library. There are [several libraries](https://stackoverflow.com/a/15644461/4717533) that handle phone numbers more accurately and should be used instead.

#### 15\. File Path

* [File Path with Filename and extension](https://www.regexpal.com/?fam=104047)

```
/((\\/|\\\\|\\/\\/|https?:\\\\\\\\|https?:\\/\\/)\[a-z0-9 \_@\\-^!#$%&+={}.\\/\\\\\\\[\\\]\]+)+\\.\[a-z\]+$/
```

* File Path with optional Filename, extension

```
/^(.+)/(\[^/\]+)$/
```

* [File Name with extension](https://www.regexpal.com/?fam=104048) having 3 chars

```
/^\[\\w,\\s-\]+\\.\[A-Za-z\]{3}$/
```

### Additional Regexes

#### 1\. Zip codes

There is **NO** single Regex that can handle all zip codes given that zip codes around the world do not follow a common pattern. Here is a [list](https://stackoverflow.com/a/7185241/4717533) that contains Regex specific to each country.

#### 2\. Payment Validation

Here is a [link](https://www.regular-expressions.info/creditcard.html) that contains regex for validating leading Credit cards like Visa, Mastercard and so on.

#### 3\. Identity Documents

* Social Security Number – [Ref](https://www.codeproject.com/Articles/651609/Validating-Social-Security-Numbers-through-Regular)

```
/\* can use either hypen(-) or space( ) character as separator \*/

/^((?!219-09-9999|078-05-1120)(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4})|((?!219 09 9999|078 05 1120)(?!666|000|9\\d{2})\\d{3} (?!00)\\d{2} (?!0{4})\\d{4})|((?!219099999|078051120)(?!666|000|9\\d{2})\\d{3}(?!00)\\d{2}(?!0{4})\\d{4})$/
```

* Passport – `/^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/`

#### References
* [https://www.codeproject.com/validate-passport-number](https://www.codeproject.com/Questions/1046445/How-to-validate-passport-number-using-javascript)
* [https://gist.github.com/](https://gist.github.com/nerdsrescueme/1237767)
* [https://code.tutsplus.com/regular-expressions](https://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149)
* [https://www.regular-expressions.info](https://www.regular-expressions.info/)
* [http://www.regexlib.com/](http://www.regexlib.com/)
* [https://projects.lukehaas.me/regexhub/](https://projects.lukehaas.me/regexhub/)
* [http://wiki.zoolz.com/commonly-used-regular-expressions/](http://wiki.zoolz.com/commonly-used-regular-expressions/)
* [https://www.smashingmagazine.com/advanced-regular-expressions/](https://www.smashingmagazine.com/2009/05/introduction-to-advanced-regular-expressions/)
