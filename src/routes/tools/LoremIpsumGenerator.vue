<template>
    <v-row justify="center" align="center" class="lorem-ipsum-generator">
        <v-col cols="12" xl="5" lg="6" md="12">
            <v-card>
                <v-card-title>Lorem ipsum generator</v-card-title>
                <v-card-text>
                    <v-slider v-model="paragraphs" min="1" max="20" label="Paragraphs" thumb-label/>
                    <v-range-slider v-model="sentencePerParagraph" min="1" max="50" label="Sentences per paragraph"
                                    thumb-label/>
                    <v-range-slider v-model="wordPerSentence" min="1" max="50" label="Words per sentence" thumb-label hide-details/>
                    <v-checkbox v-model="startWithLoremIpsum" label="Start with 'Lorem ipsum ...'" hide-details/>
                    <v-checkbox v-model="asHTML" label="As HTML" hide-details/>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" xl="5" lg="6" md="12">
            <v-card>
                <v-card-text>
                    <v-textarea outlined readonly hide-details="auto" v-model="loremIpsum" rows="15"
                                class="text-justify"></v-textarea>
                    <div class="text-center mt-4">
                        <v-btn depressed @click="copy()">Copy</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import {copyToClipboard, randFromArray, randIntFromInterval} from "../../utils/helpers";

    const vocabulary = ['a', 'ac', 'accumsan', 'ad', 'adipiscing', 'aenean', 'aliquam', 'aliquet', 'amet', 'ante', 'aptent', 'arcu', 'at', 'auctor', 'bibendum', 'blandit', 'class', 'commodo', 'condimentum', 'congue', 'consectetur', 'consequat', 'conubia', 'convallis', 'cras', 'cubilia', 'cum', 'curabitur', 'curae', 'dapibus', 'diam', 'dictum', 'dictumst', 'dignissim', 'dolor', 'donec', 'dui', 'duis', 'egestas', 'eget', 'eleifend', 'elementum', 'elit', 'enim', 'erat', 'eros', 'est', 'et', 'etiam', 'eu', 'euismod', 'facilisi', 'faucibus', 'felis', 'fermentum', 'feugiat', 'fringilla', 'fusce', 'gravida', 'habitant', 'habitasse', 'hac', 'hendrerit', 'himenaeos', 'iaculis', 'id', 'imperdiet', 'in', 'inceptos', 'integer', 'interdum', 'ipsum', 'justo', 'lacinia', 'lacus', 'laoreet', 'lectus', 'leo', 'ligula', 'litora', 'lobortis', 'lorem', 'luctus', 'maecenas', 'magna', 'magnis', 'malesuada', 'massa', 'mattis', 'mauris', 'metus', 'mi', 'molestie', 'mollis', 'montes', 'morbi', 'mus', 'nam', 'nascetur', 'natoque', 'nec', 'neque', 'netus', 'nisi', 'nisl', 'non', 'nostra', 'nulla', 'nullam', 'nunc', 'odio', 'orci', 'ornare', 'parturient', 'pellentesque', 'penatibus', 'per', 'pharetra', 'phasellus', 'placerat', 'platea', 'porta', 'porttitor', 'posuere', 'potenti', 'praesent', 'pretium', 'primis', 'proin', 'pulvinar', 'purus', 'quam', 'quis', 'quisque', 'rhoncus', 'ridiculus', 'risus', 'rutrum', 'sagittis', 'sapien', 'scelerisque', 'sed', 'sem', 'semper', 'senectus', 'sit', 'sociis', 'sociosqu', 'sodales', 'sollicitudin', 'suscipit', 'suspendisse', 'taciti', 'tellus', 'tempor', 'tempus', 'tincidunt', 'torquent', 'tortor', 'turpis', 'ullamcorper', 'ultrices', 'ultricies', 'urna', 'varius', 'vehicula', 'vel', 'velit', 'venenatis', 'vestibulum', 'vitae', 'vivamus', 'viverra', 'volutpat', 'vulputate'];
    const firstSentence = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

    const generateSentence = (length) => {
        let sentence = Array.from({length}).map(() => randFromArray(vocabulary)).join(' ')
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
        return sentence
    }


    export default {
        name: "LoremIpsumGenerator",
        data: () => ({
            paragraphs: 1,
            sentencePerParagraph: [3, 8],
            wordPerSentence: [8, 15],
            startWithLoremIpsum: true,
            asHTML: false
        }),
        methods:{
            copy(){
                copyToClipboard(this.loremIpsum)
                this.$toast.success('Copied to clipboard.')
            }
        },
        computed: {
            loremIpsum: function () {
                const lorem = Array
                    .from({length: this.paragraphs})
                    .map(() => {
                        const length = randIntFromInterval(...this.sentencePerParagraph);

                        return Array.from({length}).map(() => {
                            const wordCount = randIntFromInterval(...this.wordPerSentence);
                            return generateSentence(wordCount);
                        })
                    });

                if (this.startWithLoremIpsum) {
                    lorem[0][0] = firstSentence
                }

                let result;
                if(this.asHTML){
                    result = `<p>${lorem.map(s => s.join(' ')).join('</p>\n\n<p>')}</p>`
                }else{
                    result = lorem.map(s => s.join(' ')).join('\n\n')
                }

                return result;
            }
        }
    }
</script>

<style scoped lang="less">
    ::v-deep {
        .v-label{
            min-width: 200px !important;
        }
    }
</style>