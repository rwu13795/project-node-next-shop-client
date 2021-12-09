// a call back function which is used when the page is being unmounted

// I have use the window.scrollTo() "instant" behavior when the page
// is unmounted, otherwise, the "smooth" behavior will make the new page looks
// start at the position of the old page and then "scroll smoothly" back to top
export function instantlyToTop() {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
}
