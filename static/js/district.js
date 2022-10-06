const clickSound = new Audio("../sound/btn_click.wav");
const closeSound = new Audio("../sound/btn_close.wav");

const circle = $(".circle");
const menuList = $(".menuList .list");
const site = $("#site");
const smap = $("#smap");
$.ajax({ url: `../data/district.json` }).done(function (response) {
  let tempHtml = "";
  let menuHtml = "";
  const districtList = response.districtList;
  $.each(districtList, function (idx, item) {
    tempHtml += `
    <li data-title="${item.title}" data-site="${item.site}" data-map="${item.map}"><img src="../images/district/${item.logo}"  alt="" /></li>
    `;
    menuHtml += `
    <li data-title="${item.title}" data-site="${item.site}" data-map="${item.map}">${item.name}</li>
    `;
  });
  circle.find(".list").html(tempHtml);
  menuList.html(menuHtml);

  const gap = 250 / 1.5 / 2;
  let count01 = 0;
  let count02 = 0;
  let count03 = 0;
  $(".menuList li").on("click", function () {
    $(this).addClass("on").siblings().removeClass("on");
    smap.attr({ src: "" });
    site.attr({ src: $(this).data("site") });
    const map = $(this).data("map");
    setTimeout(function () {
      smap.attr({ src: map });
    }, 1000);

    console.log($(this).data("map"));
    clickSound.play();
  });
  $(".circle li").each(function (idx, item) {
    moveRandom(item);
    $(this).on("click", function () {
      console.log($(this).data("site"));
      popupTL.restart();
      site.attr({ src: $(this).data("site") });
      smap.attr({ src: $(this).data("map") });
      clickSound.play();
      $(".menuList").addClass("on");
      $(".menuList li").eq($(this).index()).addClass("on");
      $(".menuList li").eq($(this).index()).siblings().removeClass("on");
    });
    if (idx < 14) {
      const total = 14;
      const radiusX = 800 / 1.5;
      const radiusY = 800 / 1.5;
      $(item).attr({
        "data-left": radiusX * Math.sin((count01 / total) * Math.PI * 2) - gap,
        "data-top": -radiusY * Math.cos((count01 / total) * Math.PI * 2),
      });

      $(item).css({ left: radiusX * Math.sin((count01 / total) * Math.PI * 2) - gap });
      $(item).css({ top: -radiusY * Math.cos((count01 / total) * Math.PI * 2) });
      count01++;
    } else if (idx < 22) {
      const total = 8;
      const radiusX = 480 / 1.5;
      const radiusY = 480 / 1.5;
      $(item).attr({
        "data-left": radiusX * Math.sin((count02 / total) * Math.PI * 2 - Math.PI / 15) - gap,
        "data-top": -radiusY * Math.cos((count02 / total) * Math.PI * 2 - Math.PI / 15),
      });

      $(item).css({ left: radiusX * Math.sin((count02 / total) * Math.PI * 2 - Math.PI / 15) - gap });
      $(item).css({ top: -radiusY * Math.cos((count02 / total) * Math.PI * 2 - Math.PI / 15) });
      count02++;
    } else {
      const total = 3;
      const radiusX = 200 / 1.5;
      const radiusY = 200 / 1.5;
      $(item).attr({
        "data-left": radiusX * Math.sin((count03 / total) * Math.PI * 2 - Math.PI / 7) - gap,
        "data-top": -radiusY * Math.cos((count03 / total) * Math.PI * 2 - Math.PI / 7),
      });

      $(item).css({ left: radiusX * Math.sin((count03 / total) * Math.PI * 2 - Math.PI / 7) - gap });
      $(item).css({ top: -radiusY * Math.cos((count03 / total) * Math.PI * 2 - Math.PI / 7) });
      count03++;
    }
  });
});

function moveRandom(mc) {
  const duration = Math.random() * 2 + 1;
  gsap.to($(mc), {
    duration: duration,
  });
  gsap.to(mc, {
    x: () => Math.random() * 50 - 25,
    y: () => Math.random() * 50 - 25,
    duration: () => duration,
    onComplete: () => {
      moveRandom(mc);
    },
    onCompleteParams: [mc],
  });
}

//91/17/79
const popupTL = gsap.timeline({ paused: true });
// prettier - ignore;
popupTL.fromTo(".bg", { opacity: 0 }, { opacity: 1, duration: 1 }).fromTo(
  ".popup",
  { y: "200%" },
  {
    y: "-50%",
    duration: 1,
    ease: "power4",
    onComplete: function () {},
    onReverseComplete: function () {
      smap.attr({ src: "" });
    },
  }
);

function keyboard() {
  $(window).trigger("keyup");
}
$(".btnPopupClose").on("click", function () {
  popupTL.reverse();
  closeSound.play();
  $(".menuList").removeClass("on");
});

new Swiper(".colorBg", {
  effect: "fade",
  speed: 2000,
  autoplay: {
    delay: 5000,
  },
});
