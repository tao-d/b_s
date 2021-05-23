<template>
  <div class="view-paper-manager">
    <section class="paper-manager">
      <p class="title">试卷管理</p>
      <div class="paper-manager-content">
        <div class="add">
          <el-button type="primary" @click="addPaperDialog"
            >+添加试卷</el-button
          >
        </div>
        <div class="search">
          <el-input
            v-model="courseSearch"
            placeholder="试卷题目"
            size="small"
          ></el-input>
        </div>
        
        <section class="table">
          <el-table
            :data="
              myPaperNewList.slice(
                (pagination.currPage - 1) * pagination.pageSize,
                pagination.currPage * pagination.pageSize
              )
            "
            style="width: 100%"
            stripe
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="选择题数量">
                    <span>{{ props.row.choiceCount }}</span>
                  </el-form-item>
                  <el-form-item label="单选题数量">
                    <span>{{ props.row.singleChoiceCount }}</span>
                  </el-form-item>
                  <el-form-item label="多选题数量">
                    <span>{{ props.row.multipleChoiceCount }}</span>
                  </el-form-item>
                  <el-form-item label="判断题数量">
                    <span>{{ props.row.judgementCount }}</span>
                  </el-form-item>
                  <el-form-item label="填空题数量">
                    <span>{{ props.row.completionCount }}</span>
                  </el-form-item>
                  <el-form-item label="简答题数量">
                    <span>{{ props.row.shortAnswerCount }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="paperName"
              label="试卷题目"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="getPaperDetail(scope.row)">{{
                  scope.row.paperName
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="paperType"
              label="试卷类型"
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="questionCount"
              label="题目数量"
              align="center"
            ></el-table-column>
            <el-table-column prop="paperMark" label="试卷总分" align="center">
            </el-table-column>
            <el-table-column
              prop="passMark"
              label="通过分数"
              align="center"
              class="passMark"
            >
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="center">
            </el-table-column>
            <el-table-column prop="paperStatus" label="试卷状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.paperStatus==1?'开启':'关闭'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="paperStatus" label="试卷操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.currPage"
              :page-sizes="[10, 20]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="myPaperNewList.length"
            >
            </el-pagination>
          </div>
        </section>

        <section class="dialogVisible">
          <el-dialog
            title="试卷详情"
            :visible.sync="dialogVisiblePaperDetail"
            id="dialogVisiblePaperDetail"
            top="10vh"
            class="abow_dialog dialogVisiblePaperDetail"
          >
            <el-tabs v-model="activeNamedialogVisible" type="card">
              <el-tab-pane label="试题详情" name="first">
                <div class="dialogVisible-content">
                  <div class="left">
                    <el-tree
                      :data="treeData"
                      :props="defaultProps"
                      @node-click="handleNode"
                      node-key="id"
                      :allow-drop="allowDrop"
                      @node-drop="handleDrop"
                      ><span
                        class="custom-tree-node"
                        slot-scope="{ node, data }"
                      >
                        <span>{{ node.label }}</span>
                        <span>
                          <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-close"
                            @click="() => treeRemove(node, data)"
                            v-if="
                              node.label != '选择题' &&
                              node.label != '判断题' &&
                              node.label != '填空题' &&
                              node.label != '问答题' &&
                              node.label != '多选题' &&
                              node.label != '单选题'
                            "
                          >
                          </el-button>
                        </span>
                      </span>
                    </el-tree>
                  </div>
                  <div class="right" v-if="questionTreeForm.questionType != ''">
                    <el-form
                      ref="questionTreeForm"
                      :model="questionTreeForm"
                      :rules="updateQuestionRules"
                      label-width="100px"
                      size="mini"
                      class="question-form"
                    >
                      <el-form-item label="题目序号">
                        <el-tag type="info">{{
                          questionTreeForm.questionItemLabel
                        }}</el-tag>
                      </el-form-item>
                      <el-form-item label="选择题型">
                        <el-select
                          v-model="questionTreeForm.questionType"
                          placeholder="选择题型"
                          @change="checked"
                          disabled
                        >
                          <el-option label="选择题" value="choice"></el-option>
                          <el-option
                            label="判断题"
                            value="judgement"
                          ></el-option>
                          <el-option
                            label="填空题"
                            value="completion"
                          ></el-option>
                          <el-option
                            label="简答题"
                            value="shortAnswer"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="试题题目" prop="questionName">
                        <el-input
                          v-model="questionTreeForm.questionName"
                          type="textarea"
                        ></el-input>
                      </el-form-item>

                      <el-form-item label="题目图片">
                        <el-upload
                          action="http://localhost:3000/api/paper/uploadImg"
                          list-type="picture-card"
                          :http-request="uploadImage"
                          :on-preview="handlePictureCardPreview"
                          :on-remove="handleRemove"
                          :file-list="questionTreeForm.imgUrl"
                          :before-upload="beforeAvatarUpload"
                          class="picture"
                        >
                          <i class="el-icon-plus"></i>
                        </el-upload>
                      </el-form-item>
                      <!-- 选择题类目 -->
                      <div
                        class="choice"
                        v-if="questionTreeForm.questionType === 'choice'"
                      >
                        <!-- 选择题类型 -->
                        <el-form-item label="选择题类型">
                          <el-select
                            v-model="questionTreeForm.choiceTypeText.choiceType"
                            placeholder="选择题型"
                            disabled
                          >
                            <el-option
                              label="单选题"
                              value="singleChoice"
                            ></el-option>
                            <el-option
                              label="多选题"
                              value="multipleChoice"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <!-- 选项个数 -->
                        <el-form-item
                          label="选项个数"
                          prop="choiceTypeText.choiceCount"
                        >
                          <el-input
                            v-model="
                              questionTreeForm.choiceTypeText.choiceCount
                            "
                            clearable
                            :maxlength="1"
                          ></el-input>
                        </el-form-item>

                        <!-- 选择题选项 -->
                        <el-form-item
                          label="试题选项"
                          v-if="questionTreeForm.questionType === 'choice'"
                          prop="choiceTypeText.chooseContent"
                        >
                          <!-- 切换单选题多选题的样式 -->
                          <div
                            class="choicebox"
                            v-for="n in Number(
                              questionTreeForm.choiceTypeText.choiceCount
                            )"
                            :key="n"
                          >
                            <div
                              class="singleChoiceRadio"
                              v-if="
                                questionTreeForm.choiceTypeText.choiceType ===
                                'singleChoice'
                              "
                            >
                              <el-radio
                                :label="String.fromCodePoint(64 + n)"
                                size="small"
                                v-model="questionTreeForm.choiceTypeText.radio"
                              ></el-radio>
                            </div>
                            <div class="multipleChoiceRadio" v-else>
                              <el-checkbox
                                :label="String.fromCodePoint(64 + n)"
                                size="small"
                                v-model="
                                  questionTreeForm.choiceTypeText.checkList
                                "
                                @change="checked"
                              ></el-checkbox>
                            </div>
                            <el-input
                              v-model="
                                questionTreeForm.choiceTypeText.chooseContent[
                                  n - 1
                                ]
                              "
                              clearable
                            >
                            </el-input>
                          </div>
                        </el-form-item>
                      </div>

                      <!-- 判断题类目 -->
                      <div
                        class="judgement"
                        v-if="questionTreeForm.questionType === 'judgement'"
                      >
                        <!-- 判断题试题 -->
                        <el-form-item label="试题选项">
                          <div class="judgementbox">
                            <el-radio
                              label="yes"
                              size="small"
                              v-model="questionTreeForm.judgementTypeText.radio"
                              ><i class="el-icon-check"></i
                            ></el-radio>
                            <el-radio
                              label="no"
                              size="small"
                              v-model="questionTreeForm.judgementTypeText.radio"
                              ><i class="el-icon-close"></i
                            ></el-radio>
                          </div>
                        </el-form-item>
                      </div>

                      <!-- 填空题类目 -->
                      <div
                        class="completion"
                        v-if="questionTreeForm.questionType === 'completion'"
                      >
                        <!-- 填空题试题 -->
                        <el-form-item
                          label="填空题答案"
                          prop="completionTypeText.answer"
                        >
                          <div class="completionbox">
                            <el-input
                              v-model="
                                questionTreeForm.completionTypeText.answer
                              "
                              type="textarea"
                              clearable
                              placeholder=""
                            >
                            </el-input>
                          </div>
                        </el-form-item>
                      </div>

                      <!-- 简答题类目 -->
                      <div
                        class="shortAnswer"
                        v-if="questionTreeForm.questionType === 'shortAnswer'"
                      >
                        <!-- 简答题试题 -->
                        <el-form-item
                          label="简答题答案"
                          prop="completionTypeText.answer"
                        >
                          <div class="shortAnswerbox">
                            <el-input
                              v-model="
                                questionTreeForm.shortAnswerTypeText.answer
                              "
                              type="textarea"
                              clearable
                            >
                            </el-input>
                          </div>
                        </el-form-item>
                      </div>

                      <el-form-item label="试题得分" prop="questionMark">
                        <el-input
                          v-model="questionTreeForm.questionMark"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="试题解析">
                        <el-input
                          type="textarea"
                          v-model="questionTreeForm.questionAnalysis"
                        ></el-input>
                      </el-form-item>

                      <el-form-item size="large">
                        <el-button type="primary" @click="updateQuestionBtn"
                          >更改试题</el-button
                        >
                        <el-button @click="questionResetTree">重置</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="添加试题" name="second">
                <el-form
                  ref="questionForm"
                  label-width="100px"
                  :model="questionForm"
                  size="mini"
                  class="question-form"
                  :rules="addQuestionRules"
                >
                  <el-form-item label="选择题型" prop="questionType">
                    <el-select
                      v-model="questionForm.questionType"
                      placeholder="选择题型"
                      @change="checked"
                    >
                      <el-option label="选择题" value="choice"></el-option>
                      <el-option label="判断题" value="judgement"></el-option>
                      <el-option label="填空题" value="completion"></el-option>
                      <el-option label="简答题" value="shortAnswer"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="试题题目" prop="questionName">
                    <el-input
                      v-model="questionForm.questionName"
                      id="questionName"
                      type="textarea"
                    ></el-input>
                  </el-form-item>

                  <el-form-item label="题目图片">
                    <el-upload
                      action="http://localhost:3000/api/paper/uploadImg"
                      ref="addUpload"
                      list-type="picture-card"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleFileRemove"
                      :on-change="handleFileChange"
                      :http-request="uploadFile"
                      :auto-upload="false"
                      class="picture"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                  </el-form-item>
                  <!-- 选择题类目 -->
                  <div
                    class="choice"
                    v-if="questionForm.questionType === 'choice'"
                  >
                    <!-- 选择题类型 -->
                    <el-form-item
                      label="选择题类型"
                      prop="choiceTypeText.questionType"
                    >
                      <el-select
                        v-model="questionForm.choiceTypeText.choiceType"
                        placeholder="选择题型"
                      >
                        <el-option
                          label="单选题"
                          value="singleChoice"
                        ></el-option>
                        <el-option
                          label="多选题"
                          value="multipleChoice"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- 选项个数 -->
                    <el-form-item
                      label="选项个数"
                      prop="choiceTypeText.choiceCount"
                    >
                      <el-input
                        v-model="questionForm.choiceTypeText.choiceCount"
                        clearable
                        :maxlength="1"
                      ></el-input>
                    </el-form-item>

                    <!-- 选择题选项 -->
                    <el-form-item
                      label="试题选项"
                      v-if="questionForm.questionType === 'choice'"
                      prop="choiceTypeText.chooseContent"
                    >
                      <!-- 切换单选题多选题的样式 -->
                      <div
                        class="choicebox"
                        v-for="n in Number(
                          questionForm.choiceTypeText.choiceCount
                        )"
                        :key="n"
                      >
                        <div
                          class="singleChoiceRadio"
                          v-if="
                            questionForm.choiceTypeText.choiceType ===
                            'singleChoice'
                          "
                        >
                          <el-radio
                            :label="String.fromCodePoint(64 + n)"
                            size="small"
                            v-model="questionForm.choiceTypeText.radio"
                          ></el-radio>
                        </div>
                        <div class="multipleChoiceRadio" v-else>
                          <el-checkbox
                            :label="String.fromCodePoint(64 + n)"
                            size="small"
                            v-model="questionForm.choiceTypeText.checkList"
                            @change="checked"
                          ></el-checkbox>
                        </div>
                        <el-input
                          v-model="
                            questionForm.choiceTypeText.chooseContent[n - 1]
                          "
                          clearable
                        >
                        </el-input>
                      </div>
                    </el-form-item>
                  </div>

                  <!-- 判断题类目 -->
                  <div
                    class="judgement"
                    v-if="questionForm.questionType === 'judgement'"
                  >
                    <!-- 判断题试题 -->
                    <el-form-item label="试题选项">
                      <div class="judgementbox">
                        <el-radio
                          label="yes"
                          size="small"
                          v-model="questionForm.judgementTypeText.radio"
                          ><i class="el-icon-check"></i
                        ></el-radio>
                        <el-radio
                          label="no"
                          size="small"
                          v-model="questionForm.judgementTypeText.radio"
                          ><i class="el-icon-close"></i
                        ></el-radio>
                      </div>
                    </el-form-item>
                  </div>

                  <!-- 填空题类目 -->
                  <div
                    class="completion"
                    v-if="questionForm.questionType === 'completion'"
                  >
                    <!-- 填空题试题 -->
                    <el-form-item
                      label="填空题答案"
                      prop="completionTypeText.answer"
                    >
                      <!-- <div class="completionbox"> -->
                      <el-input
                        v-model="questionForm.completionTypeText.answer"
                        type="textarea"
                        clearable
                        placeholder=""
                      >
                      </el-input>
                      <!-- </div> -->
                    </el-form-item>
                  </div>

                  <!-- 简答题类目 -->
                  <div
                    class="shortAnswer"
                    v-if="questionForm.questionType === 'shortAnswer'"
                  >
                    <!-- 简答题试题 -->
                    <el-form-item
                      label="简答题答案"
                      prop="shortAnswerTypeText.answer"
                    >
                      <div class="shortAnswerbox">
                        <el-input
                          v-model="questionForm.shortAnswerTypeText.answer"
                          type="textarea"
                          clearable
                        >
                        </el-input>
                      </div>
                    </el-form-item>
                  </div>

                  <el-form-item label="试题得分" prop="questionMark">
                    <el-input v-model="questionForm.questionMark"></el-input>
                  </el-form-item>
                  <el-form-item label="试题解析">
                    <el-input
                      type="textarea"
                      v-model="questionForm.questionAnalysis"
                    ></el-input>
                  </el-form-item>

                  <el-form-item size="large">
                    <el-button type="primary" @click="addQuestionBtn"
                      >添加试题</el-button
                    >
                    <el-button @click="questionReset">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="试卷总览" name="third">
                <paper-view
                  :dataList="paperView"
                  :paperInformations="paperViewInformations"
                  @clickImg="handlePaperViewPicture"
                ></paper-view>
              </el-tab-pane>
            </el-tabs>
            <!-- <div class="dialogVisible-content">
              <div class="left" >
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" draggable></el-tree>

              </div>
            </div> -->
          </el-dialog>

          <!-- <el-dialog
            title="添加试卷"
            :visible.sync="dialogVisibleAddPaper"
            id="dialogVisibleAddPaper"
            v-if="dialogVisibleAddPaper"
            top="10vh"
            class="abow_dialog dialogVisibleAddPaper"
          >
        </el-dialog> -->
          <el-dialog
            title="添加试卷"
            :visible.sync="dialogVisibleAddPaper"
            id="dialogVisibleAddPaper"
            v-if="dialogVisibleAddPaper"
            top="10vh"
            class="dialogVisibleAddPaper"
          >
            <div class="dialogVisible-content">
              <el-form
                class="addPaperForm"
                status-icon
                :model="addPaperForm"
                label-width="120px"
                ref="addPaperForm"
              >
                <el-form-item
                  label="试卷名称"
                  label-position="right"
                  prop="paperName"
                  width="180"
                >
                  <el-input
                    placeholder="试卷名称"
                    id="name"
                    v-model="addPaperForm.paperName"
                    type="text"
                    size="medium"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="通过分数"
                  label-position="right"
                  prop="paperName"
                  width="180"
                >
                  <el-input
                    placeholder="通过分数"
                    id="mark"
                    v-model="addPaperForm.passMark"
                    type="text"
                    size="medium"
                  >
                  </el-input>
                </el-form-item>
                <!-- <el-form-item
              label="班级名称"
              label-position="right"
              prop="className"
              width="180"
            >
              <el-input
                placeholder="班级名称"
                id="className"
                v-model="addPaperForm.className"
                type="text"
                size="medium"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="预设人数"
              label-position="right"
              prop="classCount"
              width="180"
            >
              <el-input
                placeholder="班级预设人数"
                id="classCount"
                v-model="addPaperForm.classCount"
                type="text"
                size="medium"
              >
              </el-input>
            </el-form-item>

            <el-form-item
              label="班级信息"
              label-position="right"
              prop="classInformations"
              width="180"
            >
              <el-input
                placeholder="班级基本信息"
                id="classInformations"
                v-model="addPaperForm.classInformations"
                :rows="5"
                type="textarea"
                size="medium"
              >
              </el-input>
            </el-form-item> -->

                <el-form-item class="btnItems" prop="btn">
                  <el-button
                    type="primary"
                    @click="createPaper"
                    class="createClassBtn"
                    >新建试卷</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>

          <el-dialog
            title="修改考试信息"
            :visible.sync="dialogVisibleChange"
            id="dialogVisibleChange"
            v-if="dialogVisibleChange"
            top="10vh"
          >
            <div class="dialogVisible-content">
              <el-form
                class="paperChangeForm"
                status-icon
                :model="paperChangeForm"
                :rules="paperChangeRules"
                label-width="120px"
                ref="paperChangeForm"
              >
                <el-form-item
                  label="试卷题目"
                  label-position="right"
                  prop="paperName"
                  width="180"
                >
                  <el-input
                    placeholder="试卷题目"
                    id="paperName"
                    v-model="paperChangeForm.paperName"
                    type="text"
                    size="medium"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="通过分数"
                  label-position="right"
                  prop="passMark"
                  width="180"
                >
                  <el-input
                    placeholder="通过分数"
                    id="passMark"
                    v-model="paperChangeForm.passMark"
                    type="text"
                    size="medium"
                  >
                  </el-input>
                </el-form-item>

                <el-form-item class="btnItems" prop="btn">
                  <el-button
                    type="primary"
                    @click="saveBtn('paperChangeForm')"
                    class="changeClass"
                    >修改</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>

          <el-dialog :visible.sync="dialogVisibleImg">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import paperView from "./paperView.vue";
export default {
  name: "paper-manager",
  components: {
    paperView,
  },
  created() {
    this.getMyPaperList();
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    var chooseContentPass = (rule, value, callback) => {
      console.log(value);
      let set = new Set(value);
      if (value.length != this.questionForm.choiceTypeText.choiceCount) {
        callback(new Error("答案选项不能为空"));
      }
      if (value.length != set.size) {
        callback(new Error("答案选项不能重复"));
      } else {
        callback();
      }
    };
    var mustNumberPass = (rule, value, callback) => {
      let RegExp = /[0-9]+/g;
      console.log(value);
      if (!RegExp.test(value)) {
        callback(new Error("不能为空且为数字"));
      } else {
        callback();
      }
    };

    var passMarkChangePass = (rule, value, callback) => {
      let regExp = /\d+/g;
      if (!regExp.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      //表单检查规则
      addQuestionRules: {
        questionName: [
          { validator: validatePass, trigger: "blur", required: true },
        ],
        questionMark: [
          { validator: mustNumberPass, trigger: "blur", required: true },
        ],
        ["choiceTypeText.choiceCount"]: [
          { validator: mustNumberPass, trigger: "blur" },
        ],
        ["completionTypeText.answer"]: [
          { validator: validatePass, trigger: "blur" },
        ],
        ["shortAnswerTypeText.answer"]: [
          { validator: validatePass, trigger: "blur" },
        ],
        ["choiceTypeText.chooseContent"]: [
          { validator: chooseContentPass, trigger: "blur" },
        ],
        questionType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
      },
      updateQuestionRules: {
        questionName: [
          { validator: validatePass, trigger: "blur", required: true },
        ],
        questionMark: [
          { validator: mustNumberPass, trigger: "blur", required: true },
        ],
        ["choiceTypeText.choiceCount"]: [
          { validator: mustNumberPass, trigger: "blur" },
        ],
        ["completionTypeText.answer"]: [
          { validator: validatePass, trigger: "blur" },
        ],
        ["shortAnswerTypeText.answer"]: [
          { validator: validatePass, trigger: "blur" },
        ],
        ["choiceTypeText.chooseContent"]: [
          { validator: chooseContentPass, trigger: "blur" },
        ],
        questionType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
      },

      paperChangeRules: {
        paperName: [
          { validator: validatePass, trigger: "blur", required: true },
        ],
        passMark: [
          { validator: passMarkChangePass, trigger: "blur", required: true },
        ],
      },

      radio: String.fromCodePoint(65),
      pagination: {
        currentPage: 1,
        pageSize: 10, //每页数据条数
        currPage: 1, //当前页数
      },

      dialogVisiblePaperDetail: false,
      dialogVisibleCreatePaper: false,
      dialogVisibleAddPaper: false,
      dialogVisibleImg: false,
      dialogImageUrl: "",

      activeNamedialogVisible: "first",

      //paperView的传输数据 试卷总览
      paperView: [],
      paperViewInformations: {
        paperTeacher: "荷和",
        paperName: "计算机科学与技术",
        paperMark: 0,
        // paperTime: 120,
      },

      //修改试卷信息表单
      paperChangeForm: {
        paperName: "",
        passMark: "",
        paperInformations: "",
      },
      dialogVisibleChange: false,

      courseSearch: "",
      classNewList: [],
      classList: [],

      treeData: [
        {
          label: `选择题`,
          id: "选择题",
          children: [
            {
              label: "单选题",
              id: "单选题",
              children: [],
            },
            {
              label: "多选题",
              id: "多选题",
              children: [],
            },
          ],
        },
        {
          label: "判断题",
          id: "判断题",
          children: [],
        },
        {
          label: "填空题",
          id: "填空题",
          children: [],
        },
        {
          label: "问答题",
          id: "问答题",
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label", //根据后台返回的字段去修改
      },

      paperDetailInformations: null,
      // hasUploadImgUrl = [],

      questionTreeForm: {
        imgUrl: [],
        questionId: "",
        questionItemLabel: "",
        questionName: "",
        questionType: "",
        questionMark: "",
        questionAnalysis: "",
        choiceTypeText: {
          choiceType: "singleChoice",
          chooseContent: [],
          choiceCount: 4,
          radio: "A",
          checkList: [],
        },
        judgementTypeText: {
          radio: "yes",
          // chooseContent: [],
        },
        completionTypeText: {
          answer: "",
        },
        shortAnswerTypeText: {
          answer: "",
        },
      },

      questionForm: {
        fileData: "",
        imgUrl: [],
        questionName: "",
        questionType: "",
        questionMark: "",
        questionAnalysis: "",
        choiceTypeText: {
          choiceType: "singleChoice",
          chooseContent: [],
          choiceCount: 4,
          radio: "A",
          checkList: ["A"],
        },
        judgementTypeText: {
          radio: "yes",
        },
        completionTypeText: {
          answer: "",
        },
        shortAnswerTypeText: {
          answer: "",
        },
      },

      addPaperForm: {
        paperName: "",
      },

      myPaperNewList: [],
      myPaperList: [],
    };
  },
  watch: {
    courseSearch() {},
    // defaultProps(val){
    //   console.log(val);
    // }
    // ["questionTreeForm.imgUrl"]() {
    //   console.log(this.questionTreeForm.imgUrl);
    // },
    activeNamedialogVisible(val) {
      // console.log(val == "first" && this.dialogVisiblePaperDetail == true);
      if (val == "first") {
        this.getPaperQuestion(this.paperDetailInformations);
      }
    },
  },
  methods: {
    saveBtn() {
      this.$refs["paperChangeForm"].validate((validate) => {
        if (validate) {
          this.updatePaper();
        } else {
          console.log("error");
          return false;
        }
      });
    },
    updatePaper() {
      return this.$request({
        url: "/api/paper/updatePaper",
        method: "post",
        data: {
          paperId: this.paperChangeForm.paperId,
          paperName: this.paperChangeForm.paperName,
          passMark: this.paperChangeForm.passMark,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: "修改成功",
            message: "试卷信息修改成功",
            duration: 3000,
            type: "success",
          });
          this.dialogVisibleChange = false
          this.getMyPaperList()
        }
      });
    },
    uploadFile(file) {
      console.log(file);
      this.questionForm.fileData.append("files", file.file); // append增加数据
      console.log(this.questionForm.fileData);
    },
    handleFileChange(file) {
      console.log(file);
      this.questionForm.imgUrl.push(file);
    },
    //移除文件
    handleFileRemove(file) {
      // 移除文件时，要重新给fileList赋值
      const arr = [];
      for (let i = 0; i < this.questionForm.imgUrl.length; i++) {
        if (this.questionForm.imgUrl[i].uid !== file.uid) {
          arr.push(this.questionForm.imgUrl[i]);
        }
      }
      this.questionForm.imgUrl = arr;
    },
    // changeImg(){
    //   console.log(this.questionTreeForm.imgUrl);
    // },
    // 上传图片方法
    uploadImage(param) {
      // console.log(param);
      const formData = new FormData();
      formData.append("file", param.file);
      this.$request({
        url: "/api/paper/uploadImg",
        method: "post",
        data: formData,
      })
        .then((res) => {
          console.log("上传图片成功");
          // console.log(res.data);
          let url = res.data;
          console.log(url);
          this.urlmysql(url);
        })
        .catch(() => {
          console.log("图片上传失败");
        });
    },

    uploadImageMore() {
      const formData = new FormData();
      this.questionForm.imgUrl.forEach((file) => {
        formData.append("files", file.raw);
      });
      return this.$request({
        url: "/api/paper/uploadImgMore",
        method: "post",
        data: formData,
      })
        .then((res) => {
          console.log("上传图片成功");
          // console.log(res.data);
          let url = res.data;
          // console.log(url);
          return url;
          // this.urlmysql(url);
        })
        .catch(() => {
          console.log("图片上传失败");
        });
    },

    urlmysql(url) {
      this.$request({
        url: "/api/paper/urlMysql",
        method: "post",
        data: {
          imgUrl: url,
          paperId: this.paperDetailInformations.paperId,
          questionId: this.questionTreeForm.questionId,
        },
      }).then((res) => {
        console.log(res);
      });
    },
    beforeAvatarUpload(file) {
      const isPic = file.type.indexOf("image") >= 0;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isPic) {
        this.$message.error("资质照片只能为图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isPic && isLt2M;
    },

    handleRemove(file) {
      // console.log(file, fileList);
      this.$request({
        url: "/api/paper/urlRemove",
        method: "post",
        data: {
          imgUrl: file.url,
          paperId: this.paperDetailInformations.paperId,
          questionId: this.questionTreeForm.questionId,
        },
      }).then(() => {
        this.getPaperQuestion(this.paperDetailInformations);
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    handlePaperViewPicture(url) {
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
    },
    questionResetTree() {
      this.questionTreeForm.questionName = "";
      this.questionTreeForm.questionMark = "";
      this.questionTreeForm.questionAnalysis = "";
      this.questionTreeForm.choiceTypeText.chooseContent = [];
      this.questionTreeForm.judgementTypeText.chooseContent = [];
      this.questionTreeForm.completionTypeText.answer = "";
      this.questionTreeForm.shortAnswerTypeText.answer = "";
    },

    questionReset() {
      this.questionForm.questionName = "";
      this.questionForm.questionMark = "";
      this.questionForm.questionAnalysis = "";
      this.questionForm.choiceTypeText.chooseContent = [];
      this.questionForm.judgementTypeText.chooseContent = [];
      this.questionForm.completionTypeText.answer = "";
      this.questionForm.shortAnswerTypeText.answer = "";
      this.questionForm.imgUrl = [];
      this.$refs.addUpload.clearFiles();
    },
    treeReset() {
      this.treeData = [
        {
          label: "选择题",
          id: "选择题",
          children: [
            {
              label: "单选题",
              id: "单选题",
              children: [],
            },
            {
              label: "多选题",
              id: "多选题",
              children: [],
            },
          ],
        },
        {
          label: "判断题",
          id: "判断题",
          children: [],
        },
        {
          label: "填空题",
          id: "填空题",
          children: [],
        },
        {
          label: "问答题",
          id: "问答题",
          children: [],
        },
      ];
    },
    checked() {
      // console.log(this.questionForm.choiceTypeText.choiceType);
      // console.log(this.questionForm.questionType);
      // console.log(this.paper);
    },
    treeRemove(node, data) {
      console.log(node, data);

      this.$confirm("此操作将删除该题目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/api/paper/removeQuestion",
            method: "post",
            data: {
              ...data,
            },
          }).then((res) => {
            if (res.data.code == 1) {
              const parent = node.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex((d) => d.id === data.id);
              children.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$message({
                type: "error",
                message: "删除失败!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //tree组件item点击触发事件
    handleNode(v) {
      if (typeof v.id === "string") {
        return;
      }
      let questionType = v.questionType.split(" ");

      this.questionTreeForm.questionItemLabel = v.questionItemLabel;
      this.questionTreeForm.questionName = v.questionName;
      this.questionTreeForm.questionType = questionType[0];
      this.questionTreeForm.questionMark = v.questionMark;
      this.questionTreeForm.questionAnalysis = v.questionAnalysis;
      this.questionTreeForm.questionId = v.questionId;
      this.questionTreeForm.imgUrl = v.imgUrl.map((item, index) => {
        return {
          name: `img ${index}`,
          url: item,
        };
      });

      if (questionType[0] == "choice") {
        this.questionTreeForm.choiceTypeText.choiceType = questionType[1];
        this.questionTreeForm.choiceTypeText.chooseContent = v.questionContent;
        this.questionTreeForm.choiceTypeText.choiceCount =
          v.questionContent.length;
        if (questionType[1] == "singleChoice") {
          this.questionTreeForm.choiceTypeText.radio = String.fromCharCode(
            v.questionContent.findIndex((item) => item == v.answer) + 65
          );
        } else {
          let array = [];
          v.answer.forEach((itemself) => {
            array.push(
              String.fromCharCode(
                v.questionContent.findIndex((item) => item == itemself) + 65
              )
            );
          });
          this.questionTreeForm.choiceTypeText.checkList = array;
        }
      }

      if (questionType[0] == "judgement") {
        console.log("judgement");
        this.questionTreeForm.judgementTypeText.chooseContent =
          v.questionContent;
        this.questionTreeForm.judgementTypeText.radio = v.answer;
      }
      if (questionType[0] == "completion" || questionType[0] == "shortAnswer") {
        this.questionTreeForm.completionTypeText.answer = v.answer;
        this.questionTreeForm.shortAnswerTypeText.answer = v.answer;
      }
      this.activeTreeNode = v;
      console.log(v);
      console.log("end");
    },
    handleNodeClick() {},

    lookDialogVisible() {},

    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currPage = val;
    },

    setPaperViewInformations(row) {
      // console.log(row);
      // console.log(this.$store.state.user);
      this.$set(
        this.paperViewInformations,
        "paperTeacher",
        this.$store.state.user.username
      );
      this.$set(this.paperViewInformations, "paperName", row.paperName);
      this.$set(this.paperViewInformations, "paperMark", row.paperMark);
      // this.$set(this.paperViewInformations, "paperTime", 120);
    },

    getPaperDetail(row) {
      // console.log(row);
      // if(row)
      this.getPaperQuestion(row);
      this.setPaperViewInformations(row);

      //
      /**
       * 初始化dia打开的数据
       */
      //将pane的显示设置为first
      this.activeNamedialogVisible = "first";
      this.questionTreeForm.questionType = "";
      // this.dialogVisiblePaperDetail = true;
      // this.getPaperQuestion(row);
      console.log(this.paperDetailInformations);
      if (
        this.paperDetailInformations != row &&
        this.paperDetailInformations != null
      ) {
        this.questionReset();
        this.$refs.addUpload.clearFiles();
      }

      this.paperDetailInformations = row;

      console.log("row", row);
    },

    getPaperQuestion(row) {
      // this.treeReset();
      console.log("treeReset");
      this.$request({
        url: "/api/paper/getPaperQuestion",
        method: "post",
        data: {
          paperId: row.paperId,
        },
      }).then((res) => {
        this.treeData[0].children[0].children.splice(
          0,
          this.treeData[0].children[0].children.length
        );
        this.treeData[0].children[1].children.splice(
          0,
          this.treeData[0].children[1].children.length
        );
        this.treeData[1].children.splice(0, this.treeData[1].children.length);
        this.treeData[2].children.splice(0, this.treeData[2].children.length);
        this.treeData[3].children.splice(0, this.treeData[3].children.length);
        let data = res.data.data;
        // Vue.set(this.paperView,data)
        // this.$set(this.paperView,...data)

        this.paperView = data;
        console.log("paperView", this.paperView);
        data.forEach((item, index) => {
          // console.log(item);
          item.id = index;
          // console.log(item.answer);
          item.answer = JSON.parse(item.answer);
          // console.log(item.questionContent);
          item.questionContent = JSON.parse(item.questionContent);
          console.log(item);
          item.imgUrl = JSON.parse(item.imgUrl);

          switch (item.questionType) {
            case "choice singleChoice": {
              console.log("danxuant");
              item.label = `单选题${
                this.treeData[0].children[0].children.length + 1
              } ${item.questionName}`;
              item.questionItemLabel = `单选题${
                this.treeData[0].children[0].children.length + 1
              }`;
              this.treeData[0].children[0].children.push({
                ...item,
              });
              // console.log(this.treeData);
              break;
            }
            case "choice multipleChoice": {
              item.label = `多选题${
                this.treeData[0].children[1].children.length + 1
              } ${item.questionName}`;
              item.questionItemLabel = `多选题${
                this.treeData[0].children[1].children.length + 1
              }`;
              this.treeData[0].children[1].children.push({
                ...item,
              });
              break;
            }
            case "judgement": {
              item.label = `判断题${this.treeData[1].children.length + 1} ${
                item.questionName
              }`;
              item.questionItemLabel = `判断题${
                this.treeData[1].children.length + 1
              }`;
              this.treeData[1].children.push({
                ...item,
              });
              break;
            }
            case "completion": {
              item.label = `填空题${this.treeData[2].children.length + 1} ${
                item.questionName
              }`;
              item.questionItemLabel = `填空题${
                this.treeData[2].children.length + 1
              }`;
              this.treeData[2].children.push({
                ...item,
              });
              break;
            }
            case "shortAnswer": {
              item.label = `简答题${this.treeData[3].children.length + 1} ${
                item.questionName
              }`;
              item.questionItemLabel = `简答题${
                this.treeData[3].children.length + 1
              }`;
              this.treeData[3].children.push({
                ...item,
              });
              break;
            }
          }
        });
        // console.log(res.data.data);
        console.log(this.treeData);

        //显示dialogVisiblePaperDetail

        this.dialogVisiblePaperDetail = true;
      });
    },

    findQuestionContent() {
      switch (this.questionForm.questionType) {
        case "choice": {
          return this.questionForm.choiceTypeText;
        }
        case "judgement": {
          return this.questionForm.judgementTypeText;
        }
        case "completion": {
          return this.questionForm.completionTypeText;
        }
        case "shortAnswer": {
          return this.questionForm.shortAnswerTypeText;
        }
      }
    },
    findQuestionTreeContent() {
      switch (this.questionTreeForm.questionType) {
        case "choice": {
          return this.questionTreeForm.choiceTypeText;
        }
        case "judgement": {
          return this.questionTreeForm.judgementTypeText;
        }
        case "completion": {
          return this.questionTreeForm.completionTypeText;
        }
        case "shortAnswer": {
          return this.questionTreeForm.shortAnswerTypeText;
        }
      }
    },
    addQuestionBtn() {
      this.$refs["questionForm"].validate((validate) => {
        if (validate) {
          console.log("查看完成");
          this.uploadImageMore()
            .then((url) => {
              this.addQuestion(url);
            })
            .then(() => {
              this.questionForm.imgUrl = [];
              this.$refs.addUpload.clearFiles();
            });
        } else {
          console.log("error");
          return false;
        }
      });
    },
    addQuestion(url) {
      // this.uploadImageMore()
      return this.$request({
        url: "/api/paper/appendQuestion",
        method: "post",
        data: {
          paperId: this.paperDetailInformations.paperId,
          questionName: this.questionForm.questionName,
          questionType: this.questionForm.questionType,
          questionMark: this.questionForm.questionMark,
          questionContent: this.findQuestionContent(),
          questionAnalysis: this.questionForm.questionAnalysis,
          imgUrl: url,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.getPaperQuestion(this.paperDetailInformations);
          this.$notify({
            title: "添加试题",
            message: "添加试题成功",
            duration: 3000,
            type: "success",
          });
        } else {
          this.$notify({
            title: "添加失败",
            message: "添加试题失败",
            duration: 3000,
            type: "error",
          });
        }
      });
    },

    updateTreeNodeView() {
      this.activeTreeNode.questionItemLabel = this.questionTreeForm.questionItemLabel;
      this.activeTreeNode.questionName = this.questionTreeForm.questionName;
      this.activeTreeNode.questionMark = this.questionTreeForm.questionMark;
      this.activeTreeNode.questionAnalysis = this.questionTreeForm.questionAnalysis;
      this.activeTreeNode.questionId = this.questionTreeForm.questionId;
    },

    //更新试题按钮
    updateQuestionBtn() {
      this.$refs["questionTreeForm"].validate((validate) => {
        if (validate) {
          this.updateQuesiton();
        } else {
          console.log("error");
          return false;
        }
      });
    },
    updateQuesiton() {
      //修改后端数据
      this.$request({
        url: "/api/paper/updateQuestion",
        method: "post",
        data: {
          ...this.questionTreeForm,
          paperId: this.paperDetailInformations.paperId,
          questionContent: this.findQuestionTreeContent(),
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: "修改试题",
            message: "修改试题成功",
            duration: 3000,
            type: "success",
          });
          this.getPaperQuestion(this.paperDetailInformations);
          // this.updateTreeNodeView()
        } else {
          this.$notify({
            title: "修改失败",
            message: "修改试题失败",
            duration: 3000,
            type: "error",
          });
        }
      });
    },
    getMyPaperList() {
      this.$request({
        url: "/api/paper/getPaperList",
        method: "get",
      }).then((res) => {
        console.log(res);
        this.myPaperNewList = this.myPaperList = res.data.data;
      });
    },
    createPaper() {
      this.$request({
        url: "/api/paper/createPaper",
        method: "post",
        data: {
          paperName: this.addPaperForm.paperName,
          // passMark
        },
      }).then((res) => {
        console.log("createPaper", res);
        this.getMyPaperList();
        this.dialogVisibleAddPaper = false;
      });
    },
    addPaperDialog() {
      this.dialogVisibleAddPaper = true;
    },

    treeSort() {},
    handleDragStart(node, ev) {
      console.log("drag start", node);
      console.log(ev);
    },
    // handleDragEnter(draggingNode, dropNode, ev) {
    //   console.log('tree drag enter: ', dropNode.label);
    // },
    // handleDragLeave(draggingNode, dropNode, ev) {
    //   console.log('tree drag leave: ', dropNode.label);
    // },
    // handleDragOver(draggingNode, dropNode, ev) {
    //   console.log(ev);
    //   console.log(draggingNode);
    //   console.log('tree drag over: ', dropNode.label);
    //   // this.$alert()
    // },
    // handleDragEnd(draggingNode, dropNode, dropType, ev) {
    //   console.log(ev);
    //   console.log(draggingNode);
    //   console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    //   this.$alert()
    // },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log(draggingNode);
      console.log(ev);
      console.log("tree drop: ", dropNode.label, dropType);
      this.$alert();
    },
    //修改表项
    handleEdit(index, row) {
      console.log(index, row);

      this.paperChangeForm = row;
      //出现修改班级信息弹窗
      this.dialogVisibleChange = true;
    },
    //删除指定paper
    handleDelete(index, row) {
      console.log(row);
      this.$confirm("此操作将该试卷信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/api/paper/deletePaper",
            method: "post",
            data: {
              paperId: row.paperId,
            },
          }).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getMyPaperList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          // 向上拖拽 || 向下拖拽
          return type === "prev" || type === "next";
        }
      } else {
        // 不同级进行处理
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.paper-manager {
  // background: grey;
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 50px;
  .title {
    font-size: 28px;
    // margin-left:60px ;
    position: relative;
    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 5px;
      height: 28px;
      background-color: rgb(140, 197, 255);
      border-radius: 5px;
      top: 5px;
      left: -10px;
    }
  }
  .paper-manager-content {
    // margin: 0 50px;
    .search {
      margin-bottom: 20px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      /deep/ .el-input {
        width: 200px;
      }
      /deep/ .el-input__inner {
        width: 178px;
        margin-left: 20px;
      }
    }
    .add {
      margin-left: 20px;
      margin-top: 20px;
    }
    .table {
      margin: 20px;
      .pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }
      .addStudent {
        display: flex;
      }
      // span {
      //   margin-right: 50px;
      // }
    }
  }
}

.dialogVisible {
  .dialogVisiblePaperDetail {
    .dialogVisible-content {
      display: flex;
      flex-wrap: nowrap;
      height: 100%;
      .left {
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          min-width: 14px;
        }
        border-right: 1px solid #dcdfe6;
        width: 30%;
        height: 50vh;
        overflow: auto;
        .custom-tree-node {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;
          button {
          }
        }
      }

      .right {
        .question-form {
          margin: 0 20px;
          overflow: initial;
        }
        flex: 1;
        overflow: auto;
        max-height: 50vh;
      }
    }
  }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.abow_dialog {
  /deep/.el-dialog {
    .el-dialog__body {
      height: 60vh;
      overflow: hidden;
    }
  }
}
#dialogVisibleAddPaper {
  font-size: 16px;
}

// .abow_dialog {
//   // display: flex;
//   // justify-content: center;
//   // align-items: Center;
//   // overflow: hidden;
//   /deep/.el-dialog {
//     // margin: 0 auto !important;
//     // // height:10px;
//     // max-height: 100px;
//     // overflow: hidden;
//     .el-dialog__body {

//       height: 60vh;
//       // max-height: 100px;
//       // z-index: 1;
//       overflow: hidden;
//       // overflow-y: auto;
//     }
//   }
// }

.question-form {
  overflow: auto;
  max-height: 50vh;
}
.picture {
  // width: 300px;
  // height: 300px;
}
</style>