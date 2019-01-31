<template>
  <div class="staresult flexauto flex-column">
    <div class="result-main flexauto flex-column">
      <div class="main-box flexauto flex-column">
        <div class="box-main flexauto flex-column">
          <div class="box-top">
            <div class="title">
              <span>报表结果</span>
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

                </div>
              </div>
              <div class="content-container flexauto flex-column">
                <div class="data-content flexauto flex-column">
                  <div class="table-title-list">

                  </div>

                  <div class="data-body flexauto flex-column">
                    <div class="data-main flexauto flex-column">
                      <el-table :data="sheetList" class="mix-table" height="100%" style="width: 100%"   >

                        <el-table-column label="project_id" prop="output_id" width="120">
                        </el-table-column>

                        <el-table-column label="project_name" prop="output_name">
                        </el-table-column>

                        <el-table-column label="description" prop="description">
                        </el-table-column>


                        <el-table-column label="scheduled" prop="project_id">
                        </el-table-column>

                        <el-table-column label="file" prop="file">
                        </el-table-column>

                        <el-table-column label="created" prop="created">
                        </el-table-column>

                        <el-table-column label="操作" width="150">
                          <template slot-scope="scope">
                            <div class="operate-container">
                              <div class="opt-item" >
                                <span class="down icon-download">
                                  <a :href=" imgPrefix + '/' +  '?file_path='+scope.row.file" download></a>
                                </span>
                              </div>

                              <div class="opt-item" @click.stop="handleRowClickDelete(scope.row)">
                                <span class="icon-delete"></span>
                              </div>
                            </div>

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

  </div>
</template>


<script>
  import pagination from "@/components/Pagination.vue";
  import ReportResultApi from "@/api/reportResult.js";
  import CONFIG from "@/config.js";
  export default {
    data: function () {
      return {
        sheetList: [],

        // currentSheet: {
        //   "output_id": 1,
        //   "output_name": "测试",
        //   "description": "测试",
        //   "project_id": "2",
        //   "user_id": "1",
        //   "equipment_id": "1",
        //   "customer_id": "1",
        //   "file": "1.xls",
        //   "template": null,
        //   "script": null,
        //   "reference": null,
        //   "created": "2019-01-30 16:03:56",
        //   "is_available": 1
        // },

        searchCondition: {
          searchInput: "",
          page_size: 20,
          page_index: 1,
          total: 0
        },

      }
    },

    computed: {
			imgPrefix: function () {
				return CONFIG.ip.result.current.download;
			}
		},


    created: function () {
      let tempCondition = {
        page_size: this.searchCondition.page_size,
        page_index: this.searchCondition.page_index,
        output_name: "",
      };
      this.getSheetList(tempCondition);
    },

    methods: {

      getSheetList(conditionObj) {
        //   console.log("初始化页面，查询列表");
        this.sheetList = [];
        let self = this;
        ReportResultApi.current.reportList(function (res) {
          // console.log(res);
          if (res.code == 200) {
            //   console.log(res.result.data);
            self.sheetList = res.result.data;
            self.searchCondition.total = res.result.total_records;
            self.$refs.pagination.changeTotal(self.searchCondition.total);
            self.$refs.pagination.changeCurrentPage(
              self.searchCondition.page_index
            );
          }
        }, conditionObj);
      },

      toRefresh() {
        this.$router.go(0);
      },

       toSearch() {
        let tempCondition = {
          page_size: this.searchCondition.page_size,
          page_index: this.searchCondition.page_index,
          output_name: this.searchCondition.searchInput,
        };
        this.getSheetList(tempCondition);
      },

      handleRowClickDelete: function (row) {
        console.log("点击删除");
        ReportResultApi.current.deleteReport(function (res) {
          if (res.code == 200) {
            self.$message({
              type: "success",
              message: res.msg
            });
          }
        }, {
          output_id: row.output_id
        });
      },

      handlePageChange(value) {
        //   console.log("page----change");
        //   console.log(val);
        this.searchCondition.page_index = value;

        this.getSheetList({
          page_size: this.searchCondition.page_size,
          page_index: this.searchCondition.page_index,
          output_name: this.searchCondition.searchInput,
        });
      },

      handleSizeChange(value) {
        //   console.log(val);
        this.searchCondition.page_size = value;

        this.getSheetList({
          page_size: this.searchCondition.page_size,
          page_index: this.searchCondition.page_index,
          output_name: this.searchCondition.searchInput,
        });
      }
    },

    components: {
      pagination
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/StaResult/StaResult.scss";
</style>