<template>
    <div id='Member-Pay'>
        <div class='top-header'>
            <div class='price-bar'>
                <div class='price-bar-wrapper'>
                    <div class='price-bar-container'>
                        <div class='left-part word'>{{topHeaderWord}}:</div>
                        <div class='right-part price'>{{Number(topHeaderPrice.toFixed(2))}}</div>
                        <div class='clear'></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

module.exports = {
    name: 'member-pay',
    computed: {
        topHeaderWord: function() {
            if (this.$store.state.route.params.payType === "order") {
                return "订单总价";
            } else {
                return "充值金额";
            }
        },
        topHeaderPrice: function() {
            if (this.$store.state.route.params.payType === "order") {
                return this.$store.getters.totalFinalPrice;
            } else {
                return 100;
            }
        }
    }
};

</script>


<style scoped lang="less">

.top-header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    .price-bar {
        border-bottom: solid 1px #C8C7CC;
        width: 100%;
        background-color: #FFF5D6;
        .price-bar-container {
            padding: 0 16px;
            line-height: 43px;
            color: #910012;
            font-weight: bold;
            .price {
                &:before {
                    content: '￥';
                    font-size: 12px;
                }
            }
        }
    }
}

</style>
