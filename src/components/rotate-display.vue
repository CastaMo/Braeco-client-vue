<template>
    <div class='rotate-display'>
        <ul class='display-list'
            v-bind:style="{
                'width': `${itemWidth * (pics.length+2)}px`,
                'height': `${itemHeight}px`,
                'transform': `translate3d(-${defaultWidth + currentIndex * itemWidth + offsetWidth}px, 0, 0)`,
                'transition': `${transitionStr}`
            }"
            v-on:touchstart="touchstartEvent($event)"
            v-on:touchmove="touchmoveEvent($event)"
            v-on:touchend="touchendEvent($event)"
        >
            <li
                class='display-item'
                v-bind:style="{
                    'background-image': 'url(' + pics[pics.length-1] + ')',
                    'width': `${itemWidth}px`,
                    'height': `${itemHeight}px`,
                    'background-size': `${itemWidth}px ${itemHeight}px`
                }"
            ></li>
            <li
                class='display-item'
                v-for="pic in pics"
                v-bind:style="{
                    'background-image': 'url(' + pic + ')',
                    'width': `${itemWidth}px`,
                    'height': `${itemHeight}px`,
                    'background-size': `${itemWidth}px ${itemHeight}px`
                }"
            ></li>
            <li
                class='display-item'
                v-bind:style="{
                    'background-image': 'url(' + pics[0] + ')',
                    'width': `${itemWidth}px`,
                    'height': `${itemHeight}px`,
                    'background-size': `${itemWidth}px ${itemHeight}px`
                }"
            ></li>
        </ul>
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
        this.intervalId = setInterval(function() {
            if (!vm.temp.flag) {
                vm.currentIndex++;
                vm.transitionStr = 'all 0.3s ease-in-out';
                setTimeout(vm.onAnimateCallback, 300);
            }
        }, 3000);
    },
    beforeDestroy() {
        //如果不释放就会发生内存泄漏。
        clearInterval(this.intervalId);
    },
    data() {
        return {
            pics: [
                "http://static.brae.co/images/dinner/is56fwzhfi708a0e9ycn6pbby4q3snxb?imageView2/1/w/640/h/340",
                "http://static.brae.co/images/dinner/6clk2wez8b4t7ym9rlqsrgq6cvt4p16v?imageView2/1/w/640/h/340"
            ],
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

            temp.flag = false;

            if (currentX < startX) {
                if ((startX - currentX)*2 >= this.itemWidth ||
                    (currentTimestamp - lastTimestamp < 20)) {
                    this.currentIndex++;
                }
            } else if (currentX > startX) {
                if ((currentX - startX)*2 >= this.itemWidth ||
                    (currentTimestamp - lastTimestamp < 20)) {
                    this.currentIndex--;
                }
            }
            setTimeout(this.onAnimateCallback, 300);
        },
        onAnimateCallback() {
            if (this.currentIndex >= this.pics.length) {
                this.transitionStr = '';
                this.currentIndex = 0;
            } else if (this.currentIndex < 0) {
                this.transitionStr = '';
                this.currentIndex = this.pics.length-1;
            }
        }
    }
}

</script>

<style lang="less" scoped>
.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}
.rotate-display {
    overflow-x: hidden;
    width: 100%;
    ul.display-list {
        li.display-item {
            float: left;
        }
    }
}

</style>
