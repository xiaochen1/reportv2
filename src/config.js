// const host = "agent.fxl.mixiot.top:18100";
// const host = "agent.gz-cri.com:18100";
const host = "192.168.1.114";
const exit_ip = "http://rnd.mixiot.top"; //门户中心的地址
const exit_source = "MixReport"; // 传递给门户中心用于获取权限的source字段值

const ip = {
    login: "http://" + host + "/auth/getToken",
    auth: "http://" + host + "",
    getAuth: "http://" + host + "/auth", //从登录页传ticket和source去后台，由后台获取系统的操作权限
    version: "http://" + host + "/version",
    task: {
        current: {
            taskList: "http://" + host + "/task/index",
            getTaskDetailById: "http://" + host + "/task/detail",
            addTask: "http://" + host + "/task/add",
            deleteTask: "http://" + host + "/task/delete",
            editTask: "http://" + host + "/task/edit",
            stopTask: "http://" + host + "/task/stop",
            handStartTask: "http://" + host + "/task/startWithHand",
            timingStartTask: "http://" + host + "/task/startWithSchedule",
            getUserList: "http://" + host + "/getUserList",
            getCustomerbyUser: "http://" + host + "/getCustomerbyUser",
        },
    },

    result: {
        current: {
            reportList: "http://" + host + "/report/list",
            getReportDetailById: "http://" + host + "/report/detail",
            deleteReport: "http://" + host + "/report/delete",
            download: "http://" + host + "/report/download",
        },
    },
};

module.exports = {
    host: host,
    ip: ip,
    gate_center_index: exit_ip + "/index", //退出后 要跳转到的地址url 去获取登录权限
    gate_center_login: exit_ip + "/?source=" + exit_source + "&url=" + "http://" + host,
    //无权限时， 跳转到门户中心获取权限， 当成功获取权限后  需要跳转回到的页面的ip地址
}