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

            showMoim(location_list[selectedIndex]);
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

    let category_list = [
        "WHAT?", "취미 & 여가", "운동 & 레저", "문화 & 예술",
        "학습 & 자기개발", "사회 & 네트워킹", "음식 & 요리",
        "환경 & 지속 가능성", "반려동물"
    ];

    let category = ``;

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


    // 모든 location_item 요소 선택
    const categoryItems = document.querySelectorAll(".category_item");

    // 각 location_item에 클릭 이벤트 추가
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
        });
    });
}


async function showMoim(location) {
    try {
        const response = await axios({
            method: "GET",
            url: "/moim/moims/get"
        });
        // JSON 데이터를 받기 위한 요청
        const data = response.data.data;
        console.log(data);

        const tbody = document.querySelector("tbody");
        let rows = '';  // 누적할 rows를 let으로 선언

        if (location === "WHERE?") {
            // 모든 모임을 표시
            for (let i = 0; i < data.length; i++) {
                rows += `
                <tr onclick="location.href='/moim/${data[i].moim_id}'">
                    <td>
                        <div class="moim_infoBox">
                            <div class="moim_title">
                                <span style="font-size: 20px; font-weight: 700;">${data[i].title}</span><br>
                                <span>(3/10)</span>
                            </div>
                            <div class="locationDate">
                                <span>${data[i].location}</span>
                                <span><br>${data[i].even_date}</span>
                            </div>
                        </div>
                        <div class="moim_imgBox">
                            <img src="${data[i].represent_img}" alt="" id="moim_img" name="img_${i}">
                        </div>
                    </td>
                </tr>`;
            }
        } else {
            // 특정 location의 모임만 표시
            for (let i = 0; i < data.length; i++) {
                if (data[i].location === location) {
                    rows += `
                    <tr onclick="location.href='/moim/${data[i].moim_id}'">
                        <td>
                            <div class="moim_infoBox">
                                <div class="moim_title">
                                    <span style="font-size: 20px; font-weight: 700;">${data[i].title}</span><br>
                                    <span>(3/10)</span>
                                </div>
                                <div class="locationDate">
                                    <span>${data[i].location}</span>
                                    <span><br>${data[i].even_date}</span>
                                </div>
                            </div>
                            <div class="moim_imgBox">
                                <img src="${data[i].represent_img}" alt="" id="moim_img" name="img_${i}">
                            </div>
                        </td>
                    </tr>`;
                }
            }
        }

        // tbody에 HTML 할당
        tbody.innerHTML = rows;

    } catch (error) {
        console.error("모임 정보를 불러오는데 실패했습니다:", error);
    }

}



// 온라인, 오프라인 필터링하여 보여주는 함수
function filterMoim(onOff) {
    console.log(`${onOff}`);

}
