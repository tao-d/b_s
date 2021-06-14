<template>
  <div class="exam-option-Mark">
    
    <span class="order">
      {{ order }}
    </span>
    <div class="question-title">
      【{{ checkQuestionType() }}】
      <b>{{ questionName }} </b>
      <b style="color: red">{{ questionZongMark }}分</b>
    </div>
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
      <!-- <el-radio
        v-for="(item, index) in optionContent"
        v-model="optionModel"
        class="exam-option-Mark-item"
        :label="item"
        border
        size="medium"
        :key="index"
        fill="#FFFFFF"
        :class="{ answer: optionAnswer[0] == item }"
        >{{ String.fromCharCode(65 + index) }}、{{ item }}</el-radio
      > -->
      <!-- <exam-option-item
        v-for="(item, index) in optionContent"
        :key="index+item"
      ></exam-option-item> -->
      <exam-item
        v-for="(item, index) in optionContent"
        :key="index"
        :optionContent="String.fromCharCode(65 + index) + '、' + item"
        :isAnswer="optionAnswer[0] == item"
        :isMe="optionMyAnswer === item"
      ></exam-item>
      <div class="question-answer">
        <b>试题答案:</b>
        <span v-for="(item, index) in optionAnswer" :key="index"
          >{{
            String.fromCharCode(
              65 + optionContent.findIndex((itemIn) => itemIn == item)
            )
          }}
        </span>
      </div>
      <div class="my-answer">
        <b>学生答案:</b>
        <span
          >{{
            optionContent.findIndex((itemIn) => itemIn == optionMyAnswer) == -1
              ? ""
              : String.fromCharCode(
                  65 +
                    optionContent.findIndex(
                      (itemIn) => itemIn == optionMyAnswer
                    )
                )
          }}
        </span>
      </div>
      <div class="mark">
        <b>学生得分:</b>
        <span>{{ questionMark + "分" }}</span>
      </div>
    </div>
    <!-- 多选题 -->
    <div
      class="multipleChoice type"
      v-if="optionType == 'choice multipleChoice'"
    >
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
      <!-- <el-checkbox
        v-for="(item, index) in optionContent"
        v-model="optionModel"
        class="exam-option-Mark-item"
        :label="item"
        border
        size="medium"
        :key="index"
        :class="{ answer: optionAnswer.includes(item) }"
        >{{ String.fromCharCode(65 + index) }}、{{ item }}</el-checkbox
      > -->
      <exam-item
        v-for="(item, index) in optionContent"
        :key="index"
        :optionContent="String.fromCharCode(65 + index) + '、' + item"
        :isAnswer="optionAnswer.includes(item)"
        :isMe="optionMyAnswer.includes(item)"
      ></exam-item>
      <div class="question-answer">
        <b>试题答案:</b>
        <span v-for="(item, index) in optionAnswer" :key="index"
          >{{
            String.fromCharCode(
              65 + optionContent.findIndex((itemIn) => itemIn == item)
            )
          }}
        </span>
      </div>
      <div class="my-answer">
        <b>学生答案:</b>
        <span v-for="(item, index) in multipleChoiceAnswer" :key="index"
          >{{ item }}
        </span>
      </div>
      <div class="mark">
        <b>学生得分:</b>
        <span>{{ questionMark + "分" }}</span>
      </div>
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
      <exam-item
        v-for="(item, index) in 2"
        :key="index"
        :optionContent="index == 0 ? '对' : '错'"
        :isAnswer="
          (optionAnswer == 'yes' && item == 1) ||
          (optionAnswer == 'no' && item == 2)
        "
        :isMe="
          (optionMyAnswer == 'yes' && item == 1) ||
          (optionMyAnswer == 'no' && item == 2)
        "
      ></exam-item>
      <div class="question-answer" v-if="type!='detail'">
        <b>试题答案:</b>
        <span>
          {{ optionAnswer == "yes" ? "对" : "错" }}
        </span>
      </div>
      <div class="my-answer">
        <b>我的答案:</b>
        <span>
          {{
            optionMyAnswer != "" ? (optionMyAnswer == "yes" ? "对" : "错") : ""
          }}
        </span>
      </div>
      <div class="mark">
        <b>我的得分:</b>
        <span> {{ questionMark + "分" }}</span>
      </div>
    </div>
    <!-- 填空题 -->
    <div class="completion type" v-if="optionType == 'completion'" >
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
      <!-- <el-checkbox
        v-for="(item, index) in optionContent"
        v-model="optionModel"
        class="exam-option-Mark
    -item"
        :label="item"
        border
        size="medium"
        :key="index"
        >{{ String.fromCharCode(65 + index) }}{{ item }}</el-checkbox
      > -->
      <b>试题答案例：</b>
      <el-input
        type="textarea"
        :rows="8"
        v-model="optionAnswer"
        class="answer-text"
        :readonly="true"
      >
      </el-input>
      <b class="my-answer">学生答案：</b>
      <el-input
        type="textarea"
        :rows="8"
        v-model="optionMyAnswer"
        class="answer-text"
        :readonly="true"
      >
      </el-input>

      <span class="my-answer" style="color: #f56c6c"
        >试题分数：{{ questionZongMark }}分</span
      >

      <span class="my-answer-detail" v-if="type=='detail'">学生得分：{{optionMark}}</span>
      <span class="my-answer" v-else
        >学生得分：
        <el-input
          style="width: 178px"
          :maxlength="3"
          clearable
          v-model="optionMark"
          @input="questionMarkChange"
        ></el-input>
        <el-button class="mark-btn" type="primary" @click="markQuestion" 
          >批阅</el-button
        >
      </span>
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
      <!-- <el-checkbox
        v-for="(item, index) in optionContent"
        v-model="optionModel"
        class="exam-option-Mark
    -item"
        :label="item"
        border
        size="medium"
        :key="index"
        >{{ String.fromCharCode(65 + index) }}{{ item }}</el-checkbox
      > -->
      <b>试题答案例：</b>
      <el-input
        type="textarea"
        :rows="8"
        v-model="optionAnswer"
        class="answer-text"
        :readonly="true"
      >
      </el-input>
      <b class="my-answer">学生答案：</b>
      <!-- <el-input
        type="textarea"
        :rows="8"
        v-model="optionMyAnswer"
        class="answer-text"
        :readonly="true"
      >
      </el-input> -->
      <div class="student-answer" v-html="optionMyAnswer">
      </div>
      <span class="my-answer" style="color: #f56c6c"
        >试题分数：{{ questionZongMark }}分</span
      >
      <span class="my-answer-detail" v-if="type=='detail'">学生得分：{{optionMark}}</span>
      <span class="my-answer" v-else
        >学生得分：
        <el-input
          style="width: 178px"
          :maxlength="3"
          clearable
          v-model="optionMark"
          @input="questionMarkChange"
        ></el-input>
        <el-button class="mark-btn" type="primary" @click="markQuestion"
          >批阅</el-button
        >
      </span>
    </div>
  </div>
