import { request } from "@/network/request.js"

export default function getSearchList(searchText, page) {
  return request({
    url: "search",
    params: {
      p: page,
      n: 50,
      w: searchText,
    },
  })
}