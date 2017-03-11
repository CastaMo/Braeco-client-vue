<template>
    <transition :name="transitionName">
        <div class="trolley-footer-bar" v-if="showFlag">
            <div class='trolley-full-bar'>
                <div class='left-part order-price-field'>
                    <span>总价:</span>
                    <span class='order-price'>{{Number(total_final_price_with_coupon.toFixed(2))}}</span>
                </div>
                <div class='right-part btn-field'>
                    <button
                        class='confirm-btn'
                        v-on:click="routeToOrder"
                        v-bind:class="{
                            'disabled': !trolley_btn_able
                        }"
                    >{{trolley_btn_name}}</button>
                </div>
                <div class='clear'></div>
            </div>
            <div class='trolley-icon-field'>
                <div
                    class='trolley-icon'
                    v-bind:class="{
                        'trolley-icon-animation': animationFlagForAdd,
                        'disabled': !trolley_btn_able
                    }"
                    v-on:click="routeToOrder"
                >
                    <div class='order-number'>{{order_total_number}}</div>
                </div>
            </div>
            <div id='ball-container'>
                <div
                    class='active-ball'
                    v-for="activeBall in ballItems"
                    v-bind:style="{
                        'left': `${activeBall.x}px`,
                        'top': `${activeBall.y}px`
                    }"
                ></div>
            </div>
        </div>
    </transition>
</template>


<script>

module.exports = {
    name: 'trolley-footer-bar',
    created() {
        let vm = this;

        let clientHeight = document.body.clientHeight;
        let clientWidth = document.body.clientWidth;

        vm.$root.$on("root:play-ball", function(options) {
            let ball = {
                curvature   : options.curvature     || 0.009,
                duration    : options.duration      || 600,
                endLeft     : options.endLeft       || 40,
                endTop      : options.endTop        || (clientHeight - 48),
                initLeft    : options.initLeft      || (clientWidth - 50),
                initTop     : options.initTop       || 100,
                callback    : options.callback
            };
            vm.addBall(ball);
            vm.playAnimationForBall(ball);
        });

        vm.$root.$watch("$route", function(to, from) {
            let toPath = to.path;
            let toRouteFirstItem = toPath.split("/");
            vm.showFlag = false;
            if (toRouteFirstItem[1] === 'menu') {
                if (
                    toRouteFirstItem[2] === 'main'
                ||  toRouteFirstItem[2] === 'info'
                ||  toRouteFirstItem[2] === 'order'
                ) {
                    return vm.showFlag = true;
                }
            }
            vm.animationFlagForAdd = false;
        });
    },
    data() {
        return {
            animationFlagForAdd: false,
            ballItems: [],
            showFlag: false,
            transitionName: 'slide-bottom',
            orderLen: 0
        };
    },
    computed: {
        order_total_number: function() {
            return this.$store.getters.order_total_number;
        },
        total_final_price_with_coupon: function() {
            return this.$store.getters.total_final_price_with_coupon;
        },
        trolley_btn_name: function() {
            return this.$store.getters.trolley_btn_name;
        },
        trolley_btn_able: function() {
            return this.$store.getters.trolley_btn_able;
        }
    },
    methods: {

        routeToOrder() {
            if (!this.trolley_btn_able) {
                return;
            }
            this.$root.$emit("root:route-to-order");
        },

        playAnimationForTrolleyIcon() {
            let vm = this;
            vm.animationFlagForAdd = false;
            setTimeout(function() {
                vm.animationFlagForAdd = true;
            }, 20);
        },
        playAnimationForBall(ball) {
            let vm = this;
            ball.timerId = setInterval(function() {
                vm.step(ball);
            }, 20);
        },

        addBall(ball) {
            ball.midLeft = (ball.initLeft + ball.endLeft) / 2;
            ball.midTop = ball.initTop / 1.1;
            ball.begin = +new Date();
            ball.end = ball.begin + ball.duration;
            ball.driftx = ball.initLeft - ball.endLeft;
            ball.drifty = ball.initTop - ball.endTop;

            let temp1 = ball.endLeft - ball.midLeft;
            let temp2 = ball.midLeft - ball.initLeft;
            let temp3 = ball.initLeft - ball.endLeft;

            let temp4 = ball.initTop - ball.endTop;
            let temp5 = ball.initLeft + ball.endLeft;


            ball.a = (
                        ball.initTop * temp1
                    +   ball.endTop * temp2
                    +   ball.midTop * temp3
                    ) /
                    (
                        ball.initLeft * ball.initLeft * temp1
                    +   ball.endLeft * ball.endLeft * temp2
                    +   ball.midLeft * ball.midLeft * temp3
                    );

            ball.b = temp4 / temp3 - ball.a * temp5;
            ball.c = ball.initTop - ball.initLeft * ball.initLeft * ball.a - ball.initLeft * ball.b;
            ball.x = ball.initLeft;
            ball.y = ball.initTop;

            this.ballItems.push(ball);
        },
        step(ball) {
            let now = +new Date;
            let vm = this;
            if (now > ball.end) {
                this.playAnimationForTrolleyIcon();
                if (typeof ball.callback === 'function') {
                    // 防止因callback无法正常执行而导致小球动画永远无法被释放。
                    try {
                        ball.callback();
                    } catch(e) {
                        console.log(e);
                    }
                }
                if (!!ball.timerId) {
                    clearInterval(ball.timerId);
                }
                let ballIndex = vm.ballItems.indexOf(ball);
                return vm.ballItems.splice(ballIndex, 1);
            }
            ball.x = ball.initLeft - (now - ball.begin) * ball.driftx / ball.duration;
            ball.y = ball.a * ball.x * ball.x + ball.b * ball.x + ball.c;
            if (typeof ball.stepCallback === 'function') {
                ball.stepCallback();
            }
        },
    },
    watch: {
        ballItems(newItems, oldItems) {
            if (newItems.length === 0) {
                this.animationFlagForAdd = false;
            }
        }
    }
}

