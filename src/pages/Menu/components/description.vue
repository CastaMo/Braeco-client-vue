<template>
	<transition name="fade" mode="out-in">
        <div id='description' class='modal' v-show="show_flag">
            <div class='cover' v-on:click="hide"></div>
            <transition name='modal' mode="out-in">
                <div class='modal-dialog adapt-center' v-show="show_flag">
                    <div class='modal-content'>
                        <div class='modal-header'>
                            <b class='icon-close' v-on:click="hide"></b>
                            <p>备注</p>
                        </div>
                        <div class='modal-body'>
                            <div class='description'>
                                <div class='description-wrapper'>
                                    <div class='description-container'>
                                    	<div class='description-title'>
                                    		<p>请输入您的备注信息，如：</p>
                                    		<p>牛奶过敏，去冰等。</p>
                                    	</div>
                                    	<div class='description-content'>
                                    		<input
                                    			class='braeco-input block'
                                    			placeholder='请输入您的备注信息'
                                    			v-model="description_model"
                                    		>
                                    	</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='modal-footer'>
                            <button class='braeco-btn yellow confirm-btn' v-on:click="confirmDescription">提交备注信息</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>

module.exports = {
	name: "description",
	data() {
		return {
			show_flag: false,
			description_model: ""
		}
	},

	methods: {

		show() {
			this.description_model = this.$store.state.order.description;
			return this.show_flag = true;
		},

		hide() {
			return this.show_flag = false;
		},

		toggle() {
			return this.show_flag != this.show_flag;
		},

		confirmDescription() {
			this.$store.commit("order:confirm-description", {
				description: this.description_model
			});
			this.hide();
		}

	}
}

</script>

<style lang="less" scoped>

#description .modal-body {
	border-bottom: none;
	background-color: #FFFBF0;
}

.description {
	.description-wrapper {
		margin: 0 16px;
		.description-container {
			padding-top: 9px;
			.description-title {
				font-size: 16px;
                line-height: 25px;
                color: #4A4A4A;
                font-weight: 300;
                margin-bottom: 14px;
			}
		}
	}
}

</style>
