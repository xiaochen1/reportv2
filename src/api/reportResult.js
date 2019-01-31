import { fetch } from "./api.js";
import config from "@/config.js";

export default {
    current: {
        reportList: function(cb, data) {
            fetch(config.ip.result.current.reportList, "post", data).then((res) => cb(res)).catch((e) => cb(e));
        },

        getReportDetailById: function(cb, data) {
            fetch(config.ip.result.current.getReportDetailById, "post", data).then((res) => cb(res)).catch((e) => cb(e));
        },

        deleteReport: function(cb, data) {
            fetch(config.ip.result.current.deleteReport, "post", data).then((res) => cb(res)).catch((e) => cb(e));
        },


    }
}