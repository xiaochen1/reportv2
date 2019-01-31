<template>
  <div class="left-menu">
    <div class="menu-container flex-column">
      <div class="system">
        <span>MixReport</span>
      </div>

      <div class="menu-main flex-1 flex-column">
        <div class="menu-body">
          <div v-for="item in navUrls" :class='{"nav-item": true, "active": $route.path == item.path}'
            @click="changePage(item.path)">
            <div class="nav-message">
              <span class="iconspan" :class="$route.path == item.path?item.iconActiveClass : item.iconClass"></span>
              <span>{{item.title}}</span>
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
        navUrls: [{
          title: "报表任务",
          path: "/task/index",
          iconClass: "icon-staproject-default",
          iconActiveClass: "icon-staproject-active",
        }, {
          title: "报表结果",
          path: "/result/index",
           iconClass: "icon-staresult-default",
          iconActiveClass: "icon-staresult-active",
        }]
      }
    },

    created: function() {
        console.log(this.$route);
    },

    methods: {
        changePage(path) {
            console.log(path);
            console.log(this.$route);
            this.$router.push(path);
        },
    },
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/sass/components/LeftMenu.scss";
</style>