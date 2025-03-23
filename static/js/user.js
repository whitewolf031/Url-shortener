document.addEventListener("DOMContentLoaded", function () {
    fetchUserUrls();
    });

    $(document).ready(function() {
        // Qisqartirish tugmachasiga bosilganda
        $("#shorten-btn").click(shortenURL);
    });

    function getAuthHeaders() {
        let token = localStorage.getItem("token");
        if (!token) {
            Swal.fire("Xatolik!", "Avval tizimga kiring!", "error");
            return {};
        }
        return { "Authorization": "Token " + token };
    }       

    function generateQRCode(shortLink, elementId) {
        let qrElement = document.getElementById(elementId);
        qrElement.innerHTML = ""; // Eski QR kodni tozalash
        new QRCode(qrElement, {
            text: shortLink,
            width: 50,
            height: 50,
            correctLevel: QRCode.CorrectLevel.L
        });
    }
    
    function fetchUserUrls() {        
        $.ajax({
            url: "http://127.0.0.1:8000/api/product/shorturldetails/",
            type: "GET",
            headers: getAuthHeaders(),
            success: function(response) {
                let urls = response.results || [];
                let urlsTableBody = $("#urls-table-body");
                urlsTableBody.empty();
                urls.forEach(url => {
                    let fullShortLink = `${url.short_link}`;
                    let row = `
                        <tr>
                            <td class="url-cells">
                                <a href="${fullShortLink}" target="_blank">${fullShortLink}</a>
                                <i class="fas fa-copy copy-icon" onclick="copyToClipboard(this)"></i>
                            </td>
                            <td class="url-cell">
                                <a href="${url.original_link}" target="_blank">${url.original_link}</a>
                                <i class="fas fa-copy copy-icon" onclick="copyToClipboard(this)"></i>
                            </td>
                            <td><div id="qr-${url.short_link}"></div></td>
                            <td>${url.clicks}</td>
                            <td class="${url.status ? 'text-success' : 'text-danger'}">${url.status ? 'Active' : 'Inactive'}</td>
                            <td>${new Date(url.created_at).toLocaleString()}</td>
                            <td>
                                <button class="btn btn-sm btn-light btn_edit" data-id="${url.id}" data-status="${url.status ? 'active' : 'inactive'}">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger btn_delete" data-id="${url.id}">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>`;
                    urlsTableBody.append(row);
                    generateQRCode(fullShortLink, `qr-${url.short_link}`);
                });

                countUserUrls();

                $(".btn_edit").click(function() {
                    editStatus(this);
                });
                $(".btn_delete").click(function() {
                    deleteUrl(this);
                });
            },
            error: function(xhr) {
                let errorMsg = xhr.responseJSON?.detail || "Noma'lum xatolik yuz berdi!";
                Swal.fire("Xatolik!", errorMsg, "error");
            }
        });
    }

    function copyToClipboard(element) {
        let text = $(element).prev("a").attr("href"); // Oldingi <a> ichidagi hrefni olamiz
        navigator.clipboard.writeText(text).then(() => {
            Swal.fire("Nusxalandi!", "URL nusxalandi.", "success");
        }).catch(err => {
            Swal.fire("Xatolik!", "URL nusxalanmadi!", "error");
        });
    }    

    function editStatus(button) {
    let urlId = $(button).data("id");
    let currentStatus = $(button).data("status") === "active";
    
    Swal.fire({
        title: "Statusni o'zgartirish",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Saqlash",
        cancelButtonText: "Bekor qilish",
        html: `
            <p>Yangi statusni tanlang:</p>
            <label class="swal2-radio">
                <input type="radio" name="status" value="active" ${currentStatus ? 'checked' : ''}> Active
            </label>
            <label class="swal2-radio">
                <input type="radio" name="status" value="inactive" ${!currentStatus ? 'checked' : ''}> Inactive
            </label>
        `,
        preConfirm: () => {
            let selectedStatus = document.querySelector('input[name="status"]:checked');
            if (!selectedStatus) {
                Swal.showValidationMessage("Iltimos, statusni tanlang!");
                return false;
            }
            return selectedStatus.value;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let newStatus = result.value === "active";  // ✅ to'g'ri boolean qiymatga aylantirildi
            
            $.ajax({
                url: `http://127.0.0.1:8000/api/product/shorturldetails/${urlId}/`,
                type: "PATCH",
                headers: { "Content-Type": "application/json", ...getAuthHeaders() },
                data: JSON.stringify({ status: newStatus }),  // ✅ Statusni boolean sifatida jo'natamiz
                success: function() {
                    fetchUserUrls();
                    Swal.fire("Muvaffaqiyatli!", "Status yangilandi.", "success");
                },
                error: function(xhr) {
                    let errorMsg = xhr.responseJSON?.detail || "Xatolik yuz berdi!";
                    Swal.fire("Xatolik!", errorMsg, "error");
                }
            });
        }
    });
}
    function deleteUrl(button) {
        let urlId = $(button).data("id");
        
        Swal.fire({
            title: "Haqiqatan ham o'chirmoqchimisiz?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ha, o'chir!",
            cancelButtonText: "Bekor qilish"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://127.0.0.1:8000/api/product/shorturldetails/${urlId}/`,
                    type: "DELETE",
                    headers: getAuthHeaders(),
                    success: function() {
                        fetchUserUrls();
                    },
                    error: function(xhr) {
                        let errorMsg = xhr.responseJSON?.detail || "Xatolik yuz berdi!";
                        Swal.fire("Xatolik!", errorMsg, "error");
                    }
                });
            }
        });
    }  
    // ✅ Foydalanuvchining URL'lari sonini hisoblash
    function countUserUrls() {
        let urlCount = $("#urls-table-body tr").length; // Jadvaldagi qatorlar sonini olish
        $("#url-count").text(urlCount); // Natijani ekranga chiqarish
    }

    function shortenURL() {
        let token = localStorage.getItem("token");
        if (!token) {
            Swal.fire("Xatolik!", "Avval tizimga kiring!", "error");
            return;
        }

        let originalLink = $("#inputshortener").val();
        if (!originalLink) {
            Swal.fire("Xatolik!", "Iltimos, URL kiriting!", "error");
            return;
        }

        $.ajax({
            url: "http://127.0.0.1:8000/api/shorten/",
            type: "POST",
            headers: {
                "Authorization": "Token " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ original_link: originalLink }),
            success: function(response) {
                Swal.fire("Muvaffaqiyatli!", "URL muvaffaqiyatli qisqartirildi!", "success");
                fetchUserUrls(); // ✅ Ro‘yxatni yangilash
            },
            error: function(xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Noto‘g‘ri URL!",
                    text: "Iltimos, URL ni tekshirib qaytadan urining.",
                });
            }
        });
    }

    $(document).ready(function() {
        let token = localStorage.getItem("token");
        let user_name = localStorage.getItem("username");


        // 🔹 Sahifa yuklanganda foydalanuvchi nomini chiqarish
        if (user_name) {
            $("#username-display").text(user_name);
            $("#user-name").text(user_name);
        } else {
            $("#username-display").text("Mehmon");
            $("#user-name").text("Mehmon");
        }

        // 🔹 Dropdown toggling
        $("#toggle-dropdown").click(function() {
            $("#user-dropdown").toggle();
        });

        // 🔹 Logout bosilganda
        $("#logout-btn").click(function(e) {
            e.preventDefault();

            $.ajax({
                url: "http://127.0.0.1:8000/api/logout/", // 🔹 Backendga logout so‘rovi yuborish
                type: "POST",
                headers: { "Authorization": "Token " + token },
                success: function() {
                    localStorage.removeItem("token"); // 🔹 Tokenni o‘chirish
                    localStorage.removeItem("username"); // 🔹 Username'ni ham o‘chirish
                    window.location.href = "login.html"; // 🔹 Login sahifasiga yo‘naltirish
                },
                error: function() {
                    alert("Logout muvaffaqiyatsiz!");
                }
            });
        });

        // 🌟 Sahifadan tashqariga bosilganda dropdown yopish
    $(document).click(function(event) {
            if (!$(event.target).closest('.user-info').length) {
                $("#user-dropdown").hide();
            }
        });
    });

    //---------------------------------------------Filter-------------------------------------------------
    $(document).ready(function () {
        fetchUserUrls();
    
        $("#filter-button").click(function () {
            Swal.fire({
                title: "Filtrlash",
                html: `
                    <div>
                        <label for="searchInput_short">Search by Short Link:</label>
                        <input type="text" id="searchInput_short" class="form-control" placeholder="Enter your Short Link">
                    </div>
                    <div>
                        <label for="searchInput_origin">Search by Origin Link:</label>
                        <input type="text" id="searchInput_origin" class="form-control" placeholder="Enter your Origin Link">
                    </div>
                    <div>
                        <label>Date:</label>
                        <input type="date" id="dateFilter" class="form-control">
                    </div>
                    <div>
                        <label>Status:</label>
                        <select id="statusFilter" class="form-control">
                            <option value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: "Filtrlash",
                cancelButtonText: "Bekor qilish",
            }).then((result) => {
                if (result.isConfirmed) {
                    let filters = {
                        search_short: $("#searchInput_short").val(),
                        search_origin: $("#searchInput_origin").val(),
                        created_at: $("#dateFilter").val(),
                        status: $("#statusFilter").val(),
                    };
                    localStorage.setItem("filters", JSON.stringify(filters));
                    fetchFilteredData(filters);
                }
            });
        });
    });
    
    function fetchFilteredData(filters) {
        $.ajax({
            url: "http://127.0.0.1:8000/api/product/shorturldetails/",
            type: "GET",
            headers: getAuthHeaders(),
            data: filters,
            success: function (data) {
                console.log("API Response:", data);  // Konsolga chiqarish
                renderTable(data.results);
            },
            error: function () {
                Swal.fire("❌ Xatolik!", "Ma'lumotlarni yuklashda xatolik yuz berdi!", "error");
            }
        });
    }
    
    function renderTable(urls) {
        let tableBody = $("#urls-table-body");
        tableBody.empty();
    
        if (!urls || urls.length === 0) {
            tableBody.append("<tr><td colspan='6' class='text-center'>Ma'lumot topilmadi</td></tr>");
            return;
        }
    
        urls.forEach((url) => {
            let shortUrl = url.short_link ? url.short_link : "Noma’lum";
            let originUrl = url.original_link ? url.original_link : "Noma’lum";
            let status = url.status ? "Active" : "Inactive";
            let createdAt = url.created_at ? url.created_at : "Noma’lum";
            let clicks = url.clicks !== undefined ? url.clicks : 0;
    
            let row = `
                <tr>
                    <td><a href="${shortUrl}" target="_blank">${shortUrl}</a></td>
                    <td><a href="${originUrl}" target="_blank">${originUrl}</a></td>
                    <td id="qr-${url.id}"></td> <!-- QR kod uchun joy -->
                    <td>${clicks}</td>
                    <td class="${url.status ? 'text-success' : 'text-danger'}">${status}</td>
                    <td>${createdAt}</td>
                    <td>
                        <button class="btn btn-sm btn-light btn_edit" data-id="${url.id}" data-status="${status}">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn_delete" data-id="${url.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.append(row);
    
            // QR kodni yaratish
            generateQRCode(url.id, shortUrl);
        });
    
        Swal.fire("✅ Filtrlash yakunlandi!", "Tanlangan mezonlar bo‘yicha natijalar ko‘rsatildi.", "success");
    }
    
    function generateQRCode(id, shortUrl) {
        let qrElement = document.getElementById(`qr-${id}`);
        qrElement.innerHTML = "";
    
        if (shortUrl !== "Noma’lum") {
            let qr = new QRCode(qrElement, {
                text: shortUrl,
                width: 50,
                height: 50
            });
        } else {
            qrElement.innerText = "No QR";
        }
    }    

    $(document).ready(function () {
        setTimeout(function () {
            $("#toggle-dropdown").html($("#user-name").text() + " &#9662;");  
        }, 60000);  // 60,000 ms = 1 daqiqa
    });