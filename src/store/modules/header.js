



const header = {
    getters: {
        headerItems: function(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return [];
            } else {
                let result = [];
                let clientWidth = document.body.clientWidth;

                let canteenName = rootState.requireData.dinner.name;
                rootState.requireData.covers.forEach(function(coverPic) {
                    let temp = {};
                    temp.rdPic = `${coverPic}?imageView2/1/w/${Math.floor(clientWidth) * 2}/h/${Math.floor(clientWidth * 200 / 375) * 2}`;
                    temp.title = canteenName;
                    result.push(temp);
                });
                return result;
            }
        }
    }
};

module.exports = header;
