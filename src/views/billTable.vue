<template>
  <div id="billTable">
    <div>
      <el-card>
        <div><billChart :option="categoryTableData"></billChart></div>
        <div class="total">
          <span class="outlay">总支出：{{ outlay }}元</span>
          <span class="income">总收入：{{ income }}元</span>
        </div>
      </el-card>
    </div>
    <el-table
      :data="billTableData"
      style="width: 100%"
      :default-sort="{ prop: 'amount', order: 'descending' }"
    >
      <el-table-column prop="time" label="时间">
        <template #default="scope">
          <span>{{ moment(scope.row.time).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用途" />
      <el-table-column label="类型" props="type">
        <template #default="scope">
          <el-tag v-if="scope.row.type == 1" type="success">收入</el-tag>
          <el-tag v-else type="warning">支出</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="金额" props="amount" sortable :sort-method="sortAmount">
        <template #default="scope">
          <span>{{ parseFloat(scope.row.amount).toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { ElTable, ElTableColumn, ElTag, ElCard } from "element-plus/dist/index.full.js";
import "element-plus/es/components/table/style/css";
import "element-plus/es/components/table-column/style/css";
import "element-plus/es/components/dialog/style/css";
import "element-plus/es/components/tag/style/css";
import "element-plus/es/components/checkbox/style/css";
import "element-plus/es/components/checkbox-button/style/css";
import "element-plus/es/components/checkbox-group/style/css";
import "element-plus/es/components/card/style/css";
import { defineProps, toRefs, computed } from "vue";
import billChart from "./billChart.vue";
import moment from "moment";
interface Bill {
  type: number;
  time: string;
  category?: string;
  amount: number;
  name?: string;
}
interface Category {
  id: string;
  type: number;
  name: string;
}
interface filterObj {
  name: string;
  amount: number;
}
const props = defineProps<{
  billTableData: Array<Bill>;
}>();
const { billTableData } = toRefs(props);

const sortAmount = (obj1: Bill & Category, obj2: Bill & Category): number => {
  return obj1.amount - obj2.amount;
};

//计算收入支出
const addFloat = (a: number, b: number): number => {
  return (a * 100 + b * 100) / 100;
};
const addSum = (type: number): string => {
  let res = "0.00";
  billTableData.value.forEach((item: any) => {
    if (item.type == type) {
      res = addFloat(parseFloat(res), parseFloat(item.amount)).toFixed(2);
    }
  });
  return res;
};
const income = computed(() => {
  return addSum(1);
});

const outlay = computed(() => {
  return addSum(0);
});

const categoryTableData = computed(() => {
  const categoryMap = new Map();
  billTableData.value.forEach((item: any) => {
    if (item.type == 0) {
      const amount = categoryMap.get(item.name) || 0;
      categoryMap.set(item.name, amount - parseFloat(item.amount));
    } else {
      const amount = categoryMap.get(item.name) || 0;
      categoryMap.set(item.name, amount + parseFloat(item.amount));
    }
  });
  let res: Array<filterObj> = [];
  for (let arr of Array.from(categoryMap)) {
    res.push({
      name: arr[0],
      amount: arr[1],
    });
  }
  return res.sort((obj1: filterObj, obj2: filterObj) => {
    return obj2.amount - obj1.amount;
  });
});
</script>

<style lang="scss">
.total {
  text-align: center;
  .outlay,
.income {
  font-size: 22px;
  font-weight: 700;
}
.income {
  color: #67c23a;
  margin-left: 20px;
}
.outlay {
  color: #e6a23c;
}
}
</style>
