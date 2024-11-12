async function show_MoimSet() {
    const { data } = await axios({
        method: "POST",
        url: "/home/post"
    });

    if (data) {
        const moims = data.data;
        let moim_content = '';
        for (let i = 0; i < moims.length; i++) {
            moim_content += `<div class="moim_content" onclick='/moim/moim_detail/${moim[i].moim_id}'>
          <!-- 모임명 -->
          <p>${moims[i].title}</p>
          <!-- 사진 -->
          <img src="${moims[i].represent_img}" alt="">
        </div>`;
        }
        document.querySelector(".attending").lastElementChild.innerHTML = moim_content;
    } else {
        document.querySelector(".attending").lastElementChild.innerHTML = '<span>참여중인 모임이 없습니다.</span>';
    }

}

async function show_Recommend() {
    const {data} = await axios({
        method: "POST",
        url: "/home/post"
    });

    console.log(data.recommend);
    const moims = data.recommend;    

    if (moims) {
        
        let moim_content = '';

        for (let i = 0; i < moims.length; i++) {
            moim_content += `<div class="moim_content" onclick='/moim/moim_detail/${moim[i].moim_id}'>
          <!-- 모임명 -->
          <p>${moims[i].title}</p>
          <!-- 사진 -->
          <img src="${moims[i].represent_img}" alt="">
        </div>`;
        }

        document.querySelector(".recommend").lastElementChild.innerHTML = moim_content;
    } else {
        document.querySelector(".recommend").lastElementChild.innerHTML = '<span>추천 모임이 없습니다.</span>';
    }
}

show_MoimSet();
show_Recommend();