//prettier-ignore
const photoList = $("#main .contents .list");
const zDepth = 500;
const w = $(window).width();
const h = $(window).height();
$.ajax({ url: "data/data.json" }).done(function (response) {
  const photos = response.photos;

  let tempHtml = "";
  const list = [];
  $.each(photos, function (idx, item) {
    tempHtml += `<li class="item ${Math.random() < 0.2 ? "big" : ""}">
    <div class="inner">
      <div class="img">
        <img src="${item.img}" alt="" />
        <div class="cover"></div>
      </div>
      <div class="txt">
        <p class="title">${item.title}</p>
        <div class="dateAndAddress">
          ${item.date} ${item.address}
        </div>
      </div>
    </div>
  </li>`;
  });
  photoList.html(tempHtml);
  photoList.find("li").each(function (idx, item) {
    moveItem(item);
  });

  // photoList.imagesLoaded().always(function () {
  //   grid = photoList.isotope({
  //     itemSelector: ".item",
  //     layoutMode: "masonry",
  //   });
  // });
});
function moveItem(mc) {
  let zNum = -2000;
  let zMin = 500;
  let z = parseInt(Math.random() * 1000);
  let zValue = parseInt(Math.random() * zNum - zMin);
  console.log(zValue);
  const duration = Math.random() * 10 + 10;
  gsap.set($(mc).find(".cover"), { opacity: Math.abs(zValue / (zNum - zMin)) });
  $(mc).removeClass("show");
  if (Math.random() < 0.2) {
    $(mc).addClass("show");
    $(mc).find("img").width(600);
    z = 100000;
    zValue = parseInt(Math.random() * -100);
  }
  gsap.from(mc, { duration: 1, scale: 0, ease: "back" });
  //gsap.set(mc, { filter: `blur(${Math.abs(zValue / 80)}px)`, left: "40%", top: "40%" });
  gsap.set(mc, { left: "40%", top: "40%" });
  gsap.fromTo(
    mc,
    { x: Math.random() * -w + w / 2, y: h / 2, zIndex: z, z: zValue },
    {
      y: -h,
      duration: duration,
      ease: "none",
      onComplete: () => {
        moveItem(mc);
      },
      onCompleteParams: [mc],
    }
  );
}
