<template>
    <div id='menu-bar'>
        <div class='main-field'>
            <div class='menu'>
                <div class='menu-wrapper'>
                    <div class='menu-container'>
                        <transition name="fade" mode="out-in">
                            <ul class='food-list' v-if="foodItems">
                                <li
                                    class='food active-container'
                                    v-for="(food, index) in foodItems"
                                    
                                >
                                    <div class='food-wrapper margin-left-wrapper'>
                                        <div class='food-container'>
                                            <div class='img-field'>
                                                <div
                                                    class='img'
                                                    v-lazy:background-image="food.pic"
                                                ></div>
                                                <div
                                                    class='label-img'
                                                    v-if="food.dc_type && food.dc_type !== 'none'"
                                                    v-bind:class="`label-${food.dc_type}`"
                                                ></div>
                                            </div>
                                            <div class='info-field'>
                                                <div class='name-field'>
                                                    <p class='name'>{{food.name}}</p>
                                                    <p class='name2'>{{food.name2}}</p>
                                                </div>
                                                <div class='label-field'>
                                                    <div class='dc' v-if="food.dc_type && food.dc_type !== 'none'">{{food.dcStr}}</div>
                                                    <div class='tag' v-if="food.tag">{{food.tag}}</div>
                                                    <div class='clear'></div>
                                                </div>
                                                <div class='money-field'>
                                                    <div class='current-price'>{{Number(food.currentPrice.toFixed(2))}}</div>
                                                    <div class='init-price' v-if="food.chooseAllFirstPrice > food.currentPrice">{{Number(food.chooseAllFirstPrice.toFixed(2))}}</div>
                                                    <div class='controll'>
                                                        <div
                                                            class='add-btn'
                                                        >
                                                            <div class='add-btn-img' v-if="food.type === 'normal'"></div>
                                                            <div class='add-btn-word' v-else>选择</div>
                                                        </div>
                                                    </div>
                                                    <div class='clear'></div>
                                                </div>
                                            </div>
                                            <div class='clear'></div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
module.exports = {
    name: 'menu-bar',
    props: {
        foodItems: Array
    },
    directives: {
        'lazy': Vue.directive('lazy')
    }
}
</script>


<style lang="less" scoped>
.overflowScrolling (@num: 0) {
    -webkit-overflow-scrolling: touch;
}

.ellipsisWithLineNum (@num: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    -webkit-box-orient: vertical;
}

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

.box-shadow (@str) {
    //Firefox4.0-
    -moz-box-shadow: @str;
    //Safariand Google chrome10.0-
    -webkit-box-shadow: @str;
    //Firefox4.0+、 Google chrome 10.0+ 、 Oprea10.5+ and IE9
    box-shadow: @str;
}

