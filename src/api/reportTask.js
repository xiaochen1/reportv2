import { fetch } from "./api.js";
import config from "@/config.js";

export default {
    current: {
        taskList: function(cb, data) {
            fetch(config.ip.task.current.taskList, "post", data).then((res) => cb(res)).catch((e) => cb(e));
        },

        getTaskDetailById: function(cb, data) {
            fetch(config.ip.task.current.getTaskDetailById, "post", data).then((res) => cb(res)).catch((e) => cb(e));
        },

        addTask: function(cb, data) {
            fetch(config.ip.task.current.addTask, "upload", data).then((res) => cb(res)).catch((e) => cb(e));
        },

        editTask: function(cb, data) {
            fetch(config.ip.task.current.editTask, "upload", data).then((res) => cb(res)).catch((e) => cb(e));
        },

        deleteTask: function(cb, data) {
            fetch(config.ip.task.current.deleteTask, "post", data).then((res) => cb(res)).catch((e) => cb(e));
        },

        getUserList: function(cb, data) {
            fetch(config.ip.task.current.getUserList, "post", data).then((res) => cb(res)).catch((e) => cb(e));
        },

        getCustomerbyUser: function(cb, data) {
            fetch(config.ip.task.current.getCustomerbyUser, "post", data).then((res) => cb(res)).catch((e) => cb(e));
        },

        handStartTask: function(cb, data) {
            fetch(config.ip.task.current.handStartTask, "post", data).then((res) => cb(res)).catch((e) => cb(e));
        },


    }
}