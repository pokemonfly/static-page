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
$.ajaxSettings.async = false
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
      name: i.name,
      id: i.uuid,
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
  arr.forEach((i, ind) => {
    let s = "";
    for (let y in i) {
      s += `<div class='${y}'>${i[y]} </div>`;
    }

    $main.append(`<div class='${key}'>
    <div>${ind}</div>
    ${s}
    </div>`);
  });
}
$(async function () {
  switch (mode) {
    case "chapter":
      await renderChapter(args);
      break;
  }
  var i = 0
  setInterval(() => {
    $('#test').html('cnm:' + i)
    i ++
  }, 100)
});
