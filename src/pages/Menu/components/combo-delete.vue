<template>
    <transition name="fade" mode="out-in">
        <div id='combo-delete' class='modal' v-show="showFlag">
            <div class='cover' v-on:click="showFlag = !showFlag"></div>
            <transition name='modal' mode="out-in">
                <div class='modal-dialog adapt-center' v-show="showFlag">
                    <div class='modal-content'>
                        <div class='modal-header'>
                            <b class='icon-close' v-on:click="showFlag = !showFlag"></b>
                            <p>单品删除</p>
                        </div>
                        <div class='modal-body'>
                            <div class='combo-delete'>
                                <div class='combo-delete-wrapper'>
                                    <div class='combo-delete-container'>
                                        <ul class='delete-item-list'>
                                            <li
                                                class='delete-item'
                                                v-for="(deleteItem, index) in comboDeleteItem.deleteItems"
                                                v-on:click="deleteItemClickEvent(index)"
                                            >
                                                <div class='delete-item-wrapper margin-left-wrapper'>
                                                    <div class='delete-item-container'>
                                                        <div class='choose-info left-part'>{{deleteItem.propertyInfo}}</div>
                                                        <div class='price right-part'>{{Number(deleteItem.price.toFixed(2))}}</div>
                                                        <div class='clear'></div>
                                                        <div
                                                            class='tick'
                                                            v-show="chooseIndex === index"
                                                        ></div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='modal-footer'>
                            <button class='braeco-btn yellow confirm-btn' v-on:click="confirmBtnClickEvent">确认删除</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>


<script>

module.exports = {
    name: 'combo-delete',
    props: {
        comboDeleteItem: Object,
    },
    data() {
        return {
            showFlag: false,
            chooseIndex: -1
        }
    },
    computed: {
    },
    created() {
        let vm = this;
        this.chooseIndex = 0;
        this.$root.$on("root:combo-delete-show", function(food) {
            vm.showFlag = true;
        });
    },
    watch: {
    },
    methods: {
        deleteItemClickEvent(index) {
            this.chooseIndex = index;
        },
        confirmBtnClickEvent() {
            let vm = this;
            this.showFlag = false;
            this.$emit("confirm-minus", {
                id: this.comboDeleteItem.id,
                groups: this.comboDeleteItem.deleteItems[this.chooseIndex].groups
            });
        }
    }
}

</script>

<style scoped lang="less">

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

.overflowScrolling (@num: 0) {
    -webkit-overflow-scrolling: touch;
}

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

.combo-delete {
    .combo-delete-wrapper {
        height: 220px;
        overflow: auto;
        .overflowScrolling();
        .combo-delete-container {
            padding-bottom: 50px;
            ul.delete-item-list {
                li.delete-item {
                    line-height: 22px;
                    .delete-item-container {
                        position: relative;
                        padding: 11px 0;
                        .choose-info {
                            width: 50%;
                            color: #030303;
                            .ellipsisWithLineNum(1);
                        }
                        .price {
                            margin-right: 44px;
                            color: #910012;
                            &:before {
                                content: '￥';
                                font-size: 12px;
                            }
                        }
                        .tick {
                            position: absolute;
                            width: 24px;
                            height: 24px;
                            .background-norm();
                            top: 10px;
                            right: 10px;
                            background-size: 24px 24px;
                            background-image: url("../../../assets/Icon/tick/cell.png");
                        }
                    }
                }
            }
        }
    }
}


</style>
