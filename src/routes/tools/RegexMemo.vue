<template>
    <v-row >
      <v-col cols="12" xl="6" lg="6" md="4" sm="12">
        <v-card class="single-card" id="REGEX_Tester">
            <v-card-title>REGEX Tester</v-card-title>
            <v-card-text>
                <v-text-field
                        outlined
                        v-model="inputRegex"
                        @input="handleRegexInput"
                        label="Regular Expression"
                />
                Input Text
                <StyledTextarea v-model="inputText" ref="styledTextarea" :fn="this.handleInput" />
            </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xl="6" lg="6" md="8" sm="12">
        <v-card class="single-card" id="REGEX_Memo">
            <v-card-title>REGEX Memo</v-card-title>
            <table>
              <tr><th>Character Classes</th></tr>
              <tr>
                <td>.</td><td>Any character except newline</td>
              </tr>
              <tr>
                <td>\w \d \s</td><td>Word, digit, whitespace</td>
              </tr>
              <tr>
                <td>\w \d \s</td><td>Word, digit, whitespace</td>
              </tr>
              <tr>
                <td>[abc]</td><td>Any of a, b, or c</td>
              </tr>
              <tr>
                <td>[^abc]</td><td>Not a, b, or c</td>
              </tr>
              <tr>
                <td>[a-f]</td><td>Character between a &amp; f</td>
              </tr>

              <tr><th>Anchors</th></tr>
              <tr>
                <td>^abc$</td><td>^ is the start of the string, $ end of string</td>
              </tr>
              <tr>
                <td>\b \B</td><td>Word, not-word boundary</td>
              </tr>

              <tr><th>Escaped characters</th></tr>
              <tr>
                <td>\.\*\\</td><td>Escaped special characters</td>
              </tr>
              <tr>
                <td>\t\n\r</td><td>tab, linefeed, carriage return</td>
              </tr>

              <tr><th>Groups &amp; Lookaround</th></tr>
              <tr>
                <td>(abc)</td><td>capture group</td>
              </tr>
              <tr>
                <td>\1</td><td>Backreference to group #1</td>
              </tr>
              <tr>
                <td>(?:abc)</td><td>Non-capturing group</td>
              </tr>
              <tr>
                <td>(?=abc)</td><td>positive lookahead</td>
              </tr>
              <tr>
                <td>(?!abc)</td><td>negative lookahead</td>
              </tr>

              <tr><th>Quantifiers &amp; Alternation</th></tr>
              <tr>
                <td>a*a+a?</td><td>0 or more, 1 or more, 0 or 1</td>
              </tr>
              <tr>
                <td>a{5}a{2,}</td><td>exactly five a's, two or more a's</td>
              </tr>
              <tr>
                <td>a{1,3}</td><td>between one &amp; three a's</td>
              </tr>
              <tr>
                <td>a+?a{2,}?</td><td>match as few as possible</td>
              </tr>
              <tr>
                <td>ab|cd</td><td>match ab or cd</td>
              </tr>
            </table>
        </v-card>
      </v-col>
    </v-row>
</template>

<script>
    import StyledTextarea from "../../components/StyledTextarea";

    export default {
        name: "RegexMemo",
        data() {
            return {
                inputRegex: '',
                inputText: ''
            }
        },
        methods: {
            handleRegexInput () {
              this.$refs.styledTextarea.updateInput(false);
            },
            handleInput(str) {
              let output = str;
              if(this.inputRegex) {
                try {
                  let regex = new RegExp(this.inputRegex, 'g');

                  const matches = [...str.matchAll(regex)];
                  const matchMap = {};
                  for(const match of matches) {
                    const idx = match.index;
                    const val = match[0];
                    matchMap[idx]=val;
                  }

                  let formattedString = '';
                  for(let i =0; i < str.length; i++){
                    let c = str[i];
                    if(matchMap[i]){
                      formattedString += `<span class='highlighted'>${matchMap[i]}</span>`;
                      i += matchMap[i].length-1;
                    } else {
                      formattedString += c;
                    }
                  }
                  output = formattedString;
                } catch (e) {
                  return str;
                }
              }
              return output;
            }
        },
        components: {
            StyledTextarea,
        }
    }
</script>

<style lang="less">
  table {
    width: 100%;
    margin-left: 10%;
  }
  th {
    padding-top: 15px;
    text-align: left;
  }
  .highlighted { 
    background-color: rgb(76, 175, 80);
    margin: 0px 1px;
    color: black;
  }
</style>