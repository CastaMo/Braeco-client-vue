const mutations = {
    getData(state, payload) {
        state.requireData = payload.requireData;
        state.isLoaded = true;
        state.requireData.member_info = {
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
    }
};

module.exports = mutations;
