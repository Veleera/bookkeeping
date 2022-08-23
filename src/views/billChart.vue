<template>
  <div id="echarts" ref="echartsRef" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, onUnmounted, toRefs, watch, reactive, inject } from "vue";

const echarts: any = inject("$echarts");
const props = defineProps<{
  option: any;
}>();
const { option } = toRefs(props);
let myEcharts: any = null;
const reactiveOption = reactive({
  
  tooltip: {},
  dataset: {
    dimensions: ["name", "amount"],
    source: option.value,
  },
  xAxis: { type: "category" },
  yAxis: {},
  series: [
    {
      type: "bar",
      itemStyle: {
        color: function (params: any) {
          if (params.value.amount > 0) {
            return "#67C23A";
          } else {
            return "#E6A23C";
          }
        },
      },
    },
  ],
});
const echartsRef = ref<HTMLElement>();
onMounted(() => {
  myEcharts = echarts.init(echartsRef.value!);
  myEcharts.resize();
  //设置配置
  myEcharts.setOption(reactiveOption);
  window.onresize = () => {
    myEcharts.resize();
  };
});
watch(option, (newVal) => {
  // console.log(newVal);
  reactiveOption.dataset.source = newVal;
  myEcharts.setOption(reactiveOption);
});
onUnmounted(() => {
  // 组件销毁后解绑事件
  window.onresize = null;
});
</script>

<style lang="scss">
#echarts {
  height: 400px;
  width: 100%;
}
</style>
