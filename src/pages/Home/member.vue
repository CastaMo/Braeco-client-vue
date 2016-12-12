<template>
	<div id="Home-Member">
        <div class='home-member-container'>
            <transition name="fade" mode="out-in">
                <not-login
                    v-if="!member_info"
                    v-on:btn-click="startLogin"
                ></not-login>
                <member-info
                    v-else
                    v-on:func-click="funcClick"
                ></member-info>
            </transition>
        </div>
	</div>
</template>

<script>
module.exports = {
	name: 'home-member',

    computed: {
        member_info: function() {
            return this.$store.state.user.member_info;
        }
    },

	created() {

	},

    methods: {
        startLogin() {
            this.$store.dispatch("user:startUserLogin");
        },
        funcClick(opts) {
            console.log(opts);
        }
    },

	components: {
        "not-login": require("./components/not-login"),
        "member-info": require("./components/member-info")
	}
}

</script>


<style scoped lang="less">

.home-member-container {
    padding: 16px 0 80px 0;
}

</style>
