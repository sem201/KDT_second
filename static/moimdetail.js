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
  if (confirm("모임 탈퇴를 원하시는 경우 '확인'을 눌러주세요.")) {
    let { data } = await axios({
      method: "DELETE",
      url: "/moim/moimset",
      data: { moim_id },
    });

    if (data.result) {
      alert("다음 기회에 다시 만나요.");
      window.location.reload();
    } else {
      alert("모임을 탈퇴할 수 없습니다.");
    }
  }
}
async function moim_distory(moim_id) {
  if (confirm("모임 삭제를 원하시는 경우 '확인'을 눌러주세요.")) {
    let { data } = await axios({
      method: "DELETE",
      url: "/moim/moims",
      data: { moim_id },
    });
    if (data.result) {
      alert("모임이 정상적으로 삭제되었습니다.");
      window.location.href = "/moim/moims";
    }
  }
}
function moim_correction(moimid) {
  const data = "/moim/moim_correction/" + moimid;
  window.location.href = data;
}