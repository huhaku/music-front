<template>
	<div class="playing-song-page" :style="animationStyle">
		<div class="large-album-img" @click="showLrc">
			<img :src="getAlbumImgUrl" :style="
			    haveStarted === true ? albumImgStyle : ''
			  " />
		</div>
		<div class="contral-box">
			<div class="progress-box" @click="setSongDot" @touchstart="songDotTouchStart" @touchmove="songDotTouchMove" @touchend="songDotTouchEnd"
			 ref="progressBox">
				<div class="progress-bar">
					<div class="progressed" :style="{
			        width:
			          duration === null ? 0 : (currentTime / duration) * 100 + '%',
			      }"></div>
				</div>
				<div class="slider-dot" :style="{
			      'margin-left':
			        (duration === null ? 0 : (currentTime / duration) * 100) + '%',
			    }">
					<div class="breath-dot"></div>
				</div>
			</div>
			<div class="below-progress-box">
				<div class="time-box">{{ showTime }}</div>
				<div class="speed-box">
					<div class="speed-text-box" tabindex="0" @click="isShowSpeedOptions = true" @blur="hideSpeedOptions">
						<div class="speed-text">{{ speedText }}</div>
						<img src="@/assets/arrow-up.svg" />
					</div>
					<div class="speed-options-box" v-show="isShowSpeedOptions">
						<div class="speed-option" @click="changeSpeed(2, '2x')">2.0x</div>
						<div class="speed-option" @click="changeSpeed(1.5, '1.5x')">1.5x</div>
						<div class="speed-option" @click="changeSpeed(1.25, '1.25x')">
							1.25x
						</div>
						<div class="speed-option" @click="changeSpeed(1, '1.0x')">1.0x</div>
						<div class="speed-option" @click="changeSpeed(0.75, '0.75x')">
							0.75x
						</div>
						<div class="speed-option" @click="changeSpeed(0.5, '0.5x')">0.5x</div>
					</div>
				</div>
				<div class="volume-box">
				  <img :src="volumeStateImgUrl" @click="mute" />
				  <div class="volume-percentage">
				    {{ parseInt(volume) + "%" }}
				  </div>
				  <div
				    class="volume-adjust-box"
				    @click="setVolumeDot"
						@touchmove="volumeDotMove"
						@touchend="volumeDotTouchEnd"
				    ref="volumeAdjustBox"
				  >
				    <div class="volume-adjust-bar">
				      <div
				        class="volume-progressed"
				        :style="{ width: volume + 'px' }"
				      ></div>
				    </div>
				    <div
				      class="slider-dot"
				      :style="{ 'margin-left': volume + 'px' }"
				    >
				      <div class="breath-dot"></div>
				    </div>
				  </div>
				</div>
			</div>
			<div class="below-volume-box">
				<div class="play-mode-box" @click="playSongList">
				    <img src="@/assets/lyric.svg" width="40px" />
				</div>
				<div class="play-contral-box">
				  <div class="previous-song" @click="playPreviousSong">
				    <img src="@/assets/previous-song.svg" width="40px" />
				  </div>
				  <div class="palying-or-paused" @click="playContral">
				    <img :src="audioPaused === true ? pausedImgUrl : playingImgUrl" width="40px" />
				  </div>
				  <div class="next-song" @click="playNextSong">
				    <img src="@/assets/next-song.svg" width="40px" />
				  </div>
				</div>
		<div class="play-mode-box">
				  <img	
				    :src="modeStateImgUrl"
				    tabindex="0"
				    @click="isShowModeOptions = true"
				    @blur="hideModeOptions"
				    width="20px"
				  />
				  <div class="mode-options-box" v-show="isShowModeOptions">
				    <div class="mode-option" @click="changePlayMode('listForwardMode')">
				      <img src="@/assets/list-forward.svg" />
				      <div class="mode-option-text">顺序播放</div>
				    </div>
				    <div class="mode-option" @click="changePlayMode('singleCycleMode')">
				      <img src="@/assets/single-cycle.svg" />
				      <div class="mode-option-text">单曲循环</div>
				    </div>
				    <div class="mode-option" @click="changePlayMode('listCycleMode')">
				      <img src="@/assets/list-cycle.svg" />
				      <div class="mode-option-text">列表循环</div>
				    </div>
				    <div class="mode-option" @click="changePlayMode('randomMode')">
				      <img src="@/assets/random.svg" />
				      <div class="mode-option-text">随机播放</div>
				    </div>
				  </div>
				</div>
				<div class="playing-page-mark-box">
				  <img
				    @click="markSong"
				    :src="
				      currentList[currentListIndex] === null
				        ? this.markImgUrl
				        : setMarkImgUrl
				    "
				  />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		name: 'playing-song-page',
		data() {
			return {
				defaultAlbumImgUrl: require("@/assets/default-album-img.jpg"),
				albumImgUrl: null,
				speedText: "倍速",
				playSpeed: 1,
				isShowSpeedOptions: false,
				isShowModeOptions: false,
				modeStateImgUrl: require("@/assets/list-forward.svg"),
				listForwardImgUrl: require("@/assets/list-forward.svg"),
				singleCycleImgUrl: require("@/assets/single-cycle.svg"),
				listCycleImgUrl: require("@/assets/list-cycle.svg"),
				randomImgUrl: require("@/assets/random.svg"),
				volume: 20,
				lastVolume: null,
				isMuteNow: false,
				volumeStateImgUrl: require("@/assets/volume.svg"),
				volumeImgUrl: require("@/assets/volume.svg"),
				volumeMuteImgUrl: require("@/assets/volume-mute.svg"),
				playingImgUrl: require("@/assets/playing.svg"),
				pausedImgUrl: require("@/assets/paused.svg"),
				markImgUrl: require("@/assets/mark.svg"),
				markedImgUrl: require("@/assets/marked.svg"),
				animationStyle: {}
			}
		},
		computed: {
			...mapState({
				audio: state => state.audio,
				audioPaused: state => state.audioPaused,
				haveStarted: state => state.haveStarted,
				albumImgStyle: state => state.albumImgStyle,
				currentList: state => state.currentList,
				currentListIndex: state => state.currentListIndex,
				markedList: state => state.markedList,
				currentTime: state => state.currentTime,
				duration: state => state.duration,
				playMode: state => state.playMode,
			}),

			getAlbumImgUrl() {
				//刚启动和歌曲没有专辑图片时，使用默认专辑图片作为背景
				if (
					this.currentList.length === 0 ||
					this.currentList[this.currentListIndex].albumname === "   "
				) {
					this.albumImgUrl = this.defaultAlbumImgUrl;
				} else {
					this.albumImgUrl = this.currentList[this.currentListIndex].albumimg;
				}
				return this.albumImgUrl;
			},

			showTime() {
				//实时显示歌曲播放时间进度
				var current_m = Math.floor(this.currentTime / 60);
				var current_s = parseInt(this.currentTime % 60);
				var duration_m = Math.floor(this.duration / 60);
				var duration_s = parseInt(this.duration % 60);

				current_m += "";
				current_s += "";
				duration_m += "";
				duration_s += "";

				current_m = current_m.length == 1 ? "0" + current_m : current_m;
				current_s = current_s.length == 1 ? "0" + current_s : current_s;
				duration_m = duration_m.length == 1 ? "0" + duration_m : duration_m;
				duration_s = duration_s.length == 1 ? "0" + duration_s : duration_s;

				return current_m + ":" + current_s + "/" + duration_m + ":" + duration_s;
			},
			
			setMarkImgUrl() {
			  var isCurrentListEmpty = false;
			  if (this.currentList.length !== 0) {
			    //将已mark的歌曲逐一与当前播放歌曲对比，如有mark中的歌曲，则红心点亮
			    var haveMatchedId = false;
			    for (let i = 0; i < this.markedList.length; i++) {
			      if (
			        this.currentList[this.currentListIndex].songmid ===
			        this.markedList[i].songmid
			      ) {
			        haveMatchedId = true;
			        break;
			      }
			    }
			  } else {
			    isCurrentListEmpty = true;
			  }
			  return isCurrentListEmpty
			    ? this.markImgUrl
			    : haveMatchedId === true
			    ? this.markedImgUrl
			    : this.markImgUrl;
			},
		},
		mounted() {
			//获取历史音量值
			if (localStorage.hasOwnProperty("volume")) {
			  this.volume = parseInt(localStorage.getItem("volume"));
			}
		},
		activated() {
			this.animationStyle = {
				animation: "slideUp 0.3s linear forwards",
			}
		},
		methods: {
			setSongDot(e) {
				var offset = e.x - this.$refs.progressBox.getBoundingClientRect().left;
				var totalLength = this.$refs.progressBox.getBoundingClientRect().right - this.$refs.progressBox.getBoundingClientRect().left
				var currentTime = offset / totalLength * this.duration
				this.audio.currentTime = currentTime
				this.audio.volume = this.volume / 100
				this.audio.play()
			},

			songDotTouchStart(e) {
				this.audio.volume = 0
			},

			songDotTouchMove(e) {
				var offset = e.touches[0].pageX - this.$refs.progressBox.getBoundingClientRect().left;
				var totalLength = this.$refs.progressBox.getBoundingClientRect().right - this.$refs.progressBox.getBoundingClientRect().left
				var currentTime = offset / totalLength * this.duration
				console.log(totalLength)
				this.audio.currentTime = currentTime
				this.audio.play()
			},

			songDotTouchEnd(e) {
				this.audio.volume = this.volume / 100
			},
			
			hideSpeedOptions() {
			  setTimeout(() => {
			    this.isShowSpeedOptions = false;
			  }, 200);
			},
			
			changeSpeed(rate, text) {
			  this.playSpeed = rate;
			  this.audio.playbackRate = this.playSpeed;
				this.$store.commit("sendPlaySpeed", this.playSpeed)
			  this.speedText = text;
			  this.isShowSpeedOptions = false;
			},
			
			hideModeOptions() {
			  setTimeout(() => {
			    this.isShowModeOptions = false;
			  }, 200);
			},
			
			changePlayMode(mode) {
			  this.$store.commit("sendPlayMode", mode);
			  switch (mode) {
			    case "listForwardMode":
			      this.modeStateImgUrl = this.listForwardImgUrl;
			      break;
			    case "singleCycleMode":
			      this.modeStateImgUrl = this.singleCycleImgUrl;
			      break;
			    case "listCycleMode":
			      this.modeStateImgUrl = this.listCycleImgUrl;
			      break;
			    case "randomMode":
			      this.modeStateImgUrl = this.randomImgUrl;
			      break;
			  }
			},
			
			setVolumeDot(e) {
				var offset = e.x - this.$refs.volumeAdjustBox.getBoundingClientRect().left;
				if(offset < 0) {
					offset = 0
				}
				if(offset > 100) {
					offset = 100
				}
				this.volume = offset
				this.audio.volume = this.volume / 100
				localStorage.setItem("volume", this.volume.toString());
			},
			
			volumeDotMove(e) {
				var offset = e.touches[0].pageX - this.$refs.volumeAdjustBox.getBoundingClientRect().left;
				if(offset < 0) {
					offset = 0
				}
				if(offset > 100) {
					offset = 100
				}
				this.volume = offset
				this.audio.volume = this.volume / 100
			},
			
			volumeDotTouchEnd() {
				localStorage.setItem("volume", this.volume.toString());
			},
			
			mute() {
			  if (this.isMuteNow === false) {
			    this.audio.volume = 0;
			    this.lastVolume = this.volume;
			    this.volume = 0;
			    this.isMuteNow = true;
			    this.volumeStateImgUrl = this.volumeMuteImgUrl;
			  } else {
			    this.volume = this.lastVolume;
			    this.audio.volume = this.volume / 100;
			    this.isMuteNow = false;
			    this.volumeStateImgUrl = this.volumeImgUrl;
			  }
			},
			
			playPreviousSong() {
			  //随机播放模式下，上一首也是随机
			  if (this.playMode === "randomMode") {
			    this.$store.commit("handleRandomMode");
			  } else {
			    //其他模式上一首按顺序播放上一首
			    this.$store.commit("playPreviousSong");
			  }
			
			  //将上一首的播放速度设置为用户设置的播放速度
			  //因为切歌后播放速度会自动恢复到1
			  setTimeout(() => {
			    this.audio.playbackRate = this.playSpeed;
			  }, 1000);
			},

			playSongList() { 
				this.$router.push("playSongList");
				this.$store.state.searchList=this.currentList;
				this.$store.state.searchText='';
				//将搜索页面滑动到顶端
				this.$EventBus.$emit("scrollToTop")
				//隐藏搜索提示框
				this.isShowSearchHistory = false;
			},
			
			showLrc() {
				this.$router.push({"path":"/lyric"});
			},


			playContral() {
			  //确保当前有歌单才能播放或暂停
			  if (this.currentList.length !== 0) {
			    if (this.audio.paused) {
			      this.audio.play();
						this.$store.commit("sendAudioPaused", false);
			      this.$store.commit("albumRotateRunning");
			    } else {
			      this.audio.pause();
						this.$store.commit("sendAudioPaused", true);
			      this.$store.commit("albumRotatePaused");
			    }
			  } else {
			    this.audio.pause();
			    this.$store.commit("albumRotatePaused");
			  }
			},
			
			playNextSong() {
			  if (this.playMode == "randomMode") {
			    this.$store.commit("handleRandomMode");
			  } else {
			    this.$store.commit("playNextSong");
			  }
			
			  setTimeout(() => {
			    this.audio.playbackRate = this.playSpeed;
			  }, 1000);
			},
			
			markSong() {
			  //防止当前没歌却点击mark
			  if (this.currentList.length !== 0) {
			    this.$store.commit(
			      "sendMarkedSong",
			      this.currentList[this.currentListIndex]
			    );
			  }
			},
		}
	}
