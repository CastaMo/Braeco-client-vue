<template>
	<div id="Activity-Main">
		<div class='rotate-display-container'>
			<rotate-display :items="headerItems"></rotate-display>
		</div>
	</div>
</template>

<script>
module.exports = {
	name: 'activity-main',

	data() {
		return {
			headerItems: []
		}
	},

	created() {
		this.headerItems = this.getItemsForHeader();
		console.log(this.headerItems);
	},
	components: {
		'rotate-display': Vue.component('rotate-display')
	},
	methods: {
		getItemsForHeader() {
            let result = [];
            let clientWidth = document.body.clientWidth;

            let canteenName = this.$root.requireData.dinner.name;
            for (let i = 0, len = this.$root.requireData.covers.length; i < len; i++) {
                let cover = this.$root.requireData.covers[i];
                let temp = {};
                temp.pic = `${cover}?imageView2/1/w/${Math.floor(clientWidth) * 2}/h/${Math.floor(clientWidth * 200 / 375) * 2}`;
                temp.title = canteenName;
                result.push(temp);
            }
            return result;
        }
	}
}


</script>