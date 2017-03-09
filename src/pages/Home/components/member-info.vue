<template>
    <div id='member-info'>
        <div class='member-info'>
            <div class='member-info-wrapper'>
                <div class='member-info-container'>
                    <div class='basic-field'>
                        <div class='left-part rank-img-field'>
                            <div
                                class='rank-img'
                                v-bind:class="`rank-img-${rank_info.level}`"
                            >
                            </div>
                        </div>
                        <div class='left-part basic-info-field'>
                            <p class='user-id'>No.{{member_info.user}} 号会员</p>
                            <p class='user-discount'>{{discountInfo}}</p>
                            <p class='user-balance'>余额：<span>{{member_info.balance}}</span></p>
                            <p class='user-EXP'>积分：<span>{{member_info.EXP}} / {{rank_info.nextEXP}}</span></p>
                        </div>
                        <div class='clear'></div>
                    </div>
                    <div class='extra-bar'>
                        <div
                            class='inner-bar'
                            v-bind:style="{
                                'width': `${member_info.EXP / rank_info.nextEXP * 100}%`
                            }"
                        ></div>
                        <div class='separators'>
                            <div class='separator-item' v-for="n in 10"></div>
                            <div class='clear'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='func-column'>
            <ul class='func-list'>
                <li
                    class='func-item active-container'
                    v-for="funcType in static_allFuncType"
                    v-on:click="funcClickEvent(funcType.name)"
                >
                    <div class='func-item-wrapper margin-left-wrapper'>
                        <div class='func-item-container'>
                            <div class='left-part icon' v-bind:class="`icon-${funcType.name}`"></div>
                            <div class='left-part title'>{{funcType.title}}</div>
                            <div class='clear'></div>
                        </div>
                    </div>
                    <div class='arrow vertical-center'></div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

module.exports = {
    name: 'member-info',
    data() {
        return {
            static_allFuncType: [
                { name: 'recharge', title: '会员充值'},
                { name: 'coupon', title: '我的卡券'}
            ]
        }
    },
    computed: {
        member_info: function() {
            return this.$store.state.user.member_info;
        },
        rank_info: function() {
            return this.$store.getters.rank_info;
        },
        discountInfo: function() {
            let discount = this.rank_info.discount;
            if (discount === 100) {
                return "升级会员获取优惠";
            }
            return `尊享 ${(discount / 10).toFixed(1)} 折优惠`;
        }
    },
    methods: {
        funcClickEvent: function(title) {
            this.$emit("func-click", {
                title: title
            });
        }
    }
}

</script>


<style scoped lang="less">

@MemberRank0Url: "../../../assets/member-rank/member-rank-0.png";
@MemberRank1Url: "../../../assets/member-rank/member-rank-1.png";
@MemberRank2Url: "../../../assets/member-rank/member-rank-2.png";
@MemberRank3Url: "../../../assets/member-rank/member-rank-3.png";
@MemberRank4Url: "../../../assets/member-rank/member-rank-4.png";
@MemberRank5Url: "../../../assets/member-rank/member-rank-5.png";

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

.member-info {
    margin-bottom: 16px;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    .member-info-container {
        padding: 16px 16px 14px 16px;
        .basic-field {
            margin-bottom: 14px;
            .rank-img-field {
                .rank-img {
                    width: 115px;
                    height: 100px;
                    background-size: 115px 100px;
                    .background-norm();
                    &.rank-img-0 {
                        background-image: url(@MemberRank0Url);
                    }
                    &.rank-img-1 {
                        background-image: url(@MemberRank1Url);
                    }
                    &.rank-img-2 {
                        background-image: url(@MemberRank2Url);
                    }
                    &.rank-img-3 {
                        background-image: url(@MemberRank3Url);
                    }
                    &.rank-img-4 {
                        background-image: url(@MemberRank4Url);
                    }
                    &.rank-img-5 {
                        background-image: url(@MemberRank5Url);
                    }
                }
            }
            .basic-info-field {
                margin-left: 16px;
                line-height: 18px;
                .user-id {
                    margin-top: 2px;
                    font-weight: bold;
                    font-size: 19px;
                    line-height: 27px;
                }
                .user-discount {
                    margin-top: 5px;
                    font-weight: bold;
                    line-height: 22px;
                    color: #910012;
                }
                .user-balance {
                    margin-top: 5px;
                    font-size: 14px;
                    font-weight: 300;
                    span {
                        color: #910012;
                        font-weight: bold;
                        &:before {
                            content: '￥';
                        }
                    }
                }
                .user-EXP {
                    margin-top: 4px;
                    font-size: 14px;
                    font-weight: 300;
                }
            }
        }
        .extra-bar {
            width: 100%;
            height: 8px;
            .rounded-corners(10px);
            overflow-x: hidden;
            position: relative;
            background-color: #F4F5F9;
            .inner-bar {
                .rounded-corners(10px);
                background-color: #FFC107;
                border-right: solid 1px #C8C7CC;
                height: 100%;
            }
            .separators {
                width: 100%;
                position: absolute;
                left: 0;
                top: 0;
                .separator-item {
                    float: left;
                    width: 9%;
                    height: 8px;
                    border-right: solid 2px #fff;
                }
            }
        }
    }
}

.func-column {
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    ul.func-list {
        li.func-item {
            line-height: 43px;
            .icon {
                width: 23px;
                height: 23px;
                background-size: 23px 23px;
                .background-norm();
                margin: 10px 20px 0 0;
                &.icon-recharge {
                    background-image: url("../../../assets/icon-info.png");
                }
                &.icon-coupon {
                    background-image: url("../../../assets/icon-cards.png");
                }
            }
            &:last-of-type {
                .margin-left-wrapper {
                    border-bottom: none;
                }
            }
        }
    }
}

</style>
