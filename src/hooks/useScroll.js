import { throttle } from "@/utils/common";
import {
  ref,
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
} from "vue";

export default function useWinScroll() {
  const scrollTop = ref(0);
  const scrollHeight = ref(0);
  const clientHeight = ref(0);

  const scrollFunc = throttle(function () {
    scrollTop.value = document.documentElement.scrollTop; // 距顶部
    scrollHeight.value = document.documentElement.scrollHeight; // 滚动条总高度
    clientHeight.value = document.documentElement.clientHeight; // 可视区高度
  });

  // 监听页面的滚动
  onMounted(() => {
    window.addEventListener("scroll", scrollFunc);
  });
  onActivated(() => {
    window.addEventListener("scroll", scrollFunc);
  });
  // 取消页面的滚动
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", scrollFunc);
  });
  onDeactivated(() => {
    window.removeEventListener("scroll", scrollFunc);
  });

  return {
    scrollTop,
    scrollHeight,
    clientHeight,
  };
}
