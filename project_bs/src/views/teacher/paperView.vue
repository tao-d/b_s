<template>
  <div class="paper-view">
    <div class="paper-head">
      <h5 class="paper-name">{{ paperInformations.paperName }}</h5>
    </div>
    <div class="paper-information">
      <div class="teacher">教师:{{ paperInformations.paperTeacher }}</div>
      <div class="time">总分:{{ paperInformations.paperMark }}分</div>
    </div>
    <div class="paper-content">
      <section class="single-choice section">
        <div class="title">
          一、单选题 {{ caculateMark("choice singleChoice") }}分
        </div>
        <div class="single-choice-content">
          <paper-question-item
            v-for="(item, index) in singleChoiceList"
            :key="index"
          >
            <!-- <el-card> {{ index + 1 }} {{ item.questionName }}</el-card>  -->

            <div slot="title" class="content-title">
              {{ index + 1 }}
              {{ item.questionName }}()
              <div class="mark answer">{{ item.questionMark }}分</div>
            </div>
            <div slot="content">
              <div
                class="choice"
                v-for="(itemNei, index) in item.questionContent"
                :class="{ answer: item.answer.includes(itemNei) }"
                :key="index"
              >
                {{ String.fromCodePoint(index + 65) }}.{{ itemNei }}
              </div>
            </div>
            <div slot="img">
            <ul class="el-upload-list el-upload-list--picture-card">
            <li
              class="el-upload-list__item is-success"
              v-for="fit in item.imgUrl"
              :key="fit"
            >
              <img
                style="width: 100%; height: 100%"
                :src="fit"
                @click="handleDialogClick(fit)"
              />
            </li>
          </ul>
            </div>
          </paper-question-item>
          
        </div>
      </section>
      <section class="multiple-choice section">
        <div class="title">
          二、多选题 {{ caculateMark("choice multipleChoice") }}分
        </div>
        <div class="multiple-content">
          <paper-question-item
            v-for="(item, index) in multipleChoiceList"
            :key="index"
          >
            <div slot="title" class="content-title">
              {{ index + 1 }}. {{ item.questionName }}()
              <div class="mark answer">{{ item.questionMark }}分</div>
            </div>
            <div slot="content">
              <!-- 将选择题答案变红 -->
              <div
                class="choice"
                v-for="(itemNei, index) in item.questionContent"
                :key="index"
                :class="{ answer: item.answer.includes(itemNei) }"
              >
                {{ String.fromCodePoint(index + 65) }}.{{ itemNei }}
              </div>
            </div>
            <div slot="img">
            <ul class="el-upload-list el-upload-list--picture-card">
            <li
              class="el-upload-list__item is-success"
              v-for="fit in item.imgUrl"
              :key="fit"
            >
              <img
                style="width: 100%; height: 100%"
                :src="fit"
                @click="handleDialogClick(fit)"
              />
            </li>
          </ul>
            </div></paper-question-item
          >
        </div>
      </section>
      <section class="judgement section">
        <div class="title">三、判断题 {{ caculateMark("judgement") }}分</div>
        <div class="judgement-content">
          <paper-question-item
            v-for="(item, index) in judgementList"
            :key="index"
          >
            <el-card> {{ index + 1 }} {{ item.questionName }}</el-card>
            <div slot="title" class="content-title">
              {{ index + 1 }}.
              {{ item.questionName }}
              <div class="mark answer">{{ item.questionMark }}分</div>
            </div>
            <div slot="content">
              <div
                class="judgementSelect-yes"
                :class="{ answer: item.answer == 'yes' }"
              >
                A.对
              </div>
              <div
                class="judgementSelect-no"
                :class="{ answer: item.answer == 'no' }"
              >
                B.错
              </div>
            </div>
            <!-- <div class="mark">{{item.questionMark}}</div> -->
            <div slot="img">
            <ul class="el-upload-list el-upload-list--picture-card">
            <li
              class="el-upload-list__item is-success"
              v-for="fit in item.imgUrl"
              :key="fit"
            >
              <img
                style="width: 100%; height: 100%"
                :src="fit"
                @click="handleDialogClick(fit)"
              />
            </li>
          </ul>
            </div>
          </paper-question-item>
        </div>
      </section>
      <section class="completion section">
        <div class="title">四、填空题 {{ caculateMark("completion") }}分</div>
        <div class="completion-content">
          <paper-question-item
            v-for="(item, index) in completionList"
            :key="index"
          >
            <!-- <el-card slot="title">              {{index+1}}
              {{ item.questionName }}</el-card> -->
            <div slot="title" class="content-title">
              {{ index + 1 }}.
              {{ item.questionName }}
              <div class="mark answer">{{ item.questionMark }}分</div>
            </div>
            <div slot="content">
              {{ item.questionContent }}
            </div>
            <div class="mark">{{ item.questionMark }}</div>
            <div slot="img">
            <ul class="el-upload-list el-upload-list--picture-card">
            <li
              class="el-upload-list__item is-success"
              v-for="fit in item.imgUrl"
              :key="fit"
            >
              <img
                style="width: 100%; height: 100%"
                :src="fit"
                @click="handleDialogClick(fit)"
              />
            </li>
          </ul>
            </div>
          </paper-question-item>
        </div>
      </section>
      <section class="short-answer section">
        <div class="title">五、简答题 {{ caculateMark("shortAnswer") }}分</div>
        <div class="short-answer-content">
          <paper-question-item
            v-for="(item, index) in shortAnswerList"
            :key="index"
          >
            <div slot="title" class="content-title">
              {{ index + 1 }}.
              {{ item.questionName }}
              <div class="mark answer">{{ item.questionMark }}分</div>
            </div>
            <div slot="content">
              {{ item.questionContent }}
            </div>
            <div class="mark">{{ item.questionMark }}</div>
            <div slot="img">
            <ul class="el-upload-list el-upload-list--picture-card">
            <li
              class="el-upload-list__item is-success"
              v-for="fit in item.imgUrl"
              :key="fit"
            >
              <img
                style="width: 100%; height: 100%"
                :src="fit"
                @click="handleDialogClick(fit)"
              />
            </li>
          </ul>
            </div>
          </paper-question-item>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import paperQuestionItem from "@/components/paperQuestionItem.vue";
