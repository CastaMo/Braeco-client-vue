<template>
    <div id="Menu-Main">
        <div class='main-field'>
            <div class='menu'>
                <div class='menu-wrapper'>
                    <div class='menu-container'>
                        <transition name="fade" mode="out-in">
                            <ul class='food-list' v-if="foodItems">
                                <li
                                    class='food active-container'
                                    v-for="(food, index) in foodItems"
                                    
                                >
                                    <div class='food-wrapper margin-left-wrapper'>
                                        <div class='food-container'>
                                            <div class='img-field'>
                                                <div
                                                    class='img'
                                                    v-lazy:background-image="food.pic"
                                                ></div>
                                            </div>
                                            <div class='info-field'>
                                                <div class='name-field'>
                                                    <p class='name'>{{food.name}}</p>
                                                    <p class='name2'>{{food.name2}}</p>
                                                </div>
                                                <div class='tag-field'>
                                                    <div class='dc'>第二杯半价</div>
                                                    <div class='tag'>{{food.tag}}</div>
                                                    <div class='clear'></div>
                                                </div>
                                                <div class='money-field'>
                                                    <div class='current-price'>{{food.default_price}}</div>
                                                    <div class='init-price'>{{food.default_price}}</div>
                                                    <div class='controll'>
                                                        <div class='add-btn'></div>
                                                    </div>
                                                    <div class='clear'></div>
                                                </div>
                                            </div>
                                            <div class='clear'></div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
        <div class='popup-field' v-if="categoryId">
            <transition name="fade" mode="out-in">
                <div
                    class='cover'
                    v-show="rightBarFlag"
                    v-on:click="coverClickEvent"
                ></div>
            </transition>
            <div class='top-bar'>
                <div class='category-name'>
                    <div class='category-name-wrapper'>
                        <div class='category-name-container'>
                            <p>{{categoryName}}</p>
                        </div>
                    </div>
                </div>
                <button class='switch-btn' v-on:click="switchBtnClickEvent">
                    <b class='icon-switch'></b>
                    切换品类
                </button>
                <div class='clear'></div>
            </div>
            <transition name="slide-left" mode="out-in">
                <div class='right-bar' v-show="rightBarFlag">
                    <div class='right-bar-wrapper'>
                        <div class='right-bar-container'>
                            <ul class='category-list' v-if="categoryItems">
                                <li
                                    class='category active-container'
                                    v-for="category in categoryItems"
                                    v-on:click="categoryItemClickEvent(category.id)"
                                >
                                    <div class='category-wrapper margin-left-wrapper'>
                                        <div class='img-field'>
                                            <div
                                                class='img'
                                                v-lazy:background-image="category.pic"
                                            ></div>
                                        </div>
                                        <div class='name-field vertical-center'>{{category.name}}</div>
                                        <div class='clear'></div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
module.exports = {
    name: 'menu-main',
    data() {
        return {
            categoryId: null,
            categoryName: null,
            categoryItems: null,
            foodItems: null,
            rightBarFlag: false
        };
    },
    created() {
        this.categoryId = Number(this.$root.$route.params.id);
        this.categoryItems = this.getItemsForCategory();
        this.foodItems = this.getItemsForFood();
    },
    directives: {
        lazy: Vue.directive('lazy')
    },
    components: {

    },
    methods: {
        getItemsForCategory() {
            let result = [];
            for (let i = 0, len = this.$root.requireData.menu.categories.length; i < len; i++) {
                let category = this.$root.requireData.menu.categories[i];
                if (!category.display_flag) {
                    continue;
                }
                let temp = {};
                temp.id = category.id;
                temp.name = category.name;
                if (category.pic) {
                    temp.pic = `${category.pic}?imageView2/1/w/${40 * 2}/h/${40 * 2}`;
                }
                result.push(temp);
            }
            return result;
        },
        getItemsForFood() {
            let result = [];
            for (let i = 0, len = this.$root.requireData.menu.categories.length; i < len; i++) {
                let category = this.$root.requireData.menu.categories[i];
                if (Number(category.id) === this.categoryId) {
                    for (let j = 0, len = category.dishes.length; j < len; j++) {
                        let dish = category.dishes[j];
                        let temp = {};
                        temp.able = dish.able;
                        temp.dc = dish.dc;
                        temp.dc_type = dish.dc_type;
                        temp.default_price = dish.default_price;
                        temp.groups = dish.groups;
                        temp.id = dish.id;
                        temp.name = dish.name;
                        temp.name2 = dish.name2;
                        temp.lazy = '';
                        if (dish.pic) {
                            temp.pic = `${dish.pic}?imageView2/1/w/${100 * 2}/h/${100 * 2}`
                        }
                        temp.tag = dish.tag;
                        temp.type = dish.type;
                        result.push(temp);
                    }
                    break;
                }
            }
            return result;
        },
        switchBtnClickEvent() {
            this.rightBarFlag = true;
        },
        coverClickEvent() {
            this.rightBarFlag = false;
        },
        categoryItemClickEvent(id) {
            this.categoryId = id;
            this.$root.$router.replace(`/menu/main/${id}`);
            this.rightBarFlag = false;
        }
    },
    watch: {
        categoryId(id) {
            let vm = this;
            for (let i = 0, len = this.$root.requireData.menu.categories.length; i < len; i++) {
                let category = this.$root.requireData.menu.categories[i];
                if (Number(category.id) === id) {
                    let vm = this;
                    vm.categoryName = category.name;
                    vm.foodItems = null;

                    //通过时间tick交错的方式，使dom结构强制更换，不然v-lazy会出现问题。
                    Vue.nextTick(function() {
                        vm.foodItems = vm.getItemsForFood();
                    });
                    return true;
                }
            }

            //找不到正确的id
            this.$root.$router.back();
        }
    }
}


