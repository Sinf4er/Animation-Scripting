// // // BACK - TO - TOP // // //
"use strict";
document.querySelector('#to_shop').addEventListener('click', (_e) => {
        _e.preventDefault();
        TweenLite.to(window, 1, { scrollTo: "#shop" });
})
document.querySelector('#to_shop1').addEventListener('click', (_e) => {
        _e.preventDefault();
        TweenLite.to(window, 1, { scrollTo: "#shop" });
})

document.querySelector('#to_brand').addEventListener('click', (_e) => {
        _e.preventDefault();
        TweenLite.to(window, 1, { scrollTo: "#brand" });
})

document.querySelector('#back-to-top').addEventListener('click', (_e) => {
        _e.preventDefault();
        TweenLite.to(window, 1, { scrollTo: 0 });
})

document.querySelector('#back-to-top1').addEventListener('click', (_e) => {
        _e.preventDefault();
        TweenLite.to(window, 1, { scrollTo: 0 });
})