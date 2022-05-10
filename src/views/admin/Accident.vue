<template>
    <el-table :data="accidentPage.values">
        <el-table-column :width="100" align="center" label="id" prop="id" />
        <el-table-column align="center" label="坐标">
            <el-table-column :show-overflow-tooltip="true" align="center" label="X" prop="coordinate.x" />
            <el-table-column :show-overflow-tooltip="true" align="center" label="Y" prop="coordinate.y" />
        </el-table-column>
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="时间">
            <template #default="scope">{{ (new Date(scope.row.time)).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column align="center" label="是否已解决">
            <template #default="scope">{{ scope.row.isResolved ? "是" : "否" }}</template>
        </el-table-column>
        <el-table-column align="center" label="现场图片" prop="image" />
        <el-table-column :width="175" align="center" fixed="right" label="操作">
            <template #default="scope">
                <el-button type="primary">编辑</el-button>
                <el-button type="danger">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="page" :page-size="10" :total="accidentPage.total" layout="prev, pager, next" />
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import api from "../../api"
import { Accident, Page } from "../../types"

const page = ref(1)

const accidentPage = reactive<Page<Accident>>({ page: 0, size: 0, total: 0, values: [] })

const fetchData = async (page: number, size: number = 10) => {
    const resp: Page<Accident> = (await api.get("/accidents", { params: { "page": page, "size": size } })).data.data
    accidentPage.page = resp.page
    accidentPage.size = resp.size
    accidentPage.total = resp.total
    accidentPage.values.splice(0, accidentPage.values.length, ...resp.values)
}

watch(page, (page) => {
    fetchData(page)
})

onMounted(() => {
    fetchData(page.value)
})
</script>