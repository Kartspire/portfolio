document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".tabs__link").forEach(function (tabsLink) {
    tabsLink.addEventListener("click", function (event) {
      const path = event.target.dataset.path;
      document
        .querySelectorAll(".tabs__content")
        .forEach(function (tabContent) {
          tabContent.classList.remove("tabs__content-active");
        });
      document
        .querySelector(`[data-target = "${path}"]`)
        .classList.add("tabs__content-active");
    });
  });
});

$(document).ready(function () {
  $(".accordion__set > .accordion__control").on("click keydown", function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this).siblings(".accordion__content").slideUp(200);
      $(".accordion__set > .accordion__control i")
        .removeClass("fa-minus")
        .addClass("fa-plus");
    } else {
      $(".accordion__set > .accordion__control i")
        .removeClass("fa-minus")
        .addClass("fa-plus");
      $(this).find("i").removeClass("fa-plus").addClass("fa-minus");
      $(".accordion__set > .accordion__control").removeClass("active");
      $(this).addClass("active");
      $(".accordion__content").slideUp(200);
      $(this).siblings(".accordion__content").slideDown(200);
    }
  });
});

document
  .querySelector(".header__burger")
  .addEventListener("click", function () {
    document
      .querySelector(".burger__menu")
      .classList.toggle("burger__menu-active");
  });

let swiper = new Swiper(".swiper", {
  loop: true,
  grabCursor: true,
  slidesPerView: 1,

  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
    clickable: true,
  },
});
