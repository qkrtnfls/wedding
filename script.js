// =========================
// 요소 가져오기
// =========================

const groomInput = document.getElementById("groom");
const brideInput = document.getElementById("bride");

const groomPhotoInput = document.getElementById("groom-photo");
const bridePhotoInput = document.getElementById("bride-photo");

const groomPreview = document.getElementById("groom-preview");
const bridePreview = document.getElementById("bride-preview");

const weddingDateInput = document.getElementById("wedding-date");
const weddingTimeInput = document.getElementById("wedding-time");

const makeButton = document.getElementById("make-invitation");

const setupPage = document.getElementById("setup-page");
const invitation = document.getElementById("invitation");


// =========================
// 신랑 사진 미리보기
// =========================

groomPhotoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const imageURL = URL.createObjectURL(file);

        groomPreview.src = imageURL;
        groomPreview.style.display = "block";
    }

});


// =========================
// 신부 사진 미리보기
// =========================

bridePhotoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const imageURL = URL.createObjectURL(file);

        bridePreview.src = imageURL;
        bridePreview.style.display = "block";
    }

});


// =========================
// 날짜 표시 형식 변경
// 2026-10-24
// ↓
// 2026. 10. 24
// =========================

function formatDate(dateValue) {

    const date = new Date(dateValue);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}. ${month}. ${day}`;
}


// =========================
// 요일 구하기
// =========================

function getDayName(dateValue) {

    const date = new Date(dateValue);

    const days = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
    ];

    return days[date.getDay()];
}


// =========================
// 시간 표시 형식 변경
// 12:00
// ↓
// PM 12:00
// =========================

function formatTime(timeValue) {

    const [hour, minute] = timeValue.split(":");

    let hourNumber = Number(hour);

    const ampm = hourNumber >= 12 ? "PM" : "AM";

    if (hourNumber === 0) {
        hourNumber = 12;
    } else if (hourNumber > 12) {
        hourNumber -= 12;
    }

    return `${ampm} ${hourNumber}:${minute}`;
}


// =========================
// 청첩장 만들기
// =========================

makeButton.addEventListener("click", function () {

    const groomName = groomInput.value.trim();
    const brideName = brideInput.value.trim();

    const groomPhoto = groomPhotoInput.files[0];
    const bridePhoto = bridePhotoInput.files[0];

    const weddingDate = weddingDateInput.value;
    const weddingTime = weddingTimeInput.value;


    // =========================
    // 이름 확인
    // =========================

    if (!groomName || !brideName) {

        alert("신랑과 신부 이름을 모두 입력해주세요!");

        return;
    }


    // =========================
    // 날짜 확인
    // =========================

    if (!weddingDate) {

        alert("결혼 날짜를 선택해주세요!");

        return;
    }


    // =========================
    // 시간 확인
    // =========================

    if (!weddingTime) {

        alert("예식 시간을 선택해주세요!");

        return;
    }


    // =========================
    // 사진 확인
    // =========================

    if (!groomPhoto || !bridePhoto) {

        alert("신랑과 신부 사진을 모두 선택해주세요!");

        return;
    }


    // =========================
    // 이름 넣기
    // =========================

    document.getElementById("groom-name").textContent =
        groomName;

    document.getElementById("bride-name").textContent =
        brideName;

    document.getElementById("groom-name-2").textContent =
        groomName;

    document.getElementById("bride-name-2").textContent =
        brideName;


    // =========================
    // 날짜 넣기
    // =========================

    const formattedDate = formatDate(weddingDate);

    document.getElementById("wedding-date-result").textContent =
        formattedDate;

    document.getElementById("wedding-date-result-2").textContent =
        formattedDate;


    // =========================
    // 요일 + 시간 넣기
    // =========================

    const dayName = getDayName(weddingDate);
    const formattedTime = formatTime(weddingTime);

    document.getElementById("wedding-time-result").textContent =
        `${dayName} ${formattedTime}`;


    // =========================
    // 사진 넣기
    // =========================

    document.getElementById("groom-photo-result").src =
        URL.createObjectURL(groomPhoto);

    document.getElementById("bride-photo-result").src =
        URL.createObjectURL(bridePhoto);


    // =========================
    // 제작 화면 숨기기
    // =========================

    setupPage.classList.add("hidden");

    invitation.classList.remove("hidden");


    // =========================
    // 첫 화면으로 이동
    // =========================

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    // =========================
    // 타이핑 애니메이션
    // =========================

    startTyping();

});


// =========================
// 타이핑 애니메이션
// =========================

function startTyping() {

    const text = "OUR WEDDING DAY";

    const typingText =
        document.getElementById("typing-text");

    typingText.textContent = "";

    let index = 0;

    const typing = setInterval(function () {

        typingText.textContent += text[index];

        index++;

        if (index >= text.length) {

            clearInterval(typing);

        }

    }, 120);

}
// =========================
// 배경음악
// =========================

const musicButton = document.getElementById("music-button");
const weddingMusic = document.getElementById("wedding-music");

let musicPlaying = false;

musicButton.addEventListener("click", function () {

    if (!musicPlaying) {

        weddingMusic.play();

        musicButton.textContent = "🔊";

        musicPlaying = true;

    } else {

        weddingMusic.pause();

        musicButton.textContent = "♫";

        musicPlaying = false;

    }

});