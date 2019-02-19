window.addEventListener('load', function () { // Js erst laden wenn Seite gelanden (DOM)


        // // // SLIDER // // //
        var autoplay; // var definieren
        var start_autoplay = function () {
            autoplay = setInterval(function () {
                count++;
                slider_buttons[count].click();
                if (count >= slider_buttons.length - 1) { // wenn bei 2 angekommen 
                    count = -1;     // beginne von neu !
                }
            }, 6500);
        };
    
        var slider_buttons = document.querySelectorAll('.slide-nav'); // Die Slider buttons selektieren
        for (var i = 0; i < slider_buttons.length; i++) {   // mit einer for schleife 
            slider_buttons[i].addEventListener('click', function (event) { // einen click händler auf die nodelist geben
                event.preventDefault(); // damit nix abgeschickt wird bzw. auf klick nix passiert
                var active_slide_index = event.target.getAttribute("data-slide"); // auf die data atribute zugreifen und selek.
                var all_slides = document.querySelectorAll('.flex__wrapper');
    
                //Buttons
                for (var i = 0; i < slider_buttons.length; i++) {
                    slider_buttons[i].classList.remove("active");
                }
                slider_buttons[active_slide_index].classList.add('active'); // den buttons class active hinzufügen
    
                //Slides
                for (var i = 0; i < all_slides.length; i++) {
                    all_slides[i].classList.remove("bounceOut"); //entf
                    all_slides[i].classList.remove("bounceIn");  //entf
                }
                document.querySelector('.activeSlider').classList.add('bounceOut'); // dem aktivem slider bounceOut adden
                setTimeout(function () {  // Timeout für den Effekt (bounceIn) :D
                    for (var i = 0; i < all_slides.length; i++) {
                        all_slides[i].classList.remove("activeSlider"); //entf
                        all_slides[i].classList.remove("bounceIn");     //entf
                    }
                    all_slides[active_slide_index].classList.add("activeSlider");
                    document.querySelector('.activeSlider').classList.add('bounceIn');
                }, 400); // schönerer Übergang bei 450
            });
    
            // eventhändler der auf mouseenter reagiert und das intervall cleard!
            slider_buttons[i].addEventListener('mouseenter', function (event) {
                clearInterval(autoplay);
            });
            slider_buttons[i].addEventListener('mouseleave', function (event) {
                start_autoplay();
            });
        };
        // Schleife ! // alle 6,5 sekunden 
        var count = 0;
        start_autoplay();
    
    
    });