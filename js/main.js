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

        
});
