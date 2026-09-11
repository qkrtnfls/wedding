// =========================
// Supabase 연결
// =========================

const SUPABASE_URL =
    "https://aknsbmazbypsziykplch.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_6pqaN-jFjW4VkfFx9DHDRg_wYp_E-2A";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// =========================
// 요소 가져오기
// =========================

const groomInput =
    document.getElementById("groom");

const brideInput =
    document.getElementById("bride");

const groomPhotoInput =
    document.getElementById("groom-photo");

const bridePhotoInput =
    document.getElementById("bride-photo");

const groomPreview =
    document.getElementById("groom-preview");

const bridePreview =
    document.getElementById("bride-preview");

const weddingDateInput =
    document.getElementById("wedding-date");

const weddingTimeInput =
    document.getElementById("wedding-time");

const makeButton =
    document.getElementById("make-invitation");

const setupPage =
    document.getElementById("setup-page");

const invitation =
    document.getElementById("invitation");

const specialVideo =
    document.getElementById("special-couple-video");


// =========================
// 현재 청첩장 ID
// =========================

let currentInvitationId = null;


// =========================
// 사진 미리보기
// =========================

groomPhotoInput.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        if (file) {

            groomPreview.src =
                URL.createObjectURL(file);

            groomPreview.style.display =
                "block";
        }

    }
);


bridePhotoInput.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        if (file) {

            bridePreview.src =
                URL.createObjectURL(file);

            bridePreview.style.display =
                "block";
        }

    }
);


// =========================
// 날짜 형식
// =========================

