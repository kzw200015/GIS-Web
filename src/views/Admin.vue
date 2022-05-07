<template>
    <el-container>
        <el-header>
            <Nav></Nav>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>
<script lang="ts" setup>
import Nav from "../components/Nav.vue"</script>
<style scoped>
</style>