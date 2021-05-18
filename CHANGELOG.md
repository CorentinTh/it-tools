# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Next
### Changed
- Switched to [Nuxt.js](//nuxtjs.org)
- Switched to Typescript using class components decorators from [nuxt-property-decorator](https://github.com/nuxt-community/nuxt-property-decorator)
- UI and theme reworked
- URL path changed
    - `/hash` -> [`/hash-text`](https://it-tools.tech/hash-text)
    - `/cypher` -> [`/cypher-uncyfer-text`](https://it-tools.tech/cypher-uncyfer-text)
- [Crontab generator](https://it-tools.tech/crontab-generator) now handle 6 digits format (second support)  

### Added
- Added [/how-to-report-bug-or-request](/how-to-report-bug-or-request) route to explain how to report bug and request features
- Added i18n support
- Added new tools
  - [Random port generator](https://it-tools.tech/random-port-generator)

### Removed
- Removed markdown editor

## 1.7.0
- [feat] [Crontab friendly generator](https://it-tools.tech/crontab-generator)

## 1.6.0
- [feat] [BIP39 generator](https://it-tools.tech/bip39-generator)
- [feat] [Base 64 converter](https://it-tools.tech/base64-string-converter)

## 1.5.2
- [feat] [humans.txt](https://it-tools.tech/humans.txt)
- [feat] pwa auto update on new changes

## 1.5.1
- [feat] switched back to history mode (no more '#' in url)

## 1.5.0
- [feat] added [qr-code generator](https://it-tools.tech/qrcode-generator)

## 1.4.0
- [ui] condensed + colored sidenav
- [feat] added [git memo](https://it-tools.tech/git-memo)
- [refactor] changed app title

## 1.3.0
- [fix] [GithubContributors] ordered contributors by contribution count
- [refactor] used vue-typecasting for number inputs
- [feat] lazy loading tools routes
- [feat] added [markdown editor](https://it-tools.tech/markdown-editor)
- [feat] added [lorem ipsum generator](https://it-tools.tech/lorem-ipsum-generator)

## 1.2.1
- [fix] [UuidGenerator] added quantity validation rules
- [refactor] better isInt checker

## 1.2.0
- [feat] [UuidGenerator] can generate multiple uuids 

## 1.1.0
- [feat] 404 route + page
- [feat] changelog in the About page 
- [feat] contributors list in the About page 
- [fix] [ColorConverter] color picker now updates fields 

## 1.0.1
- [chore] added changelog
- [fix] [BaseConverter] prevented non-integer bases
- [fix] remove history move (incompatible with vercel.com)

## 1.0.0
- First release
