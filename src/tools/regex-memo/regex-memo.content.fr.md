### Caractères normaux

Expression | Description
:--|:--
`.` ou `[^\n\r]` | tout caractère *sauf* un saut de ligne ou retour chariot
`[A-Za-z]` | alphabet
`[a-z]` | alphabet minuscule
`[A-Z]` | alphabet majuscule
`\d` ou `[0-9]` | chiffre
`\D` ou `[^0-9]` | non-chiffre
`_` | soulignement
`\w` ou `[A-Za-z0-9_]` | alphabet, chiffre ou soulignement
`\W` ou `[^A-Za-z0-9_]` | inverse de `\w`
`\S` | inverse de `\s`

### Caractères d'espace

Expression | Description
:--|:--
` ` | espace
`\t` | tabulation
`\n` | saut de ligne
`\r` | retour chariot
`\s` | espace, tabulation, saut de ligne ou retour chariot

### Ensemble de caractères

Expression | Description
:--|:--
`[xyz]` | soit `x`, `y` ou `z`
`[^xyz]` | ni `x`, ni `y`, ni `z`
`[1-3]` | soit `1`, `2` ou `3`
`[^1-3]` | ni `1`, ni `2`, ni `3`

- Pensez à un ensemble de caractères comme une opération `OU` sur les caractères simples qui sont enfermés entre crochets.
- Utilisez `^` après le `[` d'ouverture pour "négation" de l'ensemble de caractères.
- Dans un ensemble de caractères, `.` signifie un point littéral.

### Caractères nécessitant un échappement

#### En dehors d'un ensemble de caractères

Expression | Description
:--|:--
`\.` | point
`\^` | accent circonflexe
`\$` | signe dollar
`\|` | barre verticale
`\\` | barre oblique inverse
`\/` | barre oblique
`\(` | parenthèse ouvrante
`\)` | parenthèse fermante
`\[` | crochet ouvrant
`\]` | crochet fermant
`\{` | accolade ouvrante
`\}` | accolade fermante

#### À l'intérieur d'un ensemble de caractères

Expression | Description
:--|:--
`\\` | barre oblique inverse
`\]` | crochet fermant

- Un `^` doit être échappé uniquement s'il se produit immédiatement après le `[` d'ouverture de l'ensemble de caractères.
- Un `-` doit être échappé uniquement s'il se produit entre deux alphabets ou deux chiffres.

### Quantificateurs

Expression | Description
:--|:--
`{2}` | exactement 2
`{2,}` | au moins 2
`{2,7}` | au moins 2 mais pas plus de 7
`*` | 0 ou plus
`+` | 1 ou plus
`?` | exactement 0 ou 1

- Le quantificateur va *après* l'expression à quantifier.

### Limites

Expression | Description
:--|:--
`^` | début de chaîne
`$` | fin de chaîne
`\b` | limite de mot

- Comment fonctionne la correspondance des limites de mots :
    - Au début de la chaîne si le premier caractère est `\w`.
    - Entre deux caractères adjacents dans la chaîne, si le premier caractère est `\w` et le deuxième caractère est `\W`.
    - À la fin de la chaîne si le dernier caractère est `\w`.

### Correspondance

Expression | Description
:--|:--
`foo\|bar` | correspond soit à `foo` soit à `bar`
`foo(?=bar)` | correspond à `foo` s'il est avant `bar`
`foo(?!bar)` | correspond à `foo` s'il n'est *pas* avant `bar`
`(?<=bar)foo` | correspond à `foo` s'il est après `bar`
`(?<!bar)foo` | correspond à `foo` s'il n'est *pas* après `bar`

### Regroupement et capture

Expression | Description
:--|:--
`(foo)` | groupe de capture ; correspond et capture `foo`
`(?:foo)` | groupe non-capturant ; correspond à `foo` mais *sans* capturer `foo`
`(foo)bar\1` | `\1` est une référence inverse au 1er groupe de capture ; correspond à `foobarfoo`

- Les groupes de capture ne sont pertinents que dans les méthodes suivantes :
    - `string.match(regexp)`
    - `string.matchAll(regexp)`
    - `string.replace(regexp, callback)`
- `\N` est une référence inverse au groupe de capture `Nth`. Les groupes de capture sont numérotés à partir de 1.

## Références et outils

- [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [RegExplained](https://leaverou.github.io/regexplained/)
