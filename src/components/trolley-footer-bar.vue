<template>
    <transition :name="transitionName">
        <div class="trolley-footer-bar" v-if="showFlag">
            <div class='trolley-full-bar'>
                <div class='left-part order-price-field'>
                    <span>总价:</span>
                    <span class='order-price'>{{Number(orderFinalPrice.toFixed(2))}}</span>
                </div>
                <div class='right-part btn-field'>
                    <button
                        class='confirm-btn'
                        v-on:click="routeToOrder"
                    >选好了</button>
                </div>
                <div class='clear'></div>
            </div>
            <div class='trolley-icon-field'>
                <div
                    class='trolley-icon'
                    v-bind:class="{
                        'trolley-icon-animation': animationFlagForAdd
                    }"
                    v-on:click="routeToOrder"
                >
                    <div class='order-number'>{{orderTotalNumber}}</div>
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
    props: {
        orderFinalPrice: Number,
        orderTotalNumber: Number
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
    methods: {

        routeToOrder() {
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
            &:active {
                background-color: #FFB300;
            }
            &:focus {
                outline: none;
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
        background-image: url(data:image/jpg;base64,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);
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
