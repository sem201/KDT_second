function selectMoim(src) {
  // Remove 'active' class from all items in button-box
  document
    .querySelectorAll(".button-box div")
    .forEach((el) => el.classList.remove("active"));

  // Add 'active' class to the clicked element
  src.classList.add("active");

  // Call functions based on the clicked element's class
  if (src.className.includes("attending")) {
    participatingMoim();
  } else if (src.className.includes("attended")) {
    participatedMoim();
  } else if (src.className.includes("dibs_moim")) {
    dibsMoim();
  }
}

async function dibsMoim() {
  const { data } = await axios({
    method: "GET",
    url: "/moim/moims/dibs",
  });

  console.log(data.data);

  showTable(data.data);
}

async function participatingMoim() {
  const { data } = await axios({
    method: "GET",
    url: "/user/participating",
  });

  console.log(data);

  showTable(data);
}

async function participatedMoim() {
  const { data } = await axios({
    method: "GET",
    url: "/user/participated",
  });

  console.log(data);

  showTable(data);
}

function showTable(data) {
  // const tbody = document.querySelector("tbody");

  // if (data) {
  //   let row = ``;

  //   for (let i = 0; i < data.length; i++) {
  //     if (i % 2 === 0) {
  //       row += `<tr>`;
  //     }
  //     row += `<td>
  //                 <div class="content" onclick="location.href='/moim/moim_detail/${data[i].moim_id}'">
  //                   <div class="title">${data[i].title}</div>
  //                   <img src="${data[i].represent_img}" alt="" />
  //                 </div>
  //               </td>`;

  //     if ((i + 1) % 2 === 0) {
  //       row += `</tr>`;
  //     }
  //   }
  //   if (data.length % 2 != 0) {
  //     row += `<td></td><tr>`;
  //   }
  //   console.log(row);
  //   tbody.innerHTML = row;
  // }

  const tbody = document.querySelector("tbody");
  let rows = "";

  for (let i = 0; i < data.length; i++) {
    let count = 0;
    let img = "/" + data[i].represent_img;

    if (data[i].location === null) {
      rows += `
                        <tr id="${data[i].moim_id}" onclick="location.href='/moim/moim_detail/${data[i].moim_id}'">
                            <td>
                                <div class="moim_infoBox">
                                    <div class="moim_title">
                                        <span style="font-size: 20px; font-weight: 700;">${data[i].title}</span><br>
                                    </div>
                                    <div class="locationDate">
                                        <span><br>${data[i].even_date}</span>
                                    </div>
                                </div>
                                <div class="moim_imgBox">
                                    <img src="${img}" alt="" id="moim_img" name="img_${i}">
                                    <div class="online_${data[i].on_line}">on</div>
                                </div>
                            </td>
                        </tr>`;
    } else {
      rows += `
                        <tr id="${data[i].moim_id}" onclick="location.href='/moim/moim_detail/${data[i].moim_id}'">
                            <td>
                                <div class="moim_infoBox">
                                    <div class="moim_title">
                                        <span style="font-size: 20px; font-weight: 700;">${data[i].title}</span><br>
                                    </div>
                                    <div class="locationDate">
                                        <span>${data[i].location}</span>
                                        <span><br>${data[i].even_date}</span>
                                    </div>
                                </div>
                                <div class="moim_imgBox">
                                    <img src="${img}" alt="" id="moim_img" name="img_${i}">
                                    <div class="online_${data[i].on_line}">on</div>
                                </div>
                            </td>
                        </tr>`;
    }

    count = 0;
  }

  if (data.length > 0) {
    tbody.innerHTML = rows;
  } else {
    tbody.innerHTML = `<tr><td style="border: 0;">해당하는 모임이 존재하지 않습니다.</td></tr>`;
  }
}

// function buttonChangeClr(){
//     const buttons = document.querySelector(".button-box").childNodes;

//     console.log(buttons);

//     // 각 location_item에 클릭 이벤트 추가
//     buttons.forEach((button) => {
//       button.addEventListener("click", function() {
//         // 이전 선택된 항목의 배경색 초기화
//         buttons.forEach((el) => (el.style.cssText = "background-color: grey;"));

//         // 현재 클릭한 항목의 배경색 변경
//         this.style.cssText = "background-color: #1E3E62;";
//       });
//     });
// }

// buttonChangeClr();
