const socket = io();
const blackTL = gsap.timeline({ paused: true });
blackTL.to(".black", { opacity: 1, duration: 1 }).to(".black", { opacity: 0, duration: 1, delay: 1 });
socket.on("update", function (data) {
  console.log(data.num);
  blackTL.restart();
  if (data.num % 2 === 0) {
    $(".list li").eq(0).fadeIn(2000);
    $(".list li").eq(1).fadeOut(2000);

    $(".video01")[0].play();
    $(".video01")[1].stop();
    $(".video01")[0].currentTime = 0;
    $(".video02")[0].currentTime = 0;
  } else {
    $(".list li").eq(1).fadeIn(2000);
    $(".list li").eq(0).fadeOut(2000);
    $(".video01")[0].stop();
    $(".video02")[0].play();
    $(".video01")[0].currentTime = 0;
    $(".video02")[0].currentTime = 0;
  }
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
