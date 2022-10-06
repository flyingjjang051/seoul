const clickSound = new Audio("../sound/btn_click.wav");
const closeSound = new Audio("../sound/btn_close.wav");

let clear = null;
let clearRestart = null;
let num = 0;
// const jsonPath = "http://seoul02.jjang051.gethompy.com/_api/data.php";
// const jsonSubPath = "http://seoul02.jjang051.gethompy.com/_api/";
// const imageFolder = "http://seoul02.jjang051.gethompy.com/images/history/";

const jsonPath = "../data/month-record.json";
const jsonSubPath = "../data/month-record/";
const imageFolder = "../images/month-record/history/";

const thumbsBox = $(".popup .thumbsBox");

const keywordList = $(".yearList");
$.ajax({ url: `${jsonPath}` }).done(function (response) {
  let tempHtml = "";
  const yearList = response.yearList;
  const total = yearList.length;

  $.each(yearList, function (idx, item) {
    const items = item.items;
    let itemsHtml = "";
    const year01 = parseInt(item.year);
    let count = 0;
    let gapY = 0;
    $.each(items, function (idx, item) {
      const year02 = parseInt(item.year.split(".")[0]);
      const gapX = item.gapx;
      const gapY = item.gapy;
      // if (year02 === count) {
      // 	gapY++;
      // } else {
      // 	gapY = 0;
      // }
      itemsHtml += `<li data-gap-x="${gapX}" data-gap-y="${gapY}" data-json="${jsonSubPath}${item.json}" data-num="${idx}" style="z-index:${100 - idx}">
    <div class="img"><img src="${imageFolder}${item.img}" alt="" /></div>
    <div class="txt">
      <p class="date">${item.year}</p>
      <p class="title">${item.title}</p>
    </div>
  </li>`;
      count = year02;
    });
    tempHtml += `<li class="swiper-slide">
    <div class="year"><span>${item.year}</span></div>
    <ul class="items">
      ${itemsHtml}
    </ul>
  </li>`;
  });
  $(".yearList").html(tempHtml);

  new Swiper(".yearListWrap", {
    slidesPerView: "auto",
  });
});
const popup = $(".popup");
const popupTL = gsap.timeline({ paused: true });
popupTL.fromTo(".bg", { opacity: 0 }, { opacity: 1, duration: 1 }).fromTo(
  popup,
  { y: "200%" },
  {
    y: "-50%",
    duration: 1,
    ease: "power4",
    onReverseComplete: function () {
      thumbsBox.hide();
      $(".thumbsBox .innerPopup").hide();
    },
  }
);
$(".yearList").on("click", "li .items > li", function () {
  clearInterval(clear);
  clickSound.play();
  const json = $(this).data("json");
  console.log(json);
  clearInterval(clear);
  $.ajax({ url: `${json}` }).done(function (response) {
    const folderItems = response.photos;
    const title = popup.find(".thumbsBox .header .title");
    const date = popup.find(".thumbsBox .header .date");
    const place = popup.find(".thumbsBox .header .place");

    const leftTitle = popup.find(".txtBox h3");
    const leftDate = popup.find(".txtBox .date");
    const leftDesc = popup.find(".txtBox .desc");

    const folderList = popup.find(".folderBox > .list");
    const thumbsList = popup.find(".folderBox .thumbsBox .list");
    title.text(response.title);
    date.text(response.date);
    place.text(response.desc);

    leftTitle.text(response.title);
    leftDate.text(response.date);
    leftDesc.text(response.desc);

    popupTL.restart();
    folderList.html("");
    thumbsList.html("");
    let tempHtml = "";
    const firstPhotos = makePopupThums(response.photos[0].photos);
    thumbsList.html(firstPhotos);
    gsap.fromTo(thumbsList.find("li"), { opacity: 0 }, { opacity: 1, stagger: { each: 0.05 }, delay: 1 });
    $.each(folderItems, function (idx, item) {
      console.log(item);
      tempHtml += ` <li>
      <div class="folderImg"><img src="../images/month-record/folder.png" alt="" /></div>
			<div class="txt">
				<p class="date">${item.date}</p>
				<p class="title">${item.title}</p>
				<p class="place">${item.place}</p>
			</div>
    </li>`;
    });
    folderList.html(tempHtml);
    folderList.find("li").on("click", function () {
      clearInterval(clear);
      clickSound.play();
      const idx = $(this).index();
      const clickedItems = { ...response.photos[idx] };
      console.log(clickedItems);
      title.text(clickedItems.title);
      date.text(clickedItems.date);
      place.text(clickedItems.place);
      thumbsBox.fadeIn(250);
      thumbsList.html("");
      const photos = makePopupThums(clickedItems.photos, `${clickedItems.date}<span>/</span>${clickedItems.title}<span>/</span>${clickedItems.place}`);
      thumbsList.html(photos);
      gsap.fromTo(thumbsList.find("li"), { opacity: 0 }, { opacity: 1, stagger: { each: 0.1 } });
    });
    thumbsBox.find(".btnInnerPopupClose").on("click", function () {
      thumbsBox.fadeOut(100);
    });
  });
});

