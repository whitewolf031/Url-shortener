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

function copyToClipboard(icon) {
    let container = icon.parentElement;
    let text = container.querySelector(".short-link").textContent;
    let copiedText = container.querySelector(".copied");

    navigator.clipboard.writeText(text).then(() => {
        copiedText.style.display = "inline";
        setTimeout(() => {
            copiedText.style.display = "none";
        }, 1500);
    }).catch(err => console.error("Copy failed", err));
}

// Short qilish
$(document).ready(function() {
$(".url-container").hide();  // Dastlab natija bo‘limini yashirish

$("#shorten-btn").click(function() {
    let originalLink = $("#inputshortener").val();
    if (!originalLink) {
        alert("Please enter a URL!");
        return;
    }

    $.ajax({
        url: "http://127.0.0.1:8000/api/shorten/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ original_link: originalLink }),
        success: function(response) {
            let shortUrl = "http://127.0.0.1:8000/api/" + response.short_link;
            
            $("#short-url").val(shortUrl);
            $(".url-container").fadeIn();  // Natija bo‘limini ko‘rsatish

            // 10 daqiqadan (600000 millisekund) keyin yashirish
            setTimeout(function() {
                $(".url-container").fadeOut();
            }, 300000);
        },
        error: function(xhr) {
            Swal.fire({
                icon: "error",
                title: "Invalid URL!",
                text: "Please check the URL and try again.",
            });
        }
    });
});

// Nusxalash tugmachasini bosganda URL ni clipboardga nusxalash
$("#copy-btn").click(function() {
    let copyText = $("#short-url").val();
    navigator.clipboard.writeText(copyText).then(() => {
        Swal.fire("Copied!", "Shortened URL copied to clipboard!", "success");
    }).catch(err => console.error("Copy failed", err));
});
});