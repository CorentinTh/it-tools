<template>
    <v-row>
        <v-col cols="12" xl="12">
            <v-card>
                <v-card-title>Git Memo</v-card-title>
                <v-card-text>
                    <MemoViewer :memo="tips"/>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import MemoViewer from "../../components/MemoViewer";

    export default {
        name: "GitMemo",
        data: () => ({
            tips: [
                {
                    section: 'Get started',
                    child: [
                        {
                            text: 'Create a git repo',
                            code: 'git init'
                        },
                        {
                            text: 'Clone an existing repository',
                            code: 'git clone [repo url]'
                        },
                        {
                            text: 'Add current files to next commit',
                            code: 'git add .'
                        },
                        {
                            text: 'Commit tracked files changes',
                            code: 'git commit -am "[commit message]"'
                        },
                        {
                            text: 'List files that has changed',
                            code: 'git status'
                        },
                        {
                            text: 'List changes in tracked files',
                            code: 'git diff'
                        }
                    ]
                },
                {
                    section: 'Basic configuration',
                    child: [
                        {
                            text: 'Set the name that will be associated to every operation',
                            code: 'git config --global user.name "[nom]"'
                        },
                        {
                            text: 'Set the email address that will be associated to every operation',
                            code: 'git config --global user.email "[email]"'
                        },
                        {
                            text: 'Tell git to always push tags',
                            code: 'git config --global push.followTags true'
                        }
                    ]
                },
                {
                    section: 'I\'ve made a mistake',
                    child: [
                        {
                            text: 'Change last commit message',
                            code: 'git commit --amend'
                        },
                        {
                            text: 'Undo most recent commit and keep changes',
                            code: 'git reset HEAD~1'
                        },
                        {
                            text: 'Undo most recent commit and get rid of changes',
                            code: 'git reset HEAD~1 --hard'
                        },
                        {
                            text: 'Reset branch to remote state',
                            code: 'git fetch origin\ngit reset --hard origin/[branch-name]'
                        }
                    ]
                },
                {
                    section: 'Setup SSH',
                    child: [
                        [
                            {
                                text: '1). Generate an SSH key.',
                                code: 'ssh-keygen -t rsa -b 4096 -C "[email]"'
                            },
                            {
                                text: '2). Start the ssh-agent in the background.',
                                code: 'eval "$(ssh-agent -s)"'
                            },
                            {
                                text: '3). Add your SSH private key to the ssh-agent.',
                                code: 'ssh-add ~/.ssh/id_rsa'
                            },
                            {
                                text: '4). Add your SSH public key to your git server (for github: Settings -> SSH and GPG keys)',
                                code: 'cat ~/.ssh/id_rsa.pub'
                            },
                            {
                                text: '5). (Optional) Testing your SSH connection',
                                code: 'ssh -T git@github.com'
                            },

                        ]
                    ]
                },
                {
                    section: 'Merge and rebase',
                    child: [
                        {
                            text: 'Merge a branch into the current',
                            code: 'git merge [branch]'
                        },
                        {
                            text: 'Abort merge (conflicts)',
                            code: 'git merge --abort'
                        },
                        {
                            text: 'Continue merge after resolving conflicts',
                            code: 'git merge --continue'
                        },
                        {
                            text: 'Rebase a branch into the current',
                            code: 'git rebase [branch]'
                        },
                        {
                            text: 'Continue rebase after resolving conflicts',
                            code: 'git rebase --continue'
                        },
                    ]
                },
            ]
        }),
        components: {
            MemoViewer
        }
    }
</script>

<style lang="less" scoped>
</style>