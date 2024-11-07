// selectOnOff 함수: 온라인/오프라인 선택 처리
function selectOnOff() {
    const onOffline = document.querySelectorAll(".is_online");
    let is_online = onOffline[0].getAttribute("name");  // 초기 상태값 가져오기

    onOffline.forEach((button) => {
        button.addEventListener("click", () => {
            // 이전 선택된 항목의 배경색 초기화
            onOffline.forEach((el) => el.style.backgroundColor = "");

            // 현재 클릭한 항목의 배경색 변경
            button.style.backgroundColor = "#d3d3d3";

            // 선택한 항목의 on_line 값 업데이트
            is_online = button.getAttribute("name");

            // is_online 상태로 데이터를 가져오기
            fetchData(is_online);
        });
    });
}

// categorize 객체는 location, category, on_line 정보를 관리
function getCategorize() {
    let location = document.querySelector(".location").innerText;
    let category = document.querySelector(".category").innerText;
    let onOffline = document.querySelectorAll(".is_online");
    let is_online = onOffline[0].getAttribute("name");  // 초기 상태값 가져오기

    // categorize 설정
    const categorize = [];

    categorize[0] = (location === "WHERE?") ? "*" : location;
    categorize[1] = (category === "WHAT?") ? "*" : category;
    categorize[2] = is_online;

    return categorize;
}

// showMoim 함수: 모임 정보 가져오기
async function showMoim() {
    try {
        const categorize = getCategorize();  // location, category, is_online 값 가져오기
        console.log("Categorize:", categorize);

        // fetchData 호출 시 categorize를 인자로 전달
        await fetchData(categorize);
    } catch (error) {
        console.error("Error initializing the script:", error);
    }
}

// fetchData 함수: 모임 정보 로드
async function fetchData(categorize) {
    try {
        console.log("Fetching data with categorize:", categorize);

        const response = await axios({
            method: "POST",  // POST 요청 사용
            url: "/moim/moims/get",
            data: {
                location: categorize[0],
                category: categorize[1],
                on_line: categorize[2],
            }
        });

        console.log(response);

        const data = response.data.data;
        const moimcount = response.data.moimcount;
        console.log(data, moimcount);

        const tbody = document.querySelector("tbody");
        let rows = '';

        for (let i = 0; i < data.length; i++) {
            let count = 0;
            for (let j = 0; j < moimcount.length; j++) {
                if (moimcount[j].moim_id === data[i].moim_id) {
                    count = moimcount[j].moim_count;
                }
            }

            rows += `
            <tr id="${data[i].moim_id}" onclick="location.href='/moim/${data[i].moim_id}'">
                <td>
                    <div class="moim_infoBox">
                        <div class="moim_title">
                            <span style="font-size: 20px; font-weight: 700;">${data[i].title}</span><br>
                            <span>(${count}/${data[i].max_people})</span>
                        </div>
                        <div class="locationDate">
                            <span>${data[i].location}</span>
                            <span><br>${data[i].even_date}</span>
                        </div>
                    </div>
                    <div class="moim_imgBox">
                        <img src="${data[i].represent_img}" alt="" id="moim_img" name="img_${i}">
                    </div>
                    <div class="online_${data[i].on_line}">on</div>
                </td>
            </tr>`;

            count = 0;
        }

        tbody.innerHTML = rows;

    } catch (error) {
        console.error("Failed to load meeting information:", error);
    }
}

