<template>
    <div id='not-login'>
        <div class='not-login-wrapper'>
            <div class='not-login-container active-container'>
                <div class='login-btn' v-on:click="btnClickEvent">
                    <div class='avater-field left-part'>
                        <div class='avater'></div>
                    </div>
                    <div class='word-field right-part'>
                        <div class='word'>点击登录</div>
                    </div>
                    <div class='clear'></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

module.exports = {
    name: 'not-login',

    data() {
        return {}
    },

    computed: {

    },
    methods: {
        btnClickEvent() {
            this.$emit("btn-click");
        }
    }
}

</script>

<style scoped lang="less">

#not-login {
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    .login-btn {
        .avater-field {
            margin: 15px;
            .avater {
                width: 60px;
                height: 60px;
                background-size: 60px 60px;
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURcXN3+To8XkGcH8AAAHKSURBVFjD7dZPToQwFAZwKtEmzoLlLHsEjzBH8SQTeh4vIUfwBrJ0ZzcmxDB9MmgZ2r6Pf8NEY4btL195fcArSXK9/vN1/wRA5HTgRRFRwUreSMVB2gBZTuRRiJNdKxpKydTcAr1AqVEBXAnZjxRsB/gSnFRsb/guOIlLcBB1QXRSQCm5ZzAiFWjOHLnrpAYNjUV1YifLDkrX0KilPdHnZ2hNEatKerFMAjO/I5erbd0e6LP30xO7oDt2qiS04MuiCWLPz/Sqrhfcp15Bcjj5sJxmlZksCkoGJ7mCIuGJIRdk0gmSoJPpA4qBJ6Bhfk/QGfwMJYMiR6VYRVJwoA+JGM0kMzICZtz7y8iSTI4qcO88+LXkMxnMZDAjYSaFmRRmxFhGz8kMrPa66mpjmQJm3vELF4cekOzQdDmJgf+wBk6XcMZv4VlymrDhcoSG/G1P/B1toDwSWq4PXt1bT3rL3RCSTSAVdzT7JQgKLx3N91BUJBW3mfb6RLdxe41v43akGCnDhxaUkDNSgwKaEjSSdq+SlcI7Y8PiFCsGSgWKHhI7JPx2ju89Eu39IfpblUBKKAY0h+gNtOD4hJAc2Gf9vaEcyh4KXeUvyxeQzQAHo26FkQAAAABJRU5ErkJggg==");
            }
        }
        .word-field {
            font-size: 20px;
            line-height: 60px;
            text-align: center;
            color: #969696;
            margin: 15px;
            width: calc(~"100% - 120px");
            width: -moz-calc(~"100% - 120px");
            width: -webkit-calc(~"100% - 120px");
        }
    }
}

</style>
