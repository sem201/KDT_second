async function showPPL(moimid) {
  const listOfppl = document.createElement("div");
  listOfppl.className = "listOfppl";

  const div = document.createElement("div");
  div.style.cssText =
    "display: flex; justify-content: space-between; align-items: center;";
  div.innerHTML =
    "<div class='title'>참여자 정보</div><div class='turnOff'>×</div>";
  listOfppl.append(div);

  // const turnoff = document.createElement("div");
  // turnoff.className = "turnOff";
  // turnoff.innerHTML = "×";
  // listOfppl.append(turnoff);

  // const title = document.createElement("div");
  // title.className = "title";
  // title.innerText = "참여자 정보";
  // listOfppl.append(title);

  const { data } = await axios({
    method: "POST",
    url: "/moim/moimset/count",
    data: {
      moim_id: moimid,
    },
  });

  console.log(data);

  for (let item of data.list) {
    let nickname = document.createElement("div");
    nickname.className = "nickname";
    nickname.innerText = item.nickname;
    nickname.addEventListener("click", () => {
      const reviewee_nickname = nickname.innerText;
      const url = window.location.href;
      const parts = url.split("/");
      const moim_id = parts[parts.length - 1];
      document.location.href = `/user/review?reviewee_nickname=${reviewee_nickname}&moim_id=${moim_id}`;
    });
    listOfppl.append(nickname);
  }

  const body = document.querySelector("body");
  body.append(listOfppl);

  // document.querySelector("button").onclick(() => {
  //   body.remove(listOfppl);
  // });
  // document.querySelector(".apply").onclick(() => {
  //   body.remove(listOfppl);
  // });
  // document.querySelector(".setting").onclick(() => {
  //   body.remove(listOfppl);
  // });

  const button = document.querySelector("button");
  const setting = document.querySelector(".setting");
  const apply = document.querySelector(".apply");
  button.style.cssText = "pointer-events: none;";
  setting.style.cssText = "pointer-events: none;";
  apply.style.cssText = "pointer-events: none;";

  document.querySelector(".turnOff").addEventListener("click", () => {
    listOfppl.remove();
    button.style.cssText = "pointer-events: all;";
    setting.style.cssText = "pointer-events: all;";
    apply.style.cssText = "pointer-events: all;";
  });
}

async function DibsMoim() {
  const pathParts = window.location.pathname.split("/");
  const moimid = pathParts[pathParts.length - 1];
  console.log(moimid);
  const { data } = await axios({
    method: "post",
    url: `/user/dibs/${moimid}`,
  });
  console.log("클릭 실행됨");
  const button = document.querySelector(".dibsMoim");

  if (data.result === true) {
    button.innerText = "♥";
  } else {
    button.innerText = "♡";
  }
}
