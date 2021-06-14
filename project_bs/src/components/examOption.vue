<template>
  <div class="exam-option">
    <!-- 单选题 -->

    <div class="singleChoice type" v-if="optionType == 'choice singleChoice'">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li
          class="el-upload-list__item is-success"
          v-for="fit in imgUrl"
          :key="fit"
        >
          <img
            style="width: 100%; height: 100%"
            :src="fit"
            @click="handleDialogClick(fit)"
          />
        </li>
      </ul>
      <el-radio
        v-for="(item, index) in optionContent"
        v-model="optionModel"
        class="exam-option-item"
        :label="item"
        border
        size="medium"
        :key="index"
        >{{ String.fromCharCode(65 + index) }}{{ item }}</el-radio
      >
    </div>
    <!-- 多选题 -->
    <div
      class="multipleChoice type"
      v-if="optionType == 'choice multipleChoice'"
    >
      <ul class="el-upload-list el-upload-list--picture-card img-list">
        <li
          class="el-upload-list__item is-success"
          v-for="fit in imgUrl"
          :key="fit"
        >
          <img
            style="width: 100%; height: 100%"
            :src="fit"
            @click="handleDialogClick(fit)"
          />
        </li>
      </ul>
      <el-checkbox
        v-for="(item, index) in optionContent"
        v-model="optionModel"
        class="exam-option-item"
        :label="item"
        border
        size="medium"
        :key="index"
        >{{ String.fromCharCode(65 + index) }}{{ item }}</el-checkbox
      >
    </div>
    <!-- 判断题 -->
    <div class="judgement type" v-if="optionType == 'judgement'">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li
          class="el-upload-list__item is-success"
          v-for="fit in imgUrl"
          :key="fit"
        >
          <img
            style="width: 100%; height: 100%"
            :src="fit"
            @click="handleDialogClick(fit)"
          />
        </li>
      </ul>
      <el-radio
        v-for="(item, index) in ['yes', 'no']"
        v-model="optionModel"
        class="exam-option-item"
        :label="item"
        border
        size="medium"
        :key="index"
        >{{ item == "yes" ? "对" : "错" }}</el-radio
      >
    </div>
    <!-- 填空题 -->
    <div class="completion type" v-if="optionType == 'completion'">
      <!-- <el-checkbox
        v-for="(item, index) in optionContent"
        v-model="optionModel"
        class="exam-option-item"
        :label="item"
        border
        size="medium"
        :key="index"
        >{{ String.fromCharCode(65 + index) }}{{ item }}</el-checkbox
      > -->
      <ul class="el-upload-list el-upload-list--picture-card">
        <li
          class="el-upload-list__item is-success"
          v-for="fit in imgUrl"
          :key="fit"
        >
          <img
            style="width: 100%; height: 100%"
            :src="fit"
            @click="handleDialogClick(fit)"
          />
        </li>
      </ul>
      <el-input
        type="textarea"
        :rows="8"
        placeholder="用逗号隔开"
        v-model="optionModel"
        :class="{'answer-text':imgUrl.length>0,'img-answer-text':imgUrl.length==0}"
      >
      </el-input>
    </div>
    <!-- 简答题 -->
    <div class="shortAnswer type" v-if="optionType == 'shortAnswer'">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li
          class="el-upload-list__item is-success"
          v-for="fit in imgUrl"
          :key="fit"
        >
          <img
            style="width: 100%; height: 100%"
            :src="fit"
            @click="handleDialogClick(fit)"
          />
        </li>
      </ul>
      <!-- <el-input
        type="textarea"
        :rows="8"
        placeholder="请输入内容"
        v-model="optionModel"
        :class="{'answer-text':imgUrl.length>0,'img-answer-text':imgUrl.length==0}"
      >
      </el-input> -->
      <quill-editor
            v-model="optionModel"
            ref="myQuillEditor"
            :options="editorOption"
        ></quill-editor>
    </div>
  </div>
</template>

<script>
// import toolbarOptions from '@/components/toolbarOptions.js'
export default {
  name: "examOptionItem",
  data() {
    return {
      optionModel: this.optionModelValue,
      optionType: this.optionTypeValue,
      // optionMyAnswer:'',
      // editorOption: {
      //   scrollingContainer: '#editorcontainer',
      //   placeholder: '请作答',
      //   // or 'bubble'
      //   theme: 'snow',
      //   modules: {
      //     // imageResize: {
      //     //   displayStyles: {
      //     //     backgroundColor: 'black',
      //     //     border: 'none',
      //     //     color: 'white'
      //     //   },
      //     //   modules: ['Resize', 'DisplaySize', 'Toolbar']
      //     // },
      //     toolbar: {
      //       // 工具栏
      //       container: toolbarOptions.toolbarOptions,
      //       handlers: {
      //         'image': function (value) {
      //           if (value) {
      //             console.log(value);
      //           } else {
      //             this.quill.format('image', false)
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
    };
  },
  watch: {
    optionModel(val) {
      console.log(val);
      this.$emit("optionClick", {
        studentAnswer: val,
      });
      console.log(this.imgUrl);
    },
    optionModelValue() {
      this.optionModel = this.optionModelValue;
    },
    optionTypeValue() {
      console.log(this.optionModelValue);
      this.optionType = this.optionTypeValue;
    },
  },
  created() {
    console.log(this.optionModelValue);
    console.log(this.optionTypeValue);
  },
  methods: {
    handleDialogClick(fit) {
      this.$emit("clickImg", fit);
    },
    
  },
  props: {
    optionTypeValue: String,
    optionContent: Array,
    optionModelValue: {
      type: [String, Array],
      default() {
        return "";
      },
    },
    imgUrl: {
      type: [Array],
      default() {
        return [];
      },
    },
    // optionIndex: Number,
    // optionModel: Object,
    // label:String,
  },
};
</script>

<style lang="less" scoped>
.exam-option {
  .type {
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
  .exam-option-item {
    margin: 10px 10px;
    padding: 10px;
    height: 50px;
    line-height: 30px;
  }
  .answer-text {
    margin-top: 10vh;
  }
  .img-answer-text{
    margin-top: 5vh;
  }
  /deep/.ql-editor {
  min-height: 10rem;
}
}



</style>