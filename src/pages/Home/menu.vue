<template>
	<div id="Home-Menu">
		<div class='rotate-display-container'>
			<rotate-display>
			</rotate-display>
		</div>
	</div>
</template>

<script>
module.exports = {
	name: 'home-menu',

	mounted() {
		
	},
	components: {
		"rotate-display": Vue.component("rotate-display")
	}
}


</script>