</script>

<style lang="less" scoped>

.transform (@str: scale(0, 0)) {
    transform: @str;
    -webkit-transform: @str;
    -moz-transform: @str;
    -ms-transform: @str;
    -o-transform: @str;
}

.animation (@str) {
    animation: @str;
    -moz-animation: @str;
    /* Firefox */
    -webkit-animation: @str;
    /* Safari and Chrome */
    -o-animation: @str;
    /* Opera */
}

.trolley-icon-animation {
    .animation(animation-bounce-up 0.4s);
}

/*-----------Bounce Up Animation Start----------*/

.animation-bounce-up-frame(@stage: 1) when (@stage =1) {
    .transform(translate3d(0, 0, 0));
}

.animation-bounce-up-frame(@stage: 1) when (@stage =2) {
    .transform(translate3d(0, -17px, 0));
}

.animation-bounce-up-frame(@stage: 1) when (@stage =3) {
    .transform(translate3d(0, -9px, 0));
}

.animation-bounce-up-frame(@stage: 1) when (@stage =4) {
    .transform(translate3d(0, -5px, 0));
}

@keyframes animation-bounce-up {
    0% {
        .animation-bounce-up-frame(1);
    }
    16.7% {
        .animation-bounce-up-frame(2);
    }
    33.3% {
        .animation-bounce-up-frame(1);
    }
    50% {
        .animation-bounce-up-frame(3);
    }
    66.7% {
        .animation-bounce-up-frame(1);
    }
    83.3% {
        .animation-bounce-up-frame(4);
    }
    100% {
        .animation-bounce-up-frame(1);
    }
}

@-moz-keyframes animation-bounce-up {
    0% {
        .animation-bounce-up-frame(1);
    }
    16.7% {
        .animation-bounce-up-frame(2);
    }
    33.3% {
        .animation-bounce-up-frame(1);
    }
    50% {
        .animation-bounce-up-frame(3);
    }
    66.7% {
        .animation-bounce-up-frame(1);
    }
    83.3% {
        .animation-bounce-up-frame(4);
    }
    100% {
        .animation-bounce-up-frame(1);
    }
}

@-webkit-keyframes animation-bounce-up {
    0% {
        .animation-bounce-up-frame(1);
    }
    16.7% {
        .animation-bounce-up-frame(2);
    }
    33.3% {
        .animation-bounce-up-frame(1);
    }
    50% {
        .animation-bounce-up-frame(3);
    }
    66.7% {
        .animation-bounce-up-frame(1);
    }
    83.3% {
        .animation-bounce-up-frame(4);
    }
    100% {
        .animation-bounce-up-frame(1);
    }
}

@-o-keyframes animation-bounce-up {
    0% {
        .animation-bounce-up-frame(1);
    }
    16.7% {
        .animation-bounce-up-frame(2);
    }
    33.3% {
        .animation-bounce-up-frame(1);
    }
    50% {
        .animation-bounce-up-frame(3);
    }
    66.7% {
        .animation-bounce-up-frame(1);
    }
    83.3% {
        .animation-bounce-up-frame(4);
    }
    100% {
        .animation-bounce-up-frame(1);
    }
}

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

.ellipsisWithLineNum (@num: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    -webkit-box-orient: vertical;
}

.trolley-footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 44px;
    z-index: 0;
}

.trolley-full-bar {
    height: 44px;
    width: 100%;
    background-color: #8B572A;

    .order-price-field {
        margin-left: 77px;
        line-height: 44px;
        color: #fff;
        .ellipsisWithLineNum(1);
        width: 140px;
        .order-price {
            &:before {
                content: '￥';
                font-size: 13px;
            }
        }
    }

    .btn-field {
        .confirm-btn {
            width: 100px;
            height: 44px;
            line-height: 44px;
            color: #fff;
            background-color: #FFC107;
            border: none;
            font-size: 16px;
            &:active:not(.disabled) {
                background-color: #FFB300;
            }
            &:focus {
                outline: none;
            }
            &.disabled {
                background-color: #E7DED8;
            }
        }
    }

}

.trolley-icon-field {
    position: absolute;
    bottom: 4px;
    left: 16px;
    .trolley-icon {
        width: 48px;
        height: 48px;
        background-size: 48px 48px;
        .background-norm();
        background-image: url("../assets/indents.png");
        &:active:not(.disabled) {
            opacity: 0.5;
        }
        .order-number {
            position: absolute;
            width: 16px;
            height: 16px;
            background-color: #D0021B;
            top: 5px;
            right: 6px;
            color: #fff;
            .rounded-corners(50%);
            line-height: 16px;
            text-align: center;
            font-size: 12px;
        }
    }
}

#ball-container {
    position: fixed;
    left: 0;
    top: 0;
}

.active-ball {
    position: absolute;
    width: 15px;
    height: 15px;
    .rounded-corners(50%);
    background-color: #FFC107;
}

</style>
