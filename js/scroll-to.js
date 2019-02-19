// // // BACK - TO - TOP // // //
"use strict";
let scrollanimation;
document.querySelector("#back-to-top").addEventListener('click',  (_e)  => {
        _e.preventDefault();
        let current_pos = document.querySelector('html').scrollTop;
        const step = current_pos / 60;
        scrollanimation = setInterval( () => {
                current_pos -= step;
                document.querySelector('html').scrollTop = current_pos;
                if (current_pos < 5) {
                        current_pos = 0;
                        clearInterval(scrollanimation);
                }
        }, 1000 / 100);
});
