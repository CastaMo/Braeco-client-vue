<template>
    <div id="Home-Menu">
        <div
            class='rotate-display-container'
            v-on:click='RDContainerClickEvent'
        >
            <rotate-display
                :items="activityItems"
            >
            </rotate-display>
        </div>
        <div class='category-display-container'>
            <div class='display-title'>
                <div class='display-title-wrapper'>
                    <div class='display-title-container'>
                        <p>餐品品类</p>
                    </div>
                </div>
            </div>
            <div class='display-body'>
                <ul class='category-list'>
                    <li
                        class="category-item"
                        v-for="(category, index) in categoryItems"
                        v-bind:style="{
                            'width': `${itemWidth}px`,
                            'height': `${itemWidth}px`
                        }"
                        v-bind:class="{
                            'left': index % 2 === 0,
                            'right': index % 2 === 1
                        }"
                        v-on:click="categoryClickEvent(category.id)"
                    >
                        <div
                            class='category-pic'
                            v-bind:style="{
                                'background-size': `${itemWidth}px ${itemWidth}px`
                            }"
                            v-lazy:background-image='category.pic'
                        >
                        </div>
                        <div class='category-name'>
                            <p class='name total-center'>{{category.name}}</p>
                        </div>
                    </li>
                    <div class='clear'></div>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    name: 'home-menu',
    data() {
        return {
            activityItems: null,
            categoryItems: null,
            itemWidth: document.body.clientWidth * 160 / 375
        }
    },
    created() {
        this.activityItems = this.getItemsForActivity();
        this.categoryItems = this.getItemsForCategory();
    },
    components: {
        "rotate-display": Vue.component("rotate-display")
    },
    directives: {
        lazy: Vue.directive('lazy')
    },
    methods: {
        getItemsForActivity() {
            let result = [];
            let clientWidth = document.body.clientWidth;
            for (let i = 0, len = this.$root.requireData.activity.length; i < len; i++) {
                let activity = this.$root.requireData.activity[i];
                let temp = {};
                temp.pic = `${activity.pic}?imageView2/1/w/${Math.floor(clientWidth) * 2}/h/${Math.floor(clientWidth * 200 / 375) * 2}`;
                temp.title = activity.title;
                result.push(temp);
            }
            return result;
        },
        getItemsForCategory() {
            let result = [];
            let clientWidth = document.body.clientWidth;
            for (let i = 0, len = this.$root.requireData.menu.categories.length; i < len; i++) {
                let category = this.$root.requireData.menu.categories[i];
                if (!category.display_flag) {
                    continue;
                }
                let temp = {};
                temp.id = category.id;
                temp.name = category.name;
                if (category.pic) {
                    temp.pic = `${category.pic}?imageView2/1/w/${Math.floor(clientWidth * 160 / 375) * 2}/h/${Math.floor(clientWidth * 160 / 375) * 2}`;
                }
                result.push(temp);
            }
            return result;
        },
        categoryClickEvent(id) {
            this.$root.$router.push('/menu/main/' + id);
        },
        RDContainerClickEvent() {
            this.$root.$router.push('/activity/main/');
        }
    }
}

</script>

<style lang="less" scoped>

.total-center {
    position: absolute;
    left: 50%;
    top: 50%;
    .translate(-50%, -50%);
}

.translate (@ver: 0, @hor: 0) {
    .transform(translate3d(@ver, @hor, 0));
}

.transform (@str: scale(0, 0)) {
    transform: @str;
    -webkit-transform: @str;
    -moz-transform: @str;
    -ms-transform: @str;
    -o-transform: @str;
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

#Home-Menu {
    padding-bottom: 100px;
}

.category-display-container {
    margin-top: 16px;
    background-color: #fff;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    .display-title {
        .display-title-wrapper {
            margin-left: 16px;
            border-bottom: solid 1px #C8C7CC;
            .display-title-container {
                line-height: 20px;
                padding: 12px 0;
                p {
                    border-left: solid 6px #FFC107;
                    padding-left: 8px;
                    font-weight: 700;
                }
            }
        }
    }
    .display-body {
        margin-top: 17px;
        ul {
            margin: 0 18px;
            li {
                overflow: hidden;
                margin-bottom: 20px;
                position: relative;
                .rounded-corners(3px);

                .category-pic {
                    width: 100%;
                    height: 100%;
                    .background-norm();
                }
                .category-name {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    .name {
                        width: 80%;
                        line-height: 28px;
                        color: #fff;
                        text-align: center;
                        font-size: 20px;
                    }
                }
                
                &.left {
                    float: left;
                }
                &.right {
                    float: right;
                }
            }
        }
    }
}

</style>
