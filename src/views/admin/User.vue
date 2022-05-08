<template>
    <el-table :data="tableData">
        <el-table-column :width="100" align="center" label="id" prop="id" />
        <el-table-column align="center" label="用户名" prop="username" />
        <el-table-column align="center" label="角色" prop="role" />
        <el-table-column :width="175" align="center" fixed="right" label="操作">
            <template #default="scope">
                <el-button type="primary">编辑</el-button>
                <el-button type="danger">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="currentPage" :page-size="10" :total="userPage.total"
        layout="prev, pager, next" />
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import api from "../../api"
import { Page, User } from "../../types"

const currentPage = ref(1)

const userPage = reactive<Page<User>>({ page: 0, size: 0, total: 0, values: [] })

const tableData = reactive<User[]>(userPage.values)

const fetchData = async (page: number, size: number = 10) => {
    const resp: Page<User> = (await api.get("/users", { params: { "page": page, "size": size } })).data.data
    userPage.page = resp.page
    userPage.size = resp.size
    userPage.total = resp.total
    userPage.values.splice(0, userPage.values.length) //清空数组
    userPage.values.push(...resp.values)
}

watch(currentPage, (page) => {
    fetchData(page)
})

onMounted(() => {
    fetchData(currentPage.value)
})
</script>