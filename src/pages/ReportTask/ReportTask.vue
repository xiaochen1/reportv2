<template>
  <div class="staproject flexauto flex-column">
    <div class="project-main flexauto flex-column">
      <div class="main-box flexauto flex-column">
        <div class="box-main flexauto flex-column">
          <div class="box-top">
            <div class="title">
              <span>统计项目</span>
            </div>
            <div class="split"></div>
          </div>
          <div class="box-body flexauto flex-column">
            <div class="body-content flexauto flex-column">
              <div class="top-search clearfix">
                <div class="search-tool fl">
                  <div class="search-input">
                    <el-input v-model="searchCondition.searchInput" class="mix-input mix-input-h32" placeholder="请输入搜索内容" @keyup.enter.native="toSearch"></el-input>
                  </div>
                  <div class="searchbtn icon-refresh fl" @click="toRefresh"></div>
                </div>

                <div class="tools fr ">
                  <div class="add-report clearfix" @click="handleClickAddTask">
                    <span class="icon-add"></span>
                    <span class="addtext">新增统计</span>
                  </div>
                </div>
              </div>
              <div class="content-container flexauto flex-column">
                <div class="data-content flexauto flex-column">
                  <div class="table-title-list">

                  </div>

                  <div class="data-body flexauto flex-column">
                    <div class="data-main flexauto flex-column">
                      <el-table :data="sheetList" class="mix-table" height="100%" style="width: 100%" row-key="project_id"
                        :expand-row-keys="expands" @row-click="handleTableRowClick">

                        <el-table-column label="project_id" prop="project_id">
                        </el-table-column>

                        <el-table-column label="project_name" prop="project_name">
                        </el-table-column>

                        <el-table-column label="description" prop="description">
                        </el-table-column>


                        <el-table-column label="schedule" prop="schedule">
                        </el-table-column>


                        <el-table-column label="type" prop="type">
                          <template slot-scope="scope">
                            <span v-if="scope.row.type == 1 || scope.row.type == '1' ">手动</span>
                            <span v-if="scope.row.type == 2 || scope.row.type == '2' ">自动</span>
                          </template>
                        </el-table-column>

                        <el-table-column label="created" prop="created">
                        </el-table-column>

                        <el-table-column label="操作" width="150">
                          <template slot-scope="scope">
                            <div class="operate-container">
                              <div class="opt-item" @click.stop="handleRowClickRun(scope.row)">
                                <span class="icon-torun"></span>
                              </div>

                              <div class="opt-item" @click.stop="handleRowClickEdit(scope.row)">
                                <span class="icon-edit"></span>
                              </div>

                              <div class="opt-item" @click.stop="handleRowClickDelete(scope.row)">
                                <span class="icon-delete"></span>
                              </div>
                            </div>

                          </template>
                        </el-table-column>


                        <el-table-column type="expand" width="50">
                          <template slot-scope="props">
                            <table class="row-expand-table">

                              <tbody>
                                <tr>
                                  <td>项目编号</td>
                                  <td>{{ props.row.project_id }}</td>

                                  <td>项目名称</td>
                                  <td>{{ props.row.project_name }}</td>

                                  <td>项目描述</td>
                                  <td>{{ props.row.description }}</td>
                                </tr>

                                <tr>
                                  <td>执行周期</td>
                                  <td>{{ props.row.schedule }}</td>

                                  <td>执行启用</td>
                                  <td>{{ props.row.project_id }}</td>

                                  <td>统计类型</td>
                                  <td>
                                    <span v-if="props.row.type == 1 || props.row.type == '1' ">手动</span>
                                    <span v-if="props.row.type == 2 || props.row.type == '2' ">自动</span>
                                  </td>
                                </tr>

                                <tr>
                                  <td>用户</td>
                                  <td>{{ props.row.user_id }}</td>

                                  <td>客户</td>
                                  <td>{{ props.row.customer_id }}</td>

                                  <td>创建时间</td>
                                  <td>{{ props.row.created }}</td>
                                </tr>


                                <tr>
                                  <td>模板文件</td>
                                  <td colspan="5">{{ props.row.template }}</td>

                                </tr>


                                <tr>
                                  <td>脚本</td>
                                  <td colspan="5">{{ props.row.script }}</td>

                                </tr>
                              </tbody>

                            </table>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>

                    <div class="box-footer">
                      <div class="box-pagination">
                        <pagination ref="pagination" @pageChange="handlePageChange" @sizeChange="handleSizeChange"
                          :pageSize="searchCondition.page_size" :total="searchCondition.total"></pagination>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <el-dialog title="添加报表任务" :visible.sync="isShowAddView" width="40%" @open="handleAddViewOpen">
      <div class="dialog-container">
        <div class="dialog-body">
          <div class="dialog-content">
            <div class="list-item">
              <div class="item item-row">
                <div class="name">项目名称</div>
                <div class="value">
                  <el-input v-model="addSheetObj.project_name"></el-input>
                </div>
              </div>

            </div>

            <div class="list-item">
              <div class="item item-row">
                <div class="name">统计类型</div>
                <div class="value">
                  <el-radio-group v-model="addSheetObj.type">
                    <el-radio :label="1">手动执行</el-radio>
                    <el-radio :label="2">定时执行</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>


            <div class="list-item" v-show="addSheetObj.type == 2">
              <div class="item">
                <div class="name">执行周期</div>
                <div class="value">
                  <el-input v-model="addSheetObj.schedule"></el-input>
                </div>
              </div>
            </div>

            <div class="list-item">
              <div class="item item-row">
                <div class="name">报告归属</div>
                <div class="value">
                  <div class="value-item">
                    <el-select v-model="addSheetObj.user_id" placeholder="请选择用户" @change="handleAddUserChange">
                      <el-option v-for="item in addUserList" :key="item.user_id" :value="item.user_id" :label="item.user_id+';  '+item.username"></el-option>
                    </el-select>
                  </div>
                  <div class="value-item">
                    <el-select v-model="addSheetObj.customer_id" placeholder="请选择客户">
                      <el-option v-for="item in addCustomerList" :key="item.customer_id" :value="item.customer_id"
                        :label="item.customer_id+';  '+item.customer_name"></el-option>
                    </el-select>
                  </div>

                </div>
              </div>

            </div>

            
            <div class="list-item">
              <div class="item item-row">
                <div class="name">项目描述</div>
                <div class="value">
                  <el-input v-model="addSheetObj.description"></el-input>
                </div>
              </div>
            </div>

            <div class="list-item">
              <div class="item item-row">
                <div class="name">脚本</div>
                <div class="value">
                  <el-input type="textarea" v-model="addSheetObj.script"></el-input>
                </div>
              </div>
            </div>



            <div class="list-item">
              <div class="item item-row">
                <div class="name">模板</div>
                <div class="value">
                  <el-upload class="upload-demo" drag action="" 
                  ref="ref_addTplFile" 
                  multiple
                  :limit="1" 
                  :http-request="handleAddTplFileUpload" 
                  @on-exceed="handleAddTplFileExceed"
                  @change="handleAddTplChange">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>

                </div>
              </div>
            </div>


            
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClickCancelAdd">取 消</el-button>
        <el-button type="primary" @click="handleClickSaveAdd">保存</el-button>
      </span>
    </el-dialog>


    <el-dialog title="编辑" :visible.sync="isShowEditView" width="40%" @open="handleEditViewOpen">
      <div class="dialog-container">
        <div class="dialog-body">
          <div class="dialog-content">
            <div class="list-item">
              <div class="item item-row">
                <div class="name">项目名称</div>
                <div class="value">
                  <el-input v-model="editSheetObj.project_name"></el-input>
                </div>
              </div>

            </div>

            <div class="list-item">
              <div class="item item-row">
                <div class="name">统计类型</div>
                <div class="value">
                  <el-radio-group v-model="editSheetObj.type">
                    <el-radio :label="1">手动执行</el-radio>
                    <el-radio :label="2">定时执行</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>

            <div class="list-item">
              <div class="item item-row">
                <div class="name">报告归属</div>
                <div class="value">
                  <div class="value-item">
                    <el-select v-model="editSheetObj.user_id" placeholder="请选择用户" @change="handleEditUserChange">
                      <el-option v-for="item in editUserList" :key="item.user_id" :value="item.user_id" :label="item.user_id+';  '+item.username"></el-option>
                    </el-select>
                  </div>
                  <div class="value-item">
                    <el-select v-model="editSheetObj.customer_id" placeholder="请选择客户">
                      <el-option v-for="item in editCustomerList" :key="item.customer_id" :value="item.customer_id"
                        :label="item.customer_id+';  '+item.customer_name"></el-option>
                    </el-select>
                  </div>

                </div>
              </div>


            </div>

            <div class="list-item">
              <div class="item">
                <div class="name">执行周期</div>
                <div class="value">

                </div>
              </div>
            </div>


            <div class="list-item">
              <div class="item item-row">
                <div class="name">项目描述</div>
                <div class="value">
                  <el-input v-model="editSheetObj.description"></el-input>
                </div>
              </div>
            </div>


            <div class="list-item">
              <div class="item item-row">
                <div class="name">模板</div>
                <div class="value">
                  <el-upload class="upload-demo" drag action="" 
                  ref="ref_editTplFile" 
                  multiple
                  :limit="1" 
                  :http-request="handleEditTplFileUpload" 
                  @on-exceed="handleEditTplFileExceed"
                  @change="handleEditTplChange">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>

                </div>
              </div>
            </div>

            <div class="list-item">
              <div class="item item-row">
                <div class="name">脚本</div>
                <div class="value">
                  <el-input type="textarea" v-model="editSheetObj.script"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClickCancelEdit">取 消</el-button>
        <el-button type="primary" @click="handleClickSaveEdit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import pagination from "@/components/Pagination.vue";
  import ReportTaskApi from "@/api/reportTask.js";
  import CONFIG from "@/config.js";
  export default {
    data: function () {
      return {
        isShowAddView: false,
        isShowEditView: false,

        sheetList: [],
        expands: [], //展开行的key 数组


        addSheetObj: {},
        addUserList: [],
        addCustomerList: [],
        addTmpFile: "",

        editSheetObj: {},
        editUserList: [],
        editCustomerList: [],
        editTmpFile: {},


        searchCondition: {
          searchInput: "",
          page_size: 20,
          page_index: 1,
          total: 0
        },

      }
    },


    created: function () {
      let tempCondition = {
        page_size: this.searchCondition.page_size,
        page_index: this.searchCondition.page_index,
        project_name: ""
      };
      this.getSheetList(tempCondition);
    },

    methods: {

      //-------  通用函数  -------------------------------------------------------------------------------------


      getSheetList(conditionObj) {
        this.sheetList = [];
        let self = this;

        ReportTaskApi.current.taskList(function (res) {
          if (res.code == 200) {
            self.sheetList = res.result.data;
            self.searchCondition.total = res.result.total_records;
            self.$refs.pagination.changeTotal(self.searchCondition.total);
            self.$refs.pagination.changeCurrentPage(
              self.searchCondition.page_index
            );
          }
        }, conditionObj);
      },

      toSearch() {
        let tempCondition = {
          page_size: this.searchCondition.page_size,
          page_index: this.searchCondition.page_index,
          project_name: this.searchCondition.searchInput,
        };
        this.getSheetList(tempCondition);
      },


      toRefresh() {
        this.$router.go(0);
      },



      handleClickAddTask() {
        let self = this;
        this.isShowAddView = true;

        ReportTaskApi.current.getUserList(function (res) {
          if (res.code == 200) {
            self.addUserList = res.result.data;
          }
        });
      },


      handleTableRowClick(row, event, column) {
        if (this.expands.indexOf(row.project_id) > -1) {
          this.expands.splice(this.expands.indexOf(row.project_id), 1);
        } else {
          this.expands.push(row.project_id);
        }

      },

      handleRowClickRun: function (row) {
        console.log("点击启动");
        let self = this;
        ReportTaskApi.current.handStartTask(function (res) {
          if (res.code == 200) {
            self.$message({
              type: "success",
              message: res.msg
            });
          }
        }, {
          project_id: row.project_id
        });
      },

      handleRowClickEdit: function (row) {
        console.log("点击编辑");
        let self = this;

        ReportTaskApi.current.getTaskDetailById(function (res) {
          console.log(res);
          if (res.code == 200) {
            self.isShowEditView = true;
            self.editSheetObj = res.result;


            ReportTaskApi.current.getUserList(function (res) {
              // console.log(res);
              if (res.code == 200) {
                self.editUserList = res.result.data;
              }
            });

            ReportTaskApi.current.getCustomerbyUser(function (res) {
              // console.log(res);
              if (res.code == 200) {
                self.editCustomerList = res.result.data;
              }
            }, {
              user_id: self.editSheetObj.user_id
            });

            return ;

          } else {
            self.$message({
              type: "error",
              message: res.msg
            });
          }


        }, {
          project_id: row.project_id
        });

        // ReportTaskApi.current.editTask( function(res) {
        //   if (res.code == 200) {
        //     self.$message({type: "success", message: res.msg});
        //   }
        // },{
        //   project_id: row.project_id
        // });
      },

      handleRowClickDelete: function (row) {
        console.log("点击删除");
        let self = this;
        self.$confirm("是否删除id为" + row.project_id + "的项目?", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ReportTaskApi.current.deleteTask(function (res) {
            if (res.code == 200) {
              self.$message({
                type: "success",
                message: res.msg
              });
              self.$router.go(0);
            }
          }, {
            project_id: row.project_id
          });
        }).catch(() => {
          self.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      },




      //-------  添加 相关函数  -------------------------------------------------------------------------------------

      handleAddViewOpen() {
        this.resetAddViewRelativeData();
      },

      handleAddUserChange(value) {
        let self = this;
        self.addCustomerList = [];
        self.addSheetObj.customer_id = "";

        ReportTaskApi.current.getCustomerbyUser(function (res) {
          // console.log(res);
          if (res.code == 200) {
            self.addCustomerList = res.result.data;
          }
        }, {
          user_id: value
        });
      },

      handleClickCancelAdd() {
        this.isShowAddView = false;
      },

      handleClickSaveAdd() {
        let self = this;
        let tempSheet = JSON.parse(JSON.stringify(this.addSheetObj));
        if(tempSheet.type == 1) {
          tempSheet.schedule = "";
        }

        // tempSheet.script = encodeURIComponent(tempSheet.script);
        tempSheet.script = JSON.stringify(JSON.parse(tempSheet.script));
        console.log(tempSheet.script);
        console.log("--------------------");
        console.log(encodeURI(tempSheet.script) );

        console.log("parse--------------------");
        console.log(JSON.stringify(JSON.parse(tempSheet.script))  );

        console.log("encodeURI--------------------");
        console.log(encodeURI(tempSheet.script)  );

        tempSheet.script = encodeURI(tempSheet.script);
        // tempSheet.script = encodeURIComponent(tempSheet.script);


        let formdata = new FormData();
        formdata.append("template", this.addTmpFile);
        formdata.append("project_name", tempSheet.project_name);
        formdata.append("user_id", tempSheet.user_id);
        formdata.append("customer_id", tempSheet.customer_id);
        formdata.append("description", tempSheet.description);
        formdata.append("script", tempSheet.script);
        formdata.append("type", tempSheet.type);
        formdata.append("schedule", tempSheet.schedule);

        // self.$http.post("http://" +CONFIG.host + '/task/add', formdata).then(function (res) {
				// 	var result = res.data;
				// 	// console.log(that.$global.upfileImgPrefix);
				// 	if (result.code == 200) {
					
				// 		self.$message({
				// 			type: 'success',
				// 			message: result.msg
				// 		});
				// 	}

				// }).catch(function (err) {
				// 	console.log(err);
				// });

        ReportTaskApi.current.addTask(function (res) {
          // console.log(res);
          if (res.code == 200) {
            self.isShowAddView = false;
            self.$message({
              type: "success",
              message: res.msg
            });
            // self.$router.go(0);
          }
        }, formdata);
      },

      resetAddViewRelativeData() {
        this.addSheetObj = {
          project_name: "",
          user_id: "",
          customer_id: "",
          type: 1,
          schedule: "",
          description: "",
          script: "",
          template: "",
        };

        this.addUserList = [];
        this.addCustomerList = [];
      },


      handleAddTplChange(file, fileList) {
        console.log(file);
      },

      handleAddTplFileUpload(file, fileList) {
        // this.$refs["ref_addTplFile"].uploadFiles = [];
        this.addTmpFile = file.file;
      },


      handleAddTplFileExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },

      //-------  编 辑  -------------------------------------------------------------------------------------


      handleEditViewOpen() {
        this.resetEditViewRelativeData();
      },

      handleEditUserChange(value) {
        let self = this;
        self.editCustomerList = [];
        self.editSheetObj.customer_id = "";

        ReportTaskApi.current.getCustomerbyUser(function (res) {
          // console.log(res);
          if (res.code == 200) {
            self.editCustomerList = res.result.data;
          }
        }, {
          user_id: value
        });
      },

      handleClickCancelEdit() {
        this.isShowEditView = false;
      },

      handleClickSaveEdit() {
        let self = this;
        let tempSheet = JSON.parse(JSON.stringify(this.editSheetObj));
        if(tempSheet.type == 1) {
          tempSheet.schedule = "";
        }



        let formdata = new FormData();
        formdata.append("template", this.editTmpFile);
        formdata.append("project_id", tempSheet.project_id);
        formdata.append("project_name", tempSheet.project_name);
        formdata.append("user_id", tempSheet.user_id);
        formdata.append("customer_id", tempSheet.customer_id);
        formdata.append("description", tempSheet.description);
        formdata.append("script", tempSheet.script);
        formdata.append("type", tempSheet.type);
        formdata.append("schedule", tempSheet.schedule);

        ReportTaskApi.current.editTask(function (res) {
          // console.log(res);
          if (res.code == 200) {
            self.isShowEditView = false;
            self.$message({
              type: "success",
              message: res.msg
            });
            self.$router.go(0);
          }
        }, formdata);
      },

      resetEditViewRelativeData() {
        this.editUserList = [];
        this.editCustomerList = [];
      },


      handleEditTplChange(file, fileList) {
        console.log(file);
      },

      handleEditTplFileUpload(file, fileList) {
        // this.$refs["ref_addTplFile"].uploadFiles = [];
        this.editTmpFile = file.file;
      },


      handleEditTplFileExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },


      //-------  分页  -------------------------------------------------------------------------------------

      handlePageChange(value) {
        //   console.log("page----change");
        //   console.log(val);
        this.searchCondition.page_index = value;

        this.getSheetList({
          page_size: this.searchCondition.page_size,
          page_index: this.searchCondition.page_index,
          project_name: this.searchCondition.searchInput,
        });
      },

      handleSizeChange(value) {
        //   console.log(val);
        this.searchCondition.page_size = value;

        this.getSheetList({
          page_size: this.searchCondition.page_size,
          page_index: this.searchCondition.page_index,
          project_name: this.searchCondition.searchInput,
        });
      }
    },

    components: {
      pagination
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/StaProject/StaProject.scss";
</style>