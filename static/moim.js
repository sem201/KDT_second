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
function uploadFile() {
  var fileVal = $("#represent_beforee").val();
  if (fileVal != "") {
    var ext = fileVal.split(".").pop().toLowerCase(); //확장자분리
    //아래 확장자가 있는지 체크
    if ($.inArray(ext, ["jpg", "jpeg", "gif", "png"]) == -1) {
      alert("jpg,gif,jpeg,png 파일만 업로드 할수 있습니다.");
      return;
    }
  }
}
