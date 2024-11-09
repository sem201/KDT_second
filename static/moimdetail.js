async function moimset(moim_id) {
  //완성
  let { data } = await axios({
    method: "POST",
    url: "/moim/moimset",
    data: { moim_id },
  });
  if (data.result) {
    alert("모임에 참여해주셔서 감사합니다.");
    window.location.reload();
  } else {
    alert("모임에 가입할 수 없습니다.");
  }
}
async function moimset_dis(moim_id) {
  if (confirm("정말, 모임에서 탈퇴하실 겁니까?")) {
    let { data } = await axios({
      method: "DELETE",
      url: "/moim/moimset",
      data: { moim_id },
    });

    if (data.result) {
      alert("다음번엔 함께 해주셨으면 좋겠습니다ㅠㅠㅠㅠㅠ");
      window.location.reload();
    } else {
      alert("모임을 탈퇴할 수 없습니다.");
    }
  }
}
async function moim_distory(nickname, moim_id) {
  if (confirm("정말, 모임을 삭제하실 겁니까?")) {
    let { data } = await axios({
      method: "DELETE",
      url: "/moim/moims",
      data: { nickname, moim_id },
    });
    if (data.result) {
      alert("모임이 정상적으로 삭제되었습니다.");
      window.location.href = "/moim/moim_list";
    }
  }
}
function moim_correction(moimid) {
  const data = "/moim/moim_correction/" + moimid;
  window.location.href = data;
}
