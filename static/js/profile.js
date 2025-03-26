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

$(document).ready(function () {
    // Profil bosilganda modal oynani ochish
    $("#openModal").click(function () {
        $("#profileModal").fadeIn();

        // Foydalanuvchi ma'lumotlari
        $("#modalName").text("John Doe");
        $("#modalEmail").text("johndoe@example.com");
        $("#modalAge").text("28");
    });

    // Modal oynani yopish
    $(".close").click(function () {
        $("#profileModal").fadeOut();
    });

    // Modal tashqarisiga bosilganda ham yopish
    $(window).click(function (event) {
        if (event.target.id === "profileModal") {
            $("#profileModal").fadeOut();
        }
    });
});
