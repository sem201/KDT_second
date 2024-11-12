function selectMoim(src) {
    console.log(src.className);
  }
  
  async function participatingMoim() {
    const { data } = await axios({
      method: "GET",
      url: "/user/participating",
    });
  
    console.log(data);
  
    showTable(data);
  }

  async function participatedMoim(){
    const { data } = await axios({
        method: "GET",
        url: "/user/participated",
    })

    console.log(data);

    showTable(data);
  }


function showTable(data){
    const tbody = document.querySelector("tbody");
  
    if (data) {
      let row = ``;
  
      for (let i = 0; i < data.length; i++) {
        if (i % 2 === 0) {
          row += `<tr>`;
        }
        row += `<td>
                    <div class="content" onclick="location.href='/moim/moim_detail/${data[i].moim_id}'">
                      <div class="title">${data[i].title}</div>
                      <img src="${data[i].represent_img}" alt="" />
                    </div>
                  </td>`;
        if ((i + 1) % 2 === 0) {
          row += `</tr>`;
        }
      }
      if (data.length % 2 != 0) {
        row += `<td></td><tr>`;
      }
      console.log(row);
      tbody.innerHTML = row;
    }
}