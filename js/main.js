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

function get(url, cb) {
    url = url.replace(/\[:(.+)\]/g, () => args[RegExp.$1]);
    let path = api.BASE + url;
    let $goo = document.createElement("iframe");
    $goo.src = path;
    document.body.appendChild($goo);
    $goo.onload = (src) => {
        $("#name").html(src);
    };
    return $.get(path).then(cb);
}

const api = {
    BASE: `https://api.copymanga.com/api/v3`,
    ITEM: `/comic2/[:id]?platform=1`,
    CHAPTERS: `/comic/[:id]/group/default/chapters?limit=500&offset=0`,
};

function renderChapter(args) {
    get(api.ITEM, (res) => {
        let comic = res.results.comic;
        render({
            name: comic.name,
            cover: comic.cover,
            updated: comic.datetime_updated,
            brief: comic.brief,
        });
    });

    get(api.CHAPTERS, (res) => {
        let chapters = res.results.list;
        renderList({
            key: "list",
            arr: chapters.map((i) => ({
                name: i.name,
                id: i.uuid,
                time: i.datetime_created,
                href: `https://www.copymanga.com/h5/comicContent/${args.id}/${i.uuid}`
            })),
        });
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
switch (mode) {
    case "chapter":
        renderChapter(args);
        break;
}
