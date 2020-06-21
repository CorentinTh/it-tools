import {copyToClipboard} from "../utils/helpers";

export const copyable = {
    methods: {
        copy(text, toastText = 'Copied to clipboard !'){
            copyToClipboard(text);
            this.$toast.success(toastText)
        }
    }
}