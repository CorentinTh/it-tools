![logo](.github/logo.png)

Aggregated set of useful tools that every developer may need once in a while. Available [here](https://it-tools.tech).

## Functionalities roadmap
Here is an unordered list of the current functionalities, and some that may come. 

- [x] Token generator
- [x] Uuid generator
- [x] String hash
- [x] Text encryption
- [x] Date format converter
- [x] Int base converter
- [x] Color format converter
- [x] Url encoder
- [x] Base 64 generator
- [x] Text information
- [x] Markdown editor
- [x] Lorem ipsum text generator
- [x] Git memo (cheat sheet)
- [x] QR code generator
- [x] Bip39 pass-phrase generator
- [x] Base 64 string converter
- [x] Crontab friendly generator
- [ ] CSS memo (cheat sheet)
- [x] REGEX memo (cheat sheet) + tester?
- [ ] Minify/un-minify
- [ ] Image exif editor/remover
- [ ] Image format converter?
- [ ] Image cropper 
- [ ] Image resizer 
- [ ] HTTP client (w/ axios + cors proxy)
- [ ] Math expression evaluator
- [ ] Math expression graph

You have an idea of a tool? Submit a feature request!

## Project setup
Install dependencies by running the following command:
```shell
npm install
```

Then compiles and hot-reloads for development:
```shell
npm run serve
```

And to lint and fixe files, run:
```shell
npm run lint
```

## Contribute
**Pull requests are welcome !** Feel free to contribute.

### Add a tool
To add a tool you just have to create a vue component in [src/routes/tools](./src/routes/tools), example:
```vue
<template>
    <v-card class="single-card">
        <v-card-title>My component</v-card-title>
        <v-card-text>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: "My component"
    }
</script>

<style scoped lang="less">
</style>
```

Then, update the file [router.js](./src/router.js) specifying info of the component.
Use [fontawesome 5](https://fontawesome.com/icons?d=gallery&m=free) for icons.

## Credits
Coded with ❤️ by [Corentin Thomasset](//corentin-thomasset.fr).

This project is continuously deployed using [vercel.com](https://vercel.com).

## License
This project is under the [MIT license](LICENSE).
