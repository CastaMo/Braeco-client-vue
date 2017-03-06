<template>
    <div id="braeco-client">
        <div id="popout">
          <tips></tips>
        </div>
        <div id="main">
            <div id="mainbar">
                <transition :name="transitionName" mode="out-in">
                    <router-view></router-view>
                </transition>
                <footer-bar></footer-bar>
                <trolley-footer-bar></trolley-footer-bar>
                <user-login></user-login>
            </div>
        </div>
    </div>
</template>

<script>

module.exports = {}

</script>
