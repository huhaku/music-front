<template>
	<div class="view-box">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
	</div>
</template>

<script>
	export default {
		name: 'view-box',
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.view-box {
		position: fixed;
		width: 100%;
		top: 50px;
		bottom: 100px;
	}
</style>