.main-field {
    .menu {
        .menu-container {
            padding: 48px 0 80px;
            ul {
                li {
                    .food-container {
                        padding: 12px 16px 12px 0;
                        .img-field {
                            float: left;
                            position: relative;
                            .img {
                                width: 100px;
                                height: 100px;
                                .background-norm();
                                background-size: 100px 100px;
                            }
                            .label-img {
                                position: absolute;
                                left: -1px;
                                top: 6px;
                                height: 20px;
                                width: 56px;
                                .background-norm();
                                background-size: 56px 20px;
                                &.label-half {
                                    width: 66px;
                                    background-size: 66px 20px;
                                    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAAAoCAMAAAAIRKIAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA5UExURQAAAP/////78//////////////////88f/////////BB//////uvf/NOP/ffv/12f/oov/HH//WW5zzaNYAAAAKdFJOUwAtrqYWjHP+yE33peOgAAAClklEQVRYw+2Y27acIAyG7e6BVkkIef+HbX4Cjjji3r3Ci2atOTjD4SN/EtBl2abbxzIfIvx4AMSfZT7ET2NY1mmWgzH8XuZCRDji21wIBsOvZSoEvcSYB5Fqds6E4JadEyEIDN+XqRC5E+MFwSGEXMQKQWpTPVmuYvKqqVm0dkRkf9gAAYskKu3E5lGN1XoI6cR4QYANg8JRwT6l+uxotEPw/ltaV93w04orF5vRDtGfY9e1me6lsofYJ2zDGzvFk9kKmW3wyERxi1TM50sNwhiLRzFRzKAkDCnXpbKHMAcF9INaMfWdzpkFP9sXW28WydW75BDaJnQ1iluAEq5LZQ/BIryKCNlLFRfXppyKJzLeWd3PVGYuELG5PmDiehU7PY6l8iTHyfNyB8FCLp8E88laNcAP2aPE1ZB2pUc96E2MHUJPMRgHEJIAsSlvwQaT5BCE1CkQ9oWaGow1R1ozH/U4ZWeXHbkYnJhLXHwCIR45EZFBnqxbzS/LMM+NkF2n8k6XpbKHyFwMEJ4Ao/0Xc3MwUaCLyDZK5YjF5x2C1y9A0BflqBDmbQUEl4aeq2X6lrVDiDs50FAJQRNeAw0h4HuIJuphWMzrxCEPryFuArM0VAWEl2i6hcAMDmEBJ55QxYF7ag0h7lL0rOugUCSpELFAUC2SvaVbiHGxyroHpip/BhHxf/JKkGtIHGKC7iGGZXv17Cx+Ln3vIRJTgbC9JP9jTNxsYF5dvPRBdvSScLLYICR6mHd19QLCB32DGG3l5FKm1hW94vaet4zMZOUvQbh3LyAGhxrG5rViC3sNnN+stlRfzmmb688ubEmCIw32WvvQ5x3vnnHQfcaR/xk3P4+4DXzGDfGxcD7iIcn/x0WPeXC2ffwFUu7SugsAiTgAAAAASUVORK5CYII=");
                                }
                                &.label-sale {
                                    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAAoCAMAAAAR447jAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA5UExURQAAAP/////BB//////+/P/////////88v/////////pp//23P/RR//ZaP/kk//ww//ff//FFv/LMAm1nqsAAAAKdFJOUwBZ//+bN3P+Fsgye494AAACf0lEQVRYw92Y63LjIAyFvXZ36UpIYN7/YasjwLc4aX7RmWomDSaOPji6mHSalqH2MY0F8udg4N9pLNAEnaZ5iK3BeP+nccDUBR0EFPD+TcOAZRd0DJCNFz7HARWC/pmGAeNWEWOA60nQC1BCCLSFOqUU2ziHkLPWgITAdhniLKp6cGx+0w2Q9op4BGL34ehBOnBZKC1ru0Xtcolz/WtFxrDgzdItXytiF3QHrrCCT4sPbcpcaOTuLYRFWwaUigIbvim5YbF1JLct5gzM1763ejYn37OZv2lNcc5wnghisTlf1Q1XPsj3LeYMRPROtrr6bEBGPO1rm+jKh4VR/fBo6b7FfJ+lWLMBAjTFMMY2J9ibYvEisQIpYikcIx+B5UHQHZjNa8tJtWFpy5PD0xMxNH+2eY8hVeFf7fBSESdgrPLMNVnYA15KgaTIIY9FmQt76j4CCXcuqZTjDs8t5ipp6BWxoZEMgkwIIVGblCfA2x2+BmqrKvcmnQwgkser4QnwmKWplcr3ku4bS91RrEnDxMq5LfwOGEWy9SE4pzPwVdL0fDi0KGllAaC8AKaLpGF9ryy0SinbGrUWvgO1JdJtDK1gYs4STdcYiSi+Ufi7ptSi5SPqwJ5St0DrE75M9ELr6zy/0dp8R0R6yFasTh0YuHe7BsR12YBSY73k1prael83b+mWvUF6BzG3SAUvCZiUBhTXAtOWLK6E91yFtsiT/Mbj6eHQmnyvwuCYet7cUgP6BqsnBIGrEq230uWx+OQBTFfL84rw28tkE425JgMmBC+b9PtszrZZSv8e0if/6BFj/CFq/DFx/EF4+FF//I+ZY8MZ/oP0V//kHv9PheXjC9BRQT515oO9AAAAAElFTkSuQmCC");
                                }
                                &.label-discount {
                                    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAAoCAMAAAAR447jAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURQAAAP/////BB//////////////////+/P/////////yyf/kkv/88v/QRf/XXv/ssf/IJf/eef/nn//44jieOgcAAAAKdFJOUwBZ///YvnObNxakqcaiAAACO0lEQVRYw92Y4XaDIAyFmW7rCgQIvP+7jhsUZaOtv7JzlnPWOgU/uUmuWmNW1bgZXWC5KwO/jC6wCmrMohLJV9670QPGXVAlIIP3adSAIuiH0QPayvN3PaCDoG9GDUi9I5SABR1x/wUM3ntakgTXbbdVs6+XuEeShHhfMDgswTmXjhPXyigTXj46YgTW3YRJW9ABtPu+jIrDNwaHpX3WUUVCzFIin3hhFLQDCa3CqF9vJbCPKspTwme0GxDjQkOBDSFcm7H2uTy1mBG4LaEetqM9rCtYpa2slbhnnNxmiFVwcicBoGzw3GJGoKzA8gDkCJkin4H4ivFkyLZf7XETmlvMoxza8fpaDjtQFCWsLQPLITRgJELRSBbK3GIeAX2UcHMghEitXJxsLs9WOFjMBGizH6QSYDhLmiAyT4DTFY4WMwG2ohHBmHrKh6IJD4DTFT4FIjkxSQ55b0ORpNBL4KlK9+55KWlcj6LZgQz9fuRwBiSu0YBSSflK0fgJUPZdAMYfkvp0oS04/AZmipeACT5bFwlvpZRzpguNv0yAs7aYAquVYw4SGKuvl+WCtTWg+MgFIIqBjhziPwAd5OyTX5i3288ROpCC7cDAJyDJdWGwY5bqL3I90Bad6i7cnqRlQhHADnRH0fTbkwBlge0wDAJKpm4YeXTHRzfghE5C1gNW226sCRZXIS5ugWO1Jhh/lZ1zKxBGrfQxmP23jxjqD1H6j4n6D8Lqj/r6LzNnw1F/If3Xr9z6Pyqst2+y8kRREG22EwAAAABJRU5ErkJggg==");
                                }
                                &.label-limit {
                                    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAAA8CAMAAADFYgHTAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURQAAAP/////12f/BB//////////++v/99//DCP/////////ppv/fff/jj//SS//LMP/GGv/YZP/33//wwyxU1ZwAAAAKdFJOUwDZw/8esk//f3/rMqhjAAADTUlEQVRo3u2a7ZKkIAxF3bJnmZGPEHj/d12bAAZFRWe3Smo2P7Tt1vZAkhtAh+Fr6sE+hj5A3asT0N9DH6BfQx+gv4ZOQF8B9HN8rDnm+CeD6qxMzwY1xCleDwe1blGmR4PK0vGPBcWoTK+Hg4JYOf6poL5QpueCKl6SHgyaHP/6t6D2bWz/3ZK0BUWdDEEXRv6QdTNcUISlgpLyFtatIAZ1oSRtQWUeBkhTjAoED/CNYbw8+MuPx6Cxt+SFknQPVPC+9BwUY1fVQO3iHAIV6dCcl6QdUOMyqDOzrUAdjwjJQenAVkFhdwinzktSHVSMDDTFVJPryfNK02k67qWGa6DbktQAOmctrHsUmCEDpWBR29aYDCpxa3Beks5BLyUTeQyOQPFeSfrLoIKCBWOfKkXkWi2uRz+bHGk7QtyflqRzUJESm0DB1M0yz2cVrCUTivBftKXfZUNJuppMe3ovJSyePwYNwmM9qUPoPN1QknbkSc6N8lAB9buZi8nzs9wfgoa/AFJBuhs2lKR9wXfRk6Xrld6zGQacSCcegGq2pYabhpJ0UJm8rSWTUXWDJQ1OQMM5CimaBUXAeUk6r0wrULnjedMMapbyLFkluQVaJFNWdjY6yiXepw/toGHnaZuz4KbrCx0Vs2mISRJB9VIcY63noJVa6ZngE1zY1tTpSjIVOkpkSUVaXH8C6vIdJl1RpyvyVLjeFywyhQM13ACJ2BVQvwiprxXVu4KfU8o2J5PdGgOldJWrS79dQl0cMEl9JevtO7KFsy7sLU8mCkJU+VK4PyiZvGCgFKqWTdreRjcyrMc4KP2qY2aoAhQXId2o08VhHp+KuNhANR72KJagLjYOpkWAEii8hwYISeJc01pOEyjv0jZQzJM3prJmE5GY8uz2VITcSaDzANwtXZpdr49c7zKTyUkfw4DPwdMEDO9O7kRRJCaabYQu1S4ZhVE+dMhAGV1khvTJ1WZO/u50uQT18R7qwPPR9xFUrqPhLepEqBtBzxcgwvAoJl8eGIUv8WDwFIdPdMVI30Qnqngt/Qa2ci3eWdL5aYtkP2jZsZ+F3H6Wxrt52NDP45t+Hoh184ixn4e26wLVzYsF/1/V+IEvv/TzOlE/L2hNH38AYkQE0O7cZ+gAAAAASUVORK5CYII=");
                                }
                            }
                        }
                        .info-field {
                            float: right;
                            min-width: 160px;
                            width: calc(~"100% - 110px");
                            width: -moz-calc(~"100% - 110px");
                            width: -webkit-calc(~"100% - 110px");
                            .name-field {
                                height: 40px;
                                .name {
                                    line-height: 22px;
                                    font-weight: bold;
                                    .ellipsisWithLineNum(1);
                                }
                                .name2 {
                                    .ellipsisWithLineNum(1);
                                    line-height: 16px;
                                    font-size: 14px;
                                    margin-top: 4px;
                                }
                            }
                            .label-field {
                                margin-top: 5px;
                                height: 20px;
                                > *:not(.clear) {
                                    float: left;
                                    line-height: 20px;
                                    .rounded-corners(2px);
                                    color: #fff;
                                    padding: 0 4px;
                                    font-size: 12px;
                                }
                                .dc {
                                    margin-right: 9px;
                                    background-color: #EB4F10;
                                }
                                .tag {
                                    background-color: #FF8F00;
                                }
                            }
                            .money-field {
                                height: 25px;
                                margin-top: 9px;
                                .current-price {
                                    float: left;
                                    color: #910012;
                                    line-height: 20px;
                                    margin-top: 3px;
                                    font-size: 16px;
                                    &:before {
                                        content: '￥';
                                        font-size: 10px;
                                    }
                                }
                                .init-price {
                                    float: left;
                                    margin-left: 5px;
                                    margin-top: 8px;
                                    line-height: 14px;
                                    font-size: 12px;
                                    text-decoration: line-through;
                                    &:before {
                                        content: '￥';
                                        font-size: 8px;
                                    }
                                }
                                .controll {
                                    float: right;
                                    .add-btn {
                                        .add-btn-img {
                                            .background-norm();
                                            width: 25px;
                                            height: 25px;
                                            background-size: 25px 25px;
                                            background-image: url("../../../assets/Icon/Round/Plus.png");
                                        }
                                        .add-btn-word {
                                            line-height: 25px;
                                            padding: 0 8px;
                                            color: #fff;
                                            background-color: #FFC107;
                                            .rounded-corners(25px);
                                            font-size: 14px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>
