<template>
	<div id="Home-Member">
		<footer-bar
			:choose="'Member'"
		></footer-bar>
	</div>
</template>

<script>
module.exports = {
	name: 'home-member',

	mounted() {
		
	},
	components: {
		"footer-bar": Vue.component("footer-bar")
	}
}


</script>