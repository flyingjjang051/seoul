const socket = io();
const viewSlider = new Swiper("#main", {
  effect: "fade",
  speed: 0,
});

const blackTL = gsap.timeline({ paused: true });
blackTL.to(".black", { opacity: 1, duration: 1 }).to(".black", { opacity: 0, duration: 1, delay: 1 });

socket.on("media-update", function (data) {
  blackTL.restart();
  setTimeout(function () {
    viewSlider.slideTo(data.num);
  }, 1000);
});
socket.on("leave", function (data) {
  //console.log(data);
});

socket.emit("enter", function (data) {
  console.log(data);
});

socket.on("back", function (data) {
  console.log(data);
});
