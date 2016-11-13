<template>
	<div id='ball'>
		<div
			class='active-ball'
			v-for="activeBall in ballItems"
			v-bind:style="{
				'left': `${activeBall.x}px`,
				'top': `${activeBall.y}px`
			}"
		></div>
	</div>
</template>

<script>

module.exports = {
	name: 'ball',
	data() {
		return {
			ballItems: []
		}
	},
	created() {
		let vm = this;
		let clientHeight = document.body.clientHeight;
		let clientWidth = document.body.clientWidth;

		vm.$parent.$on("menu:play-ball", function(options) {
			let ball = {
				curvature 	: options.curvature 	|| 0.009,
				duration 	: options.duration 		|| 600,
				endLeft 	: options.endLeft 		|| 40,
				endTop 		: options.endTop 		|| (clientHeight - 48),
				initLeft 	: options.initLeft 		|| clientWidth - 50,
				initTop 	: options.initTop 		|| 100
			};
			vm.addBall(ball);
			vm.playAnimation(ball);
		});
	},
	methods: {
		addBall(ball) {


			ball.midLeft = (ball.initLeft + ball.endLeft) / 2;
			ball.midTop = ball.initTop / 1.1;
			ball.begin = +new Date();
			ball.end = ball.begin + ball.duration;
			ball.driftx = ball.initLeft - ball.endLeft;
			ball.drifty = ball.initTop - ball.endTop;

			let temp1 = ball.endLeft - ball.midLeft;
			let temp2 = ball.midLeft - ball.initLeft;
			let temp3 = ball.initLeft - ball.endLeft;

			let temp4 = ball.initTop - ball.endTop;
			let temp5 = ball.initLeft + ball.endLeft;


			ball.a = (
						ball.initTop * temp1
					+ 	ball.endTop * temp2
					+ 	ball.midTop * temp3
					) /
					(
						ball.initLeft * ball.initLeft * temp1
					+ 	ball.endLeft * ball.endLeft * temp2
					+ 	ball.midLeft * ball.midLeft * temp3
					);

			ball.b = temp4 / temp3 - ball.a * temp5;
			ball.c = ball.initTop - ball.initLeft * ball.initLeft * ball.a - ball.initLeft * ball.b;
			ball.x = ball.initLeft;
			ball.y = ball.initTop;

			this.ballItems.push(ball);
		},
		playAnimation(ball) {
			let vm = this;
			ball.timerId = setInterval(function() {
				vm.step(ball);
			}, 20);
		},
		step(ball) {
			let now = +new Date;
			let vm = this;
			if (now > ball.end) {
				this.$parent.$emit("menu:playAnimationForAdd");
				if (typeof ball.callback === 'function') {
					ball.callback();
				}
				if (!!ball.timerId) {
					clearInterval(ball.timerId);
				}
				let ballIndex = vm.ballItems.indexOf(ball);
				return vm.ballItems.splice(ballIndex, 1);
			}
			ball.x = ball.initLeft - (now - ball.begin) * ball.driftx / ball.duration;
			ball.y = ball.a * ball.x * ball.x + ball.b * ball.x + ball.c;
			if (typeof ball.stepCallback === 'function') {
				ball.stepCallback();
			}
		}
	}
}

</script>

<style lang="less" scoped>

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

#ball {
	position: fixed;
	left: 0;
	top: 0;
}

.active-ball {
    position: absolute;
    width: 15px;
    height: 15px;
    .rounded-corners(50%);
    background-color: #FFC107;
}

</style>