popup.find(".btnPopupClose").on("click", function () {
  //gsap.to(popup, { y: "-150%", ease: "back.in", duration: 1 });
  popupTL.reverse();

  clearRestart = setTimeout(restartYoyo, 3000);
  closeSound.play();
});

gsap.defaults({
  ease: "power4.inOut",
  duration: 2,
});

function makePopupThums(array, txt) {
  let thumbsHtml = "";
  $.each(array, function (idx, item) {
    if (item.type === "pdf") {
      thumbsHtml += `<li data-img="../images/month-record/history/${item.src}" data-type="${item.type}"  data-caption="${txt}"><img src="${imageFolder}${item.img}"></li>`;
    } else if (item.type === "video") {
      thumbsHtml += `<li data-img="../images/month-record/history/${item.src}" data-type="${item.type}"  data-caption="${txt}"><img src="${imageFolder}${item.img}"></li>`;
    } else {
      thumbsHtml += `<li data-img="../images/month-record/history/${item.img}" data-type="image"  data-caption="${txt}"><img src="${imageFolder}${item.img}"></li>`;
    }
  });
  return thumbsHtml;
}

function moveRandom(mc) {
  const duration = Math.random() * 2 + 1;

  gsap.to(mc, {
    scale: 1.25,
    duration: 1,
    repeat: 3,
    yoyo: true,
  });
}

const restartYoyo = function () {
  clear = setInterval(yoyo, 5000);
};

const yoyo = function () {
  $(".yearList > li .items li")
    .eq(num)
    .each(function (idx, item) {
      moveRandom($(item).find(".img"));
    });
  num++;
  num = num % $(".yearList > li .items li").length;
};

clear = setInterval(yoyo, 5000);

// Fancybox.bind('[data-fancybox="photos"]', {
//   Toolbar: false,
//   Image: {
//     zoom: false,
//     click: false,
//     //wheel: "slide",
//   },
// });

$(".thumbsBox").on("click", "li", function () {
  clearInterval(clear);
  if ($(this).data("type") === "image") {
    // $(".thumbsBox .innerPopup .inner img").show();
    // $(".thumbsBox .innerPopup .inner img").attr({ src: $(this).data("img") });
    // $(".thumbsBox .innerPopup iframe").hide();
    $(".thumbsBox .innerPopup .contents").html(`<img src="${$(this).data("img")}" alt="" />`);
  } else if ($(this).data("type") === "pdf") {
    $(".thumbsBox .innerPopup .contents").html(`<iframe src="${$(this).data("img")}#toolbar=0&navpanes=0&scrollbar=0" height="1000px" width="100%" frameborder="0"></iframe>`);
    // $(".thumbsBox .innerPopup .inner img").hide();
    // $(".thumbsBox .innerPopup iframe").show();
  } else {
    $(".thumbsBox .innerPopup .contents").html(`<video src="${$(this).data("img")}" id="contentsVideo" controls></video>`);
  }
  $(".thumbsBox .innerPopup").fadeIn(100);

  $(".thumbsBox .innerPopup .inner .innerPopupTxt").html($(this).data("caption"));

  return false;
});
$(".thumbsBox .btnInnerPhotoPopupClose").on("click", function () {
  $(".thumbsBox .innerPopup").fadeOut(100);
  $("#contentsVideo")[0].pause();
  return false;
});
