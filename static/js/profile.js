// $(document).ready(function() {
//     let token = localStorage.getItem("token");
//     if (!token) {
//         alert("Please log in first!");
//         return;
//     }
    
//     $.ajax({
//         url: "http://127.0.0.1:8000/api/user/profile/",
//         type: "GET",
//         headers: { "Authorization": "Token " + token },
//         success: function(response) {
//             $("#username").text(response.username);
//             $("#email").text(response.email);
//             $("#full-name").text(response.first_name + " " + response.last_name);
//             if (response.profile_picture) {
//                 $("#profile-pic").attr("src", response.profile_picture);
//             }
//         },
//         error: function() {
//             alert("Failed to load profile data.");
//         }
//     });
// });

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
