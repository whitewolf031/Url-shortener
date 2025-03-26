// --------------------------------------languange-------------------------------------
$(document).ready(function () {
    function changeLanguage(lang) {
        $.getJSON(`./locales/${lang}.json`, function (translations) {
            $("[data-i18n]").each(function () {
                let key = $(this).attr("data-i18n");

                // Check if it's an input field (update placeholder)
                if ($(this).is("input, textarea")) {
                    $(this).attr("placeholder", translations[key]);
                } else {
                    $(this).text(translations[key]);
                }
            });
        });
    }

    // Detect user's preferred language
    let userLang = localStorage.getItem("lang") || "en";
    $("#languageSwitcher").val(userLang);
    changeLanguage(userLang);

    // Change language on dropdown select
    $("#languageSwitcher").on("change", function () {
        let selectedLang = $(this).val();
        localStorage.setItem("lang", selectedLang);
        changeLanguage(selectedLang);
    });
});

// --------------------------------------languange-------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login").addEventListener("click", function () {  // ✅ ID to‘g‘ri chaqirildi
        let username = document.getElementById("username").value.trim();
        let password = document.getElementById("password").value.trim();

        // 🔹 Bo‘sh maydonlar uchun validatsiya
        if (!username || !password) {
            Swal.fire({
                icon: "warning",
                title: "⚠️ Ogohlantirish!",
                text: "Iltimos, username va parolni kiriting!",
                confirmButtonColor: "#ffc107",
                confirmButtonText: "OK"
            });
            return;
        }

        Swal.fire({
            title: "⏳ Iltimos, kuting...",
            text: "Login amalga oshirilmoqda",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(data => {
                Swal.close(); // 🔹 Loading modalni yopish

                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", data.username);

                    Swal.fire({
                        icon: "success",
                        title: "✅ Muvaffaqiyatli!",
                        text: "Login amalga oshdi!",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    }).then(() => {
                        window.location.href = "user.html";
                    });
                } else {
                    throw { detail: "Noto‘g‘ri username yoki parol!" };
                }
            })
            .catch(error => {
                Swal.close(); // 🔹 Loading modalni yopish

                let errorMessage = "Noto‘g‘ri username yoki parol!";

                if (error.detail) {
                    errorMessage = error.detail;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                Swal.fire({
                    icon: "error",
                    title: "❌ Xatolik!",
                    text: errorMessage,
                    confirmButtonColor: "#d33",
                    confirmButtonText: "Yopish"
                });

                console.error("Error:", error);
            });
    });
});

document.getElementById("togglePassword").addEventListener("click", function() {
    let passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    } else {
        passwordField.type = "password";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    }
});

document.querySelectorAll('.clear-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        let input = this.previousElementSibling;
        input.value = ""; // Inputni tozalash
        input.focus(); // Inputga fokus berish
    });
});
