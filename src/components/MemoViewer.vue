<template>
    <div class="memo-viewer" v-bind:style="{ columns: `auto ${colWidth}` }">
        <div class="section" v-for="(group,i) in memo" :key="i">
            <h2>{{group.section}}</h2>

            <div class="tip" v-for="(tips,i) in group.child" :key="i">
                <v-card>
                    <v-card-text>
                        <template v-for="tip in (Array.isArray(tips) ? tips : [tips])">
                            <p :key="tip.text">{{tip.text}}</p>
                            <CopyableCodeContent class="code" :key="tip.code">{{tip.code}}</CopyableCodeContent>
                        </template>
                    </v-card-text>
                </v-card>
                </div>
        </div>
    </div>
</template>

<script>
    import CopyableCodeContent from "./CopyableCodeContent";

    export default {
        name: "MemoViewer",
        props: {
            memo: Array,
            colWidth: {
                type: String,
                default: '400px'
            }
        },
        components: {
            CopyableCodeContent
        }
    }
</script>

<style lang="less" scoped>
    .memo-viewer {
        column-gap: 30px;
        column-rule: 1px solid #37373961;
        column-fill: auto;

    }
    .section {
        break-inside: avoid-column;
        display: inline-block;
        margin-bottom: 20px;
        width: 100%;

        h2 {
            margin: 25px 0 15px;
            display: inline-block;
        }

        .tip {
            margin: 20px 0;

            .v-card{
                background-color: rgba(47, 46, 46, 0.44);
            }

            p {
                margin-bottom: 10px;

                &:not(:first-child){
                    margin-top: 16px;
                }
            }
        }
    }

</style>