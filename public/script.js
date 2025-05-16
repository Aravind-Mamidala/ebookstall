document.addEventListener("DOMContentLoaded", () => {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const menuIcon = document.querySelector("#menu-icon");
    const menuCloseIcon = document.querySelector("#menu-close-icon");

    if (menuIcon && menuCloseIcon && hamburgerMenu) {
        menuIcon.addEventListener("click", () => {
            hamburgerMenu.style.left = "0";  // Open menu
            hamburgerMenu.style.opacity = "1";
        });

        menuCloseIcon.addEventListener("click", () => {
            hamburgerMenu.style.left = "-100%";  // Close menu
            hamburgerMenu.style.opacity = "0";
        });

        console.log("✅ Navbar menu toggling enabled!");
    } else {
        console.error("❌ Navbar elements not found!");
    }
});


    // SWIPER FIX
    const swiper = new Swiper(".mySwiper", {
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
    document.addEventListener("DOMContentLoaded", function () {
        console.log("✅ Script loaded!");
    
        document.querySelectorAll(".add-to-wishlist-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const bookId = this.dataset.bookId; 
                console.log("✅ Wishlist button clicked for book:", bookId);
    
                try {
                    const response = await fetch(`/wishlist/add/${bookId}`, {
                        method: "POST",
                    });
    
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message || "Failed to add to wishlist");
    
                    // ✅ Fix: Use `style.background` Instead of `backgroundColor`
                    Toastify({
                        text: data.message || "Book added to wishlist!",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" } // ✅ FIXED
                    }).showToast();
    
                } catch (error) {
                    console.error("❌ Error adding book:", error);
    
                    Toastify({
                        text: "Error adding book to wishlist!",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: { background: "linear-gradient(to right, #ff0000, #ff8000)" } // ✅ FIXED
                    }).showToast();
                }
            });
        });
    });
    