function formatDate(dateValue) {

    const date =
        new Date(dateValue);

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}. ${month}. ${day}`;
}


// =========================
// 요일
// =========================

function getDayName(dateValue) {

    const date =
        new Date(dateValue);

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
// 시간 형식
// =========================

function formatTime(timeValue) {

    const [hour, minute] =
        timeValue.split(":");

    let hourNumber =
        Number(hour);

    const ampm =
        hourNumber >= 12
            ? "PM"
            : "AM";

    if (hourNumber === 0) {

        hourNumber = 12;

    } else if (hourNumber > 12) {

        hourNumber -= 12;
    }

    return `${ampm} ${hourNumber}:${minute}`;
}


// =========================
// 사진 업로드
// =========================

async function uploadPhoto(
    file,
    invitationId,
    type
) {

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    const filePath =
        `${invitationId}/${type}.${extension}`;


    const { error } =
        await supabaseClient
            .storage
            .from("wedding-photos")
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: true,
                    contentType: file.type
                }
            );


    if (error) {

        console.error(
            "사진 업로드 오류:",
            error
        );

        throw error;
    }


    const { data } =
        supabaseClient
            .storage
            .from("wedding-photos")
            .getPublicUrl(filePath);


    return data.publicUrl;
}


// =========================
// 청첩장 만들기
// =========================

makeButton.addEventListener(
    "click",
    async function (event) {

        event.preventDefault();

        const groomName =
            groomInput.value.trim();

        const brideName =
            brideInput.value.trim();

        const groomPhoto =
            groomPhotoInput.files[0];

        const bridePhoto =
            bridePhotoInput.files[0];

        const weddingDate =
            weddingDateInput.value;

        const weddingTime =
            weddingTimeInput.value;


        // -------------------------
        // 입력값 확인
        // -------------------------

        if (!groomName || !brideName) {

            alert(
                "신랑과 신부 이름을 모두 입력해주세요!"
            );

            return;
        }


        if (!weddingDate) {

            alert(
                "결혼 날짜를 선택해주세요!"
            );

            return;
        }


        if (!weddingTime) {

            alert(
                "예식 시간을 선택해주세요!"
            );

            return;
        }


        if (!groomPhoto || !bridePhoto) {

            alert(
                "신랑과 신부 사진을 모두 선택해주세요!"
            );

            return;
        }


        makeButton.disabled = true;

        makeButton.textContent =
            "청첩장 만드는 중...";


        try {

            // -------------------------
            // 새로운 청첩장 ID 생성
            // -------------------------

            const invitationId =
                crypto.randomUUID();


            // -------------------------
            // 사진 업로드
            // -------------------------

            const groomPhotoUrl =
                await uploadPhoto(
                    groomPhoto,
                    invitationId,
                    "groom"
                );


            const bridePhotoUrl =
                await uploadPhoto(
                    bridePhoto,
                    invitationId,
                    "bride"
                );


            // -------------------------
            // Supabase에 저장
            // -------------------------

            const { data, error } =
                await supabaseClient
                    .from("invitations")
                    .insert({

                        id: invitationId,

                        groom_name:
                            groomName,

                        bride_name:
                            brideName,

                        wedding_date:
                            weddingDate,

                        wedding_time:
                            weddingTime,

                        groom_photo_url:
                            groomPhotoUrl,

                        bride_photo_url:
                            bridePhotoUrl

                    })
                    .select()
                    .single();


            if (error) {

                console.error(
                    "청첩장 저장 오류:",
                    error
                );

                throw error;
            }


            // 현재 청첩장 ID 저장

            currentInvitationId =
                data.id;


            // -------------------------
            // ⭐ 공유용 주소 생성
            // -------------------------

            const invitationUrl =
                `${window.location.origin}/?id=${data.id}`;


            console.log(
                "청첩장 공유 주소:",
                invitationUrl
            );


            // -------------------------
            // ⭐ 주소로 이동
            // -------------------------

            window.location.href =
                invitationUrl;


        } catch (error) {

            console.error(
                "청첩장 제작 오류:",
                error
            );


            alert(
                "청첩장을 만드는 중 오류가 발생했어요.\n\n" +
                error.message
            );


        } finally {

            makeButton.disabled = false;

            makeButton.textContent =
                "청첩장 만들기";
        }

    }
);


// =========================
// 청첩장 불러오기
// =========================

async function loadInvitation(
    invitationId
) {

    const { data, error } =
        await supabaseClient
            .from("invitations")
            .select("*")
            .eq("id", invitationId)
            .single();


    if (error) {

        console.error(
            "청첩장 불러오기 오류:",
            error
        );

        alert(
            "청첩장을 찾을 수 없어요."
        );

        return;
    }


    currentInvitationId =
        data.id;


    showInvitation(data);
}


// =========================
// 청첩장 화면 표시
// =========================

function showInvitation(data) {

    const groomName =
        data.groom_name;

    const brideName =
        data.bride_name;

    const weddingDate =
        data.wedding_date;

    const weddingTime =
        data.wedding_time;


    // -------------------------
    // 이름
    // -------------------------

    document.getElementById(
        "groom-name"
    ).textContent =
        groomName;


    document.getElementById(
        "bride-name"
    ).textContent =
        brideName;


    document.getElementById(
        "groom-name-2"
    ).textContent =
        groomName;


    document.getElementById(
        "bride-name-2"
    ).textContent =
        brideName;


    // -------------------------
    // 특별 영상
    // -------------------------

    if (
        groomName === "박원빈" &&
        brideName === "이소희"
    ) {

        specialVideo.style.display =
            "block";

    } else {

        specialVideo.style.display =
            "none";
    }


    // -------------------------
    // 날짜
    // -------------------------

    const formattedDate =
        formatDate(weddingDate);


    document.getElementById(
        "wedding-date-result"
    ).textContent =
        formattedDate;


    document.getElementById(
        "wedding-date-result-2"
    ).textContent =
        formattedDate;


    // -------------------------
    // 요일 + 시간
    // -------------------------

    const dayName =
        getDayName(weddingDate);

    const formattedTime =
        formatTime(weddingTime);


    document.getElementById(
        "wedding-time-result"
    ).textContent =
        `${dayName} ${formattedTime}`;


    // -------------------------
    // 사진
    // -------------------------

    document.getElementById(
        "groom-photo-result"
    ).src =
        data.groom_photo_url;


    document.getElementById(
        "bride-photo-result"
    ).src =
        data.bride_photo_url;


    // -------------------------
    // 화면 전환
    // -------------------------

    setupPage.classList.add(
        "hidden"
    );

    invitation.classList.remove(
        "hidden"
    );


    // -------------------------
    // 맨 위로
    // -------------------------

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    // -------------------------
    // 타이핑
    // -------------------------

    startTyping();


    // -------------------------
    // 방명록
    // -------------------------

    loadGuestbook(data.id);
}


// =========================
// 타이핑 애니메이션
// =========================

function startTyping() {

    const text =
        "OUR WEDDING DAY";

    const typingText =
        document.getElementById(
            "typing-text"
        );

    typingText.textContent =
        "";

    let index = 0;


    const typing =
        setInterval(
            function () {

                typingText.textContent +=
                    text[index];

                index++;


                if (
                    index >= text.length
                ) {

                    clearInterval(
                        typing
                    );
                }

            },
            120
        );
}


// =========================
// 배경음악
// =========================

const musicButton =
    document.getElementById(
        "music-button"
    );

const weddingMusic =
    document.getElementById(
        "wedding-music"
    );

let musicPlaying = false;


musicButton.addEventListener(
    "click",
    function () {

        if (!musicPlaying) {

            weddingMusic.play();

            musicButton.textContent =
                "🔊";

            musicPlaying = true;

        } else {

            weddingMusic.pause();

            musicButton.textContent =
                "♫";

            musicPlaying = false;
        }

    }
);


// =========================
// 방명록
// =========================

const guestNameInput =
    document.getElementById(
        "guest-name"
    );

const guestMessageInput =
    document.getElementById(
        "guest-message"
    );

const guestbookSubmit =
    document.getElementById(
        "guestbook-submit"
    );

const guestbookList =
    document.getElementById(
        "guestbook-list"
    );


// =========================
// 방명록 불러오기
// =========================

async function loadGuestbook(
    invitationId
) {

    if (!invitationId) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("guestbook")
            .select(
                "id, name, message, created_at"
            )
            .eq(
                "invitation_id",
                invitationId
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "방명록 불러오기 오류:",
            error
        );

        return;
    }


    guestbookList.innerHTML =
        "";


    data.forEach(
        function (item) {

            const article =
                document.createElement(
                    "article"
                );

            article.className =
                "guestbook-item";


            const name =
                document.createElement(
                    "strong"
                );

            name.className =
                "guest-name";

            name.textContent =
                item.name;


            const date =
                document.createElement(
                    "span"
                );

            date.className =
                "guest-date";

            date.textContent =
                new Date(
                    item.created_at
                ).toLocaleDateString(
                    "ko-KR"
                );


            const message =
                document.createElement(
                    "p"
                );

            message.className =
                "guest-message";

            message.textContent =
                item.message;


            article.appendChild(
                name
            );

            article.appendChild(
                date
            );

            article.appendChild(
                message
            );


            guestbookList.appendChild(
                article
            );

        }
    );
}


// =========================
// 방명록 등록
// =========================

guestbookSubmit.addEventListener(
    "click",
    async function () {

        const name =
            guestNameInput.value.trim();

        const message =
            guestMessageInput.value.trim();


        if (!name || !message) {

            alert(
                "이름과 메시지를 모두 입력해주세요!"
            );

            return;
        }


        if (!currentInvitationId) {

            alert(
                "청첩장 정보를 찾을 수 없어요."
            );

            return;
        }


        guestbookSubmit.disabled =
            true;


        const { error } =
            await supabaseClient
                .from("guestbook")
                .insert({

                    name:
                        name,

                    message:
                        message,

                    invitation_id:
                        currentInvitationId

                });


        if (error) {

            console.error(
                "방명록 등록 오류:",
                error
            );


            alert(
                "방명록 등록에 실패했어요."
            );

        } else {

            guestNameInput.value =
                "";

            guestMessageInput.value =
                "";


            await loadGuestbook(
                currentInvitationId
            );
        }


        guestbookSubmit.disabled =
            false;

    }
);


// =========================
// 청첩장 공유
// =========================

const shareButton =
    document.getElementById(
        "share-button"
    );


shareButton.addEventListener(
    "click",
    async function () {

        const invitationUrl =
            window.location.href;


        // 모바일 / 지원 브라우저
        if (navigator.share) {

            try {

                await navigator.share({

                    title:
                        "우리의 결혼식에 초대합니다",

                    text:
                        "저희 결혼식에 초대합니다 💍",
                    url:
                        invitationUrl

                });

            } catch (error) {

                // 사용자가 공유창을 닫은 경우
                if (
                    error.name !==
                    "AbortError"
                ) {

                    console.error(
                        "공유 오류:",
                        error
                    );
                }
            }


        // 공유 기능을 지원하지 않는 경우
        } else {

            try {

                await navigator.clipboard.writeText(
                    invitationUrl
                );


                alert(
                    "청첩장 링크가 복사되었습니다!"
                );


            } catch (error) {

                prompt(
                    "아래 링크를 복사해주세요.",
                    invitationUrl
                );
            }
        }

    }
);


// =========================
// 페이지 처음 열었을 때
// =========================

async function initializePage() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const invitationId =
        params.get("id");


    console.log(
        "현재 청첩장 ID:",
        invitationId
    );


    if (invitationId) {

        await loadInvitation(
            invitationId
        );
    }
}


initializePage();
