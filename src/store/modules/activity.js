const activity = (function() {

    let clientWidth = document.body.clientWidth;

    var getFixedDataForActivity = function(activity) {
        let temp = {};
        temp.content = activity.content;
        temp.title = activity.title;
        temp.detail = activity.detail;
        temp.id = activity.id;
        temp.intro = activity.intro;
        temp.rdWidth = clientWidth;
        temp.rdHeight = clientWidth * 200 / 375;
        if (activity.pic) {
            temp.rdPic = `${activity.pic}?imageView2/1/w/${Math.floor(temp.rdWidth) * 2}/h/${Math.floor(temp.rdHeight) * 2}`;
            temp.smallPic = `${activity.pic}?imageView2/1/w/${80 * 2}/h/${80 * 2}`;
        }
        return temp;
    }
    return {
        getters: {
            activityItems: function(state, getters, rootState) {
                if (!rootState.isLoaded) {
                    return [];
                } else {
                    let result = [];
                    rootState.requireData.activity.forEach(function(activity) {
                        let temp = getFixedDataForActivity(activity);
                        result.push(temp);
                    });
                    return result;
                }
            },
            activityMapTypeItems: function(state, getters, rootState) {
                if (!rootState.isLoaded) {
                    return {};
                }
                let result = {
                    theme: [],
                    sales: []
                };
                rootState.requireData.activity.forEach(function(activity) {
                    let temp = getFixedDataForActivity(activity);
                    if (result[activity.type]) {
                        result[activity.type].push(temp);
                    }
                });
                return result;
            },
            activityInfoItem: function(state, getters, rootState) {
                if (!rootState.isLoaded) {
                    return {};
                }
                let activityId = Number(rootState.route.params.activityId);
                let temp = {
                    inValid: true
                };
                if (activityId === 0 || activityId) {
                    rootState.requireData.activity.every(function(activity) {
                        if (Number(activity.id) !== activityId) {
                            return true;
                        }
                        let clientWidth = document.body.clientWidth;
                        temp.title = activity.title;
                        temp.inValid = false;
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
                        return false;
                    });
                }
                return temp;
            }
        }
    };
})();

module.exports = activity;