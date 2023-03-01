<template>
  <div class="home" ref="homeRef">
    <van-nav-bar title="快乐旅途"></van-nav-bar>
    <div class="banner">
      <img src="@/assets/img/home/banner.webp" alt="" />
    </div>
    <search-box :hot-suggests="hotSuggests" />
    <div class="content">
      <category-list :categories="categories" />
      <house-area :houselist="houselist" />
    </div>
  </div>
  <div v-show="showSearchBar" class="home-top">
    <search-bar
    title="广州"
    startDate="02.09"
    endDate="02.10"
    />
  </div>
</template>

<script setup>
import { onActivated, ref, computed } from "vue";
import { useRouter } from "vue-router";
import useReachBottom from "@/hooks/useReachBottom";
import SearchBox from "./cpns/search-box.vue";
import CategoryList from "./cpns/category-list.vue";
import HouseArea from "./cpns/house-area.vue";
import SearchBar from "@/components/search-bar/index.vue"
import {
  getHomeHotSuggests,
  getHomeCategories,
  getHomeHouselist,
} from "@/service";
import useScroll from "@/hooks/useScroll";
const router = useRouter();
const hotSuggests = ref([]);
getHomeHotSuggests().then((res) => {
  hotSuggests.value = res.data;
});

const categories = ref([]);
getHomeCategories().then((res) => {
  categories.value = res.data;
});

let currentPage = 1;
const houselist = ref([]);
fetchHouseListData();

// 监听点击
function itemClick(houseId) {
  console.log("itemClick", houseId);
  router.push({
    path: "/detail/" + houseId,
  });
}

function fetchHouseListData() {
  getHomeHouselist(currentPage).then((res) => {
    houselist.value.push(...res.data);
    currentPage++;
  });
}

// 监听达到底部
useReachBottom(() => {
  fetchHouseListData();
});

// 监听页面的滚动
const { scrollTop } = useScroll();

const showSearchBar = computed(() => {
  return scrollTop.value >= 350;
});

// 跳转回home时, 保留原来的位置
const homeRef = ref()
onActivated(() => {
  homeRef.value?.scrollTo({
    top: scrollTop.value
  })
})

</script>

<style lang="less" scoped>
.home {
  padding-bottom: 50px;
}

.banner {
  img {
    width: 100%;
  }
}

.content {
  margin-top: 20px;
  background-color: #f5f7f9;
}

.home-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 16px 10px 16px;
  background-color: white;
  z-index: 100;
}
</style>
