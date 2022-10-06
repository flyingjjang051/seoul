const socket = io();

const clickSound = new Audio("sound/btn_click.wav");
const closeSound = new Audio("sound/btn_close.wav");

let selectedNum = 0;

const keywordSlider = new Swiper(".mask", {
  direction: "vertical",
  effect: "coverflow",
  coverflowEffect: {
    rotate: 0,
    slideShadows: false,
    depth: 200,
  },
  on: {
    slideChange: function (swiper) {
      selectedNum = swiper.realIndex;
      console.log(selectedNum);
      setTimeout(function () {
        closeSound.play();
        gsap.to($(".keywordBox .swiper-slide-active"), { opacity: 1 });
        gsap.to($(".keywordBox .swiper-slide-active").next(), { opacity: 0.5 });
        gsap.to($(".keywordBox .swiper-slide-active").next().next(), { opacity: 0.3 });
        gsap.to($(".keywordBox .swiper-slide-active").next().next().next(), { opacity: 0.1 });
        gsap.to($(".keywordBox .swiper-slide-active").prev(), { opacity: 0.5 });
        gsap.to($(".keywordBox .swiper-slide-active").prev().prev(), { opacity: 0.3 });
        gsap.to($(".keywordBox .swiper-slide-active").prev().prev().prev(), { opacity: 0.1 });
      }, 0);
    },
  },
});
const bgSlider = new Swiper(".bgWrapper", {
  effect: "fade",
});
keywordSlider.controller.control = bgSlider;

$(".txt02").on("click", function () {
  console.log(selectedNum);

  socket.emit("signal", { num: selectedNum });
});
