const clickSound = new Audio("../sound/btn_click.wav");
const closeSound = new Audio("../sound/btn_close.wav");

const w = $(window).width();
const h = $(window).height();
const keywordList = $(".keywordList");
let swiper = null;
let isRandom = true;
const centerX = (w - 800) / 2;
const zDepth = 100;

const loadJson = $("body").data("json");
console.log(loadJson);

$.ajax({ url: "../data/" + loadJson }).done(function (response) {
  let tempHtml = "";
  const keyword = response.keyword;
  const imageFolder = response.imageFolder;
  const total = keyword.length;
  const harf = (w - (420 / 1.5) * total) / 2;
  console.log(imageFolder);

  $.each(keyword, function (idx, item) {
    let thumbListHtml = "";
    let swiperListHtml = "";
    $.each(item.thumbList, function (idx, item) {
      thumbListHtml += `<li>
      <img src="../images/keyword/${imageFolder}${item.img}" alt="">
      <p>${item.desc}</p>
    </li>`;
    });
    $.each(item.thumbList, function (idx, item) {
      console.log(item.mp4);
      if (item.mp4 === undefined) {
        swiperListHtml += `<li class="swiper-slide">
      <img src="../images/keyword/${imageFolder}${item.img}" alt="">
      <p>${item.desc}</p>
    </li>`;
      } else {
        console.log("비디오 있음");
        swiperListHtml += `<li class="swiper-slide">
      <video src="../images/keyword/${imageFolder}${item.mp4}" controls alt="">
      <p>${item.desc}</p>
    </li>`;
      }
    });

    tempHtml += `<li>
    <div class="topBg"></div>
    <h2 class="title"><span>${item.title}</span></h2>
    <div class="img"><img src="../images/keyword/${imageFolder}${item.img}" alt="" /></div>
    <p class="category">${item.category}</p>
    <span class="btns"><img src="../images/keyword/arrow_white.png" alt="" /></span>
    <p class="topCategory">${item.category}</p>
    <div class="desc" data-splitting>
      ${item.desc}
    </div>
    <div class="thumbList">
      <ul>${thumbListHtml}</ul>
    </div>
    <div class="bg"></div>
    <div class="openBg"></div>
    <div class="black"></div>
		<div class="swiperContents">
			<ul class="swiper-wrapper">
				${swiperListHtml}
			</ul>
      <button class="close">
        <span class="material-icons">
          close
        </span>
      </button>
		</div>
    <div class="icons">
      <ul class="list">
        <li data-src="https://www.seoul.go.kr/seoul/symbol.do?tr_code=short"><img src="images/homepage.png"></li>
        <li data-src="https://www.instagram.com/seoul_official/"><img src="images/instagram.png"></li>
        <li data-src="https://www.youtube.com/user/seoullive"><img src="images/youtube.png"></li>
      </ul>
    </div>
    <div class="contentsHtml">
      <iframe src="" frameborder="0" scrolling="auto"></iframe>
      <button class="close">
        <span class="material-icons">
          close
        </span>
      </button>
    </div>
    <button class="mainClose">
        <img src="../images/keyword/back.png">
    </button>
  </li>`;
  });
  keywordList.html(tempHtml);
  Splitting();
  $(".keywordList > li").each((idx, item) => {
    gsap.set(item, { left: harf + (420 / 1.5) * idx });
    $(item).attr("data-load-x", harf + (420 / 1.5) * idx);
    $(item).attr("data-load-y", harf + (420 / 1.5) * idx);
    moveRandom(item);
  });
  clickFunc();
  thumListClickFunc();
  contentsHtmlClickFunc();
  btnCloseClickFunc();
  mainCloseClickFunc();
});

gsap.defaults({
  ease: "power4.inOut",
  duration: 2,
});
let count = 0;
function moveRandom(mc) {
  const zValue = Math.random() * -zDepth;
  const duration = Math.random() * 3 + 3;
  gsap.to($(mc).find(".black"), {
    opacity: Math.abs(zValue) / (zDepth + 100),
    duration: duration,
  });
  gsap.to(mc, {
    x: () => Math.random() * 50 - 25,
    y: () => Math.random() * 400 - 200,
    z: () => zValue,
    //opacity: () => 1.2 - Math.abs(zValue / 300),
    zIndex: () => 10000 - Math.abs(zValue),
    duration: () => duration,
    onComplete: () => {
      moveRandom(mc);
    },
    onCompleteParams: [mc],
  });
}

