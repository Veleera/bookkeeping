<template>
  <!-- <router-view /> -->
  <div id="app">
    <div class="header">
      <div class="title">Bookkeeping</div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="时间">
          <el-date-picker
            v-model="month"
            type="month"
            value-format="YYYY-MM"
            placeholder="请选择月份"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="category" placeholder="请选择分类" :clearable="true">
            <el-option
              v-for="item in categoryTableData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :icon="Edit" type="primary" @click="dialogVisible = true">新增账单</el-button>
        </el-form-item>
      </el-form>
    </div>
    <billTable
      :billTableData="filterBillTableData"
    ></billTable>
    <el-dialog
      v-model="dialogVisible"
      title="新增账单"
      width="30%"
      center
      :close-on-click-modal="false"
      draggable
    >
      <el-form :model="addForm" label-width="120px" ref="form" :rules="rules">
        <el-form-item label="账单类型" prop="type">
          <el-radio-group v-model="addForm.type">
            <el-radio-button :label="0">支出</el-radio-button>
            <el-radio-button :label="1">收入</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账单时间" prop="time">
          <el-date-picker
            v-model="addForm.time"
            type="datetime"
            placeholder="请选择时间"
            :shortcuts="shortcuts"
            :default-value="defaultTime"
          />
        </el-form-item>
        <el-form-item label="账单分类" prop="category">
          <el-select v-model="addForm.category" placeholder="请选择分类" @change="changeName">
            <el-option
              v-for="(item, index) in categoryTableData"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账单金额" prop="amount">
          <el-input-number v-model.number="addForm.amount" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form)">提交</el-button>
          <el-button @click="resetForm(form)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed} from "vue";
import {
  ElSelect,
  ElOption,
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElRadioGroup,
  ElRadioButton,
  ElDatePicker,
  ElInputNumber,
} from "element-plus/dist/index.full.js";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/select/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/input-number/style/css";
import "element-plus/es/components/radio/style/css";
import "element-plus/es/components/radio-button/style/css";
import "element-plus/es/components/date-picker/style/css";
import type { FormInstance, FormRules } from "element-plus";
import { AsyncLoadCSV } from "./utils/AsyncLoadCSV";
import { Edit } from "@element-plus/icons-vue";
import moment from "moment";
import billTable from "./views/billTable.vue";

interface Bill {
  type: number;
  time: string;
  category?: string;
  amount: number;
  name?: string;
  id?: string;
}
interface Category {
  id: string;
  type: number;
  name: string;
}

const billTableData: Array<Bill> = reactive([]);
const categoryTableData: Array<Category> = reactive([]);
onMounted(() => {
  Promise.all([
    AsyncLoadCSV("http://localhost:3000/bill"),
    AsyncLoadCSV("http://localhost:3000/category"),
  ])
    .then((res: any) => {
      res[0].forEach((item: Bill) => {
        item.time = moment(parseInt(item.time)).format();
        res[1].forEach((category: Category) => {
          if (item.type == category.type && item.category == category.id) {
            item.name = category.name;
            item.id = category.id;
          }
        });
      });
      billTableData.push(...res[0]);
      categoryTableData.push(...res[1]);
    })
    .catch((err) => {
      console.log(err);
    });
});

//新增表单
const dialogVisible = ref(false);
const form = ref<FormInstance>();
const addForm: Bill = reactive({
  type: 0,
  time: "",
  amount: 0.0,
  category: "",
  name: "",
  id: "",
});
const rules = reactive<FormRules>({
  type: [{ required: true, message: "请选择账单的类型", trigger: "change" }],
  time: [
    {
      type: "date",
      required: true,
      message: "请选择账单时间",
      trigger: "change",
    },
  ],
  category: [
    {
      required: true,
      message: "请选择账单类型",
      trigger: "change",
    },
  ],
  amount: [
    { type: "number", required: true, message: "请输入账单金额", trigger: "change", min: 0 },
  ],
});
const shortcuts = [
  {
    text: "今天",
    value: new Date(),
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    },
  },
  {
    text: "上周",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    },
  },
];
const defaultTime = new Date();
const changeName = (val: string) => {
  addForm.name = categoryTableData.find((item: Category) => item.id === val)?.name || "";
  addForm.id = val;
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      billTableData.push({
        type: addForm.type,
        time: moment(addForm.time).format(),
        amount: addForm.amount,
        category: addForm.category,
        name: addForm.name,
        id: addForm.id,
      });
      formEl.resetFields();
      dialogVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

//筛选
const month = ref<string>("");

const category = ref<string>("");

const filterBillTableData = computed<Array<Bill>>(() => {
  if (month.value != "" && category.value != "") {
    return billTableData.filter((item: Bill) => {
      return (
        moment(item.time).format("YYYY-MM-DD HH:mm:ss").includes(month.value) &&
        item.category == category.value
      );
    });
  } else if (!month.value && category.value) {
    return billTableData.filter((item: Bill) => {
      return item.category == category.value;
    });
  } else if (month.value && !category.value) {
    return billTableData.filter((item: Bill) => {
      return moment(item.time).format("YYYY-MM-DD HH:mm:ss").includes(month.value);
    });
  }
  return billTableData;
});
</script>

<style lang="scss">
#app {
  margin: auto 200px;
  .header {
    .title {
      text-align: center;
      font-size: 32px;
      font-weight: 700;
      margin: 20px 0;
    }
  }
}
</style>
