<template>
  <div
    class="marked-list-page"
    @touchstart="touchstart($event)"
    @touchmove="touchmove($event)"
  >
    <div class="marked-list-box">
      <div
        class="marked-list-item"
        v-for="(item, index) in markedList"
        :key="index"
        :style="
          currentList.length === 0
            ? ''
            : currentList[currentListIndex].songmid === item.songmid
            ? playingSongStyle
            : ''
        "
      >
        <div class="mark-img">
          <img
            :src="markedImgUrl"
            @click="markSong(item, index)"
            width="20px"
          />
        </div>
        <div class="marked-list-song-info" @click="playThisSong(item, index)">
          <div class="marked-list-song-name">{{ item.songname }}</div>
          <div class="marked-list-singer-name">{{ item.singer.name }}</div>
          <div class="marked-list-album-name">{{ "-" + item.albumname }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "marked-list-page",
  data() {
    return {
      markedImgUrl: require("@/assets/marked.svg"),
      scrollerPosition: 0,
      playingSongStyle: {
        "background-color": "var(--highlight-color)",
        "border-radius": "15px",
      },
    };
  },
  computed: {
    ...mapState({
      currentList: (state) => state.currentList,
      currentListIndex: (state) => state.currentListIndex,
      markedList: (state) => state.markedList,
    }),
  },
  beforeRouteLeave(to, from, next) {
    //记下离开时滑块位置
    this.scrollerPosition =
      document.querySelector(".marked-list-box").scrollTop;
    next();
  },
  activated() {
    //激活后恢复滑块位置
    document.querySelector(".marked-list-box").scrollTop =
      this.scrollerPosition;
  },
  methods: {
    playThisSong(item, index) {
      var payload = {
        index: index,
        activatedPage: "markedListPage",
      };

      this.$store.commit("sendCurrentIndex", payload);
      this.$store.commit("playCurrentSong");
    },

    markSong(item) {
      this.$store.commit("sendMarkedSong", item);
    },
    touchstart(e) {
      // console.log("鼠标按下");
      this.lastPosX = e.targetTouches[0].clientX;
      console.log(this.lastPosX);
    },
    touchmove(e) {
      // 只监听单指划动，多指划动不作响应
      if (e.targetTouches.length > 1) {
        return;
      }
      // console.log("鼠标移动");
      // 获取当前位置x
      this.curPosX = e.targetTouches[0].clientX;

      // 计算差值
      this.diff = +(this.curPosX - this.lastPosX);

      // console.log(this.diff);
      // 其他业务逻辑
      if (this.diff > 80) {
        this.$router.push("search");
      }

      if (this.diff < -80) {
        this.$router.push("songList");
      }
    },
  },
};
</script>

<style>
.marked-list-page {
  width: 100%;
  height: 100%;
}

.marked-list-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}

.marked-list-item {
  height: 50px;
  margin-left: 10px;
  margin-right: 10px;
  overflow: hidden;
}

.mark-img {
  width: 6%;
  height: 20px;
  float: left;
  margin-left: 4%;
  margin-top: 15px;
}

.mark-img:active {
  transform: scale(1.5);
}

.marked-list-song-info {
  float: left;
  width: 88%;
  margin-left: 2%;
  margin-top: 5px;
}

.marked-list-song-name {
  height: 20px;
  line-height: 20px;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.marked-list-singer-name {
  height: 20px;
  line-height: 20px;
  font-size: 8px;
  color: var(--highlight-deep-color);
  float: left;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.marked-list-album-name {
  height: 20px;
  line-height: 20px;
  font-size: 8px;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
