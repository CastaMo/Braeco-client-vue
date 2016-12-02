<template>
    <div id="Activity-Info" v-if="activityItem">
        <div class='activity-pic'>
            <div
                class='pic'
                v-bind:style="{
                    'width': `${activityItem.width}px`,
                    'height': `${activityItem.height}px`,
                    'background-size': `${activityItem.width}px ${activityItem.height}px`
                }"
                v-lazy:background-image="activityItem.pic"
            ></div>
        </div>
        <div class='activity-title'>
            <div class='type'>{{activityItem.typeStr}}</div>
            <p class='title'>{{activityItem.title}}</p>
            <div class='clear'></div>
        </div>
        <div class='activity-intro'>
            <div class='activity-intro-wrapper margin-left-wrapper'>
                <div class='activity-intro-container'>{{activityItem.intro}}</div>
            </div>
        </div>
        <div class='activity-time'>
            <div class='activity-time-wrapper margin-left-wrapper'>
                <div class='activity-time-container'>
                    <div class='head'>活动时间</div>
                    <div class='content'>{{activityItem.dateStr}}</div>
                </div>
            </div>
        </div>
        <div class='activity-content'>
            <div class='activity-content-wrapper'>
                <div class='activity-content-container'>
                    <div class='head'>活动详情</div>
                    <div class='content' v-html="activityItem.content"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    name: 'activity-info',
    data() {
        return {
            activityItem: null
        }
    },
    created() {
        let vm = this;
        if (this.$root.isLoaded) {
            vm.init();
        }
        this.$root.$on("root:getData", function() {
            vm.init();
        });
    },
    beforeDestroy() {
        this.$root.$emit("root:getData");
    },
    directives: {
        'lazy': Vue.directive('lazy')
    },
    methods: {
        init() {
            let id = Number(this.$root.$route.params.activityId);
            this.activityItem = this.getActivityItem(id);
            if (!this.activityItem) {
                this.$root.$router.back();
            }
        },
        getActivityItem(id) {
            let activity;
            let temp = {};
            let clientWidth = document.body.clientWidth;
            for (let i = 0, len = this.$root.requireData.activity.length; i < len; i++) {
                activity = this.$root.requireData.activity[i];
                if (Number(activity.id) === id) {
                    temp.title = activity.title;
                    temp.content = activity.content;
                    temp.intro = activity.intro;
                    temp.width = clientWidth - 32;
                    temp.height = temp.width * 182.93 / 343;
                    temp.pic = `${activity.pic}?imageView2/1/w/${temp.width * 2}/h/${Math.floor(temp.height) * 2}`;
                    if (activity.type === "sales") {
                        temp.typeStr = "促销";
                    } else if (activity.type === "theme") {
                        temp.typeStr = "主题";
                    }
                    if (activity.date_begin === 0 && activity.date_end === 0) {
                        temp.dateStr = "永久";
                    } else {
                        temp.dateStr = `${new Date(activity.date_begin * 1000).Format('yyyy.MM.dd')} - ${new Date(activity.date_end * 1000).Format('yyyy.MM.dd')}`
                    }
                    return temp;
                }
            }
            return null;
        }
    }
}

</script>

<style lang="less" scoped>

body {
    background-color: #fff;
}

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

#Activity-Info {
    padding: 16px 0 250px;
    background-color: #fff;
    .activity-pic {
        margin-left: 16px;
        .pic {
            .background-norm();
        }
    }
    .activity-title {
        margin: 17px 16px 0 16px;
        > *:not(.clear) {
            float: left;
        }
        .type {
            line-height: 18px;
            width: 30px;
            text-align: center;
            background-color: #8B572A;
            color: #fff;
            font-size: 10px;
            .rounded-corners(2px);
            margin-top: 2px;
        }
        .title {
            line-height: 22px;
            margin-left: 8px;
            font-weight: bold;
        }
    }
    .activity-intro {
        .activity-intro-container {
            margin-right: 16px;
            padding: 8px 0;
            line-height: 20px;
            font-size: 14px;
        }
    }
    .activity-time {
        .activity-time-container {
            margin-right: 16px;
            padding: 8px 0;
            .head {
                color: #845726;
                font-weight: bold;
                line-height: 22px;
            }
            .content {
                line-height: 16px;
                margin-top: 2px;
                font-size: 14px;
            }
        }
    }
    .activity-content {
        .activity-content-container {
            margin: 0 16px;
            padding: 8px 0;
            .head {
                color: #845726;
                font-weight: bold;
                line-height: 22px;
            }
            .content {
                line-height: 20px;
                margin-top: 2px;
                font-size: 14px;
            }
        }
    }
}

</style>