const clickFunc = () => {
  $(".keywordList").on("click", "li .bg", function () {
    clickSound.play();
    gsap.killTweensOf(".keywordList li");
    gsap.killTweensOf(".keywordList li .black");
    gsap.killTweensOf(".keywordList li .thumbList");
    gsap.killTweensOf(".keywordList li .desc .char");
    gsap.killTweensOf(".keywordList li .mainClose");
    gsap.killTweensOf(".keywordList li .thumbList li");
    const parent = $(this).parent();
    if (!parent.hasClass("on")) {
      openMotion(parent);
    } else {
      closeMotion(parent);
    }
  });
};

function openMotion(parent) {
  isRandom = false;
  parent.addClass("on");
  gsap.to(parent.siblings(), {
    z: -zDepth,
    opacity: 0.2,
    //left: w / 2,
    x: 0,
    y: 0,
  });
  gsap.set(parent, { zIndex: 10000 });
  gsap.set(parent.siblings(), { zIndex: 0 });
  parent.siblings().addClass("not");
  if (parent.index() === 7) {
    gsap.to(parent, {
      width: 800 / 1.5,
      height: "86%",
      x: -200,
      y: 0,
      z: 0,
      //left: centerX,
    });
  } else if (parent.index() === 8) {
    gsap.to(parent, {
      width: 800 / 1.5,
      height: "86%",
      x: -400,
      y: 0,
      z: 0,
      //left: centerX,
    });
  } else {
    gsap.to(parent, {
      width: 800 / 1.5,
      height: "86%",
      x: 0,
      y: 0,
      z: 0,
      //left: centerX,
    });
  }

  gsap.to(parent.find(".topBg"), {
    opacity: 0,
  });
  gsap.to(parent.find(".img"), {
    //scale: 0.75,
    top: 200 / 1.5,
  });

  gsap.to(parent.find(".openBg"), {
    opacity: 1,
  });

  gsap.to(parent.find(".btns"), {
    opacity: 0,
  });
  gsap.to(parent.find(".btns"), {
    opacity: 0,
  });

  gsap.to(parent.find(".category"), {
    opacity: 0,
  });
  gsap.to(parent.find(".title"), {
    top: 30,
    left: 20,
    transform: "translateX(0)",
  });

  gsap.to(parent.find(".topCategory"), {
    opacity: 1,
    delay: 1,
  });
  gsap.to(parent.find(".mainClose"), {
    opacity: 1,
  });

  gsap.fromTo(
    parent.find(".desc .char"),
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power4.out",
      stagger: {
        each: 0.02,
      },
      delay: 1.5,
    }
  );
  gsap.to(parent.find(".thumbList"), {
    opacity: 1,
    delay: 2,
  });
  gsap.to(parent.find(".black"), {
    opacity: 0,
  });
  gsap.to(parent.find(".icons"), {
    opacity: 1,
  });
}
function closeMotion(parent) {
  gsap.killTweensOf(".keywordList li");
  gsap.killTweensOf(".keywordList li .black");
  gsap.killTweensOf(".keywordList li .thumbList");
  gsap.killTweensOf(".keywordList li .swiperContents");
  gsap.killTweensOf(".keywordList li .contentsHtml");
  gsap.killTweensOf(".keywordList li .desc .char");
  gsap.killTweensOf(".keywordList li .mainClose");
  gsap.killTweensOf(".keywordList li .thumbList li");
  isRandom = true;
  parent.removeClass("on");
  gsap.to(parent.siblings(), {
    opacity: 1,
    z: (idx, item) => 0,
    x: 0,
    y: 0,
    left: (idx, item) => $(item).data("load-x"),
  });
  gsap.set(parent.siblings(), {
    zIndex: 0,
  });
  parent.siblings().removeClass("not");
  gsap.to(parent, {
    width: 400 / 1.5,
    height: 1470 / 1.5,
    left: parent.data("load-x"),
    x: 0,
    onComplete: () => {
      parent.removeClass("on");
      $(".keywordList > li").each((idx, item) => {
        moveRandom(item);
      });
    },
  });
  gsap.to(parent.find(".topBg"), {
    opacity: 1,
  });
  gsap.to(parent.find(".img"), {
    top: 220 / 1.5,
  });
  gsap.to(parent.find(".openBg"), {
    opacity: 0,
  });
  gsap.to(parent.find(".btns"), {
    opacity: 1,
  });
  gsap.to(parent.find(".category"), {
    opacity: 1,
    delay: 1,
  });
  gsap.to(parent.find(".title"), {
    top: 50,
    left: "50%",
    transform: "translateX(-50%)",
  });

  gsap.to(parent.find(".topCategory"), {
    opacity: 0,
  });

  gsap.set(parent.find(".desc .char"), {
    opacity: 0,
  });
  gsap.set(parent.find(".thumbList"), {
    opacity: 0,
  });
  gsap.set(parent.find(".swiperContents"), {
    opacity: 0,
    display: "none",
  });
  gsap.set(parent.find(".contentsHtml"), {
    opacity: 0,
    display: "none",
  });

  gsap.to(parent.find(".mainClose"), {
    opacity: 0,
  });
  gsap.to(parent.siblings().find(".black"), {
    opacity: 0,
  });
  gsap.to(parent.find(".icons"), {
    opacity: 0,
  });
  if (swiper !== null) {
    swiper.destroy();
    swiper = null;
  }
  $(".contentsHtml iframe").attr({ src: "" });
}

