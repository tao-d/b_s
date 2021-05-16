<template>
  <div class="paper-question-item">
    <el-card class="card">
      <div class="question-title">
        <slot name="title">
        </slot>
      </div>
      <div class="question-content">
        <slot name="content">
        </slot>
        <slot name="img">
        </slot>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "paper",
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.paper-question-item {
  margin: 10px 0;
  .card
  {
    margin-bottom: 20px;
    min-height: 100px;
  }
  
  .question-title {
    // margin: 20px 0;
    margin-left: 10px;
  }
    .question-content {
    // margin: 20px 0;
    margin-left: 20px;
  }
}
</style>