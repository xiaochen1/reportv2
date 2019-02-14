<template>
  <div class="staproject flexauto flex-column">
    <div class="project-main flexauto flex-column">
      <div class="main-box flexauto flex-column">
        <div class="box-main flexauto flex-column">
          <div class="box-top">
            <div class="title">
              <span>报表项目</span>
            </div>
            <div class="split"></div>
          </div>
          <div class="box-body flexauto flex-column">
            <div class="body-content flexauto flex-column">
              <div class="top-search clearfix">
                <div class="search-tool fl">
                  <div class="search-input">
                    <el-input v-model="searchCondition.searchInput" class="mix-input mix-input-h32" placeholder="请输入搜索内容"
                      @keyup.enter.native="toSearch"></el-input>
                    <span class="searchbtn icon-search" @click="toSearch"></span>
                  </div>
                  <div class="refresh icon-refresh fl" @click="toRefresh"></div>
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

    <el-dialog title="添加报表任务" :visible.sync="isShowAddView" width="50%" @open="handleAddViewOpen">
      <div class="dialog-container">
        <div class="dialog-body">
          <div class="dialog-content">
            <div class="list-item">
              <div class="report-item item-row">
                <div class="name">项目名称</div>
                <div class="value">
                  <el-input v-model="addSheetObj.project_name"></el-input>
                </div>
              </div>

            </div>

            <div class="list-item">
              <div class="report-item item-row">
                <div class="name">统计类型</div>
                <div class="value">
                  <el-radio-group v-model="addSheetObj.type">
                    <el-radio :label="1">手动执行</el-radio>
                    <el-radio :label="2">定时执行</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>


            <div class="list-item schedule" v-show="addSheetObj.type == 2">
              <div class="report-item item-row">
                <div class="name">执行周期</div>
                <div class="value  schedule-comp clearfix">

                  <el-form ref="ruleForm" class="demo-ruleForm">
                    <el-form-item class="cron" label="">
                      <el-tabs type="border-card" v-model="addCurrentActiveTab">

                        <el-tab-pane label="分" name="minute">

                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="addMinuteObj.type" label="*">每分 允许的通配符</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="addMinuteObj.type" label="-">周期从</el-radio>
                              <el-input v-model="addMinuteObj.circleStart" type="number" :min="1" :max="59"></el-input>
                              <span>-</span>
                              <el-input v-model="addMinuteObj.circleEnd" type="number" :min="1" :max="59"></el-input>分

                            </div>

                            <div class="item">
                              <el-radio v-model="addMinuteObj.type" label="/"></el-radio>每
                              <el-input v-model="addMinuteObj.everyGap" type="number" :min="1" :max="59"></el-input>分钟执行一次,
                              从第
                              <el-input v-model="addMinuteObj.everyStart" type="number" :min="0" :max="59"></el-input>分开始，第
                              <el-input v-model="addMinuteObj.everyEnd" type="number" :min="0" :max="59"></el-input>分结束
                            </div>

                            <div class="item">
                              <el-radio v-model="addMinuteObj.type" label="point">指定</el-radio>
                              <div class="many" v-show="addMinuteObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="addMinuteObj.selectMany">
                                    <el-checkbox v-for="item in addMinuteObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>
                        </el-tab-pane>

                        <el-tab-pane label="时" name="hour">
                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="addHourObj.type" label="*">每时 允许的通配符</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="addHourObj.type" label="-">周期从</el-radio>
                              <el-input v-model="addHourObj.circleStart" type="number" :min="0" :max="23"></el-input>
                              <span>-</span>
                              <el-input v-model="addHourObj.circleEnd" type="number" :min="1" :max="23"></el-input>时

                            </div>

                            <div class="item">
                              <el-radio v-model="addHourObj.type" label="/"></el-radio>每
                              <el-input v-model="addHourObj.everyGap" type="number" :min="0" :max="23"></el-input>小时执行一次,
                              从第
                              <el-input v-model="addHourObj.everyStart" type="number" :min="0" :max="23"></el-input>点开始，第
                              <el-input v-model="addHourObj.everyEnd" type="number" :min="0" :max="23"></el-input>点结束
                            </div>

                            <div class="item">
                              <el-radio v-model="addHourObj.type" label="point">指定</el-radio>
                              <div class="many" v-show="addHourObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="addHourObj.selectMany">
                                    <el-checkbox v-for="item in addHourObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>
                        </el-tab-pane>

                        <el-tab-pane label="日" name="day">
                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="addDayObj.type" label="*">日 允许的通配符[ , - / ?]</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="addDayObj.type" label="-">周期从</el-radio>
                              <el-input v-model="addDayObj.circleStart" type="number" :min="0" :max="31"></el-input>
                              <span>-</span>
                              <el-input v-model="addDayObj.circleEnd" type="number" :min="1" :max="31"></el-input>日
                            </div>

                            <div class="item">
                              <el-radio v-model="addDayObj.type" label="/"></el-radio>每
                              <el-input v-model="addDayObj.everyGap" type="number" :min="1" :max="31"></el-input>天执行一次,
                              从第
                              <el-input v-model="addDayObj.everyStart" type="number" :min="1" :max="31"></el-input>号开始，第
                              <el-input v-model="addDayObj.everyEnd" type="number" :min="1" :max="31"></el-input>号结束
                            </div>

                            <!-- <div class="item">
                                <el-radio v-model="addDayObj.type" label="?">不指定</el-radio>
                              </div> -->

                            <div class="item">
                              <el-radio v-model="addDayObj.type" label="point" @change="handleAddClickDayPoint">指定</el-radio>
                              <div class="many" v-show="addDayObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="addDayObj.selectMany">
                                    <el-checkbox v-for="item in addDayObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>
                        </el-tab-pane>

                        <el-tab-pane label="月" name="month">
                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="addMonthObj.type" label="*">月 允许的通配符[ , - * / ]</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="addMonthObj.type" label="-">周期从</el-radio>
                              <el-input v-model="addMonthObj.circleStart" type="number" :min="0" :max="23"></el-input>
                              <span>-</span>
                              <el-input v-model="addMonthObj.circleEnd" type="number" :min="1" :max="59"></el-input>日
                            </div>

                            <div class="item">
                              <el-radio v-model="addMonthObj.type" label="/"></el-radio>每
                              <el-input v-model="addMonthObj.everyGap" type="number" :min="1" :max="12"></el-input>月执行一次,
                              从第
                              <el-input v-model="addMonthObj.everyStart" type="number" :min="1" :max="12"></el-input>月开始，第
                              <el-input v-model="addMonthObj.everyEnd" type="number" :min="1" :max="12"></el-input>月结束
                            </div>

                            <div class="item">
                              <el-radio v-model="addMonthObj.type" label="point">指定</el-radio>
                              <div class="many" v-show="addMonthObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="addMonthObj.selectMany">
                                    <el-checkbox v-for="item in addMonthObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>

                        </el-tab-pane>

                        <el-tab-pane label="周" name="week">

                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="addWeekObj.type" label="*">周 允许的通配符[ , - * / ]</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="addWeekObj.type" label="-">周期从</el-radio>星期
                              <el-input v-model="addWeekObj.circleStart" type="number" :min="0" :max="6"></el-input>
                              <span style="margin: 0 10px;">-</span>星期
                              <el-input v-model="addWeekObj.circleEnd" type="number" :min="0" :max="6"></el-input>
                            </div>



                            <!--      6#3    表示    第三个星期五-->
                            <!--                   
                              <div class="item">
                                <el-radio v-model="addWeekObj.type" label="#">第</el-radio>
                                <el-input v-model="addWeekObj.everyStart" type="number" :min="1" :max="4"></el-input>周的星期
                                <el-input v-model="addWeekObj.week" type="number" :min="1" :max="7"></el-input>
                              </div> 
                            -->

                            <!-- <div class="item">
                              <el-radio v-model="addWeekObj.type" label="?">不指定</el-radio> <span>(?)</span>
                            </div> -->

                            <div class="item">
                              <el-radio v-model="addWeekObj.type" label="point" @change="handleAddClickWeekPoint">指定</el-radio>
                              <span>(a,b,c...)</span>
                              <div class="many" v-show="addWeekObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="addWeekObj.selectMany">
                                    <el-checkbox v-for="item in addWeekObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>
                        </el-tab-pane>

                      </el-tabs>

                      <div class="cron-result">

                        <div class="result-item">
                          <div class="title">分:</div>
                          <el-input class="content" v-model="add_cpt_minute" disabled></el-input>

                        </div>

                        <div class="result-item">
                          <div class="title">时:</div>
                          <el-input class="content" v-model="add_cpt_hour" disabled></el-input>
                        </div>

                        <div class="result-item">
                          <div class="title">日:</div>
                          <el-input class="content" v-model="add_cpt_day" disabled></el-input>
                        </div>

                        <div class="result-item">
                          <div class="title">月:</div>
                          <el-input class="content" v-model="add_cpt_month" disabled></el-input>
                        </div>

                        <div class="result-item">
                          <div class="title">周:</div>
                          <el-input class="content" v-model="add_cpt_week" disabled></el-input>
                        </div>

                      </div>

                    </el-form-item>

                  </el-form>

                </div>
              </div>
            </div>

            <div class="list-item">
              <div class="report-item item-row">
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
              <div class="report-item item-row">
                <div class="name">项目描述</div>
                <div class="value">
                  <el-input v-model="addSheetObj.description"></el-input>
                </div>
              </div>
            </div>

            <div class="list-item">
              <div class="report-item item-row">
                <div class="name">脚本</div>
                <div class="value">
                  <el-input type="textarea" v-model="addSheetObj.script"></el-input>
                </div>
              </div>
            </div>



            <div class="list-item">
              <div class="report-item item-row">
                <div class="name">模板</div>
                <div class="value">
                  <el-upload class="upload-demo" drag action="" ref="ref_addTplFile" multiple :limit="1" :http-request="handleAddTplFileUpload"
                    @on-exceed="handleAddTplFileExceed" @change="handleAddTplChange">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
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


    <el-dialog title="编辑" :visible.sync="isShowEditView" width="50%" @open="handleEditViewOpen">
      <div class="dialog-container">
        <div class="dialog-body">
          <div class="dialog-content">
            <div class="list-item">
              <div class="report-item item-row">
                <div class="name">项目名称</div>
                <div class="value">
                  <el-input v-model="editSheetObj.project_name"></el-input>
                </div>
              </div>

            </div>

            <div class="list-item">
              <div class="report-item item-row">
                <div class="name">统计类型</div>
                <div class="value">
                  <el-radio-group v-model="editSheetObj.type">
                    <el-radio :label="1">手动执行</el-radio>
                    <el-radio :label="2">定时执行</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>


            <div class="list-item schedule" v-show="editSheetObj.type == 2">
              <div class="report-item item-row">
                <div class="name">执行周期</div>
                <div class="value  schedule-comp clearfix">

                  <el-form ref="ruleForm" class="demo-ruleForm">
                    <el-form-item class="cron" label="">
                      <el-tabs type="border-card" v-model="editCurrentActiveTab">

                        <el-tab-pane label="分" name="minute">

                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="editMinuteObj.type" label="*">每分 允许的通配符</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="editMinuteObj.type" label="-">周期从</el-radio>
                              <el-input v-model="editMinuteObj.circleStart" type="number" :min="1" :max="59"></el-input>
                              <span>-</span>
                              <el-input v-model="editMinuteObj.circleEnd" type="number" :min="1" :max="59"></el-input>分

                            </div>

                            <div class="item">
                              <el-radio v-model="editMinuteObj.type" label="/"></el-radio>每
                              <el-input v-model="editMinuteObj.everyGap" type="number" :min="1" :max="59"></el-input>分钟执行一次,
                              从第
                              <el-input v-model="editMinuteObj.everyStart" type="number" :min="0" :max="59"></el-input>分开始，第
                              <el-input v-model="editMinuteObj.everyEnd" type="number" :min="0" :max="59"></el-input>分结束
                            </div>

                            <div class="item">
                              <el-radio v-model="editMinuteObj.type" label="point">指定</el-radio>
                              <div class="many" v-show="editMinuteObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="editMinuteObj.selectMany">
                                    <el-checkbox v-for="item in editMinuteObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>
                        </el-tab-pane>

                        <el-tab-pane label="时" name="hour">
                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="editHourObj.type" label="*">每时 允许的通配符</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="editHourObj.type" label="-">周期从</el-radio>
                              <el-input v-model="editHourObj.circleStart" type="number" :min="0" :max="23"></el-input>
                              <span>-</span>
                              <el-input v-model="editHourObj.circleEnd" type="number" :min="1" :max="23"></el-input>时

                            </div>

                            <div class="item">
                              <el-radio v-model="editHourObj.type" label="/"></el-radio>每
                              <el-input v-model="editHourObj.everyGap" type="number" :min="0" :max="23"></el-input>小时执行一次,
                              从第
                              <el-input v-model="editHourObj.everyStart" type="number" :min="0" :max="23"></el-input>点开始，第
                              <el-input v-model="editHourObj.everyEnd" type="number" :min="0" :max="23"></el-input>点结束
                            </div>

                            <div class="item">
                              <el-radio v-model="editHourObj.type" label="point">指定</el-radio>
                              <div class="many" v-show="editHourObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="editHourObj.selectMany">
                                    <el-checkbox v-for="item in editHourObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>
                        </el-tab-pane>

                        <el-tab-pane label="日" name="day">
                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="editDayObj.type" label="*">日 允许的通配符[ , - / ?]</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="editDayObj.type" label="-">周期从</el-radio>
                              <el-input v-model="editDayObj.circleStart" type="number" :min="0" :max="31"></el-input>
                              <span>-</span>
                              <el-input v-model="editDayObj.circleEnd" type="number" :min="1" :max="31"></el-input>日
                            </div>

                            <div class="item">
                              <el-radio v-model="editDayObj.type" label="/"></el-radio>每
                              <el-input v-model="editDayObj.everyGap" type="number" :min="1" :max="31"></el-input>天执行一次,
                              从第
                              <el-input v-model="editDayObj.everyStart" type="number" :min="1" :max="31"></el-input>号开始，第
                              <el-input v-model="editDayObj.everyEnd" type="number" :min="1" :max="31"></el-input>号结束
                            </div>

                            <!-- <div class="item">
                                <el-radio v-model="editDayObj.type" label="?">不指定</el-radio>
                              </div> -->

                            <div class="item">
                              <el-radio v-model="editDayObj.type" label="point" @change="handleEditClickDayPoint">指定</el-radio>
                              <div class="many" v-show="editDayObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="editDayObj.selectMany">
                                    <el-checkbox v-for="item in editDayObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>
                        </el-tab-pane>

                        <el-tab-pane label="月" name="month">
                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="editMonthObj.type" label="*">月 允许的通配符[ , - * / ]</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="editMonthObj.type" label="-">周期从</el-radio>
                              <el-input v-model="editMonthObj.circleStart" type="number" :min="0" :max="23"></el-input>
                              <span>-</span>
                              <el-input v-model="editMonthObj.circleEnd" type="number" :min="1" :max="59"></el-input>日
                            </div>

                            <div class="item">
                              <el-radio v-model="editMonthObj.type" label="/"></el-radio>每
                              <el-input v-model="editMonthObj.everyGap" type="number" :min="1" :max="12"></el-input>月执行一次,
                              从第
                              <el-input v-model="editMonthObj.everyStart" type="number" :min="1" :max="12"></el-input>月开始，第
                              <el-input v-model="editMonthObj.everyEnd" type="number" :min="1" :max="12"></el-input>月结束
                            </div>

                            <div class="item">
                              <el-radio v-model="editMonthObj.type" label="point">指定</el-radio>
                              <div class="many" v-show="editMonthObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="editMonthObj.selectMany">
                                    <el-checkbox v-for="item in editMonthObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>

                        </el-tab-pane>

                        <el-tab-pane label="周" name="week">

                          <div class="card-box">
                            <div class="item">
                              <el-radio v-model="editWeekObj.type" label="*">周 允许的通配符[ , - * / ]</el-radio>
                            </div>

                            <div class="item">
                              <el-radio v-model="editWeekObj.type" label="-">周期从</el-radio>星期
                              <el-input v-model="editWeekObj.circleStart" type="number" :min="0" :max="6"></el-input>
                              <span style="margin: 0 10px;">-</span>星期
                              <el-input v-model="editWeekObj.circleEnd" type="number" :min="0" :max="6"></el-input>
                            </div>



                            <!--      6#3    表示    第三个星期五-->
                            <!--                   
                              <div class="item">
                                <el-radio v-model="editWeekObj.type" label="#">第</el-radio>
                                <el-input v-model="editWeekObj.everyStart" type="number" :min="1" :max="4"></el-input>周的星期
                                <el-input v-model="editWeekObj.week" type="number" :min="1" :max="7"></el-input>
                              </div> 
                            -->

                            <!-- <div class="item">
                              <el-radio v-model="editWeekObj.type" label="?">不指定</el-radio> <span>(?)</span>
                            </div> -->

                            <div class="item">
                              <el-radio v-model="editWeekObj.type" label="point" @change="handleEditClickWeekPoint">指定</el-radio>
                              <span>(a,b,c...)</span>
                              <div class="many" v-show="editWeekObj.type == 'point'">
                                <div class="radio-item">
                                  <el-checkbox-group v-model="editWeekObj.selectMany">
                                    <el-checkbox v-for="item in editWeekObj.selectArr" :label="item" :key="item">{{item}}</el-checkbox>
                                  </el-checkbox-group>
                                </div>
                              </div>
                            </div>

                          </div>
                        </el-tab-pane>

                      </el-tabs>

                      <div class="cron-result">

                        <div class="result-item">
                          <div class="title">分:</div>
                          <el-input class="content" v-model="edit_cpt_minute" disabled></el-input>

                        </div>

                        <div class="result-item">
                          <div class="title">时:</div>
                          <el-input class="content" v-model="edit_cpt_hour" disabled></el-input>
                        </div>

                        <div class="result-item">
                          <div class="title">日:</div>
                          <el-input class="content" v-model="edit_cpt_day" disabled></el-input>
                        </div>

                        <div class="result-item">
                          <div class="title">月:</div>
                          <el-input class="content" v-model="edit_cpt_month" disabled></el-input>
                        </div>

                        <div class="result-item">
                          <div class="title">周:</div>
                          <el-input class="content" v-model="edit_cpt_week" disabled></el-input>
                        </div>

                      </div>

                    </el-form-item>

                  </el-form>

                </div>
              </div>
            </div>

            <div class="list-item">
              <div class="report-item item-row">
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
              <div class="report-item">
                <div class="name">执行周期</div>
                <div class="value">

                </div>
              </div>
            </div>


            <div class="list-item">
              <div class="report-item item-row">
                <div class="name">项目描述</div>
                <div class="value">
                  <el-input v-model="editSheetObj.description"></el-input>
                </div>
              </div>
            </div>

            <div class="list-item">
              <div class="report-item item-row">
                <div class="name">脚本</div>
                <div class="value">
                  <el-input type="textarea" v-model="editSheetObj.script"></el-input>
                </div>
              </div>
            </div>


            <div class="list-item">
              <div class="report-item item-row">
                <div class="name">模板</div>
                <div class="value">
                  <el-upload class="upload-demo" drag action="" ref="ref_editTplFile" multiple :file-list="editTplFileList"
                    :limit="1" :http-request="handleEditTplFileUpload" @on-exceed="handleEditTplFileExceed"
                    @before-upload="handleEditTplFileBeforeUpload" @change="handleEditTplChange">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
                  </el-upload>

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
        addTplFile: "",

        addCurrentActiveTab: "minute",

        addMinuteObj: {
          type: "*",
          circleStart: 1,
          circleEnd: 1,

          everyStart: "",
          everyEnd: "",
          everyGap: 1,

          selectArr: [],
          selectMany: []
        },

        addHourObj: {
          type: "*",
          circleStart: 1,
          circleEnd: 1,

          everyStart: "",
          everyEnd: "",
          everyGap: 1,

          selectArr: [],
          selectMany: []
        },

        addDayObj: {
          type: "*",
          circleStart: 1,
          circleEnd: 1,

          everyStart: "",
          everyEnd: "",
          everyGap: 1,

          selectArr: [],
          selectMany: [],

          lastDay: "L",
          noPoint: "?"
        },

        addMonthObj: {
          type: "*",

          circleStart: 1,
          circleEnd: 1,

          everyStart: "",
          everyEnd: "",
          everyGap: 1,

          selectArr: [],
          selectMany: [],

          lastDay: "L",
          noPoint: "?"
        },

        addWeekObj: {
          type: "*",
          circleStart: 0,
          circleEnd: 1,

          everyStart: "",
          everyEnd: "",
          //						everyGap: 1,
          week: 0,

          selectArr: [],
          selectMany: [],

          lastWeekN: 1
        },

        editSheetObj: {},
        editUserList: [],
        editCustomerList: [],
        editTplFileList: [],
        editTplFile: "",


        editCurrentActiveTab: "minute",
        editMinuteObj: {
          type: "*",
          circleStart: 1,
          circleEnd: 1,

          everyStart: "",
          everyEnd: "",
          everyGap: 1,

          selectArr: [],
          selectMany: []
        },

        editHourObj: {
          type: "*",
          circleStart: 1,
          circleEnd: 1,

          everyStart: "",
          everyEnd: "",
          everyGap: 1,

          selectArr: [],
          selectMany: []
        },

        editDayObj: {
          type: "*",
          circleStart: 1,
          circleEnd: 1,

          everyStart: "",
          everyEnd: "",
          everyGap: 1,

          selectArr: [],
          selectMany: [],

          lastDay: "L",
          noPoint: "?"
        },

        editMonthObj: {
          type: "*",

          circleStart: 1,
          circleEnd: 1,

          everyStart: "",
          everyEnd: "",
          everyGap: 1,

          selectArr: [],
          selectMany: [],

          lastDay: "L",
          noPoint: "?"
        },

        editWeekObj: {
          type: "*",
          circleStart: 0,
          circleEnd: 6,

          everyStart: 0,
          //						everyGap: 1,
          week: 1,

          selectArr: [],
          selectMany: [],

          lastWeekN: 1
        },


        searchCondition: {
          searchInput: "",
          page_size: 20,
          page_index: 1,
          total: 0
        },

      }
    },

    computed: {

      add_cpt_minute: function () {
        switch (this.addMinuteObj.type) {
          case "*":
            return "*";
            break;
          case "-":
            return (
              this.addMinuteObj.circleStart + "-" + this.addMinuteObj.circleEnd
            );
            break;

          case "/":
            if (this.addMinuteObj.everyGap == "") {
              this.addMinuteObj.everyGap = 1;
            }
            if (this.addMinuteObj.everyStart == "") {
              return "*" + "/" + this.addMinuteObj.everyGap;
              break;
            } else if (this.addMinuteObj.everyEnd == "") {
              return (
                this.addMinuteObj.everyStart + "/" + this.addMinuteObj.everyGap
              );
              break;
            }
            return (
              this.addMinuteObj.everyStart +
              "-" +
              this.addMinuteObj.everyEnd +
              "/" +
              this.addMinuteObj.everyGap
            );
            break;

          case "point":
            return this.addMinuteObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.addMinuteObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },
      add_cpt_hour: function () {
        switch (this.addHourObj.type) {
          case "*":
            return "*";
            break;
          case "-":
            return this.addHourObj.circleStart + "-" + this.addHourObj.circleEnd;
            break;

          case "/":
            if (this.addHourObj.everyGap == "") {
              this.addHourObj.everyGap = 1;
            }
            if (this.addHourObj.everyStart == "") {
              return "*" + "/" + this.addHourObj.everyGap;
              break;
            } else if (this.addHourObj.everyEnd == "") {
              return this.addHourObj.everyStart + "/" + this.addHourObj.everyGap;
              break;
            }
            return (
              this.addHourObj.everyStart +
              "-" +
              this.addHourObj.everyEnd +
              "/" +
              this.addHourObj.everyGap
            );
            break;

          case "point":
            return this.addHourObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.addHourObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },
      add_cpt_day: function () {
        switch (this.addDayObj.type) {
          case "*":
            return "*";
            break;
          case "-":
            return this.addDayObj.circleStart + "-" + this.addDayObj.circleEnd;
            break;

          case "/":
            if (this.addDayObj.everyGap == "") {
              this.addDayObj.everyGap = 1;
            }
            if (this.addDayObj.everyStart == "") {
              return "*" + "/" + this.addDayObj.everyGap;
              break;
            } else if (this.addDayObj.everyEnd == "") {
              return this.addDayObj.everyStart + "/" + this.addDayObj.everyGap;
              break;
            }
            return (
              this.addDayObj.everyStart +
              "-" +
              this.addDayObj.everyEnd +
              "/" +
              this.addDayObj.everyGap
            );
            break;

          case "?":
            return "?";
            break;

          case "point":
            return this.addDayObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.addDayObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },
      add_cpt_month: function () {
        switch (this.addMonthObj.type) {
          case "*":
            return "*";
            break;
          case "-":
            return (
              this.addMonthObj.circleStart + "-" + this.addMonthObj.circleEnd
            );
            break;

          case "/":
            if (this.addMonthObj.everyGap == "") {
              this.addMonthObj.everyGap = 1;
            }
            if (this.addMonthObj.everyStart == "") {
              return "*" + "/" + this.addMonthObj.everyGap;
              break;
            } else if (this.addMonthObj.everyEnd == "") {
              return (
                this.addMonthObj.everyStart + "/" + this.addMonthObj.everyGap
              );
              break;
            }
            return (
              this.addMonthObj.everyStart +
              "-" +
              this.addMonthObj.everyEnd +
              "/" +
              this.addMonthObj.everyGap
            );
            break;

          case "?":
            return "?";
            break;

          case "point":
            return this.addMonthObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.addMonthObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },
      add_cpt_week: function () {
        switch (this.addWeekObj.type) {
          case "*":
            return "*";
            break;

          case "-":
            return this.addWeekObj.circleStart + "-" + this.addWeekObj.circleEnd;
            break;

          case "/":
            return this.addWeekObj.everyStart + "-" + this.addWeekObj.everyGap;
            break;

          case "?":
            return "?";
            break;

          case "point":
            return this.addWeekObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.addWeekObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },

      add_cpt_result: function () {
        return (
          this.add_cpt_minute +
          " " +
          this.add_cpt_hour +
          " " +
          this.add_cpt_day +
          " " +
          this.add_cpt_month +
          " " +
          this.add_cpt_week
        );
      },

      edit_cpt_minute: function () {
        switch (this.editMinuteObj.type) {
          case "*":
            return "*";
            break;
          case "-":
            return (
              this.editMinuteObj.circleStart + "-" + this.editMinuteObj.circleEnd
            );
            break;

          case "/":
            if (this.editMinuteObj.everyGap == "") {
              this.editMinuteObj.everyGap = 1;
            }
            if (this.editMinuteObj.everyStart == "") {
              return "*" + "/" + this.editMinuteObj.everyGap;
              break;
            } else if (this.editMinuteObj.everyEnd == "") {
              return (
                this.editMinuteObj.everyStart + "/" + this.editMinuteObj.everyGap
              );
              break;
            }
            return (
              this.editMinuteObj.everyStart +
              "-" +
              this.editMinuteObj.everyEnd +
              "/" +
              this.editMinuteObj.everyGap
            );
            break;

          case "point":
            return this.editMinuteObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.editMinuteObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },

      edit_cpt_hour: function () {
        switch (this.editHourObj.type) {
          case "*":
            return "*";
            break;
          case "-":
            return (
              this.editHourObj.circleStart + "-" + this.editHourObj.circleEnd
            );
            break;

          case "/":
            if (this.editHourObj.everyGap == "") {
              this.editHourObj.everyGap = 1;
            }
            if (this.editHourObj.everyStart == "") {
              return "*" + "/" + this.editHourObj.everyGap;
              break;
            } else if (this.editHourObj.everyEnd == "") {
              return (
                this.editHourObj.everyStart + "/" + this.editHourObj.everyGap
              );
              break;
            }
            return (
              this.editHourObj.everyStart +
              "-" +
              this.editHourObj.everyEnd +
              "/" +
              this.editHourObj.everyGap
            );
            break;

          case "point":
            return this.editHourObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.editHourObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },

      edit_cpt_day: function () {
        switch (this.editDayObj.type) {
          case "*":
            return "*";
            break;
          case "-":
            return this.editDayObj.circleStart + "-" + this.editDayObj.circleEnd;
            break;

          case "/":
            if (this.editDayObj.everyGap == "") {
              this.editDayObj.everyGap = 1;
            }
            if (this.editDayObj.everyStart == "") {
              return "*" + "/" + this.editDayObj.everyGap;
              break;
            } else if (this.editDayObj.everyEnd == "") {
              return this.editDayObj.everyStart + "/" + this.editDayObj.everyGap;
              break;
            }
            return (
              this.editDayObj.everyStart +
              "-" +
              this.editDayObj.everyEnd +
              "/" +
              this.editDayObj.everyGap
            );
            break;

          case "?":
            return "?";
            break;

          case "point":
            return this.editDayObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.editDayObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },

      edit_cpt_month: function () {
        switch (this.editMonthObj.type) {
          case "*":
            return "*";
            break;
          case "-":
            return (
              this.editMonthObj.circleStart + "-" + this.editMonthObj.circleEnd
            );
            break;

          case "/":
            if (this.editMonthObj.everyGap == "") {
              this.editMonthObj.everyGap = 1;
            }
            if (this.editMonthObj.everyStart == "") {
              return "*" + "/" + this.editMonthObj.everyGap;
              break;
            } else if (this.editMonthObj.everyEnd == "") {
              return (
                this.editMonthObj.everyStart + "/" + this.editMonthObj.everyGap
              );
              break;
            }
            return (
              this.editMonthObj.everyStart +
              "-" +
              this.editMonthObj.everyEnd +
              "/" +
              this.editMonthObj.everyGap
            );
            break;
          case "?":
            return "?";
            break;

          case "point":
            return this.editMonthObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.editMonthObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },

      edit_cpt_week: function () {
        switch (this.editWeekObj.type) {
          case "*":
            return "*";
            break;

          case "-":
            return (
              this.editWeekObj.circleStart + "-" + this.editWeekObj.circleEnd
            );
            break;

          case "/":
            return this.editWeekObj.everyStart + "-" + this.editWeekObj.everyGap;
            break;

          case "?":
            return "?";
            break;

          case "point":
            return this.editWeekObj.selectMany.sort((a, b) => a - b).length > 0 ?
              this.editWeekObj.selectMany.sort((a, b) => a - b).join() :
              "*";
        }
      },

      edit_cpt_result: function () {
        return (
          this.edit_cpt_minute +
          " " +
          this.edit_cpt_hour +
          " " +
          this.edit_cpt_day +
          " " +
          this.edit_cpt_month +
          " " +
          this.edit_cpt_week
        );
      }
    },


    created: function () {

      let tempCondition = {
        page_size: this.searchCondition.page_size,
        page_index: this.searchCondition.page_index,
        project_name: ""
      };
      this.getSheetList(tempCondition);
      this.initCronData();
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

            if(self.editSheetObj.type == 2 || self.editSheetObj.type == 2 ) {
              self.$nextTick(() => {
                self.toReverseParseCron(self.editSheetObj.schedule);
              });
            }

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

            return;

          } else {
            self.$message({
              type: "error",
              message: res.msg
            });
          }


        }, {
          project_id: row.project_id
        });

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

      initCronData() {
        this.addMinuteObj.selectArr = [];
        this.addMinuteObj.selectMany = [];
        this.editMinuteObj.selectArr = [];
        this.editMinuteObj.selectMany = [];

        this.addHourObj.selectArr = [];
        this.addHourObj.selectMany = [];
        this.editHourObj.selectArr = [];
        this.editHourObj.selectMany = [];

        this.addDayObj.selectArr = [];
        this.addDayObj.selectMany = [];
        this.editDayObj.selectArr = [];
        this.editDayObj.selectMany = [];

        this.addMonthObj.selectArr = [];
        this.addMonthObj.selectMany = [];
        this.editMonthObj.selectArr = [];
        this.editMonthObj.selectMany = [];

        this.addWeekObj.selectArr = [];
        this.addWeekObj.selectMany = [];
        this.editWeekObj.selectArr = [];
        this.editWeekObj.selectMany = [];


        //初始化分钟多选数据
        for (var i = 0; i < 60; i++) {
          this.addMinuteObj.selectArr.push(i);
          this.editMinuteObj.selectArr.push(i);
        }

        //初始化小时多选数据
        for (var i = 0; i < 24; i++) {
          this.addHourObj.selectArr.push(i);
          this.editHourObj.selectArr.push(i);
        }

        //初始化日多选数据
        for (var i = 1; i <= 31; i++) {
          this.addDayObj.selectArr.push(i);
          this.editDayObj.selectArr.push(i);
        }

        //初始化秒月多选数据
        for (var i = 1; i <= 12; i++) {
          this.addMonthObj.selectArr.push(i);
          this.editMonthObj.selectArr.push(i);
        }

        //初始化周多选数据
        for (var i = 0; i < 7; i++) {
          this.addWeekObj.selectArr.push(i);
          this.editWeekObj.selectArr.push(i);
        }

        this.addMinuteObj.type = "*";
        this.addHourObj.type = "*";
        this.addDayObj.type = "*";
        this.addMonthObj.type = "*";
        this.addWeekObj.type = "*";

        this.editMinuteObj.type = "*";
        this.editHourObj.type = "*";
        this.editDayObj.type = "*";
        this.editMonthObj.type = "*";
        this.editWeekObj.type = "*";
      },

      handleAddViewOpen() {
        this.resetAddViewRelativeData();
        this.initCronData();
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
        if (tempSheet.type == 1 || tempSheet.type == '1') {
          tempSheet.schedule = "";
        }

        if (tempSheet.type == 2 || tempSheet.type == '2') {
          tempSheet.schedule = this.add_cpt_result;
        }

        console.log(tempSheet.schedule);

        // tempSheet.script = encodeURIComponent(JSON.stringify(JSON.parse(tempSheet.script)));
        tempSheet.script = JSON.stringify(JSON.parse(tempSheet.script));
        /*
          console.log("初始script------------------------");
          console.log(tempSheet.script);

          // tempSheet.script = encodeURI(tempSheet.script);
          console.log("encodeURI后的script------------------------");
          console.log(encodeURI(tempSheet.script) );
        
          // tempSheet.script = encodeURIComponent(tempSheet.script);
          console.log("encodeURIComponent后的script------------------------");
          console.log(encodeURIComponent(tempSheet.script));


          console.log("decodeURIComponent后的script------------------------");
          console.log(decodeURIComponent(encodeURIComponent(tempSheet.script)));

            // console.log("parse--------------------");
          // console.log(JSON.stringify(JSON.parse(tempSheet.script))  );

        */
        let formdata = new FormData();
        formdata.append("template", this.addTplFile);
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
        let self = this;
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
        this.addTplFile = "";

        this.$nextTick(() => {
          self.$refs.ref_addTplFile.uploadFiles = [];
        });
      },


      handleAddTplChange(file, fileList) {
        console.log(file);
      },

      handleAddTplFileUpload(file, fileList) {
        this.addTplFile = file.file;
      },


      handleAddTplFileExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },




      handleAddClickDayPoint() {
        this.addDayObj.selectMany = [1];
      },

      handleAddClickMonthPoint() {
        this.addMonthObj.selectMany = [1];
      },

      handleAddClickWeekPoint() {
        this.addWeekObj.selectMany = [1];
      },

      //-------  编 辑  -------------------------------------------------------------------------------------


      handleEditViewOpen() {
        let self = this;
        this.initCronData();
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
        if (tempSheet.type == 1 || tempSheet.type == '1') {
          tempSheet.schedule = "";
        }

        if (tempSheet.type == 2 || tempSheet.type == '2') {
          tempSheet.schedule = this.edit_cpt_result;
        }

        let formdata = new FormData();
        formdata.append("template", this.editTplFile);
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
        let self = this;
        this.editUserList = [];
        this.editCustomerList = [];
        this.editTplFile = "";

        this.$nextTick(() => {
          console.log("edit view open nexttick");
          self.$refs.ref_editTplFile.uploadFiles = [];
        });
      },


      handleEditTplChange(file, fileList) {
        console.log(file);
      },

      handleEditTplFileBeforeUpload(file, fileList) {
        console.log("edit ----- beforeupload");
        // this.editTplFile = "";
      },

      handleEditTplFileUpload(file, fileList) {
        this.editTplFile = file.file;
      },


      handleEditTplFileExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },

      handleEditClickDayPoint() {
        this.editDayObj.selectMany = [1];
      },

      handleEditClickMonthPoint() {
        this.editMonthObj.selectMany = [1];
      },

      handleEditClickWeekPoint() {
        this.editWeekObj.selectMany = [1];
      },

      //重置  编辑  时的  定时任务结果  相关数据
      resetEditCronData() {
        this.editCurrentActiveTab = "minute";
        this.editMinuteObj.type = "*";
        this.editHourObj.type = "*";
        this.editDayObj.type = "*";
        this.editMonthObj.type = "*";
        this.editWeekObj.type = "*";
      },


      //定时任务反向解析
      toReverseParseCron(str) {
        // console.log("反向解析");
        var temparr = str.split(" ");
        // console.log(temparr);
        if (temparr.length == 5) {
          var minute = temparr[0];
          var hour = temparr[1];
          var day = temparr[2];
          var month = temparr[3];
          var week = temparr[4];

          //解析周
          switch (week) {
            // case "?":
            //   this.editWeekObj.type = "?";
            //   break;
            case "*":
              this.editWeekObj.type = "*";
              break;
            default:

              if (week.indexOf("-") > -1) {
                this.editWeekObj.type = "-";
                this.editWeekObj.circleStart = parseInt(week.split("-")[0]);
                this.editWeekObj.circleEnd = parseInt(week.split("-")[1]);
                break;
              }

              this.editWeekObj.type = "point";
              this.editWeekObj.selectMany = week.split(",").map(v => parseInt(v));
              break;
          }

          //解析月
          switch (month) {
    
            // case "?":
            //   this.editDayObj.type = "?";
            //   break;
            case "*":
              this.editMonthObj.type = "*";
              break;

            default:
              // console.log(month);
              // 每 n  月执行
              if (month.indexOf("/") > -1) {
                // console.log("每 n  月执行");
                // console.log(/^(\d){1,}-(\d){1,}\/(\d){1,}$/.test(month));
                // console.log(/^(\d){1,}\/(\d){1,}$/.test(month));
                // console.log(/^[*]\/(\d){1,}$/.test(month));

                if(/^(\d){1,}-(\d){1,}\/(\d){1,}$/.test(month)){
                  //   5-19/3  ----->    ["5-19","3"]
                  var tmparr = month.split("/");
                  // console.log("a-b/c");
                  // console.log(tmparr);
                  this.editMonthObj.type = "/";
                  this.editMonthObj.everyGap = parseInt(tmparr[1]);
                  this.editMonthObj.everyStart = parseInt(tmparr[0].split("-")[0]);
                  this.editMonthObj.everyEnd = parseInt(tmparr[0].split("-")[1]);
                  break;
                }

                if(/^(\d){1,}\/(\d){1,}$/.test(month)){
                  //   19/3  ----->    ["19","3"]
                  var tmparr = month.split("/");
                  // console.log("a/c");
                  // console.log(tmparr);
                  this.editMonthObj.type = "/";
                  this.editMonthObj.everyGap = parseInt(tmparr[1]);
                  this.editMonthObj.everyStart = parseInt(tmparr[0]);
                  this.editMonthObj.everyEnd = "";
                  break;
                }

                if(/^[*]\/(\d){1,}$/.test(month)){
                  var tmparr = month.split("/");
                  // console.log("*/c");
                  // console.log(tmparr);
                  this.editMonthObj.type = "/";
                  this.editMonthObj.everyGap = tmparr[1];
                  this.editMonthObj.everyStart = "";
                  this.editMonthObj.everyEnd = "";
                  break;
                }

                // console.log("默认天处理");
                this.editMonthObj.type = "/";
                this.editMonthObj.everyGap = 1;
                this.editMonthObj.everyStart = "";
                this.editMonthObj.everyEnd = "";
                break;
              }

              // 每   n  天执行
              if (/^(\d){1,}-(\d){1,}$/.test(month)) {
                var tmparr = month.split("-");
                this.editMonthObj.type = "-";               
                this.editMonthObj.circleStart = parseInt(tmparr[0]);
                this.editMonthObj.circleEnd = parseInt(tmparr[1]);
                break;
              }

              this.editMonthObj.type = "point";
              this.editMonthObj.selectMany = month
                .split(",")
                .map(v => parseInt(v));
              break;
          }

          //解析日
          switch (day) {


            // case "?":
            //   this.editDayObj.type = "?";
            //   break;
            case "*":
              this.editDayObj.type = "*";
              break;
            default:
              // console.log(day);
              // 每 n  天执行
              if (hour.indexOf("/") > -1) {
                // console.log("每 n  天执行");
                // console.log(/^(\d){1,}-(\d){1,}\/(\d){1,}$/.test(day));
                // console.log(/^(\d){1,}\/(\d){1,}$/.test(day));
                // console.log(/^[*]\/(\d){1,}$/.test(day));

                if(/^(\d){1,}-(\d){1,}\/(\d){1,}$/.test(day)){
                  //   5-19/3  ----->    ["5-19","3"]
                  var tmparr = day.split("/");
                  this.editDayObj.type = "/";
                  this.editDayObj.everyGap = parseInt(tmparr[1]);
                  this.editDayObj.everyStart = parseInt(tmparr[0].split("-")[0]);
                  this.editDayObj.everyEnd = parseInt(tmparr[0].split("-")[1]);
                  break;
                }

                if(/^(\d){1,}\/(\d){1,}$/.test(day)){
                  //   5-19/3  ----->    ["5-19","3"]
                  var tmparr = day.split("/");
                  this.editDayObj.type = "/";
                  this.editDayObj.everyGap = parseInt(tmparr[1]);
                  this.editDayObj.everyStart = parseInt(tmparr[0]);
                  this.editDayObj.everyEnd = "";
                  break;
                }

                if(/^[*]\/(\d){1,}$/.test(day)){
                  var tmparr = day.split("/");
                  this.editDayObj.type = "/";
                  this.editDayObj.everyGap = tmparr[1];
                  this.editDayObj.everyStart = "";
                  this.editDayObj.everyEnd = "";
                  break;
                }

                // console.log("默认天处理");
                this.editDayObj.type = "/";
                this.editDayObj.everyGap = 1;
                this.editDayObj.everyStart = "";
                this.editDayObj.everyEnd = "";
                break;
              }

              // 每   n  天执行
              if (/^(\d){1,}-(\d){1,}$/.test(day)) {
                var tmparr = day.split("-");
                this.editDayObj.type = "-";               
                this.editDayObj.circleStart = parseInt(tmparr[0]);
                this.editDayObj.circleEnd = parseInt(tmparr[1]);
                break;
              }

              this.editDayObj.type = "point";
              this.editDayObj.selectMany = day
                .split(",")
                .map(v => parseInt(v));
              break;

          }

          //解析时
          switch (hour) {

            // case "?":
            //   this.editMinuteObj.type = "?";
            //   break;
            case "*":
              this.editHourObj.type = "*";
              break;
            default:
              // console.log(hour);
              // 每 n  小时执行
              if (hour.indexOf("/") > -1) {
                // console.log("每 n  小时执行");
                // console.log(/^(\d){1,}-(\d){1,}\/(\d){1,}$/.test(hour));
                // console.log(/^(\d){1,}\/(\d){1,}$/.test(hour));
                // console.log(/^[*]\/(\d){1,}$/.test(hour));

                if(/^(\d){1,}-(\d){1,}\/(\d){1,}$/.test(hour)){
                  //   5-19/3  ----->    ["5-19","3"]
                  var tmparr = hour.split("/");
                  // console.log("a-b/c");
                  // console.log(tmparr);

                  this.editHourObj.type = "/";
                  this.editHourObj.everyGap = parseInt(tmparr[1]);
                  this.editHourObj.everyStart = parseInt(tmparr[0].split("-")[0]);
                  this.editHourObj.everyEnd = parseInt(tmparr[0].split("-")[1]);
                  break;
                }

                if(/^(\d){1,}\/(\d){1,}$/.test(hour)){
                  //   5-19/3  ----->    ["5-19","3"]
                  var tmparr = hour.split("/");
                  // console.log("a/c");
                  // console.log(tmparr);
                  this.editHourObj.type = "/";
                  this.editHourObj.everyGap = parseInt(tmparr[1]);
                  this.editHourObj.everyStart = parseInt(tmparr[0]);
                  this.editHourObj.everyEnd = "";
                  break;
                }

                if(/^[*]\/(\d){1,}$/.test(hour)){
                  var tmparr = hour.split("/");
                  // console.log("*/c");
                  // console.log(tmparr);
                  this.editHourObj.type = "/";
                  this.editHourObj.everyGap = parseInt(tmparr[1]);
                  this.editHourObj.everyStart = "";
                  this.editHourObj.everyEnd = "";
                  break;
                }

                // console.log("默认小时处理");
                this.editHourObj.type = "/";
                this.editHourObj.everyGap = 1;
                this.editHourObj.everyStart = "";
                this.editHourObj.everyEnd = "";
                break;
              }

              // 每   n  小时执行
              if (/^(\d){1,}-(\d){1,}$/.test(hour)) {
                var tmparr = hour.split("-");
                this.editHourObj.type = "-";               
                this.editHourObj.circleStart = parseInt(tmparr[0]);
                this.editHourObj.circleEnd = parseInt(tmparr[1]);
                break;
              }

              this.editHourObj.type = "point";
              this.editHourObj.selectMany = hour
                .split(",")
                .map(v => parseInt(v));
              break;
          
          }

          //解析分
          switch (minute) {
            // case "?":
            //   this.editMinuteObj.type = "?";
            //   break;
            case "*":
              this.editMinuteObj.type = "*";
              break;
            default:
              // console.log(minute);
              // 每 n  分执行
              if (minute.indexOf("/") > -1) {
                // console.log("每 n  分执行");
                // console.log(/^(\d){1,}-(\d){1,}\/(\d){1,}$/.test(minute));
                // console.log(/^(\d){1,}\/(\d){1,}$/.test(minute));
                // console.log(/^[*]\/(\d){1,}$/.test(minute));

                if(/^(\d){1,}-(\d){1,}\/(\d){1,}$/.test(minute)){
                  //   5-19/3  ----->    ["5-19","3"]
                  var tmparr = minute.split("/");
                  // console.log(tmparr);
                  // console.log("a-b/c");
                  this.editMinuteObj.type = "/";
                  this.editMinuteObj.everyGap = parseInt(tmparr[1]);
                  this.editMinuteObj.everyStart = parseInt(tmparr[0].split("-")[0]);
                  this.editMinuteObj.everyEnd = parseInt(tmparr[0].split("-")[1]);
                  break;
                }

                if(/^(\d){1,}\/(\d){1,}$/.test(minute)){
                  //   5-19/3  ----->    ["5-19","3"]
                  var tmparr = minute.split("/");
                  // console.log(tmparr);
                  // console.log("a/c");
                  this.editMinuteObj.type = "/";
                  this.editMinuteObj.everyGap = parseInt(tmparr[1]);
                  this.editMinuteObj.everyStart = parseInt(tmparr[0]);
                  this.editMinuteObj.everyEnd = "";
                  break;
                }

                if(/^[*]\/(\d){1,}$/.test(minute)){
                  var tmparr = minute.split("/");
                  this.editMinuteObj.type = "/";
                  // console.log(tmparr);
                  // console.log("*/c");
                  this.editMinuteObj.everyGap = parseInt(tmparr[1]);
                  this.editMinuteObj.everyStart = "";
                  this.editMinuteObj.everyEnd = "";
                  break;
                }

                // console.log("默认分处理");
                this.editMinuteObj.type = "/";
                this.editMinuteObj.everyGap = 1;
                this.editMinuteObj.everyStart = "";
                this.editMinuteObj.everyEnd = "";
                break;
              }

              // 每   n  分执行
              if (/^(\d){1,}-(\d){1,}$/.test(minute)) {
                var tmparr = minute.split("-");
                this.editMinuteObj.type = "-";               
                this.editMinuteObj.circleStart = parseInt(tmparr[0]);
                this.editMinuteObj.circleEnd = parseInt(tmparr[1]);
                break;
              }

              this.editMinuteObj.type = "point";
              this.editMinuteObj.selectMany = minute
                .split(",")
                .map(v => parseInt(v));
              break;
          }
         
        } else {
          console.log("数据格式有误");
          this.resetEditCronData();
        }
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
  @import "@/assets/sass/pages/ReportTask/ReportTask.scss";
</style>