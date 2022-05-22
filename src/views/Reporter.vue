<template>
    <el-form label-width="120px">
        <el-form-item label="坐标">
            <el-input/>
            <el-input/>
        </el-form-item>
        <el-form-item label="描述">
            <el-input/>
        </el-form-item>
        <el-form-item label="时间">
            <el-date-picker type="date"/>
        </el-form-item>
        <el-form-item label="是否已解决">
            <el-radio>是</el-radio>
            <el-radio :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="现场图片">
            <el-upload>
                <el-button type="primary">点击上传</el-button>
            </el-upload>
        </el-form-item>
        <el-form-item label="现场图片">
            <el-button>清空</el-button>
            <el-button type="primary">提交</el-button>
        </el-form-item>

    </el-form>
</template>
<script lang="ts" setup>
import { onMounted } from "vue"

onMounted(() => {

})
</script>