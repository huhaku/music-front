import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const DiscoverPage = () => import('@/views/DiscoverPage.vue')
const SongList = () => import('@/views/SongList.vue')
const SearchPage = () => import('@/views/SearchPage.vue')
const MarkedPage = () => import('@/views/MarkedPage.vue')
const LyricPage = () => import('@/views/LyricPage.vue')
const PlayingPage = () => import('@/views/PlayingPage.vue')
const AboutPage = () => import('@/views/AboutPage.vue')
const PlaySongList = () => import('@/views/PlaySongList.vue')

const routes = [
  {
    path: '/discover',
    component: DiscoverPage,
  },
  {
    path: '/songList',
    component: SongList,
  },
  {
    path: '/search',
    component: SearchPage
  },
  {
    path: '/playSongList',
    component: PlaySongList
  },
  {
    path: '/marked',
    component: MarkedPage
  },
  {
    path: '/lyric',
    component: LyricPage
  },
	{
	  path: '/playing',
	  component: PlayingPage
	},
	{
	  path: '/about',
	  component: AboutPage
	}
]

const router = new VueRouter({
  routes,
})

export default router
