const users_nav = document.querySelector('.users_nav');
const user_option = document.querySelector('#user_option');
const user_close = document.querySelector('.user_close');

user_option.addEventListener("click", () => {
    users_nav.classList.toggle("users_nav_show");
});


user_close.addEventListener("click", () => {
    users_nav.classList.toggle("users_nav_show");
});