</template>

<script>
import examItem from "@/components/examItem.vue";

export default {
  components: {
    examItem,
  },
  name: "examOptionItem",
  data() {
    return {
      optionModel: this.optionModelValue,
      optionType: this.optionTypeValue,
      optionAnswer: this.optionAnswerValue,
      optionMyAnswer: this.optionMyAnswerValue,
      optionMark: this.questionMark,
      oldMark: this.optionMark,
      multipleChoiceAnswer: [],
      // for(let i=0 ;i<this.optionMyAnswer)
      // questionMarkValue:this.
    };
  },
  methods: {
    handleDialogClick(fit){
      this.$emit('clickImg',fit)
    },
    optionAnswerList() {
      this.optionAnswer = this.optionAnswerValue;
      //改变答案的排序，以A、B、C排列
      if (this.optionTypeValue === "choice multipleChoice") {
        this.multipleChoiceAnswer = [];
        for (let i = 0; i < this.optionMyAnswerValue.length; i++) {
          this.multipleChoiceAnswer.push(
            String.fromCharCode(
              65 +
                this.optionContent.findIndex(
                  (itemIn) => itemIn == this.optionMyAnswerValue[i]
                )
            )
          );
        }
        this.multipleChoiceAnswer.sort();
        console.log(this.multipleChoiceAnswer);
      }

      this.optionMark = 0;
    },
    questionMarkChange() {
      this.$emit("giveMark", {
        giveMark: Number(this.optionMark),
      });
    },
    markQuestion() {
      if (Number(this.questionZongMark) < Number(this.optionMark)) {
        this.$message({
          message: "批阅分数大于试题分数!!",
          type: "error",
        });
        return;
      }
      this.$emit("markQuestion", {
        giveMark: Number(this.optionMark),
        oldMark: Number(this.oldMark),
      });
    },
    checkQuestionType() {
      let result = this.optionTypeValue.split(" ");
      // console.log(result);
      switch (result[0]) {
        case "choice": {
          if (result[1] == "singleChoice") {
            return "单选题";
          } else {
            return "多选题";
          }
        }
        case "singleChoice": {
          return "单选题";
        }
        case "multipleChoice": {
          return "多选题";
        }
        case "judgement": {
          return "判断题";
        }
        case "completion": {
          return "填空题";
        }
        case "shortAnswer": {
          return "简答题";
        }
      }
    },
  },
  watch: {
    // optionMark(){
    //   this.
    // },
    

    optionModel(val) {
      console.log(val);
      this.$emit("giveMark", {
        studentAnswer: val,
      });
    },
    optionContent() {
      this.optionMark = 0;
    },
    optionModelValue() {
      this.optionModel = this.optionModelValue;
      console.log("optionAnswer", this.optionAnswer);
    },
    optionTypeValue() {
      console.log(this.optionTypeValue);
      this.optionType = this.optionTypeValue;
    },
    optionAnswerValue() {
      console.log("optionMyAnswer", this.optionMyAnswer);
      console.log(this.optionAnswerValue);
      console.log(this.optionContent);
      this.optionAnswer = this.optionAnswerValue;
      //改变答案的排序，以A、B、C排列
      if (this.optionTypeValue === "choice multipleChoice") {
        this.multipleChoiceAnswer = [];
        for (let i = 0; i < this.optionMyAnswerValue.length; i++) {
          this.multipleChoiceAnswer.push(
            String.fromCharCode(
              65 +
                this.optionContent.findIndex(
                  (itemIn) => itemIn == this.optionMyAnswerValue[i]
                )
            )
          );
        }
        this.multipleChoiceAnswer.sort();
        console.log(this.multipleChoiceAnswer);
      }

      this.optionMark = 0;
    },
    optionMyAnswerValue() {
      this.optionMyAnswer = this.optionMyAnswerValue;
      console.log("optionMyAnswer", this.optionMyAnswer);
    },
    questionMark() {
      this.optionMark = this.questionMark;
      console.log("questionMark", this.questionMark);
      console.log("optionMark", this.optionMark);
    },
  },
  created() {
    console.log("create");
    console.log(this.optionModelValue);
    console.log(this.optionTypeValue);
    console.log("optionMyAnswer", this.optionMyAnswer);
    this.optionMark = this.questionMark;
    this.optionAnswerList()
    console.log("optionMark", this.optionMark);
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
    optionAnswerValue: {
      type: [String, Array],
      default() {
        return "我是answer";
      },
    },
    optionMyAnswerValue: {
      type: [String, Array, Object],
      default() {
        return "我是myanswer";
      },
    },
    questionMark: {
      type: Number,
      default() {
        return 0;
      },
    },
    questionZongMark: {
      type: Number,
      default() {
        return 0;
      },
    },
    order: {
      type: Number,
      default() {
        return 0;
      },
    },
    questionName: {
      type: String,
      default() {
        return '';
      },
    },
    type:{
      type: String,
      default() {
        return '';
      },
    },
    imgUrl:{
      type: Array,
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
.exam-option-Mark {
  .order {
    // width: 20px;
    // height: 20px;
    padding: 2px 5px;
    background-color: #409eff;
    color: white;
    text-align: center;
    line-height: 20px;
    float: left;
    margin-right: 20px;
  }
  .question-title {
    margin-bottom: 20px;
    overflow: hidden;
  }
  .type {
    display: flex;
    flex-direction: column;
  }
  .exam-option-Mark-item {
    margin: 10px 10px;
    padding: 10px;
    height: 50px;
    line-height: 30px;
  }
  .answer-text {
    // margin-top: 20vh;
  }
  .question-answer {
    margin-top: 20px;
    span {
      color: #67c23a;
    }
  }
  .my-answer {
    margin-top: 20px;
    span {
      color: red;
    }
  }
  .student-answer{
    padding: 5px 15px;
    min-height: 200px;
    border: 1px solid gray;
    border-radius: 5px;
  }
  .mark {
    margin-top: 20px;
    span {
      color: red;
    }
  }
}

/deep/.el-radio__input.is-checked + .el-radio__label {
  color: #fd7624 !important;
}
/deep/.el-radio__input.is-checked .el-radio__inner {
  background: #fd7624 !important;
  border-color: #fd7624 !important;
}
.is-me {
  color: white;
  border: 1px solid #f56c6c;
}
.answer {
  color: #67c23a;
  border: 1px solid #67c23a;
}
.mark-btn {
  margin-left: 20px;
}
</style>