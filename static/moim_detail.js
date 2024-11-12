async function showPPL(moimid) {
  const listOfppl = document.createElement("div");
  listOfppl.className = "listOfppl";

  const turnoff = document.createElement("div");
  turnoff.className = "turnOff";
  turnoff.innerHTML = "×";
  listOfppl.append(turnoff);

  const { data } = await axios({
    method: "POST",
    url: "/moim/moimset/count",
    data: {
      moim_id: moimid,
    },
  });

  for (let item of data.list) {
    let items = document.createElement("div");
    items.innerText = item.nickname;
    listOfppl.append(items);
  }

  const body = document.querySelector("body");
  body.append(listOfppl);

  const button = document.querySelector("button");
  const setting = document.querySelector(".setting");
  const apply = document.querySelector(".apply");
  button.style.cssText = "pointer-events: none;";
  setting.style.cssText = "pointer-events: none;";
  apply.style.cssText = "pointer-events: none;";

  listOfppl.onclick(() => {
    listOfppl.remove();
    button.style.cssText = "pointer-events: all;";
    setting.style.cssText = "pointer-events: all;";
    apply.style.cssText = "pointer-events: all;";
  });
}

function DibsMoim() {
  const pathParts = window.location.pathname.split("/");
  const moimid = pathParts[pathParts.length - 1];
  console.log(moimid);
  axios({
    method: "post",
    url: `/user/dibs/${moimid}`,
  });
  console.log("클릭 실행됨");

  const button = document.querySelector(".dibsMoim");

  button.innerHTML = "♥︎";
}
