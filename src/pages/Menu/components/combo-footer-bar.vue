<template>
    <transition name='slide-bottom'>
        <div id='combo-footer-bar' v-if="true">
            <div class='combo-full-bar'>
                <div class='left-part combo-price-field'>
                    <span><b>套餐总价:</b></span>
                    <span class='price'>45</span>
                </div>
                <div class='right-part btn-field'>
                    <button
                        class="braeco-btn confirm-btn yellow rect"
                        v-bind:class="{
                            'disabled': !enableFlag
                        }"
                        v-on:click="confirmBtnClickEvent"
                    >加入购物车</button>
                </div>
                <div class='clear'></div>
            </div>
        </div>
    </transition>
</template>

<script>

module.exports = {
    name: 'combo-footer-bar',
    props: {
        enableFlag: Boolean,
        comboPrice: Number
    },
    created() {

    },
    methods: {
        confirmBtnClickEvent() {
            if (!this.enableFlag) {
                return;
            }
            this.$emit("confirm-add");
        }
    }
}

</script>


<style scoped lang="less">

#combo-footer-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 44px;
    .combo-full-bar {
        height: 44px;
        width: 100%;
        background-color: #8B572A;
        .combo-price-field {
            line-height: 44px;
            color: #fff;
            margin-left: 16px;
            font-size: 16px;
            .price {
                &:before {
                    content: '￥';
                    font-size: 13px;
                }
            }
        }
        .btn-field {
            .confirm-btn {
                border: none;
                line-height: 44px;
                width: 100px;
                font-size: 16px;
            }
        }
    }
}

</style>
