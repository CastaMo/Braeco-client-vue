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
                                                type="number"
                                            >
                                        </div>
                                        <div class='login-captcha'>
                                            <input
                                                pattern="[0-9]*"
                                                v-model="captcha"
                                                class='braeco-input left-part input-captcha'
                                                placeholder="请输入验证码"
                                                type="number"
                                            >
                                            <button class='braeco-btn yellow right-part'>获取验证码</button>
                                            <div class='clear'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='modal-footer'>
                            <button class='braeco-btn yellow confirm-btn' v-on:click="confirmBtnClickEvent">登录</button>
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
            captcha: ""
        }
    },
    computed: {
        showFlag: function() {
            return this.$store.state.user.showFlag;
        }
    },
    methods: {
        closeUserLogin() {
            this.$store.dispatch("user:endUserLogin");
        },
        confirmBtnClickEvent() {
            this.closeUserLogin();
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
                line-height: 25px;
                color: #4A4A4A;
                font-weight: 300;
                font-size: 18px;
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
                    width: calc(~"50% - 24px");
                }
                button {
                    line-height: 51px;
                    width: 45%;
                    font-size: 18px;
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
