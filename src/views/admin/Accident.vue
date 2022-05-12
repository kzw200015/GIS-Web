<template>
    <el-row>
        <el-col :span="3">
            <el-button @click="handleHotspotAnalysis" type="primary">热点分析</el-button>
        </el-col>
        <el-col :span="3">
            <el-button @click="isShowStatistics=true" type="primary">数据统计</el-button>
            <el-dialog destroy-on-close v-model="isShowStatistics">
                <div v-loading="isStatisticsLoading">
                    <el-button @click="handleStatistics">开始统计</el-button>
                    <v-chart class="chart" :option="chartOption"/>
                </div>
            </el-dialog>
        </el-col>
        <el-col :span="3">
            <el-button type="primary">数据导出</el-button>
        </el-col>
    </el-row>
    <el-row>
        <el-col>
            <el-table :data="accidentPage.values">
                <el-table-column :width="100" align="center" label="id" prop="id"/>
                <el-table-column align="center" label="坐标">
                    <el-table-column :show-overflow-tooltip="true" align="center" label="X" prop="coordinate.x"/>
                    <el-table-column :show-overflow-tooltip="true" align="center" label="Y" prop="coordinate.y"/>
                </el-table-column>
                <el-table-column align="center" label="描述" prop="description"/>
                <el-table-column align="center" label="时间">
                    <template #default="scope">{{ (new Date(scope.row.time)).toLocaleString() }}</template>
                </el-table-column>
                <el-table-column align="center" label="是否已解决">
                    <template #default="scope">{{ scope.row.isResolved ? "是" : "否" }}</template>
                </el-table-column>
                <el-table-column align="center" label="现场图片" prop="image"/>
                <el-table-column :width="175" align="center" fixed="right" label="操作">
                    <template #default="scope">
                        <el-button type="primary">编辑</el-button>
                        <el-button type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
    <el-row>
        <el-col>
            <el-pagination v-model:current-page="page" :page-size="10" :total="accidentPage.total"
                           layout="prev, pager, next"/>
        </el-col>
    </el-row>
    <el-dialog v-model="isShowHotspotAnalysis">
        <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        <div class="map-container">
            <el-amap :center="center" :zoom="zoom">
                <el-amap-layer-heat-map :visible="true" :data-set="dataSet"></el-amap-layer-heat-map>
            </el-amap>
        </div>
    </el-dialog>
</template>
<script lang="ts" setup>
import "echarts"
import { onMounted, reactive, ref, watch } from "vue"
import VChart from "vue-echarts"
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


const center = ref([120.62, 31.32])
const zoom = ref(9)
const dataSet: {
    data: { lng: number, lat: number, count: number }[]
} = reactive({ data: [] })
const isShowHotspotAnalysis = ref(false)
const handleHotspotAnalysis = async () => {
    isShowHotspotAnalysis.value = true
    dataSet.data.splice(0, dataSet.data.length)
    for (let i = 1; i <= 50; i++) {
        const points = (await api.get("/accidents", {
            params: {
                page: i,
                size: 10
            }
        })).data.data.values.map((it: any) => {
            return { lng: it.coordinate.x, lat: it.coordinate.y, count: 1 }
        })
        dataSet.data.push(...points)
    }
}


const isStatisticsLoading = ref(false)
const chartOption = ref({
    tooltip: {},
    dataset: {
        source: [] as { date: string, counts: number }[]
    },
    xAxis: {
        type: "time",
        name: "时间"
    },
    yAxis: {
        type: "value",
        name: "事故数量"
    },
    series: [{ type: "line" }],
    dataZoom: [
        {
            type: "inside"
        },
        {
            type: "slider"
        }
    ]
})
const isShowStatistics = ref(false)
const handleStatistics = async () => {
    isStatisticsLoading.value = true
    const dateToCounts = new Map<string, number>()
    const accidents: Accident[] = []
    for (let i = 1; i <= 50; i++) {
        accidents.push(...(await api.get("/accidents", {
            params: {
                page: i,
                size: 10
            }
        })).data.data.values)
    }

    accidents.sort((a, b) => a.time - b.time)
    for (const accident of accidents) {
        const date = new Date(accident.time)
        const dateStr = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`
        const count = dateToCounts.get(dateStr)
        if (count) {
            dateToCounts.set(dateStr, count + 1)
        } else {
            dateToCounts.set(dateStr, 1)
        }
    }
    const source = [...dateToCounts].map(it => {
        return { date: it[0], counts: it[1] }
    })
    chartOption.value.dataset.source.splice(0, chartOption.value.dataset.source.length, ...source)
    console.log(chartOption.value.dataset.source)
    isStatisticsLoading.value = false
}

</script>

<style scoped>
.map-container {
    height: 400px;
}

.chart {
    width: 500px;
    height: 400px;
}

</style>