export default {
  name: "paperView",
  components: {
    paperQuestionItem,
  },
  created() {
    this.updateData();
    console.log(this.dataList);
  },
  watch: {
    dataList() {
      this.updateData();
      // console.log(this.dataList);
    },
  },
  data() {
    return {
      singleChoiceList: [],
      multipleChoiceList: [],
      judgementList: [],
      completionList: [],
      shortAnswerList: [],
    };
  },
  props: {
    dataList: {
      type: Array,
      default() {
        return [];
      },
    },
    paperInformations: {
      type: Object,
      default() {
        return {
          paperTeacher: "荷和",
          paperName: "计算机科学与技术",
          paperTime: 120,
        };
      },
    },
  },
  methods: {

    handleDialogClick(fit){
      this.$emit('clickImg',fit)
    },
    caculateMark(type) {
      let allMark = this.dataList.reduce((total, item) => {
        if (item.questionType == type) {
          console.log(item.questionMark);
          return total + Number(item.questionMark);
        } else {
          return total + 0;
        }
      }, 0);
      return allMark;
    },

    updateData() {
      this.singleChoiceList.splice(0, this.singleChoiceList.length);
      this.multipleChoiceList.splice(0, this.multipleChoiceList.length);
      this.judgementList.splice(0, this.judgementList.length);
      this.completionList.splice(0, this.completionList.length);
      this.shortAnswerList.splice(0, this.shortAnswerList.length);
      this.dataList.forEach((item) => {
        let type = item.questionType.split(" ");
        switch (type[0]) {
          case "choice": {
            if (type[1] == "singleChoice") {
              this.singleChoiceList.push(item);
            } else {
              this.multipleChoiceList.push(item);
            }
            break;
          }
          case "judgement": {
            this.judgementList.push(item);
            break;
          }
          case "completion": {
            this.completionList.push(item);
            break;
          }
          case "shortAnswer": {
            this.shortAnswerList.push(item);
            break;
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.paper-view {
  overflow: auto;
  height: 55vh;
}
.paper-head {
  display: flex;
  justify-content: center;
  .paper-name {
    font-size: 24px;
    margin: 20px 0;
  }
}

.paper-information {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 20px;
}

.paper-content {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 16px;
  .title {
    // margin-bottom: 10px;
  }
  .content-title {
    margin-bottom: 5px;
  }
  .section {
    margin: 50px 20px 50px 0px;
  }
  .choice {
    margin: 10px 0;
  }
  .answer {
    color: #f56c6c;
  }
  .mark {
    float: right;
  }
}
.is-success{
  cursor:pointer;
}
</style>