<template>
    <el-row :gutter="20">
        <el-col :span="18">
            <div class="map-container">
                <el-amap :center="center" :zoom="zoom">
                    <el-amap-marker v-for="location in policeLocations" :key="location.id"
                                    @click="handlePoliceMarkerClick(location.id)"
                                    :position="[location.x,location.y]">
                    </el-amap-marker>
                </el-amap>
            </div>
        </el-col>
        <el-col :span="6">
            <el-card class="info-card">
                <template #header>警员信息</template>
                <div>姓名: <span v-if="currentPolice">{{ currentPolice.name }}</span></div>
                <div>联系方式：<span v-if="currentPolice">{{ currentPolice.phone }}</span></div>
                <div>性别：<span v-if="currentPolice">{{ currentPolice.gender === Gender.MALE ? "男" : "女" }}</span></div>
                <div>工作状态：<span v-if="currentPolice">{{ currentPolice.isWorking ? "任务中 " : "空闲" }}</span></div>
            </el-card>
            <el-card class="info-card">
                <template #header>当前事故列表</template>
                <div>
                    一些信息
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import api, { usePoliceLocations } from "../../api"
import { Gender, Police } from "../../types"

const center = ref([120.62, 31.32])
const zoom = ref(9)

const policeLocations = usePoliceLocations()
const currentPolice = ref<Police>()

const handlePoliceMarkerClick = async (policeId: number) => {
    currentPolice.value = (await api.get("/polices/" + policeId)).data.data
}

onMounted(async () => {

})
</script>

<style scoped>
.map-container {
    height: 550px;
}

.info-card {
    margin-bottom: 15px;
}
</style>