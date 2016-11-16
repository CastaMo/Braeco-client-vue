<template>
	<div id='category-bar'>
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
                                    v-bind:class="{
                                        'choose': categoryId === category.id
                                    }"
                                >
                                    <div class='category-wrapper margin-left-wrapper'>
                                        <div class='img-field'>
                                            <div
                                                class='img'
                                                v-lazy:background-image="category.smallPic"
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
	name: 'category-bar',

	props: {
		categoryId: Number,
		categoryItems: Array,
		categoryName: String
	},

	data() {
		return {
			rightBarFlag: false
		}
	},

	methods: {
		switchBtnClickEvent() {
            this.rightBarFlag = true;
        },
        coverClickEvent() {
            this.rightBarFlag = false;
        },
        categoryItemClickEvent(id) {
            this.$emit("category-id-change", id);
            this.rightBarFlag = false;
        }
	},
	directives: {
		'lazy': Vue.directive('lazy')
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

.box-shadow (@str) {
    //Firefox4.0-
    -moz-box-shadow: @str;
    //Safariand Google chrome10.0-
    -webkit-box-shadow: @str;
    //Firefox4.0+、 Google chrome 10.0+ 、 Oprea10.5+ and IE9
    box-shadow: @str;
}

.cover {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
}

.top-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;
    z-index: 2;
    background-color: #8B572A;
    .box-shadow(0px 2px 8px rgba(0, 0, 0, 0.2));
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
            background-image: url("../../../assets/switch-icon.png");
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
    z-index: 3;
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
            &.choose {
                background-color: #FFECB3;
            }
        }
    }
}

</style>