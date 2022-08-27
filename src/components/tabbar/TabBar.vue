<template>
	<div class="tab-bar">
		<router-link to="/songList" class="router-link" tag="div">
		  <img class="tab-bar-item-icon" src="@/assets/lyric.svg">
		  <div class="tab-bar-item-text">歌单</div>
		</router-link>
		<router-link to="/discover" class="router-link" tag="div">
		  <img class="tab-bar-item-icon" src="@/assets/discover.svg">
		  <div class="tab-bar-item-text">专辑</div>
		</router-link>
		<router-link to="/search" class="router-link" tag="div">
		  <img class="tab-bar-item-icon" src="@/assets/search.svg">
		  <div class="tab-bar-item-text">搜索</div>
		</router-link>
		<router-link to="/marked" class="router-link" tag="div">
		  <img class="tab-bar-item-icon" src="@/assets/marked.svg">
		  <div class="tab-bar-item-text">喜欢</div>
		</router-link>

	</div>
</template>

<script>
	export default {
		name: 'tab-bar',
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.tab-bar {
		display: flex;
		justify-content: space-evenly;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}
	
	.router-link {
		text-decoration: none;
	}
	
	.router-link-active {
		color: var(--highlight-deep-color);
		transform: scale(1.15);
	}
	
	.tab-bar-item-icon {
	  width: 20px;
	  height: 20px;
	  margin-left: 15px;
	  margin-top: 5px;
		vertical-align: middle;
	}
	
	.tab-bar-item-text {
		width: 50px;
	  height: 25px;
		font-size: 14px;
	  line-height: 25px;
		text-align: center;
	}
</style>
