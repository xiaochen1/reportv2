<template>
  <div class="pagination-container">
    <div class="block">
      <el-pagination 
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      
      :current-page="current_page"
      :page-sizes="[20,30,50, 100, 200]" 
      :page-size="psize" 
      :total="total"
      layout="total, sizes, prev, pager, next, jumper" >
      </el-pagination>
    </div>
  </div>

</template>

<script>
export default {
  data: function() {
    return {
      current_page: 1,
      total: 0,
      psize: 0
    };
  },
  methods: {
    handleSizeChange(size) {
      console.log(size);
      // this.pageSize = size;
      this.$emit("sizeChange", size);
    },

    handleCurrentChange(val) {
      this.$emit("pageChange",val);
    },

    changeTotal(val){
    	this.total=parseInt(val);
    },

    changeCurrentPage(val){
    	this.current_page=parseInt(val);
    },
  },
  props: {
    pageSize: {
      default: 0
    }
  },

  watch: {
    psize: function(){
      return this.pageSize;
    }
  }
};
</script>


<style lang="scss" scoped>
@import "@/assets/sass/components/pagination.scss";
</style>
