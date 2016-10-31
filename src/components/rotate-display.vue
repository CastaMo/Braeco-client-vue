<template>
    <div class='rotate-display'>
        <ul class='display-list'
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
        <div class='choose-field'>
            <ul class='choose-dot-list'>
                <li
                    v-for="(item, index) in items"
                    v-bind:id="`choose-dot-${index}`"
                    class='choose-dot'
                    v-bind:class="{'choose': ((currentIndex + items.length) % items.length) === index}"
                    v-on:click="dotClickEvent(index)"
                >
                    <div class='dot'></div>
                </li>
                <div class='clear'></div>
            </ul>
        </div>
    </div>
</template>


<script>

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
        dotClickEvent(index) {
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
    ul.display-list {
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
