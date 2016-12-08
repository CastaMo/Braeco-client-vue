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
        test_member_info: {
            EXP: 17837,
            address: {
                address: "广东省广州市番禺区 中二横路/中四路(路口)",
                detail: "哈哈哈"
            },
            avatar: "http://static.brae.co/images/avatar/default.png",
            balance: 9672.96,
            mobile: "18819473259",
            nickname: "冠钊",
            sex: 0,
            user: 2
        }
    },
    getters: {
        member_info: function(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return null;
            };
            if (Number(rootState.requireData.member_info.user) === 0) {
                return null;
            }
            let temp = rootState.requireData.member_info;
            return temp;
        }
    }
};

module.exports = user;
