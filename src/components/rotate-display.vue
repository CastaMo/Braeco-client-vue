<template>
    <div class='rotate-display'>
        <ul class='display-list'
            v-if="items && items.length > 0"
            v-bind:style="{
                'width': `${itemWidth * (items.length+2)}px`,
                'height': `${itemHeight}px`,
                'transform': `translate3d(-${defaultWidth + currentIndex * itemWidth + offsetWidth}px, 0, 0)`,
                'transition': `${transitionStr}`,
                'backface-visibility': 'hidden',
                'perspective': 1000
            }"
            v-on:touchstart="touchstartEvent($event)"
            v-on:touchmove="touchmoveEvent($event)"
            v-on:touchend="touchendEvent($event)"
        >
            <li
                class='display-item'
                v-bind:id="`display-item--1`"
                v-bind:style="{
                    'background-size': `${itemWidth}px ${itemHeight}px`,
                    'width': `${itemWidth}px`,
                    'height': `${itemHeight}px`
                }"
                v-lazy:background-image="items[items.length-1].pic"
            >
                <div class='title-field'>
                    <div class='title-container'>
                        <p>{{items[items.length-1].title}}</p>
                    </div>
                </div>
            </li>
            <li
                class='display-item'
                v-for="(item, index) in items"
                v-bind:id="`display-item-${index}`"
                v-bind:style="{
                    'width': `${itemWidth}px`,
                    'height': `${itemHeight}px`,
                    'background-size': `${itemWidth}px ${itemHeight}px`
                }"
                v-lazy:background-image="item.pic"
            >
                <div class='title-field'>
                    <div class='title-container'>
                        <p>{{item.title}}</p>
                    </div>
                </div>
            </li>
            <li
                class='display-item'
                v-bind:id="`display-item-${items.length}`"
                v-bind:style="{
                    'width': `${itemWidth}px`,
                    'height': `${itemHeight}px`,
                    'background-size': `${itemWidth}px ${itemHeight}px`
                }"
                v-lazy:background-image="items[0].pic"
            >
                <div class='title-field'>
                    <div class='title-container'>
                        <p>{{items[0].title}}</p>
                    </div>
                </div>
            </li>
        </ul>
        <div class='display-loading' v-else>
            <li
                class='display-item'
                v-bind:style="{
                    'width': `${itemWidth}px`,
                    'height': `${itemHeight}px`,
                    'background-size': `${itemWidth}px ${itemHeight}px`
                }"
            >
                <div class='title-field'>
                    <div class='title-container'>
                        <p>正在加载数据中</p>
                    </div>
                </div>
            </li>
        </div>
        <div class='choose-field'>
            <ul class='choose-dot-list'>
                <li
                    v-for="(item, index) in items"
                    v-bind:id="`choose-dot-${index}`"
                    class='choose-dot'
                    v-bind:class="{'choose': ((currentIndex + items.length) % items.length) === index}"
                    v-on:click="dotClickEvent(index, $event)"
                >
                    <div class='dot'></div>
                </li>
                <div class='clear'></div>
            </ul>
        </div>
    </div>
</template>


<script>

import Vue from "vue"

module.exports = {
    name: 'rotate-display',
    created() {
        let vm = this;
        this.itemWidth = document.body.clientWidth;
        this.itemHeight = this.itemWidth * 200 / 375;
        this.defaultWidth = this.itemWidth;

        //自动轮播
        this.intervalId = setInterval(function() {
            if (!vm.temp.flag) {
                vm.currentIndex++;
                vm.transitionStr = 'all 0.3s ease-in-out';
                setTimeout(vm.onAnimateCallback, 300);
            } else {
                vm.temp.flag = false;
            }
        }, 3000);
    },
    beforeDestroy() {

        //如果不释放就会发生内存泄漏。
        clearInterval(this.intervalId);
    },
    props: {
        items: Array
    },
    data() {
        return {
            temp: {
                startX: 0,
                startY: 0,
                moveX: 0,
                moveY: 0,
                timestamp: 0,
                flag: false //标志是否在触摸
            },
            itemWidth: null,
            itemHeight: null,
            defaultWidth: null,
            offsetWidth: 0,
            transitionStr: 'all 0.3s ease-in-out',
            currentIndex: 0,
            intervalId: null
        }
    },
    directives: {
        lazy: Vue.directive('lazy')
    },
    methods: {
        touchstartEvent(event) {
            let touch = event.touches[0];
            let temp = this.temp;

            temp.flag = true;
            temp.startX = touch.clientX;
            temp.moveX = touch.clientX;
            temp.startY = touch.clientY;
            temp.moveY = touch.clientY;
            temp.timestamp = new Date().getTime();
        },
        touchmoveEvent(event) {
            event.preventDefault();

            let touch = event.touches[0];
            let temp = this.temp;

            temp.moveX = touch.clientX;
            temp.moveY = touch.clientY;
            temp.timestamp = new Date().getTime();
            this.transitionStr = '';
            this.offsetWidth = temp.startX - temp.moveX;
        },
        touchendEvent(event) {
            event.preventDefault();

            this.transitionStr = 'all 0.3s ease-in-out';
            this.offsetWidth = 0;

            let temp = this.temp;

            let startX = temp.startX;
            let currentX = temp.moveX;

            let lastTimestamp = temp.timestamp;
            let currentTimestamp = new Date().getTime();


            if (currentX < startX) {
                if ((startX - currentX)*2 >= this.itemWidth ||
                    (currentTimestamp - lastTimestamp < 60)) {
                    this.currentIndex++;
                }
            } else if (currentX > startX) {
                if ((currentX - startX)*2 >= this.itemWidth ||
                    (currentTimestamp - lastTimestamp < 60)) {
                    this.currentIndex--;
                }
            }
            setTimeout(this.onAnimateCallback, 300);
        },
        dotClickEvent(index, event) {
            event.stopPropagation();
            this.currentIndex = index;
            this.transitionStr = 'all 0.3s ease-in-out';
        },
        onAnimateCallback() {
            if (this.currentIndex >= this.items.length) {
                this.transitionStr = '';
                this.currentIndex = 0;
            } else if (this.currentIndex < 0) {
                this.transitionStr = '';
                this.currentIndex = this.items.length-1;
            }
        }
    }
}

</script>

<style lang="less" scoped>
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
.rotate-display {
    overflow-x: hidden;
    width: 100%;
    position: relative;
    li.display-item {
        float: left;
        position: relative;
        .title-field {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.5);
            p {
                line-height: 30px;
                color: #fff;
                padding-left: 16px;
            }
        }
    }
    .display-loading {
        li.display-item {
            background-image: url("data:image/png;base64,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");
        }
    }
    .choose-field {
        position: absolute;
        bottom: 5px;
        right: 16px;
        ul.choose-dot-list {
            li.choose-dot {
                float: left;
                height: 20px;
                width: 20px;
                &.choose {
                    .dot {
                        background-color: #fff;
                    }
                }
                .dot {
                    background-color: rgba(0, 0, 0, 0.5);
                    width: 8px;
                    height: 8px;
                    margin: 6px auto;
                    .rounded-corners(50%);
                }
            }
        }
    }
}

</style>
