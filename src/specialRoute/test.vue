<template>
	<div></div>
</template>

<script>
	module.exports = {
		name: 'test',
		mounted() {
			let vm = this;
			this.$root.$router.push('/home/menu/x');
			setTimeout(function() {
				vm.$root.$router.push('/home/order');
				setTimeout(function() {
					console.log(this);
					vm.$root.$router.push('/home/member');
				}, 100);
			}, 100);
		}
	}
</script>