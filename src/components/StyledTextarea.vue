<template>
  <div class="StyledTextarea" @input="updateInput(true)" contenteditable></div>
</template>

<script>
export default {
  name: "StyledTextarea",
  props: {
    value: String,
    fn: Function,
  },
  data () {
    return {
      content: this.value
    }
  },
  methods: {
    updateInput (moveCursor) {
      if(this.$el.innerText){
        this.$emit('input', this.$el.innerText);
        
        let html = this.fn(this.$el.innerText);
        this.$el.innerHTML = html;

        if(moveCursor){
          /* Move cursor to end of selection */
          this.$el.focus();
          document.execCommand('selectAll', false, null);
          document.getSelection().collapseToEnd();
        }
      }
    }
  }
}
</script>

<style lang="less">
  .StyledTextarea {
    overflow:scroll;
    height:100px;
    width:100%;
    border:solid;
    border-width:1px;
    resize: vertical;
  }
</style>