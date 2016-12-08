<template>
	<div id="Home-Member">
        <div class='home-member-container'>
            <not-login
                v-if="!user"
                v-on:btn-click="startLogin"
            ></not-login>
        </div>
	</div>
</template>

<script>
module.exports = {
	name: 'home-member',

    computed: {
        user: function() {
            return this.$store.state.user;
        }
    },

	created() {

	},

    methods: {
        startLogin() {
            console.log("gg");
        }
    },

	components: {
        "not-login": require("./components/not-login")
	}
}

</script>


<style scoped lang="less">

.home-member-container {
    padding: 16px 0 80px 0;
}

</style>
