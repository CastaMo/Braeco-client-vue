<template>
	<div id="Home-Menu">
		<footer-bar
			:choose="'Menu'"
		></footer-bar>
	</div>
</template>

<script>
module.exports = {
	name: 'home-menu',

	mounted() {
		
	},
	components: {
		"footer-bar": Vue.component("footer-bar")
	}
}


</script>