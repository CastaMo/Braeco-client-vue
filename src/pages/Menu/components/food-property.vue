<template>
    <transition name="fade" mode="out-in">
        <div id='food-property' class='modal' v-show="showFlag">
            <div class='cover' v-on:click="showFlag = !showFlag"></div>
            <transition name='modal' mode="out-in">
                <div class='modal-dialog adapt-center' v-show="showFlag">
                    <div class='modal-content'>
                        <div class='modal-header'>
                            <b class='icon-close'></b>
                            <p>杯口特调</p>
                        </div>
                        <div class='modal-body'>
                            <div class='property'>
                                <div class='property-wrapper'>
                                    <div class='property-container'></div>
                                </div>
                            </div>
                        </div>
                        <div class='modal-footer'>
                            <button class='braeco-btn yellow confirm-btn'>加入购物车</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>


<script>

module.exports = {
    name: 'food-property',
    data() {
        return {
            showFlag: false
        }
    },
    created() {
        let vm = this;
        this.$root.$on("root:food-property", function(food) {
            console.log(food);
            vm.showFlag = true;
        });
    },
    watch: {
        showFlag(newFlag, oldFlag) {
            this.$root.$emit("root:trolley-footer-bar-show", !newFlag);
        }
    }
}

</script>

<style scoped lang="less">

.property {
    .property-wrapper {
        height: 220px;
    }
}

</style>