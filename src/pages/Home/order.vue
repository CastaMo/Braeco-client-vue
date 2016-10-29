<template>
	<div id="Home-Order">
		<footer-bar
			:choose="'Order'"
		></footer-bar>
	</div>
</template>

<script>
module.exports = {
	name: 'home-order',

	mounted() {
		
	},
	components: {
		"footer-bar": Vue.component("footer-bar")
	}
}


</script>