const thumListClickFunc = function () {
  $(".thumbList").on("click", "li", function () {
    $(this).parents(".on").find(".swiperContents").show();
    const swiperContents = $(this).parents(".on").find(".swiperContents")[0];
    console.log(swiperContents);
    const first = $(this).index();
    if (swiper === null) {
      swiper = new Swiper(swiperContents, { observer: true, observeParents: true, observeSlideChildren: true, initialSlide: first });
      gsap.to(swiperContents, { opacity: 1, duration: 0.5 });
    }
  });
};
const mainCloseClickFunc = function () {
  $(".keywordList li").on("click", ".mainClose", function () {
    closeSound.play();
    const parent = $(this).parent();
    closeMotion(parent);
  });
};
const btnCloseClickFunc = function () {
  $(".keywordList li").on("click", ".swiperContents .close", function () {
    console.log("close click");
    const swiperContents = $(this).parents(".on").find(".swiperContents")[0];
    if (swiper !== null) {
      gsap.to(swiperContents, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(swiperContents, { display: "none" });
          swiper.destroy();
          swiper = null;
        },
      });
    }
  });
  $(".keywordList li").on("click", ".contentsHtml .close", function () {
    console.log("close click");
    const contentsHtml = $(this).parents(".on").find(".contentsHtml");
    gsap.to(contentsHtml, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        gsap.set(contentsHtml, { display: "none" });
        contentsHtml.find("iframe").attr({ src: "" });
      },
    });
  });
};
$(".keywordList li").on("click", ".swiperContents .close", function () {
  console.log("close click");
  const swiperContents = $(this).parents(".on").find(".swiperContents")[0];
  if (swiper !== null) {
    gsap.to(swiperContents, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        gsap.set(swiperContents, { display: "none" });
        swiper.destroy();
        swiper = null;
      },
    });
  }
});
const contentsHtmlClickFunc = function () {
  $(".icons").on("click", "li", function () {
    const dataSrc = $(this).data("src");
    console.log(dataSrc);
    $(this).parents(".on").find(".contentsHtml").show();
    $(".contentsHtml iframe").attr({ src: dataSrc });
    const contentsHtml = $(this).parents(".on").find(".contentsHtml");
    gsap.to(contentsHtml, { opacity: 1, duration: 0.5 });
  });
};