</script>

<style>
	
	@keyframes slideUp{
		from{
			transform: translateY(100%);
		}
		to{
			transform: translateY(0);
		}
	}
	
	.playing-song-page {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.large-album-img>img {
		width: 80%;
		height: 80%;
		margin-top: 10%;
		margin-left: 10%;
		border-radius: 50%;
		box-shadow: 0 0 10px var(--highlight-deep-color);
	}
	
	.contral-box {
		width: 90%;
		height: 100px;
		position: absolute;
		margin-left: 5%;
		bottom: 2%;
	}

	.progress-box {
		width: 100%;
		height: 12px;
	}

	.progress-bar {
		width: 100%;
		height: 2px;
		margin-top: 5px;
		position: absolute;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.progressed {
		height: 100%;
		background-color: var(--highlight-color);
	}

	.slider-dot {
		width: 12px;
		height: 12px;
		position: absolute;
		border-radius: 50%;
		background-color: white;
		box-shadow: 0 0 10px var(--highlight-deep-color);
	}

	.slider-dot:active {
		transform: scale(1.5);
	}

	.breath-dot {
		width: 6px;
		height: 6px;
		margin-top: 3px;
		margin-left: 3px;
		border-radius: 50%;
		background-color: var(--highlight-deep-color);
	}
	
	.below-progress-box {
		width: 100%;
		height: 20px;
		margin-top: 10px;
	}

	.time-box {
		width: 80px;
		height: 20px;
		float: left;
		font-size: 13px;
		line-height: 20px;
	}

	.speed-box {
		width: 58px;
		height: 20px;
		position: relative;
		float: left;
	}
	
	.speed-text-box {
	  width: 56px;
	  height: 20px;
	  border-radius: 5px;
	  border: 1px solid var(--highlight-deep-color);
	}
	
	.speed-text-box:focus {
	  outline: none;
	}
	
	.speed-text {
	  width: 30px;
	  height: 20px;
	  float: left;
	  margin-left: 4px;
	  line-height: 20px;
	  text-align: center;
	  font-size: 13px;
	}
	
	.speed-text-box img {
	  width: 14px;
	  height: 14px;
	  margin-top: 3px;
	  margin-left: 3px;
	}
	
	.speed-options-box {
	  position: absolute;
	  width: 56px;
	  height: 165px;
	  margin-top: -190px;
	  border-radius: 8px;
		background-color: white;
	  box-shadow: 0 0 10px var(--highlight-deep-color);
	}
	
	.speed-option {
	  width: 50px;
	  height: 20px;
	  margin-left: 3px;
	  margin-top: 5px;
	  line-height: 20px;
	  text-align: center;
	  border-radius: 5px;
	}
	
	.speed-option:first-child {
	  margin-top: 10px;
	}
	
	.speed-option:active {
	  transform: scale(1.1);
	}
	
	.volume-box {
		width: 156px;
		height:20px;
		position: relative;
		float: right;
	}
	
	.volume-box img {
		width: 20px;
		height: 20px;
	  float: left;
	}
	
	.volume-box img:active {
	  transform: scale(1.5);
	}
	
	.volume-percentage {
	  width: 36px;
	  height: 20px;
	  float: left;
	  line-height: 20px;
	  text-align: center;
	  font-size: 10px;
	}
	
	.volume-adjust-box {
	  width: 100px;
	  height: 12px;
		margin-top: 4px;
	  float: right;
	}
	
	.volume-adjust-bar {
	  width: 100px;
	  height: 2px;
	  margin-top: 5px;
	  position: absolute;
	  background-color: rgba(0, 0, 0, 0.1);
	}
	
	.volume-progressed {
	  height: 100%;
	  background-color: var(--highlight-color);
	}
	
	.below-volume-box {
		width: 100%;
		height: 50px;
		margin-top: 8px;
		display: flex;
		justify-content: space-evenly;
	}
	
	.play-mode-box {
	  width: 30px;
	  height:20px;
		margin-top: 15px;
	  position: relative;
	  float: left;
	}
	
	.play-mode-box > img {
	  width: 20px;
	  height: 20px;
	  margin-left: 5px;
	  float: left;
	}
	
	.play-mode-box > img:focus {
	  outline: none;
	}
	
	.mode-options-box {
	  width: 100px;
	  height: 115px;
	  position: absolute;
	  margin-top: -120px;
	  margin-left: -35px;
	  border-radius: 10px;
		background-color: white;
	  box-shadow: 0 0 10px var(--highlight-deep-color);
	}
	
	.mode-option {
	  width: 80px;
	  height: 20px;
	  margin-top: 5px;
	  margin-left: 10px;
	  border-radius: 5px;
	}
	
	.mode-option:active {
	  transform: scale(1.1);
	}
	
	.mode-option:first-child {
	  margin-top: 10px;
	}
	
	.mode-option img {
	  width: 20px;
	  height: 20px;
	  float: left;
	  border-radius: 5px 0 0 5px;
	}
	
	.mode-option-text {
	  width: 60px;
	  height: 20px;
	  float: left;
	  line-height: 20px;
	  text-align: center;
	  font-size: 12px;
	  border-radius: 0 5px 5px 0;
	}
	
	.play-contral-box {
	  width: 50%;
	  height: 50px;
	  float: left;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	
	.previous-song {
	  width: 40px;
	  height: 40px;
	  float: left;
	}
	
	.previous-song:active {
	  transform: scale(1.5);
	}
	
	.palying-or-paused {
	  width: 40px;
	  height: 40px;
	  border: 2px solid #9a79d2;
	  border-radius: 50%;
	  float: left;
	}
	
	.palying-or-paused:active {
	  transform: scale(1.3);
	}
	
	.next-song {
	  width: 40px;
	  height: 40px;
	  float: left;
	}
	
	.next-song:active {
	  transform: scale(1.5);
	}
	
	.playing-page-mark-box {
		width: 30px;
		height: 30px;
		float: left;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10px;
	}
	
	.playing-page-mark-box > img {
		width: 20px;
		height: 20px;
	}
	
	.playing-page-mark-box > img:active {
		transform: scale(1.5);
	}
</style>
