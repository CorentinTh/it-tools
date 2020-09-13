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
      let area = this.$el;

      /* Emit innerText */
      this.$emit('input', area.innerText);

      if(area.innerText) {
        let pos = this.getPos();
        console.log(pos);

        /* Update innerHTML with formatting */
        let html = this.fn(area.innerText);
        area.innerHTML = html;

        if(moveCursor){
          this.setPos(pos);
        }
      }
    },
    getPos () {
      let _range = document.getSelection().getRangeAt(0);
      let range = _range.cloneRange();
      range.selectNodeContents(this.$el);
      range.setEnd(_range.endContainer, _range.endOffset);
      return range.toString().length;
    },
    setPos (pos) {
      /* find childnode which will contain the cursor. */
      let node = null;
      for(let n of this.$el.childNodes) {
        let length = n.firstChild ? n.firstChild.length : n.length;
        if(length >= pos) {
          node = n.firstChild ?? n;
          break;
        } else {
          pos -= length;
        }
      }
      /* Set cursor at right position on right node */
      let rangeObj = document.createRange();
      let selectObj = window.getSelection();
      rangeObj.setStart(node, pos);
      rangeObj.collapse(true);
      selectObj.removeAllRanges();
      selectObj.addRange(rangeObj);
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