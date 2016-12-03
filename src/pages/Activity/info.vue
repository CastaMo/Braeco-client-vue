<template>
    <div id="Activity-Info">
        <iframe
            v-if="activityItem.inValid"
            v-on:load="backRoute"
        ></iframe>
        <div class='activity-pic'>
            <div
                class='pic'
                v-bind:style="{
                    'width': `${picWidth}px`,
                    'height': `${picHeight}px`,
                    'background-size': `${picWidth}px ${picHeight}px`
                }"
                v-lazy:background-image="activityItem.pic"
            ></div>
        </div>
        <div class='activity-title'>
            <div class='type' v-if="activityItem.typeStr">{{activityItem.typeStr}}</div>
            <div class='type' v-else>加载</div>
            <p class='title' v-if="activityItem.title">{{activityItem.title}}</p>
            <p class='title' v-else>正在加载数据中</p>
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
    computed: {
        activityItem: function() {
            return this.$store.getters.activityInfoItem;
        },
        picWidth: function() {
            let clientWidth = document.body.clientWidth;
            return clientWidth - 32;
        },
        picHeight: function() {
            return this.picWidth * 182.93 / 343;
        }
    },
    created() {
    },
    methods: {
        backRoute() {
            this.$root.$emit("tips:error", "活动已过期");
            this.$router.back();
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
