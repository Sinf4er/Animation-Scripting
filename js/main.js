window.addEventListener('load', () => {
        document.getElementById('account_window').addEventListener('click', (_e) => {
                _e.preventDefault();
                const formWindow = document.querySelector('.login_window');
                formWindow.classList.add('window_active');
        })

        document.getElementById('close_form').addEventListener('click', (_e) => {
                _e.preventDefault();
                const formWindow = document.querySelector('.login_window');
                formWindow.classList.remove('window_active');
        })

        document.querySelector('.large_btn').addEventListener('click', (_e) => {
                input = document.querySelector('#email').value;
                if (input !== "") {
                        const arrow = document.querySelector('#arrow');
                        let tl = new TimelineLite();
                        tl.to(arrow, .2, { left: "210px" })
                                .to(arrow, .9, { rotation: "900", transformOrigin: "-30px 50px", left: "-10px", top: "150px" }, "-=.05")
                                .to(arrow, 2, { left: "-2500px", fill: "#fff" }, "-=.1");
                        tl.set(arrow, { clearProps: "all" });

                        const background = document.querySelector('.bg-login');
                        background.classList.add('active_color');

                        const leftBox = document.querySelector('.first_big_box');
                        const rightBox = document.querySelector('.second_big_box');

                        setTimeout(function () {
                                leftBox.classList.add('width_box_100');
                                rightBox.classList.add('width_box_0');
                        }, 800);

                        setTimeout(function () {
                                const formWindow = document.querySelector('.login_window');
                                formWindow.classList.remove('window_active');
                                background.classList.remove('active_color');
                                leftBox.classList.remove('width_box_100');
                                rightBox.classList.remove('width_box_0');
                        }, 2000);
                } else {

                        let login_window = document.querySelector('.anker');
                        login_window.classList.add('wobble-hor-bottom');
                        let background = document.querySelector('.bg-login');
                        background.classList.add('active_color2');
                        setTimeout(function () {
                                background.classList.remove('active_color2');
                                login_window.classList.remove('wobble-hor-bottom');
                        }, 800);

                };
        })
});