// location 선택 처리
function selectLocation() {
    const categoryPopup = document.createElement("div");

    categoryPopup.style.cssText =
        'background-color: lightgrey; width: 100%; height: 50vh; z-index: 1; position: fixed; bottom: 0; overflow: scroll;';

    // 닫기 버튼 생성
    const closeButton = document.createElement("button");
    closeButton.innerText = "×";
    closeButton.style.cssText =
        'width: 30px; height: 30px; font-size: 30px; position: fixed; top: 50vh; right: 10px; cursor: pointer; background-color: rgb(0,0,0,0); color: black; border: none; border-radius: 100%;';

    // 닫기 버튼 클릭 시 팝업 닫기
    closeButton.addEventListener("click", () => {
        categoryPopup.remove();
        document.removeEventListener("click", closePopupOnClickOutside);
    });

    let location_list = [
        "WHERE?", "서울특별시", "부산광역시", "대구광역시", "인천광역시",
        "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
        "경기도", "강원도", "충청북도", "충청남도",
        "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"
    ];

    let location = ``;

    for (let i = 0; i < location_list.length; i++) {
        location += `<div class="location_item" data-index="${i}" style="padding: 10px; cursor: pointer;">
                        <span>${location_list[i]}</span>
                     </div>`;
    }

    categoryPopup.innerHTML = location;
    categoryPopup.prepend(closeButton);
    document.querySelector("section").append(categoryPopup);

    // 팝업 외부 클릭 시 닫기 함수
    function closePopupOnClickOutside(event) {
        if (!categoryPopup.contains(event.target)) {
            categoryPopup.remove();
            document.removeEventListener("click", closePopupOnClickOutside);
        }
    }

    // 팝업 외부 클릭 감지 이벤트 추가
    setTimeout(() => {
        document.addEventListener("click", closePopupOnClickOutside);
    }, 0); // 팝업 생성 이후 클릭 이벤트 등록

    // 모든 location_item 요소 선택
    const locationItems = document.querySelectorAll(".location_item");

    // 각 location_item에 클릭 이벤트 추가
    locationItems.forEach((item) => {
        item.addEventListener("click", function () {
            // 이전 선택된 항목의 배경색 초기화
            locationItems.forEach((el) => el.style.backgroundColor = "");

            // 현재 클릭한 항목의 배경색 변경
            this.style.backgroundColor = "#d3d3d3";

            // 선택한 항목의 인덱스에 해당하는 텍스트를 표시
            const selectedIndex = this.getAttribute("data-index");
            const text = document.querySelector(".location");
            text.innerHTML = location_list[selectedIndex];

            showMoim();
        });
    });
}

function selectCategory() {
    const categoryPopup = document.createElement("div");

    categoryPopup.style.cssText =
        'background-color: lightgrey; width: 100%; height: 50vh; z-index: 1; position: fixed; bottom: 0; overflow: scroll;';

    // 닫기 버튼 생성
    const closeButton = document.createElement("button");
    closeButton.innerText = "×";
    closeButton.style.cssText =
        'width: 30px; height: 30px; font-size: 30px; position: fixed; top: 50vh; right: 10px; cursor: pointer; background-color: rgb(0,0,0,0); color: black; border: none; border-radius: 100%;';

    // 닫기 버튼 클릭 시 팝업 닫기
    closeButton.addEventListener("click", () => {
        categoryPopup.remove();
        document.removeEventListener("click", closePopupOnClickOutside);
    });

    // 카테고리 목록 배열
    let category_list = [
        "WHAT?", "취미 & 여가", "운동 & 레저", "문화 & 예술",
        "학습 & 자기개발", "사회 & 네트워킹", "음식 & 요리",
        "환경 & 지속 가능성", "반려동물"
    ];

    let category = ``;

    // 카테고리 목록을 동적으로 추가
    for (let i = 0; i < category_list.length; i++) {
        category += `<div class="category_item" data-index="${i}" style="padding: 10px; cursor: pointer;">
                        <span>${category_list[i]}</span>
                     </div>`;
    }

    categoryPopup.innerHTML = category;
    categoryPopup.prepend(closeButton);
    document.querySelector("section").append(categoryPopup);

    // 팝업 외부 클릭 시 닫기 함수
    function closePopupOnClickOutside(event) {
        if (!categoryPopup.contains(event.target)) {
            categoryPopup.remove();
            document.removeEventListener("click", closePopupOnClickOutside);
        }
    }

    // 팝업 외부 클릭 감지 이벤트 추가
    setTimeout(() => {
        document.addEventListener("click", closePopupOnClickOutside);
    }, 0); // 팝업 생성 이후 클릭 이벤트 등록

    // 모든 category_item 요소 선택
    const categoryItems = document.querySelectorAll(".category_item");

    // 각 category_item에 클릭 이벤트 추가
    categoryItems.forEach((item) => {
        item.addEventListener("click", function () {
            // 이전 선택된 항목의 배경색 초기화
            categoryItems.forEach((el) => el.style.backgroundColor = "");

            // 현재 클릭한 항목의 배경색 변경
            this.style.backgroundColor = "#d3d3d3";

            // 선택한 항목의 인덱스에 해당하는 텍스트를 표시
            const selectedIndex = this.getAttribute("data-index");
            const text = document.querySelector(".category");
            text.innerHTML = category_list[selectedIndex];

            // 카테고리 선택 후 모임 정보를 갱신
            showMoim();
        });
    });
}
