<picture>
    <source srcset="./.github/logo-dark.png" media="(prefers-color-scheme: light)">
    <source srcset="./.github/logo-white.png" media="(prefers-color-scheme: dark)">
    <img src="./.github/logo-dark.png" alt="logo">
</picture>

<p align="center">
Useful tools for developer and people working in IT. <a href="https://it-tools.tech">Try it!</a>
</p>

## Functionalities and roadmap

Please check the [issues](https://github.com/CorentinTh/it-tools/issues) to see if some feature listed to be implemented.

You have an idea of a tool? Submit a [feature request](https://github.com/CorentinTh/it-tools/issues/new/choose)!

## Self host

Self host solutions for your homelab

**From docker hub:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 corentinth/it-tools:latest
```

**From github packages:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 ghcr.io/corentinth/it-tools:latest
```

**Other solutions:**

- [Cloudron](https://www.cloudron.io/store/tech.ittools.cloudron.html)
- [Tipi](https://www.runtipi.io/docs/apps-available)
- [Unraid](https://unraid.net/community/apps?q=it-tools)

## Contribute

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) with the following extensions:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

with the following settings:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Create a new tool

To create a new tool, there is a script that generate the boilerplate of the new tool, simply run:

```sh
pnpm run script:create:tool my-tool-name
```

It will create a directory in `src/tools` with the correct files, and a the import in `src/tools/index.ts`. You will just need to add the imported tool in the proper category and develop the tool.

## Contributors

Big thanks to all the people who have already contributed!

[![contributors](https://contrib.rocks/image?repo=corentinth/it-tools&refresh=1)](https://github.com/corentinth/it-tools/graphs/contributors)

## Credits

Coded with ❤️ by [Corentin Thomasset](https://corentin.tech?utm_source=it-tools&utm_medium=readme).

This project is continuously deployed using [vercel.com](https://vercel.com).

Contributor graph is generated using [contrib.rocks](https://contrib.rocks/preview?repo=corentinth/it-tools).

<a href="https://www.producthunt.com/posts/it-tools?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-it&#0045;tools" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=345793&theme=light" alt="IT&#0032;Tools - Collection&#0032;of&#0032;handy&#0032;online&#0032;tools&#0032;for&#0032;devs&#0044;&#0032;with&#0032;great&#0032;UX | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
<a href="https://www.producthunt.com/posts/it-tools?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-it&#0045;tools" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=345793&theme=light&period=daily" alt="IT&#0032;Tools - Collection&#0032;of&#0032;handy&#0032;online&#0032;tools&#0032;for&#0032;devs&#0044;&#0032;with&#0032;great&#0032;UX | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## License

This project is under the [GNU GPLv3](LICENSE).


## 🌐 Web Resources & Interactive Index
- [BUBBLE SHOOTER REMASTERED](https://brainquestses.pages.dev/bubble-shooter-remastered.html)
- [ROPEWAY MASTER](https://eduquestspt.pages.dev/ropeway-master.html)
- [SHAPE SHIFTING](https://learnaction.netlify.app/shape-shifting.html)
- [GARAGE MASTER NUTS AND BOLTS](https://learnaction.netlify.app/garage-master-nuts-and-bolts.html)
- [CATEGORY IDLE448](https://learnaction.netlify.app/category-idle448.html)
- [CATEGORY DRIFTING116](https://learnaction.netlify.app/category-drifting116.html)
- [TINY FIGHTER UNSTOPPABLE RUN](https://brainquests.pages.dev/tiny-fighter-unstoppable-run.html)
- [CATEGORY CONTROLLER 3](https://brainquests.pages.dev/category-controller-3.html)
- [BOLTS UNSCREW IT](https://welearnaction.onrender.com/bolts-unscrew-it.html)
- [BOUNCY BLOB RACE OBSTACLE COURSE](https://brainquests.pages.dev/bouncy-blob-race-obstacle-course.html)
- [CATEGORY RACING127](https://welearnaction.onrender.com/category-racing127.html)
- [RAINBOW BALLS 2048](https://eduquests.netlify.app/rainbow-balls-2048.html)
- [SAVE THE BEAUTY](https://brainquests.pages.dev/save-the-beauty.html)
- [WEST FRONTIER SHARPSHOOTER 3D](https://brainquestsfr.pages.dev/west-frontier-sharpshooter-3d.html)
- [BIG BAD APE](https://quizzesarena.web.app/big-bad-ape.html)
- [POOL 8](https://welearnaction.onrender.com/pool-8.html)
- [CATEGORY BASKETBALL](https://eduquestkr.pages.dev/category-basketball.html)
- [CATEGORY SPOT THE DIFFERENCE](https://brainquests.pages.dev/category-spot-the-difference.html)
- [SPOT DIFFERENCES BIRD ADVENTURE](https://brainquestspt.pages.dev/spot-differences-bird-adventure.html)
- [PAPAS BURGER COOK](https://brainquestspt.pages.dev/papas-burger-cook.html)
- [APOCALYPSE SHELTER](https://eduquestses.pages.dev/apocalypse-shelter.html)
- [BRAWL BROS SQUAD](https://quizzesarena.web.app/brawl-bros-squad.html)
- [CARTOON MOTO STUNT](https://quizzesarena.onrender.com/cartoon-moto-stunt.html)
- [TURBO RACE](https://welearnaction.onrender.com/turbo-race.html)
- [ITALIAN BRAINROT FIND THE STARS](https://quizzesarena.onrender.com/italian-brainrot-find-the-stars.html)
- [DRAW BRIDGE CHALLENGE](https://quizzesarena.onrender.com/draw-bridge-challenge.html)
- [LOOP GHOST](https://eduquestkr.pages.dev/loop-ghost.html)
- [HARVESTING VEGGIES](https://learnaction.netlify.app/harvesting-veggies.html)
- [CATEGORY DRIFTING116](https://welearnaction.onrender.com/category-drifting116.html)
- [SNAKE IO](https://welearnaction.onrender.com/snake-io.html)
- [CATEGORY PROXY LIST](https://eduquestses.pages.dev/category-proxy-list.html)
- [UNLOCK THE BOLTS](https://eduquestkr.pages.dev/unlock-the-bolts.html)
- [CATEGORY 3 PLAYER26](https://quizzesarena.web.app/category-3-player26.html)
- [PET SALON 2](https://quizzesarena.web.app/pet-salon-2.html)
- [REAL MOTORBIKE SUPER HERO STUNT 3D](https://welearnaction.onrender.com/real-motorbike-super-hero-stunt-3d.html)
- [1945 AIR FORCE AIRPLANE](https://eduquestkr.pages.dev/1945-air-force-airplane.html)
- [CHESS ONLINE](https://eduquests.onrender.com/chess-online.html)
- [CATEGORY ROBOT49](https://brainquests.pages.dev/category-robot49.html)
- [CATEGORY ESCAPE 2](https://learnaction.netlify.app/category-escape-2.html)
- [CATEGORY AVOID295](https://eduquests.onrender.com/category-avoid295.html)
- [LABUBU JETPACK RUSH](https://brainquests.pages.dev/labubu-jetpack-rush.html)
- [CATEGORY IDLE](https://quizzesarena.web.app/category-idle.html)
- [DINO SHOOTER PRO](https://quizzesarena.web.app/dino-shooter-pro.html)
- [ESCAPE THE ALIEN PRISON](https://eduquestkr.pages.dev/escape-the-alien-prison.html)
- [BOMB HEAD HOT POTATO](https://brainquestspt.pages.dev/bomb-head-hot-potato.html)
- [ZEN MINI GAMES 2](https://eduquestses.pages.dev/zen-mini-games-2.html)
- [MONSTER TRUCK CRUSH](https://eduquestkr.pages.dev/monster-truck-crush.html)
- [SNAKE MASTERS](https://eduquestses.pages.dev/snake-masters.html)
- [THE SPECIMEN ZERO](https://brainquestspt.pages.dev/the-specimen-zero.html)
- [WORDMEISTER HD](https://brainquests.pages.dev/wordmeister-hd.html)
- [PET DOCTOR BUSINESS TYCOON PET CARE GAME](https://quizzesarena.onrender.com/pet-doctor-business-tycoon-pet-care-game.html)
- [2048 MAYHEMIO](https://quizzesarena.onrender.com/2048-mayhemio.html)
- [DRAGON HUNTER](https://eduquests.netlify.app/dragon-hunter.html)
- [UNPUZZLE MASTER](https://quizzesarena.onrender.com/unpuzzle-master.html)
- [BLOCKSSS](https://brainquests.pages.dev/blocksss.html)
- [BLOCK EATING SIMULATOR](https://eduquests.netlify.app/block-eating-simulator.html)
- [CATEGORY 3D1 383](https://welearnaction.onrender.com/category-3d1-383.html)
- [DIGITAL AQUA](https://quizzesarena.web.app/digital-aqua.html)
- [CHESS DUEL](https://brainquestspt.pages.dev/chess-duel.html)
- [2048 NUMBER MATCH](https://eduquests.netlify.app/2048-number-match.html)
- [KIDS SUPERMARKET](https://eduquests.netlify.app/kids-supermarket.html)
- [CATEGORY PUZZLE 4](https://eduquests.netlify.app/category-puzzle-4.html)
- [PRESS A TO PARTY](https://eduquestses.pages.dev/press-a-to-party.html)
- [MAKEUP TRENDS THEN AND NOW](https://eduquestses.pages.dev/makeup-trends-then-and-now.html)
- [CATEGORY JIGSAW](https://quizzesarena.web.app/category-jigsaw.html)
- [CATEGORY BUBBLE SHOOTER](https://welearnaction.onrender.com/category-bubble-shooter.html)
- [CATEGORY CASUAL 16](https://brainquests.pages.dev/category-casual-16.html)
- [CATEGORY SHOOTER 2](https://learnaction.netlify.app/category-shooter-2.html)
- [CONSTRUCTION SIMULATOR](https://eduquestkr.pages.dev/construction-simulator.html)
- [CATEGORY PUZZLE 2](https://brainquestspt.pages.dev/category-puzzle-2.html)
- [CATEGORY ESCAPE 2](https://eduquests.netlify.app/category-escape-2.html)
- [ROBOT TERMINATOR T REX](https://eduquestkr.pages.dev/robot-terminator-t-rex.html)
- [CATEGORY INTERSTELLARUNBLOCKER](https://quizzesarena.onrender.com/category-interstellarunblocker.html)
- [MOTO RACE CITY](https://eduquestses.pages.dev/moto-race-city.html)
- [MY TINY LAND](https://quizzesarena.onrender.com/my-tiny-land.html)
- [MAZEAN COM](https://eduquestkr.pages.dev/mazean-com.html)
- [CATEGORY DIRT BIKE18](https://welearnaction.onrender.com/category-dirt-bike18.html)
- [CATEGORY EDUCATIONAL](https://eduquests.onrender.com/category-educational.html)
- [FARM DEFENSE](https://learnaction.netlify.app/farm-defense.html)
- [CATEGORY LOL41](https://welearnaction.onrender.com/category-lol41.html)
- [MEME MYTHWUKONG](https://eduquests.netlify.app/meme-mythwukong.html)
- [CATEGORY HORROR90](https://eduquestsjp.pages.dev/category-horror90.html)
- [MR BOUNCE](https://eduquestses.pages.dev/mr-bounce.html)
- [FURRY WEDDING PROPOSAL](https://quizzesarena.onrender.com/furry-wedding-proposal.html)
- [HUNT AND SEEK](https://quizzesarena.web.app/hunt-and-seek.html)
- [COLOR STRINGS](https://eduquests.netlify.app/color-strings.html)
- [SIEGE BREAK](https://welearnaction.onrender.com/siege-break.html)
- [HALLOWEEN FRUIT SLICE](https://learnaction.netlify.app/halloween-fruit-slice.html)
- [GROW WARSIO](https://welearnaction.onrender.com/grow-warsio.html)
- [CHICKEN SCREAM RACE](https://brainquestspt.pages.dev/chicken-scream-race.html)
- [MINECRAFT PIXEL WARFARE](https://quizzesarena.onrender.com/minecraft-pixel-warfare.html)
- [CATEGORY DRESS UP 3](https://brainquests.pages.dev/category-dress-up-3.html)
- [PUT THE FRUIT TOGETHER](https://brainquestspt.pages.dev/put-the-fruit-together.html)
- [RANCH ADVENTURES](https://eduquestsjp.pages.dev/ranch-adventures.html)
- [SWORD PLAY NINJA SLICE RUNNER](https://eduquestkr.pages.dev/sword-play-ninja-slice-runner.html)
- [SAFE MERGE](https://eduquestsjp.pages.dev/safe-merge.html)
- [CATEGORY DRESS UP 3](https://ieduquests.web.app/category-dress-up-3.html)
- [CAT LIFE SIMULATOR](https://eduquestsjp.pages.dev/cat-life-simulator.html)
- [SCREW COLOR SORTING MASTER](https://brainquestspt.pages.dev/screw-color-sorting-master.html)
- [WOOD NUTS MASTER SCREW PUZZLE](https://quizzesarena.onrender.com/wood-nuts-master-screw-puzzle.html)
- [INDEX19](https://quizzesarena.web.app/index19.html)
- [CATEGORY ZOMBIE](https://brainquestspt.pages.dev/category-zombie.html)
- [BATTLE SHOT ELITE](https://brainquests.pages.dev/battle-shot-elite.html)
- [CATEGORY ZOMBIE175](https://eduquestses.pages.dev/category-zombie175.html)
- [NO PAIN NO GAIN RAGDOLL SANDBOX](https://eduquests.onrender.com/no-pain-no-gain-ragdoll-sandbox.html)
- [COLOR YARN SORT](https://quizzesarena.onrender.com/color-yarn-sort.html)
- [FUN TOWN PARKING](https://brainquests.pages.dev/fun-town-parking.html)
- [FUNNY FRUITS MERGE AND GATHER WATERMELON](https://brainquestspt.pages.dev/funny-fruits-merge-and-gather-watermelon.html)
- [THRILL ROLLER COASTER](https://eduquests.netlify.app/thrill-roller-coaster.html)
- [OFFROAD LIFE 3D](https://eduquestsjp.pages.dev/offroad-life-3d.html)
- [TWO BLOCKS](https://eduquests.netlify.app/two-blocks.html)
- [CATEGORY PUZZLE 11](https://ieduquests.web.app/category-puzzle-11.html)
- [CATEGORY JIGSAW](https://eduquests.onrender.com/category-jigsaw.html)
- [GOO GOO GAGA CLICKER](https://eduquests.onrender.com/goo-goo-gaga-clicker.html)
- [BRAIN PUZZLE TRICKY CHOICES](https://eduquestkr.pages.dev/brain-puzzle-tricky-choices.html)
- [K POP HUNTERS VALENTINE STYLE](https://eduquestkr.pages.dev/k-pop-hunters-valentine-style.html)
- [CATEGORY FPS GAMES](https://brainquests.pages.dev/category-fps-games.html)
- [INDEX34](https://ieduquests.web.app/index34.html)
- [GRIDDLERS DELUXE](https://brainquests.pages.dev/griddlers-deluxe.html)
- [GLACIER RUSH](https://quizzesarena.onrender.com/glacier-rush.html)
- [WITCHY AND THE PUZZLE ADVENTURES](https://eduquestsfr.pages.dev/witchy-and-the-puzzle-adventures.html)
- [CRYPTOWORD](https://eduquestses.pages.dev/cryptoword.html)
- [GLOVES OF BLOCK](https://eduquestses.pages.dev/gloves-of-block.html)
- [PANDA RESTAURANT](https://eduquests.netlify.app/panda-restaurant.html)
- [MAHJONG EARTH](https://quizzesarena.onrender.com/mahjong-earth.html)
- [INDEX18](https://eduquests.onrender.com/index18.html)
- [2020 CONNECT](https://eduquestspt.pages.dev/2020-connect.html)
- [MERGE HOME MANIA](https://eduquestsjp.pages.dev/merge-home-mania.html)
- [FLOWER SHOP](https://eduquestsfr.pages.dev/flower-shop.html)
- [MONONINJA](https://quizzesarena.web.app/mononinja.html)
