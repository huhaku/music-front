<template>
  <div
    class="bottom-box"
    @click="showPlayingPage"
    @touchstart="songtouchstart($event)"
    @touchmove="songtouchmove($event)"
    @touchend="songtouchend($event)"
  >
    <div class="bottom-box-album-img">
      <img
        :src="getAlbumImgUrl"
        :style="haveStarted === true ? albumImgStyle : ''"
      />
    </div>
    <div class="current-song-info">
      {{
        currentList.length === 0
          ? ""
          : currentList[currentListIndex].singer.name +
            "-" +
            currentList[currentListIndex].songname
      }}
    </div>
    <div class="bottom-box-playing-or-paused" @click.stop="playContral">
      <img :src="audioPaused === true ? pausedImgUrl : playingImgUrl" />
    </div>
    <audio id="audio" :src="currentSongUrl" autoplay></audio>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "bottom-box",
  components: {},
  data() {
    return {
      currentTime: null,
      duration: null,
      defaultAlbumImgUrl: require("@/assets/default-album-img.jpg"),
      albumImgUrl: null,
      playingImgUrl: require("@/assets/playing.svg"),
      pausedImgUrl: require("@/assets/paused.svg"),
    };
  },
  computed: {
    ...mapState({
      audio: (state) => state.audio,
      haveStarted: (state) => state.haveStarted,
      albumImgStyle: (state) => state.albumImgStyle,
      currentList: (state) => state.currentList,
      currentListIndex: (state) => state.currentListIndex,
      currentSongUrl: (state) => state.currentSongUrl,
      playMode: (state) => state.playMode,
      playSpeed: (state) => state.playSpeed,
      audioPaused: (state) => state.audioPaused,
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
  },
  mounted() {
    var audio = document.querySelector("#audio");

    //将audio发送到vuex前先设置一下，不然默认最大音量受不了
    if (localStorage.hasOwnProperty("volume")) {
      audio.volume = parseInt(localStorage.getItem("volume")) / 100;
    } else {
      audio.volume = 0.6;
    }

    //将audio发送到vuex，方便其他组件操作audio
    this.$store.commit("sendAudio", audio);

    this.addAudioEventListeners();
  },
  methods: {
    addAudioEventListeners() {
      this.audio.addEventListener("canplay", this.getDuration);
      this.audio.addEventListener("timeupdate", this.getCurrentTime);
      this.audio.addEventListener("ended", this.autoPlayNextSong);
    },

    getDuration() {
      this.duration = this.audio.duration;
      this.$store.commit("sendAudioPaused", false);

      //将上一首的播放速率延续到下一首
      this.audio.playbackRate = this.playSpeed;

      //检测app是否是刚启动，防止刚启动专辑图片就开始旋转
      this.$store.commit("sendHaveStarted", true);

      this.$store.commit("sendDuration", this.duration);

      //app已启动，播放歌曲专辑图片开始转动
      this.$store.commit("albumRotateRunning");
    },

    autoPlayNextSong() {
      switch (this.playMode) {
        case "listForwardMode":
          //默认顺序播放，不做处理,直接下一首
          this.$store.commit("playNextSong");
          break;

        case "singleCycleMode":
          //单曲循环，播完又开始播
          this.audio.play();
          break;

        case "listCycleMode":
          //列表循环，处理已嵌入vuex中的playNextSong中，所以直接下一首
          this.$store.commit("playNextSong");
          break;

        case "randomMode":
          //随机播放
          this.$store.commit("handleRandomMode");
          break;
      }

      setTimeout(() => {
        this.audio.playbackRate = this.playSpeed;
      }, 1000);
    },

    getCurrentTime() {
      this.currentTime = this.audio.currentTime;
      this.$store.commit("sendCurrentTime", this.currentTime);
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

    showPlayingPage() {
      this.$router.push("/playing");
    },
    songtouchstart(e) {
      //   console.log("鼠标按下");
      this.songlastPosX = e.targetTouches[0].clientX;
      //   console.log(this.lastPosX);
    },
    songtouchmove(e) {
      // 只监听单指划动，多指划动不作响应
      if (e.targetTouches.length > 1) {
        return;
      }
      //   console.log("鼠标移动");
      // 获取当前位置x
      this.songcurPosX = e.targetTouches[0].clientX;

      // 计算差值
      this.songdiff = +(this.songcurPosX - this.songlastPosX);
    },

    songtouchend(e) {
      // 其他业务逻辑
      if (this.songdiff < -80) {
        switch (this.playMode) {
          case "listForwardMode":
            //默认顺序播放，不做处理,直接下一首
            this.$store.commit("playNextSong");
            break;

          case "singleCycleMode":
          case "listCycleMode":
            //列表循环，处理已嵌入vuex中的playNextSong中，所以直接下一首
            this.$store.commit("playNextSong");
            break;

          case "randomMode":
            //随机播放
            this.$store.commit("handleRandomMode");
            break;
        }
        setTimeout(() => {
          this.audio.playbackRate = this.playSpeed;
        }, 1000);
      }

      if (this.songdiff > 80) {
        switch (this.playMode) {
          case "listForwardMode":
            //默认顺序播放，不做处理,直接下一首
            this.$store.commit("playPreviousSong");
            break;

          case "singleCycleMode":
          case "listCycleMode":
            //列表循环，处理已嵌入vuex中的playNextSong中，所以直接下一首
            this.$store.commit("playPreviousSong");
            break;

          case "randomMode":
            //随机播放
            this.$store.commit("handleRandomMode");
            break;
        }
        setTimeout(() => {
          this.audio.playbackRate = this.playSpeed;
        }, 1000);
      }
    },
  },
};
</script>

<style>
.bottom-box {
  width: 98%;
  height: 50px;
  position: fixed;
  display: flex;
  justify-content: space-between;
  left: 1%;
  right: 1%;
  bottom: 50px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 25px;
}

.bottom-box-album-img > img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

@keyframes albumRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.current-song-info {
  height: 50px;
  line-height: 50px;
  text-align: center;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.bottom-box-playing-or-paused {
  width: 30px;
  height: 30px;
  margin-top: 8px;
  margin-right: 10px;
  border: 2px solid #9a79d2;
  border-radius: 50%;
}

.bottom-box-playing-or-paused > img {
  width: 30px;
}
</style>
