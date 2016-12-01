<template>
    <div id='order-blank-page'>
        <div class='order-blank-wrapper'>
            <div class='order-blank-container'>
                <div class='menu-icon-field'>
                    <div class='menu-icon' v-on:click="iconClickEvent"></div>
                </div>
                <div class='word-field'>
                    <div class='word'>这里没有订单</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

module.exports = {
    name: 'order-blank-page',
    methods: {
        iconClickEvent() {
            this.$emit("menu-icon-click");
        }
    }
}

</script>

<style scoped lang="less">

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

#order-blank-page {
    .order-blank-wrapper {
        .order-blank-container {
            padding-top: 100px;
        }
    }
}

.menu-icon-field {
    .menu-icon {
        width: 180px;
        height: 180px;
        .background-norm();
        background-size: 180px 180px;
        background-image: url("../../../assets/menu-icon.png");
        margin: 0 auto;
    }
}

.word-field {
    margin-top: 56px;
    text-align: center;
}

</style>
