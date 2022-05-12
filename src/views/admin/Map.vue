<template>
    <el-row>
        <el-col :span="3">
            <span>警力显示 </span>
            <el-switch v-model="isShowPolice"/>
        </el-col>
        <el-col :span="3">
            <span>事故显示 </span>
            <el-switch v-model="isShowAccident"/>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="18">
            <div class="map-container">
                <el-amap :center="center" :zoom="zoom">
                    <el-amap-control-scale></el-amap-control-scale>
                    <el-amap-control-tool-bar position="RT"></el-amap-control-tool-bar>
                    <el-amap-control-hawk-eye></el-amap-control-hawk-eye>
                    <el-amap-marker :visible="isShowPolice" v-for="location in policeLocations" :key="location.id"
                                    @click="handlePoliceMarkerClick(location.id)"
                                    :position="[location.x,location.y]">
                        <img width="30" height="40" :src="blueMarkerUrl" :alt="`${location.x},${location.y}`"/>
                    </el-amap-marker>
                    <template v-if="unresolvedAccidents">
                        <el-amap-marker :visible="isShowAccident" v-for="accident in unresolvedAccidents"
                                        :key="accident.id"
                                        :position="[accident.coordinate.x,accident.coordinate.y]"
                                        @click="handleAccidentMarkerClick(accident)">
                            <img width="30" height="40" :src="redMarkerUrl"
                                 :alt="`${accident.coordinate.x},${accident.coordinate.y}`"/>
                        </el-amap-marker>
                    </template>
                    <el-amap-polyline lineJoin="round" lineCap="round" :strokeOpacity="1" :stroke-weight="5"
                                      v-if="steps" :visible="true"
                                      :path="steps"></el-amap-polyline>
                </el-amap>
            </div>
        </el-col>
        <el-col :span="6">
            <el-card class="info-card">
                <template #header>警员信息</template>
                <div>ID：<span v-if="currentPolice">{{ currentPolice.id }}</span></div>
                <div>姓名: <span v-if="currentPolice">{{ currentPolice.name }}</span></div>
                <div>联系方式：<span v-if="currentPolice">{{ currentPolice.phone }}</span></div>
                <div>性别：<span v-if="currentPolice">{{
                        currentPolice.gender === Gender.MALE ? "男" : "女"
                    }}</span></div>
                <div>工作状态：<span v-if="currentPolice">{{ currentPolice.isWorking ? "任务中 " : "空闲" }}</span></div>
            </el-card>
            <el-card class="info-card">
                <template #header>事故信息</template>
                <div>ID：<span v-if="currentAccident">{{ currentAccident.id }}</span></div>
                <div>描述: <span v-if="currentAccident">{{ currentAccident.description }}</span></div>
                <div>时间：<span v-if="currentAccident">{{ (new Date(currentAccident.time)).toLocaleString() }}</span>
                </div>
                <div>现场图片：
                    <el-button size="small" v-if="currentAccident" type="primary">点击查看</el-button>
                </div>
                <div>
                    <el-button @click="showRoute(currentAccident.id)" size="small" v-if="currentAccident"
                               type="primary">查找最近警力
                    </el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
import api, { useAccidentPage, usePoliceLocations } from "../../api"
import blueMarkerUrl from "../../assets/blue-marker.png"
import redMarkerUrl from "../../assets/red-marker.png"
import { Accident, Gender, Location, Police } from "../../types"
import { searchNearestPolice } from "../../utils"

const center = ref([120.62, 31.32])
const zoom = ref(9)

const isShowPolice = ref(true)
const isShowAccident = ref(true)

const policeLocations = usePoliceLocations()
const currentPolice = ref<Police>()
const currentAccident = ref<Accident>()

const handlePoliceMarkerClick = async (policeId: number) => {
    currentPolice.value = (await api.get("/polices/" + policeId)).data.data
}

const handleAccidentMarkerClick = (accident: Accident) => {
    currentAccident.value = accident
}

const showRoute = async (accidentId: number) => {
    const polices = new Array<Location>()
    for (const loc of policeLocations) {
        const police = (await api.get("/polices/" + loc.id)).data.data
        if (!police.isWorking) {
            polices.push(loc)
        }
    }
    console.log(polices)
    const route = await searchNearestPolice(polices, (await api.get("/accidents/" + accidentId)).data.data.coordinate)
    steps.value = route.steps
}

const { page: accidentPageNum, accidents } = useAccidentPage()

const unresolvedAccidents = computed(() => accidents.value?.values?.filter(it => !it.isResolved))

const steps = ref<Array<number[]>>()
onMounted(async () => {
    accidentPageNum.value = 2
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