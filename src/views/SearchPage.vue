<template>
  <div
    class="search-list-page"
    @touchstart="touchstart($event)"
    @touchmove="touchmove($event)"
  >
    <div class="search-list-box" ref="searchListBoxDom">
      <div class="search-list-backtop" @click="backTop" v-show="isShowBackTop">
        <img src="@/assets/backtop.svg" width="40px" />
      </div>
      <div
        class="search-list-item"
        v-for="(item, index) in searchList"
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
            :src="setMarkImgUrl(item)"
            @click="markSong(item, index)"
            width="20px"
          />
        </div>
        <div class="search-list-song-info" @click="playThisSong(item, index)">
          <div class="search-list-song-name">{{ item.songname }}</div>
          <div class="search-list-singer-name">{{ item.singer.name }}</div>
          <div class="search-list-album-name">{{ "-" + item.albumname }}</div>
        </div>
      </div>
      <div class="load-more" @click="loadMore" v-show="haveSearched">
        {{ loadMoreText }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "search-list-page",
  data() {
    return {
      markImgUrl: require("@/assets/mark.svg"),
      markedImgUrl: require("@/assets/marked.svg"),
      scrollerPosition: 0,
      isShowBackTop: false,
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
      searchList: (state) => state.searchList,
      markedList: (state) => state.markedList,
      haveSearched: (state) => state.haveSearched,
      loadMoreText: (state) => state.loadMoreText,
    }),
  },
  mounted() {
    //????????????scrollToTop???????????????????????????????????????????????????
    this.$EventBus.$on("scrollToTop", () => {
      this.$refs.searchListBoxDom.scrollTop = 0;
    });

    //???????????????????????????????????????
    this.$refs.searchListBoxDom.addEventListener("scroll", (e) => {
      if (this.$refs.searchListBoxDom.scrollTop > 600) {
        this.isShowBackTop = true;
      } else {
        this.isShowBackTop = false;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    //???????????????????????????
    this.scrollerPosition = this.$refs.searchListBoxDom.scrollTop;
    next();
  },
  activated() {
    //???????????????????????????
    this.$refs.searchListBoxDom.scrollTop = this.scrollerPosition;
  },
  methods: {
    playThisSong(item, index) {
      var payload = {
        index: index,
        activatedPage: "searchListPage",
      };

      this.$store.commit("sendCurrentIndex", payload);
      this.$store.commit("playCurrentSong");
    },

    markSong(item, index) {
      this.$store.commit("sendMarkedSong", item);
    },

    setMarkImgUrl(item) {
      //??????mark?????????????????????????????????????????????mark??????????????????????????????
      var haveMatchedId = false;
      for (let i = 0; i < this.markedList.length; i++) {
        if (item.songmid === this.markedList[i].songmid) {
          haveMatchedId = true;
        }
      }
      return haveMatchedId === true ? this.markedImgUrl : this.markImgUrl;
    },

    backTop() {
      this.$refs.searchListBoxDom.scrollTop = 0;
    },

    loadMore() {
      this.$store.commit("handleLoadMore");
    },
    touchstart(e) {
      // console.log("????????????");
      this.lastPosX = e.targetTouches[0].clientX;
      console.log(this.lastPosX);
    },
    touchmove(e) {
      // ????????????????????????????????????????????????
      if (e.targetTouches.length > 1) {
        return;
      }
      // console.log("????????????");
      // ??????????????????x
      this.curPosX = e.targetTouches[0].clientX;

      // ????????????
      this.diff = +(this.curPosX - this.lastPosX);

      // console.log(this.diff);
      // ??????????????????
      if (this.diff > 80) {
        this.$router.push("discover");
      }

      if (this.diff < -80) {
        this.$router.push("marked");
      }
    },
  },
};
</script>

<style>
.search-list-page {
  width: 100%;
  height: 100%;
}

.search-list-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}

.search-list-backtop {
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 20%;
  right: 3%;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
}

.search-list-backtop:active {
  transform: scale(1.2);
}

.search-list-item {
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

.search-list-song-info {
  float: left;
  width: 88%;
  margin-left: 2%;
  margin-top: 5px;
}

.search-list-song-name {
  height: 20px;
  line-height: 20px;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.search-list-singer-name {
  height: 20px;
  line-height: 20px;
  font-size: 8px;
  color: #000000;
  float: left;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.search-list-album-name {
  height: 20px;
  line-height: 20px;
  font-size: 8px;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.load-more {
  width: 96%;
  height: 40px;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 1%;
  line-height: 40px;
  text-align: center;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
