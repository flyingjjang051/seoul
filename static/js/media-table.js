const socket = io();

const clickSound = new Audio("../sound/btn_click.wav");
const closeSound = new Audio("../sound/btn_close.wav");

let book = null;
const pdfList = $(".pdfList");
const popup = $(".popup");
const popupContents = $(".popup .book");
const pdfListTL = gsap.timeline({ paused: true });
let bookList = [];
pdfListTL
  .to("#header", { top: -620, paddingBottom: 0 })
  .to("#header .desc", { opacity: 0 }, 0)
  .fromTo(".pdfList", { opacity: 0 }, { opacity: 1, duration: 1, stagger: { each: 0.1 } })
  .fromTo(".pdfListBox button", { opacity: 0 }, { opacity: 1 }, 1)
  .to(".panorama", { bottom: 0 }, 0)
  .to(".panorama .btn", { autoAlpha: 0 }, 0)
  .to(".panorama .inner", { paddingTop: 80 / 1.5, paddingBottom: 50 / 1.5, backgroundColor: "#222" }, 0)
  .fromTo(".panorama .info", { opacity: 0 }, { opacity: 1 }, 0.5);
//const bookContents = $(".popup .book");
const popupTL = gsap.timeline({ paused: true });
popupTL.fromTo(".bg", { opacity: 0 }, { opacity: 1, duration: 1 }).fromTo(popup, { y: "200%" }, { y: "-50%", duration: 1, ease: "power4" });
$.ajax({ url: "../data/media-table.json" }).done(function (response) {
  let tempHtml = "";
  const panoramaList = response.panoramaList;

  const total = panoramaList.length;

  $.each(panoramaList, function (idx, item) {
    tempHtml += `<li class="swiper-slide" data-json="${item.json}" data-idx="${idx}">
    <div class="imgBox">
      <div class="thumb"><img src="../images/media-table/${item.thumb}" alt="" /></div>
      <div class="border"><img src="../images/media-table/border.png" alt="" /></div>
    </div>
    <div class="txtBox">
      <p class="title">${item.title}</p>
      <p class="desc">${item.desc}</p>
    </div>
  </li>`;
    $(".panoramaList").html(tempHtml);
    new Swiper(".panorama .mask", {
      slidesPerView: 7,
      spaceBetween: 156 / 1.5,
      navigation: {
        prevEl: ".panorama .btnPrev",
        nextEl: ".panorama .btnNext",
      },
    });
  });
});
$(".panoramaList").on("click", "li", function () {
  clickSound.play();
  pdfListTL.kill();
  const json = $(this).data("json");
  $(".pdfListBox").addClass("on");
  const selectedNum = $(this).index();
  console.log("🚀 ~ file: media-table.js ~ line 58 ~ selectedNum", selectedNum);

  socket.emit("media-table-signal", { num: selectedNum });

  $.ajax({ url: `../data/media-table/${json}` }).done(function (response) {
    console.log(response);
    const rootImgFolder = response.imgFolder;
    console.log(rootImgFolder);
    const pdfImgs = response.pdfImgs;
    $(".panorama .info").text(response.info);
    pdfList.html("");

    let tempHtml = "";
    bookList = [];
    $.each(pdfImgs, function (idx, item) {
      bookList.push(item.imgs);
      if (item.type !== "video") {
        tempHtml += `<li class="swiper-slide""  data-idx="${idx}"  data-imgfolder="${item.imgFolder}" data-department = "${item.department}" data-date = "${item.date}"  data-title = "${item.title}" data-type="image">
      <div class="imgBox">
        <div class="thumb"><img src="../images/media-table/${rootImgFolder}/${item.img}" alt="" /></div>
      </div>
      <div class="txtBox">
        <p class="date">${item.date}</p>
        <p class="title">${item.title}</p>
        <p class="desc">${item.desc}</p>
      </div>
    </li>`;
      } else {
        tempHtml += `<li class="swiper-slide""  data-idx="${idx}"  data-imgfolder="${item.imgFolder}" data-department = "${item.department}" data-date = "${item.date}"  data-title = "${item.title}" data-type="video" data-src="${item.src}">
      <div class="imgBox">
        <div class="thumb"><img src="../images/media-table/${rootImgFolder}/${item.img}" alt="" /></div>
      </div>
      <div class="txtBox">
        <p class="date">${item.date}</p>
        <p class="title">${item.title}</p>
        <p class="desc">${item.desc}</p>
      </div>
    </li>`;
      }
    });
    pdfList.html(tempHtml);
    console.log(bookList);

    new Swiper(".pdfListBox .mask", {
      slidesPerView: 6,
      spaceBetween: 110,
      navigation: {
        nextEl: ".pdfListBox .btnNext",
        prevEl: ".pdfListBox .btnPrev",
      },
    });
    pdfList.find("li").on("click", function () {
      popup.find(".date").text($(this).data("date"));
      popup.find(".title").text($(this).data("title"));
      popup.find(".department").text($(this).data("department"));
      const imgFolder = $(this).data("imgfolder");
      popupTL.restart();
      $("body").addClass("on");
      let popupContentsHtml = "";
      const imgs = bookList[$(this).index()];
      popupContents.html("");
      popupContents.prepend(`<div class="contents"></div>`);
      if ($(this).data("type") !== "video") {
        $.each(imgs, function (idx, item) {
          popupContentsHtml += `<div class="page" style="background-image: url('../images/media-table/${rootImgFolder}/${imgFolder}/${item.img}')"></div>`;
        });
        $(".popup .book .contents").html(popupContentsHtml);
        book = null;
        makeBook(1);
      } else {
        $(".popup .book .contents").html(`<video src="../images/media-table/${rootImgFolder}/${imgFolder}/${$(this).data("src")}" controls></video>`);
      }
      //book = $(".book .contents").turn("page", parseInt($(this).data("idx")) + 1);
    });
    //pdfListTL.timeScale(1);
    pdfListTL.restart();
  });
  $(".btnBack").addClass("on");
});
$(".btnBack").on("click", function () {
  closeSound.play();
  pdfListTL.kill();
  $(this).removeClass("on");
  $(".pdfListBox").removeClass("on");
  pdfListTL.reverse();
  $("body").removeClass("on");
});

function makeBook(page = 1) {
  book = null;
  book = $(".popup .book .contents").turn({
    width: 1182 - 4,
    height: 829 - 4,
    elevation: 50,
    gradients: true,
    //autoCenter: true,
    when: {
      turned: function (event, page, pageObj) {
        console.log("page===", page);
      },
    },
  });
  $(".book .contents").turn("page", page);
}
popup.find(".btnPopupClose").on("click", function () {
  //gsap.to(popup, { y: "-150%", ease: "back.in", duration: 1 });
  closeSound.play();
  popupTL.reverse();
  $("body").removeClass("on");
});
