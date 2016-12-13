<template>
    <transition name="fade" mode="out-in">
        <div id='user-login' class='modal' v-show="showFlag">
            <div class='cover' v-on:click="closeUserLogin"></div>
            <transition name='modal' mode="out-in">
                <div class='modal-dialog adapt-center' v-show="showFlag">
                    <div class='modal-content'>
                        <div class='modal-header'>
                            <b class='icon-close' v-on:click="closeUserLogin"></b>
                            <p>手机验证</p>
                        </div>
                        <div class='modal-body'>
                            <div class='user-login'>
                                <div class='user-login-wrapper'>
                                    <div class='user-login-container'>
                                        <div class='login-title'>
                                            <p>欢迎您，新朋友！</p>
                                            <p>首次使用请您先验证手机，以便享受更多优惠！</p>
                                        </div>
                                        <div class='login-phone'>
                                            <input
                                                pattern="[0-9]*"
                                                v-model="mobile"
                                                class='braeco-input block input-mobile'
                                                placeholder="请输入您的手机号码"
                                            >
                                        </div>
                                        <div class='login-captcha'>
                                            <input
                                                pattern="[0-9]*"
                                                v-model="captcha"
                                                class='braeco-input left-part input-captcha'
                                                placeholder="请输入验证码"
                                            >
                                            <button
                                                class='braeco-btn yellow right-part'
                                                v-bind:disabled = "!getCaptchaFlag"
                                                v-on:click="getCaptchaClickEvent"
                                            >{{ isCount ? (`${remainder}s后再试`) : '获取验证码'}}</button>
                                            <div class='clear'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='modal-footer'>
                            <button
                                class='braeco-btn yellow confirm-btn'
                                v-on:click="confirmBtnClickEvent"
                                v-bind:disabled = "!loginFlag"
                            >登录</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>


<script>

module.exports = {
    name: 'user-login',
    data() {
        return {
            mobile: "",
            captcha: "",
            isCount: false,
            remainder: 60,
            timerId: null
        }
    },
    computed: {
        showFlag: function() {
            return this.$store.state.user.showFlag;
        },
        getCaptchaFlag: function() {
            return !this.isCount && /^1\d{10}$/.test(this.mobile);
        },
        loginFlag: function() {
            return this.captcha.length === 6;
        }
    },
    methods: {
        closeUserLogin() {
            this.$store.dispatch("user:endUserLogin");
        },
        getCaptchaClickEvent() {
            let vm = this;
            this.setRemainderToCount(60);
            this.$store.dispatch("user:getCaptcha", {
                mobile: this.mobile,
                callback: function(result) {
                    if (result.message === "success") {
                        vm.$root.$emit("tips:success", "获取验证码成功！");
                    } else {
                        vm.$root.$emit("tips:error", "获取验证码失败，请稍后重试！");
                    }
                }
            });
        },
        confirmBtnClickEvent() {
            let vm = this;
            this.$store.dispatch("user:login", {
                captcha: this.captcha,
                callback: function(result) {
                    if (result.message === "success") {
                        vm.$root.$emit("tips:success", "登录成功");
                        let temp = {
                            avatar              :       result.avatar,
                            mobile              :       result.mobile,
                            nickname            :       result.nickname,
                            sex                 :       result.sex,
                            user                :       result.user,
                            EXP                 :       result.membership.EXP,
                            balance             :       result.membership.balance,
                            address             :       result.address
                        };
                        vm.$store.commit("user:try-login", {
                            member_info: temp
                        });
                    } else {
                        vm.$root.$emit("tips:error", "登录失败，请稍后重试！");
                    }
                }
            });
            this.$store.dispatch("user:endUserLogin");
        },
        setRemainderToCount(remainder) {
            this.remainder = remainder;
            this.isCount = true;
            let vm = this;
            this.timerId = setInterval(function() {
                vm.remainder--;
                if (vm.remainder <= 0) {
                    vm.isCount = false;
                    clearInterval(vm.timerId);
                }
            }, 1000);
        }
    }
}

</script>

<style scoped lang="less">

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.ellipsisWithLineNum (@num: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    -webkit-box-orient: vertical;
}

.overflowScrolling (@num: 0) {
    -webkit-overflow-scrolling: touch;
}

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

.modal .modal-dialog .modal-content .modal-body {
    border-bottom: none;
    background-color: #FFFCF6;
}
.user-login {
    .user-login-wrapper {
        margin: 0 16px;
        .user-login-container {
            padding-top: 5px;
            .login-title {
                font-size: 16px;
                line-height: 25px;
                color: #4A4A4A;
                font-weight: 300;
                margin-bottom: 14px;
            }
            .login-phone {
                width: 100%;
                margin-bottom: 15px;
                position: relative;
                .force-cover {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }
            }
            .login-captcha {
                position: relative;
                input {
                    width: calc(~"50% - 10px");
                }
                button {
                    line-height: 40px;
                    width: 45%;
                    font-size: 16px;
                }
                .force-cover {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 50%;
                    height: 100%;
                }
            }
        }
    }
}


</style>
