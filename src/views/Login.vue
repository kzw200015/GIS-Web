<template>
    <el-container>
        <el-main>
            <el-row>
                <el-col class="center">
                    <h1>苏州市交通事故管理系统</h1>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="center">
                    <el-form :model="loginForm" class="login-form" label-width="120px" size="large">
                        <el-form-item label="用户名">
                            <el-input v-model="loginForm.username" clearable/>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="loginForm.password" clearable show-password/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="login">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus"
import { reactive } from "vue"
import { useRouter } from "vue-router"
import api from "../api"

const props = defineProps<{
    redirect: string
}>()

const loginForm = reactive({
    username: "",
    password: ""
})

const router = useRouter()

const login = async () => {
    try {
        await api.post("/login", {
            username: loginForm.username,
            password: loginForm.password
        })
        router.push(props.redirect)
    } catch (error) {
        ElMessage.error((error as any).message)
    }
}
</script>

<style scoped>
.login-form {
    width: 500px;
}

.center {
    display: flex;
    justify-content: center;
}
</style>