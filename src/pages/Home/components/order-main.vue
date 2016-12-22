<template>
    <div id='order-main'>
        <div class='order-main-wrapper'>
            <div class='order-main-container'>
                <ul class='order-already-list'>
                    <li
                        class='order-already-item'
                        v-for="orderAlready in orderForAlready"
                        v-on:click="routeToMemberOrder(orderAlready.orderInfo.order_id)"
                    >
                        <div class='title-field active-container'>
                            <div class='title-wrapper margin-left-wrapper'>
                                <div class='title-container'>
                                    <div class='left-part create-time'>{{new Date(orderAlready.createTimestamp).Format("yyyy-MM-dd hh:mm")}}</div>
                                    <div class='right-part pay-info'>{{orderAlready.orderInfo.pay_info}}</div>
                                    <div class='clear'></div>
                                </div>
                            </div>
                            <div class="arrow vertical-center"></div>
                        </div>
                        <div class='order-field'>
                            <div class='order-wrapper margin-left-wrapper'>
                                <div class='order-container'>
                                    <ul class='order-item-list'>
                                        <li
                                            class='order-item'
                                            v-for="orderItem in orderAlready.orderItems"
                                        >
                                            <div class='order-item-wrapper'>
                                                <div class='order-item-container'>
                                                    <div class='left-part name'>{{orderItem.name}}</div>
                                                    <div class='right-part num'>{{orderItem.num}}</div>
                                                    <div class='clear'></div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class='total-field'>
                            <div class='total-wrapper'>
                                <div class='total-container'>
                                    <div class='right-part'>
                                        共 {{orderAlready.orderTotalNumber}} 项，实付<span class='total-price'>{{Number(orderAlready.totalFinalPrice.toFixed(2))}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class='clear'></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

module.exports = {
    name: 'order-main',
    computed: {
        orderForAlready: function() {
            return this.$store.state.order.orderForAlready;
        }
    },
    methods: {
        routeToMemberOrder(id) {
            console.log(id);
        }
    }
}

</script>

<style scoped lang="less">

.order-main-container {
    padding: 16px 0 100px 0;
}

.order-already-item {
    background-color: #fff;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    margin-bottom: 16px;
    .title-field {
        line-height: 45px;
        .title-container {
            padding-right: 45px;
        }
    }
    .order-field {
        .order-container {
            padding: 12px 0 12px 0;
            .order-item {
                line-height: 20px;
                margin-bottom: 4px;
                font-size: 14px;
                &:last-of-type {
                    margin-bottom: 0;
                }
                .order-item-container {
                    padding-right: 16px;
                    .num {
                        &:before {
                            content: '×';
                        }
                    }
                }
            }
        }
    }
    .total-field {
        line-height: 45px;
        .total-container {
            padding-right: 16px;
            .total-price {
                margin-left: 5px;
                color: #910012;
                font-weight: bold;
                &:before {
                    content: '￥';
                    font-size: 12px;
                }
            }
        }
    }
}

</style>
