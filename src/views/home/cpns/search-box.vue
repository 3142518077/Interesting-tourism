<template>
  <div class="serach-box">
    <div class="item location bottom-gray-line">
      <div class="city" @click="cityItemClick">{{ currentCity.cityName }}</div>
      <div class="current" @click="positionClick">
        <span class="mine">我的位置</span>
        <img src="@/assets/img/home/icon_location.png" alt="" />
      </div>
    </div>
  
    <div class="item date-range bottom-gray-line " @click="showCalendar = true">
      <div class="start">
        <div class="date">
          <span class="tip">入住</span>
          <span class="time">{{ startDateStr }}</span>
        </div>
        <div class="stay">共{{ stayCount }}晚</div>
      </div>
      <div class="end">
        <div class="date">
          <span class="tip">离店</span>
          <span class="time">{{ endDateStr }}</span>
        </div>
      </div>
    </div>
    <van-calendar 
      v-model:show="showCalendar"
      type="range"
      color="#ff9854"
      :round="false"
      :show-confirm="false"
      @confirm="onConfirm" 
    />

    <!-- 价格/人数选择 -->
    <div class="item price-counter bottom-gray-line">
      <div class="start" @click="showPickerFrist = true">
        <div class="date">
          <span class="tip">价格</span>
          <span class="time">{{ price }}</span>
        </div>
      </div>
      <div class="start" @click="showPicker = true">
        <div class="number-people">
          <div class="date">
          <span class="tip">人数</span>
          <span class="time">{{ numberPeople }}</span>
        </div>
        </div>
      </div>
      <!-- <div class="start" @click="showPickerFrist = true">{{ price }}</div>
      <div class="end" @click="showPicker = true">{{ numberPeople }}</div> -->
    </div>
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        title="选择人数"
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirmLast"
      />
    </van-popup>
    <van-popup v-model:show="showPickerFrist" round position="bottom">
      <van-picker
        title="选择价格"
        :columns="priceColumns"
        @cancel="showPickerFrist = false"
        @confirm="onConfirmPrice"
      />
    </van-popup>

    <div class="item hot-suggest">
      <template v-for="(item, index) in hotSuggests" :key="index">
        <span class="tag">{{ item.tagText.text }}</span>
      </template>
    </div>

    <div class="item search-btn">
      <div class="btn" @click="startSearch">开始搜索</div>
    </div>
  </div>
</template>

<script setup>
import useCityStore from "@/store/modules/city";
import { useRouter } from "vue-router";
import useMainStore from "@/store/modules/main"
import { storeToRefs } from "pinia"
import { ref, computed } from "vue"
import { formatMonthDay, getDiffDays } from "@/utils/format_date"

const positionClick = () => {
  navigator.geolocation.getCurrentPosition(res => {
    console.log("获取位置成功:", res)
  }, err => {
    console.log("获取位置失败:", err)
  }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  })
}

// 日期范围的处理
const mainStore = useMainStore()
const { startDate, endDate, numberPeoples, prices } = storeToRefs(mainStore)

const priceColumns = ref([])
prices.value.forEach((value) => {
  priceColumns.value.push(value)
})

const columns = ref([]);
numberPeoples.value.forEach((value) => {
  columns.value.push(value)
})

const startDateStr = computed(() => formatMonthDay(startDate.value))
const endDateStr = computed(() => formatMonthDay(endDate.value))
const stayCount = ref(getDiffDays(startDate.value, endDate.value))


const showCalendar = ref(false)
const showPicker = ref(false)
const showPickerFrist = ref(false)
const onConfirm = (value) => {
  // 1.设置日期
  const selectStartDate = value[0]
  const selectEndDate = value[1]
  mainStore.startDate = selectStartDate
  mainStore.endDate = selectEndDate
  stayCount.value = getDiffDays(selectStartDate, selectEndDate)

  // 2.隐藏日历
  showCalendar.value = false
}

const numberPeople = ref("任意人数")
const onConfirmLast = (value) => {
  // 设置人数
  numberPeople.value = value
  showPicker.value = false
}

const price = ref("任意价格")
const onConfirmPrice = (value) => {
  price.value = value
  showPickerFrist.value = false
}

defineProps({
  hotSuggests: {
    type: Object,
    default: () => [],
  },
});

const cityStore = useCityStore()
const { currentCity } = storeToRefs(cityStore)
const router = useRouter();
const startSearch = () => {
  router.push({
    path: "/search",
    query: {
      address: currentCity.value.cityName,
      startDate: startDateStr.value,
      endDate: endDateStr.value,
    },
  });
};

const cityItemClick = () => {
  router.push({
    path: "/city"
  })
}
</script>

<style lang="less" scoped>
.location {
  height: 44px;
  .city {
    flex: 1;
    font-size: 15px;
    padding: 0 10px 0 0;
    color: #333;
  }

  .current {
    display: flex;
    align-items: center;

    .mine {
      margin-right: 8px;
      font-size: 12px;
      color: #666;
    }
    img {
      width: 18px;
      height: 18px;
    }
  }
}

.date-range {
  height: 44px;
  .stay {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #666;
  }
}

.price-counter {
  height: 44px;
  .start {
    border-right: 1px solid f8f9f9;
  }
}

.keyword {
  height: 44px;
}

.hot-suggest {
  margin: 10px 0;

  .tag {
    font-size: 12px;
    padding: 4px 8px;
    margin: 3px;
    border-radius: 14px;
    color: #3f4954;
    background-color: #f1f3f5;
  }
}

.search-btn {
  .btn {
    width: 342px;
    height: 38px;
    max-height: 50px;
    font-weight: 500;
    font-size: 18px;
    line-height: 38px;
    text-align: center;
    border-radius: 20px;
    color: #fff;
    background-image: var(
      --tjc-theme-linear-gradient,
      linear-gradient(90deg, #fa8c1d, #fcaf3f)
    );
  }
}

.item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 20px;
  color: #999;
  margin-bottom: 10px;

  .number-people {
    position: relative;
    left: 66px;
  }

  .start {
    flex: 1;
    display: flex;
    height: 44px;
    align-items: center;
  }

  .end {
    min-width: 30%;
    padding-left: 20px;
  }

  .date {
    display: flex;
    flex-direction: column;

    .tip {
      font-size: 12px;
      color: #999;
    }

    .time {
      margin-top: 3px;
      color: #333;
      font-size: 15px;
      font-weight: 500;
    }
  }
}
</style>
