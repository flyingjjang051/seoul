const gap = 200;
let clear = null;
$("#main").on("mousedown", function (e) {
  const posX = e.clientX;
  gsap.set(".fast", { clipPath: `polygon(${posX}px 0, ${posX}px 0, ${posX}px 100%, ${posX}px 100%)`, ease: "power4.inOut" });
  gsap.to(".fast", { clipPath: `polygon(${posX - gap}px 0, ${posX + gap}px 0, ${posX + gap}px 100%, ${posX - gap}px 100%)`, ease: "power4.inOut" });
  if (clear !== null) {
    clearTimeout(clear);
  }
  clear = setTimeout(move, 3000, e);
});

// $("#main").on("mouseup", function (e) {
//   const posX = e.clientX;
//   gsap.to(".fast", { clipPath: `polygon(${posX}px 0, ${posX}px 0, ${posX}px 100%, ${posX}px 100%)`, ease: "power4.inOut" });
// });
$("#main").on("drag", function (e) {
  const posX = e.clientX;
  gsap.to(".fast", { clipPath: `polygon(${posX - gap}px 0, ${posX + gap}px 0, ${posX + gap}px 100%, ${posX - gap}px 100%)` });
});
$("#main").on("dragend", function (e) {
  const posX = e.clientX;
  gsap.to(".fast", { clipPath: `polygon(${posX}px 0, ${posX}px 0, ${posX}px 100%, ${posX}px 100%)`, ease: "power4.inOut" });
});
function move(e) {
  const posX = e.clientX;
  gsap.to(".fast", { clipPath: `polygon(${posX}px 0, ${posX}px 0, ${posX}px 100%, ${posX}px 100%)`, ease: "power4.inOut" });
}
