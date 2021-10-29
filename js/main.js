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
  url = url.replace(/\[:(.+)\]/g, () => args[RegExp.$1]);
  return $.get(api.BASE + url, params);
}

const api = {
  BASE: `https://api.copymanga.com/api/v3`,
  ITEM: `/comic2/[:id]?platform=1`,
  CHAPTERS: `/comic/[:id]/group/default/chapters?limit=500&offset=0`,
};

async function renderChapter(args) {
  let res = await get(api.ITEM);
  let comic = res.results.comic;
  render({
    name: comic.name,
    cover: comic.cover,
    updated: comic.datetime_updated,
    brief: comic.brief,
  });
  res = await get(api.CHAPTERS);
  let chapters = res.results.list;
  renderList({
    key: "list",
    arr: chapters.map((i) => ({
      id: i.comic_id,
      name: i.name,
      time: i.datetime_created,
    })),
  });
}

function render(obj) {
  let $main = $("#main");
  for (let k in obj) {
    $main.append(`<div>${k}:</div>`);
    $main.append(`<div id='${k}'>${obj[k]}</div>`);
  }
}
function renderList({ key, arr }) {
  let $main = $("#main");
  for (let k in obj) {
    $main.append(`<div class='${key}'>
    ${arr
      .map((i) => {
        for (let y in i) {
          return `<div class='${y}'>${i[y]} </div>`;
        }
      })
      .join("")}
    </div>`);
  }
}
$(function () {
  switch (mode) {
    case "chapter":
      renderChapter(args);
      break;
  }
});
