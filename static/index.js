async function show_MoimSet() {
    const {data} = await axios({
        method: "POST",
        url: "/home/post"
    });

    console.log(data.data);

    const moimSet = data.data;

    const contents_scroll = document.querySelector(".contents_scroll attending");

    const moim_content = document.createAttribute("div");
    moim_content.className = "moim_content";

    let innerHTML = '';

    moimSet.forEach(moim => {
        innerHTML = `<div class="moim_content">
          <!-- 모임명 -->
          <p>${moim.title}</p>
          <!-- 사진 -->
          <img src="${moim.represent_img}" alt="">
        </div>`
        moim_content.innerHTML = innerHTML;
        contents_scroll.append(moim_content)
    });

    moim_content.innerHTML = innerHTML;

}

show_MoimSet();
