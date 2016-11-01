<template>
    <div id="Activity-Main">
        <div class='rotate-display-container'>
            <rotate-display :items="headerItems"></rotate-display>
        </div>
        <div class='activity-display-container'>
            <div class='sales-display-container display-container' v-if="activityItems.sales">
                <div class='display-header'>
                    <div class='display-header-wrapper margin-left-wrapper'>
                        <div class='display-header-container'>
                            <p>促销活动</p>
                        </div>
                    </div>
                </div>
                <div class='display-body'>
                    <ul class='activity-list'>
                        <li
                            class='activity active-container'
                            v-for="activity in activityItems.sales"
                            v-on:click="activityLiClickEvent(activity.id)"
                        >
                            <div class='activity-wrapper margin-left-wrapper'>
                                <div class='img-field'>
                                    <div
                                        class='img'
                                        v-lazy:background-image="activity.pic">
                                    </div>
                                </div>
                                <div class='info-field'>
                                    <p class='title'>{{activity.title}}</p>
                                    <p class='intro'>{{activity.intro}}</p>
                                </div>
                                <div class='clear'></div>
                            </div>
                            <div class='arrow vertical-center'></div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class='theme-display-container display-container' v-if="activityItems.theme">
                <div class='display-header'>
                    <div class='display-header-wrapper margin-left-wrapper'>
                        <div class='display-header-container'>
                            <p>主题活动</p>
                        </div>
                    </div>
                </div>
                <div class='display-body'>
                    <ul class='activity-list'>
                        <li
                            class='activity active-container'
                            v-for="activity in activityItems.theme"
                            v-on:click="activityLiClickEvent(activity.id)"
                        >
                            <div class='activity-wrapper margin-left-wrapper'>
                                <div class='img-field'>
                                    <div
                                        class='img'
                                        v-lazy:background-image="activity.pic">
                                    </div>
                                </div>
                                <div class='info-field'>
                                    <p class='title'>{{activity.title}}</p>
                                    <p class='intro'>{{activity.intro}}</p>
                                </div>
                                <div class='clear'></div>
                            </div>
                            <div class='arrow vertical-center'></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    name: 'activity-main',

    data() {
        return {
            headerItems: [],
            activityItems: {}
        }
    },

    created() {
        this.headerItems = this.getItemsForHeader();
        this.activityItems = this.getItemsForActivity();
    },
    directives: {
        'lazy': Vue.directive('lazy')
    },
    components: {
        'rotate-display': Vue.component('rotate-display')
    },
    methods: {
        getItemsForHeader() {
            let result = [];
            let clientWidth = document.body.clientWidth;

            let canteenName = this.$root.requireData.dinner.name;
            for (let i = 0, len = this.$root.requireData.covers.length; i < len; i++) {
                let cover = this.$root.requireData.covers[i];
                let temp = {};
                temp.pic = `${cover}?imageView2/1/w/${Math.floor(clientWidth) * 2}/h/${Math.floor(clientWidth * 200 / 375) * 2}`;
                temp.title = canteenName;
                result.push(temp);
            }
            return result;
        },
        getItemsForActivity() {
            let result = {
                theme: [],
                sales: []
            };
            for (let i = 0, len = this.$root.requireData.activity.length; i < len; i++) {
                let activity = this.$root.requireData.activity[i];
                let temp = {};
                temp.pic = `${activity.pic}?imageView2/1/w/${80 * 2}/h/${80 * 2}`
                temp.title = activity.title;
                temp.intro = activity.intro;
                temp.id = activity.id;
                if (result[activity.type]) {
                    result[activity.type].push(temp);
                }
            }
            return result;
        },
        activityLiClickEvent(id) {
            this.$root.$router.push(`/activity/info/${id}`);
        }
    }
}


</script>

<style lang="less" scoped>

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.ellipsisWithLineNum (@num: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    -webkit-box-orient: vertical;
}

.activity-display-container {
    padding-bottom: 40px;
    .display-container {
        margin-top: 16px;
        background-color: #fff;
        border-top: solid 1px #C8C7CC;
        border-bottom: solid 1px #C8C7CC;
        .display-header {
            .display-header-wrapper {
                .display-header-container {
                    font-size: 16px;
                    line-height: 22px;
                    padding: 11px 0;
                    p {
                        border-left: solid 6px #FFC107;
                        padding-left: 8px;
                        font-weight: 700;
                    }
                }
            }
        }
        .display-body {
            ul.activity-list {
                li.activity {
                    .activity-wrapper {
                        > *:not(.clear) {
                            float: left;
                        }
                        .img-field {
                            margin: 8px 0;
                            .img {
                                width: 80px;
                                height: 80px;
                                .background-norm();
                                background-size: 80px 80px;
                            }
                        }
                        .info-field {
                            margin: 8px 0 8px 10px;
                            width: 63%;
                            p.title {
                                font-size: 14px;
                                font-weight: bold;
                                line-height: 20px;
                            }
                            p.intro {
                                line-height: 17px;
                                font-size: 12px;
                                margin-top: 4px;
                                .ellipsisWithLineNum(3);
                            }
                        }
                    }

                    &:last-child {
                        .margin-left-wrapper {
                            border-bottom: none;
                        }
                    }
                }
            }
        }

        &.sales-display-container {
            .display-header {
                color: #85020F;
            }
        }
        &.theme-display-container {
            .display-header {
                color: #845726;
            }
        }
    }
}

</style>
