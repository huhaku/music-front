<template>
  <div class="top-100-page"  @touchstart="touchstart($event)" @touchmove="touchmove($event)">
    <div class="top-100-backtop" @click="backTop" v-show="isShowBackTop">
        <img src="@/assets/backtop.svg" width="40px">
    </div>
    <div class="top-100-title">专辑列表</div>
    <div class="top-100-item-box" ref="top100ItemBoxDom">
      <div
        class="top-100-item"
        v-for="(item, index) in top100List"
        :key="index">
        <img
          class="top-100-album-img"
          @click="showAlbumList(item, index)"
          :src="item.albumimg"
          width="100px"
        />
        <div class="top-100-album-info">
          <div class="top-100-song-name">{{ item.songname }}</div>
          <div class="top-100-singer-name">{{ item.singer.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "discover-page",
  data() {
    return {
      markImgUrl: require("@/assets/mark.svg"),
      markedImgUrl: require("@/assets/marked.svg"),
      scrollerPosition: 0,
      isShowBackTop: false,
      playingSongStyle: {
        "transform": "scale(1.1)",
      },
    };
  },
  computed: {
    ...mapState({
      currentList: (state) => state.currentList,
      currentListIndex: (state) => state.currentListIndex,
      top100List: state => state.top100List,
      markedList: state => state.markedList,
    }),
  },
  mounted() {
    this.$store.commit('handleTop100List')

    //当滑块滑动到一定距离再出现
    this.$refs.top100ItemBoxDom.addEventListener('scroll', () => {
      if(this.$refs.top100ItemBoxDom.scrollTop > 600) {
        this.isShowBackTop = true
      } else {
        this.isShowBackTop = false
      }
    })
  },
	
  beforeRouteLeave(to, from, next) {
    //记下离开时滑块位置
    this.scrollerPosition = this.$refs.top100ItemBoxDom.scrollTop
    next()
  },
	
  activated() {
    //激活后恢复滑块位置
    this.$refs.top100ItemBoxDom.scrollTop = this.scrollerPosition
  },
	
  methods: {
    showAlbumList(item, index) {
      this.searchText = "【album】"+item.songname;
			  this.$router.push("playSongList");
				this.$store.commit("handleSearchSong", this.searchText);
				//搜索后将搜索页面滑动到顶端
				this.$EventBus.$emit("scrollToTop")
				//隐藏搜索提示框
				this.isShowSearchHistory = false;
    },

    backTop() {
      this.$refs.top100ItemBoxDom.scrollTop = 0
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
        if(this.diff > 80) {
          this.$router.push("songList");
        }

        if(this.diff < -80) {
          this.$router.push("search");
        }
    },
  },
};
</script>

<style>
.top-100-page {
  width: 100%;
  height: 100%;
}

.top-100-title {
  width: 100%;
  height: 6%;
  line-height: 40px;
  text-align: center;
  font-size: 25px;
  font-weight: bolder;
}

.top-100-item-box {
  width: 100%;
	height: 94%;
	overflow-x: hidden;
	overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.top-100-backtop {
  width: 40px;
  height: 40px;
  position: fixed;
	bottom: 15%;
	right: 3%;
  border-radius: 10px;
	background-color: rgba(255,255,255,0.2);
  z-index: 3;
}

.top-100-backtop:active {
  transform: scale(1.2);
}

.top-100-item {
	width: 30%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  position: relative;
}

.top-100-album-img {
  border-radius: 20px;
  box-shadow: 2px 2px 10px 3px grey;
}

.top-100-mark-img {
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 30%;
  left: 12%;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  z-index: 2;
}

.top-100-mark-img:active {
  transform: scale(1.5);
}

.top-100-album-info {
  width: 100%;
}

.top-100-song-name {
  width: 100%;
  margin-top: 5px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.top-100-singer-name {
  width: 100%;
  margin-top: 5px;
  font-size: 8px;
  text-align: center;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>