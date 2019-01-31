<template>
    <div class="index-container flex-wrap">
        <div class="leftbox ">
            <LeftMenu   ></LeftMenu>
        </div>
        <div class="rightbox flexauto flex-column">
            <div class="main flexauto flex-column">
                <div class="top">
                    <TopHeader></TopHeader>
                </div>

                <div class="main-content flexauto flex-column">
                    <div class="main-body flexauto flex-column">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LeftMenu from "@/components/LeftMenu.vue";
import TopHeader from "@/components/TopHeader.vue";
export default {
    data: function() {
        return {

        }
    },

    components: {
        LeftMenu,
        TopHeader,
    },

}
</script>


<style lang="scss" scoped>
@import "@/assets/sass/pages/index.scss";
</style>

