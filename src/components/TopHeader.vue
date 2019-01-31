<template>
  <div class="top-header">
    <div class="top-container">
      <div class="top-main">
        <div class="top-content">
          <div class="top-box fl">

          </div>

          <!-- <div class="tool-box fr">
              <div class="box-item version">
                <span class="icon-version"></span>
              </div>
            
          </div> -->

          <div class="tool-box fr">

            <div class="box-item version-box ">
                <span class="icon-version"></span>
            </div>
            <div class=" box-item user-box clearfix">
              <div class="info user-avatar">
                <span class=" avatar icon-avatar"></span>
              </div>
              <div class="info username">
                <span>{{accountInfoObj.username}}</span>
                <span class="tog icon-toggle"></span>
              </div>

              <div class="relative">
                <div class="rel-box">
                  <div class="item">
                    <div class="info account-info">
                      <span class="icon-version"></span>
                      <span>账户信息</span>
                    </div>
                  </div>

                  <!-- <div class="item">
                    <div class="psw-info">
                      <span class="rel-icon icon-version"></span>
                      <span>修改密码</span>
                    </div>
                  </div> -->

                  <div class="item">
                    <div class="info ">
                      <span class="icon-logout"></span>
                      <span>退出登录</span>
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
  export default {
    data: function () {
      return {
        accountInfoObj: {
          user_id: "",
          username: ""
        },
      };
    },

    mounted: function () {
      var self = this;
    },

    methods: {

    }
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/sass/components/TopHeader.scss";
  @import "@/assets/sass/common/icon.scss";
</style>