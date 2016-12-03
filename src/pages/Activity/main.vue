<template>
    <div id="Activity-Main">
        <div class='rotate-display-container'>
            <rotate-display :items="headerItems"></rotate-display>
        </div>
        <div class='activity-display-container'>
            <div class='sales-display-container display-container' v-if="activityMapTypeItems.sales">
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
                            v-for="activity in activityMapTypeItems.sales"
                            v-on:click="activityLiClickEvent(activity.id)"
                        >
                            <div class='activity-wrapper margin-left-wrapper'>
                                <div class='img-field'>
                                    <div
                                        class='img'
                                        v-lazy:background-image="activity.smallPic">
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
            <div class='theme-display-container display-container' v-if="activityMapTypeItems.theme">
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
                            v-for="activity in activityMapTypeItems.theme"
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

const mapGetters = require("Vuex").mapGetters;

module.exports = {
    name: 'activity-main',

    computed: {
        ...mapGetters([
            'headerItems',
            'activityMapTypeItems'
        ])
    },

    created() {
    },
    components: {
        'rotate-display': require('../../components/rotate-display')
    },
    methods: {
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
