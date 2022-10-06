const clickSound = new Audio("../sound/btn_click.wav");
const closeSound = new Audio("../sound/btn_close.wav");
const museum = $(".museum");
$.ajax({ url: `../data/epilog.json` }).done(function (response) {
  let tempHtml = "";
  const museumList = response.museumList;
  $.each(museumList, function (idx, item) {
    tempHtml += `
    <li data-title="${item.title}"  data-site="${item.site}"  style="left:${item.posX / 1.5}px; top:${item.posY / 1.5}px">
      <div class="imgBox"><img src="../images/epilog/${item.thumb}" alt="" /></div>
      <p class="title">${item.title}</p>
    </li>
    `;
  });
  museum.find(".list").html(tempHtml);
  $(".museum .list li").each(function (idx, item) {
    if (idx !== 0) {
      moveRandom(item);
    }
    $(item).on("click", function () {
      clickSound.play();
      popupTL.restart();
      $(".popup #site").attr({ src: $(this).data("site") });
    });
  });
});

function moveRandom(mc) {
  const duration = Math.random() * 2 + 1;
  gsap.to($(mc), {
    duration: duration,
  });
  gsap.to(mc, {
    scale: () => Math.random() * 0.5 + 0.75,

    duration: () => duration,
    ease: "power4.inOut",
    onComplete: () => {
      moveRandom(mc);
    },
    onCompleteParams: [mc],
  });
}

const popupTL = gsap.timeline({ paused: true });
// prettier-ignore
popupTL
.fromTo(".bg", { opacity: 0 }, { opacity: 1, duration: 1 })
.fromTo(".popup", { y: "200%" }, { y: "-50%", duration: 1, ease: "power4",onReverseComplete:function(){
  $(".popup #site").attr({ src: "" });
} });

$(".btnPopupClose").on("click", function () {
  popupTL.reverse();
  closeSound.play();
});
