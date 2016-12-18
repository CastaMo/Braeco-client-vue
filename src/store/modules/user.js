const user = {
    state: {

        /*
         * member_info.EXP      Number 经验值
         * member_info.address  Object 地址 {address: 地图地址, detail: 详细信息}
         * member_info.avatar   String 头像url
         * member_info.balance  Number 余额
         * member_info.mobile   Number 手机号码
         * member_info.nickname String 昵称
         * member_info.sex      Number 性别
         * member_info.user     Number userId
         */
        member_info: null,

        showFlag: false
    },
    getters: {
        rank_info: function(state, getters, rootState) {
            let member_info = state.member_info;
            if (!member_info) {
                return null;
            }
            let temp = {};
            let ladder = rootState.requireData.membership_rule.ladder;
            let ladderLen = ladder.length;
            ladder.every(function(item, index) {
                if (item.EXP <= member_info.EXP) {
                    if (
                        // 最大一项或者比下一项小, 那么就是它了。
                        index === ladderLen - 1
                    ||  ladder[index + 1].EXP > member_info.EXP
                    ) {
                        temp = item;
                        if (index === ladderLen - 1) {
                            temp.nextEXP = item.EXP;
                        } else {
                            temp.nextEXP = ladder[index + 1].EXP;
                        }
                        return false;
                    }
                }
                return true;
            });
            return temp;
        },
        charge_ladder: function(state, getters, rootState) {
            let temp = [];
            if (!rootState.isLoaded
            ||  !state.member_info
            ) {
                return temp;
            }

            temp = Vue.util.extend([], rootState.requireData.membership_rule.charge_ladder);

            let current_EXP = state.member_info.EXP;
            let current_level = getters.rank_info.level;
            let ladder = rootState.requireData.membership_rule.ladder;

            temp.forEach(function(chargeItem) {
                if (chargeItem.get > chargeItem.pay) {
                    chargeItem.give = chargeItem.get - chargeItem.pay;
                }
                let recharge_to_level = current_level;
                let total_EXP = current_EXP + chargeItem.EXP;

                // 遍历以查询最大可到达多少级
                for (let i = current_level + 1, len = ladder.length;
                    i < len;
                    i++
                ) {
                    let ref = ladder[i];
                    if (total_EXP >= ref.EXP) {
                        recharge_to_level = i;
                    } else {
                        break;
                    }
                }
                if (recharge_to_level > current_level) {
                    chargeItem.to_rank_info = {
                        level: recharge_to_level,
                        level_name: ladder[recharge_to_level].name
                    };
                }
            });
            return temp;
        }
    },
    mutations: {
        "user:try-login": function(state, playload) {
            let temp = null;
            if (Number(playload.member_info.user) === 0) {
                return state.member_info = temp;
            }
            return state.member_info = playload.member_info;
        },
        "user:modify-property": function(state, playload) {
            for (var key in playload) {
                var value = playload[key];
                state.member_info[key] = value;
            }
        },
        "user:set-show-flag": function(state, playload) {
            state.showFlag = playload.showFlag;
        }
    },
    actions: {
        "user:startUserLogin": function(context, playload) {
            context.commit("user:set-show-flag", {
                showFlag: true
            });
        },
        "user:endUserLogin": function(context, playload) {
            context.commit("user:set-show-flag", {
                showFlag: false
            });
        },
        "user:getCaptcha": function(context, playload) {
            NProgress.start();
            requireManage.get("getCaptcha").require({
                data: {
                    JSON: JSON.stringify({
                        type: "testmsg",
                        mobile: playload.mobile
                    })
                },
                success: function(result) {
                    playload.callback(result);
                },
                always: function() {
                    NProgress.done();
                }
            });
        },
        "user:login": function(context, playload) {
            NProgress.start();
            requireManage.get("login").require({
                data: {
                    JSON: JSON.stringify({
                        captcha: playload.captcha
                    })
                },
                success: function(result) {
                    playload.callback(result);
                },
                always: function() {
                    NProgress.done();
                }
            });
        }
    }
};

module.exports = user;
