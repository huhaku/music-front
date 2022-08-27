<template>
	<div id="app">
		<div class="app-background" :style="getBgStyle"></div>
		<div class="app-background-above">
			<top-box></top-box>
			<view-box></view-box>
			<bottom-box></bottom-box>
			<tab-bar></tab-bar>
		</div>
	</div>
</template>

<script>
	import TabBar from '@/components/tabbar/TabBar.vue'
	import TopBox from '@/components/topbox/TopBox.vue'
	import BottomBox from '@/components/bottombox/BottomBox.vue'
	import ViewBox from '@/components/viewbox/ViewBox.vue'

	import {
		mapState
	} from "vuex";

	export default {
		name: 'app',
		components: {
			TabBar,
			TopBox,
			BottomBox,
			ViewBox
		},
		data() {
			return {
				defaultAlbumImgUrl: require("@/assets/default-album-img.jpg"),
				albumImgUrl: null,
				bgStyle: {}
			}
		},
		computed: {
			...mapState({
				currentList: (state) => state.currentList,
				currentListIndex: (state) => state.currentListIndex,
			}),

			getBgStyle() {
				//刚启动和歌曲没有专辑图片时，使用默认专辑图片作为背景
				if (this.currentList.length == 0 || this.currentList[this.currentListIndex].albumname == "   ") {
					this.albumImgUrl = this.defaultAlbumImgUrl
				} else {
					this.albumImgUrl = this.currentList[this.currentListIndex].albumimg
				}

				//请求图片需要时间，背景会短暂变成白色形成闪烁
				//所以延迟背景图片改变，给出请求背景图片（专辑图片）的时间
				setTimeout(() => {
					this.bgStyle = {
						'background-image': 'url(' + this.albumImgUrl + ')'
					}
				}, 1500)

				return this.bgStyle
			}
		},
		mounted() {
			this.$store.commit('getHistoryData')
			this.$router.push('songList')

			// 监听用户返回键,返回则路由退一步,防止退出应用
			document.addEventListener('plusready', function() {
				var first = null;
				var webview = plus.webview.currentWebview();
				plus.key.addEventListener('backbutton', function() {
					webview.canBack(function(e) {
						if (e.canBack) {
							webview.back(); //这里不建议修改自己跳转的路径  
						} else {
							//首次按键，提示‘再按一次退出应用’  
							if (!first) {
								first = new Date().getTime(); //获取第一次点击的时间戳  
								plus.nativeUI.toast("再按一次退出应用", {
									duration: 'short'
								}); //通过H5+ API 调用Android 上的toast 提示框  
								setTimeout(function() {
									first = null;
								}, 1000);
							} else {
								// 获取第二次点击的时间戳, 两次之差 小于 1000ms 说明1s点击了两次, 
								if (new Date().getTime() - first < 1000) {
									plus.runtime.quit(); //退出应用  
								}
							}
						}
					})
				});
			});
		},
		methods: {
			
		}
	}
</script>

<style>
	:root {
		--highlight-color: #ffe8e8;
		--highlight-deep-color: #000000;
	}

	#app {
		width: 100vw;
		height: 100vh;
		position: relative;
		-webkit-user-select: none;
	}

	.app-background {
		width: 100%;
		height: 100%;
		position: absolute;
		background-image: url("./assets/default-album-img.jpg");
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		filter: blur(150px);
	}

	.app-background-above {
		width: 100%;
		height: 100%;
		position: absolute;
	}

	::-webkit-scrollbar {
		width: 8px;
	}

	::-webkit-scrollbar-thumb {
		border-radius: 4px;
		background-color: rgba(255, 255, 255, 0.4);
	}

	::-webkit-scrollbar-track {
		border-radius: 4px;
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>
