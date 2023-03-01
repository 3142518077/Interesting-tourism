import { defineStore } from "pinia";

const startDate = new Date()
const endDate = new Date()
endDate.setDate(startDate.getDate() + 1)

const useMainStore = defineStore("main", {
  state: () => ({
    token: "",

    startDate: startDate,
    endDate: endDate,

    isLoading: false,

    numberPeoples: ["1 人","2 人","3 人","4 人","5 人","6 人"],
    prices: ["￥199","￥299","￥399","￥499","￥599","￥699","￥799"]
  }),
})

export default useMainStore