</script>


<style lang="less" scoped>

.overflowScrolling (@num: 0) {
    -webkit-overflow-scrolling: touch;
}

.ellipsisWithLineNum (@num: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    -webkit-box-orient: vertical;
}

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.main-field {
    .menu {
        .menu-container {
            padding: 48px 0 80px;
            ul {
                li {
                    .food-container {
                        padding: 12px 16px 12px 0;
                        .img-field {
                            float: left;
                            .img {
                                width: 100px;
                                height: 100px;
                                .background-norm();
                                background-size: 100px 100px;
                            }
                        }
                        .info-field {
                            float: right;
                            min-width: 160px;
                            width: calc(~"100% - 110px");
                            width: -moz-calc(~"100% - 110px");
                            width: -webkit-calc(~"100% - 110px");
                            .name-field {
                                height: 40px;
                                .name {
                                    line-height: 22px;
                                    font-weight: bold;
                                    .ellipsisWithLineNum(1);
                                }
                                .name2 {
                                    .ellipsisWithLineNum(1);
                                    line-height: 16px;
                                    font-size: 14px;
                                    margin-top: 4px;
                                }
                            }
                            .tag-field {
                                margin-top: 5px;
                                > *:not(.clear) {
                                    float: left;
                                    line-height: 20px;
                                    .rounded-corners(2px);
                                    color: #fff;
                                    padding: 0 4px;
                                    font-size: 12px;
                                }
                                .dc {
                                    margin-right: 9px;
                                    background-color: #EB4F10;
                                }
                                .tag {
                                    background-color: #FF8F00;
                                }
                            }
                            .money-field {
                                height: 25px;
                                margin-top: 9px;
                                .current-price {
                                    float: left;
                                    color: #910012;
                                    line-height: 20px;
                                    margin-top: 3px;
                                    font-size: 16px;
                                    &:before {
                                        content: '￥';
                                        font-size: 10px;
                                    }
                                }
                                .init-price {
                                    float: left;
                                    margin-left: 5px;
                                    margin-top: 8px;
                                    line-height: 14px;
                                    font-size: 12px;
                                    text-decoration: line-through;
                                    &:before {
                                        content: '￥';
                                        font-size: 8px;
                                    }
                                }
                                .controll {
                                    float: right;
                                    .add-btn {
                                        .background-norm();
                                        width: 25px;
                                        height: 25px;
                                        background-size: 25px 25px;
                                        background-image: url("../../assets/Icon/Round/Plus.png");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


.cover {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
}

.top-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;
    background-color: #8B572A;
    .category-name {
        float: left;
        color: #fff;
        line-height: 20px;
        width: 180px;
        .ellipsisWithLineNum(1);
        .category-name-wrapper {
            margin-left: 16px;
            .category-name-container {
                padding: 14px 0;
                p {
                    padding-left: 5px;
                    border-left: solid 6px #FFC107;
                }
            }
        }
    }
    .switch-btn {
        float: right;
        margin: 8px;
        width: 106px;
        height: 32px;
        line-height: 32px;
        color: #fff;
        background-color: #FFC107;
        border: none;
        .rounded-corners(2px);
        font-size: 14px;
        .icon-switch {
            float: left;
            .background-norm();
            width: 10px;
            height: 10px;
            background-size: 10px 10px;
            background-image: url("../../assets/switch-icon.png");
            margin: 11px -7px 11px 16px;
        }
        &:active {
            background-color: #FFB300;
        }
    }
}

.right-bar {
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    width: 49%;
    background-color: #FFFBF0;
    .right-bar-wrapper {
        height: 100%;
        overflow: auto;
        .overflowScrolling();
        .right-bar-container {
            padding-bottom: 80px;
        }
    }
    ul.category-list {
        li.category {
            .category-wrapper {
                > *:not(.clear) {
                    float: left;
                }
                .img-field {
                    .img {
                        width: 40px;
                        height: 40px;
                        .background-norm();
                        background-size: 40px 40px;
                        margin: 12px 16px 12px 0;
                    }
                }
                .name-field {
                    width: 48%;
                    line-height: 22px;
                    height: 44px;
                    .ellipsisWithLineNum(2);
                    left: 72px;
                }
            }
        }
    }
}



</style>
