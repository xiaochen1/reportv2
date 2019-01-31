import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from '@/pages/index.vue'
import ReportTask from '@/pages/ReportTask/ReportTask.vue'
import ReportResult from '@/pages/ReportResult/ReportResult.vue'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Index',
        component: Index,
        redirect: "/task",
        children: [{
            name: "task",
            path: "/task",
            component: ReportTask,
            redirect: "/task/index",
            children: [{
                path: "/task/index",
                component: ReportTask
            }, ],
        }, {
            name: "result",
            path: "/result",
            component: ReportResult,
            redirect: "/result/index",
            children: [{
                path: "/result/index",
                component: ReportResult
            }, ],
        }],
    }]
})