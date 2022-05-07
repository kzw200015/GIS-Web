<template>
    <el-menu :default-active="route.path" mode="horizontal" router>
        <el-menu-item index="/admin/map">地图显示</el-menu-item>
        <el-menu-item index="/admin/accident">事故管理</el-menu-item>
        <el-menu-item index="/admin/user">用户管理</el-menu-item>
    </el-menu>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router"

const route = useRoute()
</script>
<style scoped>
</style>