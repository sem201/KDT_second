function selectLocation() {
    

    const categoryPopup = document.createElement("div");


    categoryPopup.style.cssText  = 
        'background-color: lightgrey; width: 100%; height: 50vh; z-index: 1; position: fixed; bottom: 0; overflow: scroll;';
    

    let location_list = [
        "서울특별시", "부산광역시", "대구광역시", "인천광역시",
        "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
        "경기도", "강원도", "충청북도", "충청남도",
        "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"
    ]

    // let location = `<ul>`;
    let location = ``;

    for(let i=0; i<location_list.length; i++){
        location += `<div style="padding: 5px"><span>${location_list[i]}</span></div>`;
    }

    // location += `</ul>`

    categoryPopup.innerHTML = location;

    document.querySelector("section").append(categoryPopup);
}

function selectCategory() {
    alert("selectCategory")
}

// 온라인, 오프라인 필터링하여 보여주는 함수
function filterMoim(onOff) {
    console.log(`${onOff}`);

}

