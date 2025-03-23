$('#register').on('click', function (event) {
    event.preventDefault();

        $.ajax({
            url: 'http://127.0.0.1:8000/api/registration/',
            type: 'POST',
            data: {
                username: $('#register_username').val(),
                email: $('#email').val(),
                first_name: $('#first_name').val(),
                last_name: $('#last_name').val(),
                password: $('#password').val(),
                confirm_password: $('#confirm_password').val()
            },
            success: function (response) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Registration successful',
                    icon: 'success',
                    timer: 2000, // 2 sekunddan keyin o'chadi
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "login.html";
                    // Перенаправление на страницу входа
                });
            },
            error: function (xhr) {
                let errorMessage = 'Something went wrong!';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage = xhr.responseJSON.error;
                }
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error'
                });
            }
        });
    });

     // Parolni ko'rsatish yoki yashirish
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

    document.getElementById("toggleConfirmPassword").addEventListener("click", function() {
        let confirmPasswordField = document.getElementById("confirm_password");
        if (confirmPasswordField.type === "password") {
            confirmPasswordField.type = "text";
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
        } else {
            confirmPasswordField.type = "password";
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
    