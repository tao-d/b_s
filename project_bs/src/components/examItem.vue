
<template>
  <div class="exam-item">
    <div class="option-item" :class="{'isAnswer':isAnswer,'isMe':isMe}">
      <span>{{optionContent}}</span>
    </div>
    
  </div>
</template>

<script>
export default {
  name:'examItem',
  data(){
    return{
      
    }
  },
    props:{
    optionContent: {
      type: [String, Array],
      default() {
        return "我是answer";
      },
    },
    isAnswer:Boolean,
    isMe:Boolean,
    // optionIndex:Number,
    // optionModel:String,
    // label:String,
  }
}
</script>

<style lang="less" scoped>
  .option-item{
    margin: 10px 10px;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    font-size: 14px;
    color: #606266;
    font-weight: 500;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    span{
      padding-left: 10px;
    }
  }
  .isMe{
     color: #F56C6C;
      border: 1px solid #F56C6C;
  }
  .isAnswer {
  color: #67c23a;
  border: 1px solid #67c23a;
}
</style>