function move(moim_id) {
  const data = "/moim/moim_detail/" + moim_id;
  window.location.href = data;
}

$(function () {
  $("input:file").change(function () {
    const file = document.querySelector("#represent_img").files[0];
    let imgVal = $("#represent_img").val();
    var fileReg = /(.*?)\.(gif|png|jpg|jpeg)$/;
    if (!imgVal.toLowerCase().match(fileReg)) {
      alert("지원하는 파일 확장자가 아닙니다.");
      $("#represent_img").val("");
      return;
    }
    alert("이미지 값 변경");
    $("#represent_before").attr("src", URL.createObjectURL(file));
  });
});
