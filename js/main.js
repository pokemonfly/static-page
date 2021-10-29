function getQuery(search = window.location.search) {
  if (!search) {
    return {};
  }
  const sp = new URLSearchParams(search);
  let query = {};
  for (const [k, v] of sp.entries()) {
    query[k] = v;
  }
  return query;
}

const { mode, ...args } = getQuery();

function get(url, params) {
  url = url.replace(/\[:(.+)\]/g, args[RegExp.$1]);
  return $.get(api.BASE + url, params);
}

const api = {
  BASE: `https://api.copymanga.com/api/v3`,
  ITEM: `/comic2/[:id]?platform=1`,
  CHAPTERS: `/comic/[:id]/group/default/chapters?limit=1000&offset=0`,
};

async function renderChapter(args) {
  const { results } = await get(api.ITEM);
  console.log(results);
  render({
    name: results.comic.name,
    cover: results.comic.cover,
    updated: results.comic.updated,
    brief: results.comic.brief,
  });
}

function render(obj) {
  let $main = $("#main");
  for (let k in obj) {
    $main.append(`<div>${k}:</div>`);
    $main.append(`<div id='${k}'>${obj[k]}</div>`);
  }
}
$(function () {
  switch (mode) {
    case "chapter":
      renderChapter(args);
      break;
  }
});
