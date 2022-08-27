import axios from 'axios'
export function request(config) {
  const instance = axios.create({
    //由于有跨域问题，所以调试和打包用不同的baseURL
    baseURL: 'https://cloud.huhaku.top:7083/mz7fmmoschqetr51y7lcpyob1pv6tv1x',
    timeout: 6000,
  })
  return instance(config)
}
