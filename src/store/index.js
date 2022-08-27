import Vue from 'vue'
import Vuex from 'vuex'

import { Message } from 'element-ui';
Vue.use(Vuex)

import { request } from "@/network/request.js";
import getSearchList from '@/network/getSearchList.js'
import getTop100List from '@/network/getTop100List.js'
import getSongList from '@/network/getSongList.js'

export default new Vuex.Store({
  state: {
		audio: null,
		audioPaused: true,
    currentList: [],
    currentListIndex: null,
    searchList: [],
    top100List: [],
    songList: [],
    markedList: [],
    isPlayingMarkedListSong: false,
    currentSongUrl: '',
    playMode: 'listForwardMode',
		playSpeed: 1,
    haveStarted: false,
    albumImgStyle: {},
    haveSearched: false,
    searchText: '',
    currentPage: 1,
    loadMoreText: '加载更多',
    canLoadMore: true,
    lyricTextArr: [],
    currentTime: null,
		duration: null,
    isSearchInputOnFocus: false
  },
  mutations: {

    getHistoryData(state) {
      if (localStorage.hasOwnProperty('markedList')) {
        state.markedList = JSON.parse(localStorage.getItem('markedList'))
      }
    },

    sendCurrentIndex(state, payload) {
      state.currentListIndex = payload.index
      switch (payload.activatedPage) {
        case 'searchListPage':
          state.currentList = state.searchList
          state.isPlayingMarkedListSong = false
          break

        case 'top100Page':
          state.currentList = state.top100List
          state.isPlayingMarkedListSong = false
          break

          case 'songListPage':
            state.currentList = state.songList
            state.isPlayingMarkedListSong = false
            break

        case 'markedListPage':
          state.currentList = state.markedList
          state.isPlayingMarkedListSong = true
          break
      }
    },
		
		sendAudio(state, audio) {
			state.audio = audio
		},
		
		sendAudioPaused(state, audioPaused) {
			state.audioPaused = audioPaused
		},

    sendPlayMode(state, mode) {
      state.playMode = mode
    },
		
		sendPlaySpeed(state, playSpeed) {
      state.playSpeed = playSpeed
    },

    sendHaveStarted(state, haveStarted) {
      state.haveStarted = haveStarted
    },
		
		sendDuration(state, duration) {
      state.duration = duration
    },

    sendCurrentTime(state, currentTime) {
      state.currentTime = currentTime
    },

    sendSearchInputOnFocus(state, isSearchInputOnFocus) {
      state.isSearchInputOnFocus = isSearchInputOnFocus
    },

    sendMarkedSong(state, item) {
      //添加第一个mark的歌曲
      if (state.markedList.length === 0) {
        state.markedList.push(item)
      } else {

        //如果有重复的mark歌曲，即取消mark，相同的mark歌曲均删除
        var haveSameItem = false
        for (let i = 0; i < state.markedList.length; i++) {
          if (state.markedList[i].songmid === item.songmid) {
            state.markedList.splice(i, 1)
            haveSameItem = true

            //当在喜欢页面点击mark时，处理逻辑有点复杂，初步处理下
            if (state.isPlayingMarkedListSong === true) {

              //取消当前mark歌曲后，自动播放上一首
              state.currentListIndex -= 1

              //最上面的歌曲取消mark后，停在第一首
              if (state.currentListIndex < 0) {
                state.currentListIndex = 0
              }
              if (state.currentList.length !== 0) {
                this.commit('getSongUrlAndLyric')
              }
            }
            break
          }
        }
        //如果没有重复的歌曲，则加入新的mark歌曲
        if (haveSameItem === false) {
          state.markedList.unshift(item)
        }
      }
      localStorage.setItem('markedList', JSON.stringify(state.markedList))
    },

    //修改专辑图片样式，使专辑图片开始转动
    albumRotateRunning(state) {
      state.albumImgStyle = {
        'animation': 'albumRotate 20s linear infinite running'
      }
    },

    //修改专辑图片样式，使专辑图片暂停转动（保持已转动的角度）
    albumRotatePaused(state) {
      state.albumImgStyle = {
        'animation': 'albumRotate 20s linear infinite paused'
      }
    },

    handleTop100List(state) {
      getTop100List().then(res => {
        state.top100List = res.data.data.list
      }).catch(err => {
				Message.error({
				  message: '数据请求失败！',
				  showClose: true
				})
        console.log(err)
      })

      getSongList().then(res => {
        state.songList = res.data.data.list
      }).catch(err => {
				Message.error({
				  message: '歌单数据请求失败！',
				  showClose: true
				})
        console.log(err)
      })
    },
    

    handleSearchSong(state, searchText) {
      state.searchText = searchText
      getSearchList(state.searchText, 1)
        .then(res => {
          console.log(res)
          state.searchList = res.data.data.list;

          //搜索后再显示loadMore
          state.haveSearched = true
        })
        .catch(err => {
					Message.error({
					  message: '数据请求失败！',
					  showClose: true
					})
          console.log(err)
        })
    },

    handleLoadMore(state) {
      if (state.canLoadMore) {
        state.currentPage += 1
        getSearchList(state.searchText, state.currentPage)
          .then(res => {
            console.log(res.data.data.list)

            //得到下一页的搜索结果
            var moreSearchList = res.data.data.list

            //每页请求50首歌曲，如请求结果不足50首则说明没有更多歌曲了
            if (moreSearchList.length < 50) {
              state.loadMoreText = "已到达底线，再也加载不出来了"
              state.searchList.push(...res.data.data.list)
              state.canLoadMore = false
            } else {
              state.searchList.push(...res.data.data.list)
            }
          })
          .catch(err => {
						Message.error({
						  message: '数据请求失败！',
						  showClose: true
						})
            console.log(err)
          })
      }
    },

    //处理随机播放模式下的下一首
    handleRandomMode(state) {
      var randomIndex = Math.floor(Math.random() * state.currentList.length)
      state.currentListIndex = randomIndex
      this.commit('getSongUrlAndLyric')
    },

    getSongUrlAndLyric(state) {
      request({
        url: 'song',
        params: {
          songmid: state.currentList[state.currentListIndex].songmid,
          guid: '126548448',
          lyric: 1
        },
      }).then(res => {
        //获取歌曲播放链接
        state.currentSongUrl = res.data.data.musicUrl
        //处理歌词
        var lyricText = res.data.data.lyric
        // console.log(lyricText);
        var lyricTextArr = lyricText.split('\r')
        if(!(lyricTextArr instanceof Array)) {
          lyricTextArr = lyricText.split('\n')
        }

        //去掉前面五个没用的歌词
        // lyricTextArr.splice(0, 5)
        //清除上一首的歌词
        state.lyricTextArr = []
        
        //将歌词与时间分离
        lyricTextArr.forEach(eachLine => {
          var t = eachLine.substring(eachLine.indexOf("[") + 1, eachLine.indexOf("]"))
          var lyricTextLineObj = {
            time: (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(2),
            text: eachLine.substring(eachLine.indexOf("]") + 1, eachLine.length)
          }

          state.lyricTextArr.push(lyricTextLineObj)
        })
      }).catch(err => {
				Message.error({
				  message: '数据请求失败！',
				  showClose: true
				})
        console.log(err)
      })
    },

    playPreviousSong(state) {
      //各个列表上一首到头则index重新置零
      state.currentListIndex -= 1
      if (state.currentListIndex >= 0) {
        this.commit('getSongUrlAndLyric')
      } else {
        state.currentListIndex = 0
      }
    },

    playCurrentSong() {
      this.commit('getSongUrlAndLyric')
    },

    playNextSong(state) {
      //各个列表下一首到头了，则将index停留在最后一位
      state.currentListIndex += 1
      if (state.currentListIndex < state.currentList.length) {
        this.commit('getSongUrlAndLyric')
      } else {
        //当播放列表index超出，如果是列表循环模式，则将index置零，从头开始播放
        if (state.playMode === "listCycleMode") {
          state.currentListIndex = 0
          this.commit('getSongUrlAndLyric')
        } else {
          //如果不是列表循环模式，则index停留在最后
          state.currentListIndex = state.currentList.length - 1
          this.commit('albumRotatePaused')
        }
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
