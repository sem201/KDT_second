const sequelize = require("sequelize");
const {
  Moim,
  User,
  MoimDetail,
  MoimSet,
  DibsMoim,
} = require("../models/index");

exports.Moims_GET = async (req, res) => {
  try {
    const data = await Moim.findAll();
    res.render("moim_list", { data: data });
  } catch (error) {
    res.json({
      result: true,
      Message: "모임 정보 불러오기에 실패하였습니다!!!",
    });
  }
};

exports.Moim_destory = async (req, res) => {
  const { user_id, moim_id } = req.body;
  try {
    await Moim.destroy({
      where: { user_id, moim_id },
    });
    res.json({ result: true });
  } catch (error) {
    res.json({ result: true, Message: "모임 정보 삭제에 실패하였습니다!!!" });
  }
};

exports.moim_insert = (req, res) => {
  res.render("moiminsert"); // 모임 추가 창으로 가는 코드
};

exports.Moimset_patch = async (req, res) => {
  try {
    const { user_review, moim_id, user_id, updatereview } = req.body;
    console.log(
      `User ID: ${user_id}, Moim ID: ${moim_id}, New Review Score: ${updatereview}`
    );
    await MoimSet.update(
      { user_review: updatereview },
      { where: { user_id, moim_id } }
    );

    res.send({
      result: true,
      Message: `해당 user의 점수를 ${updatereview}로 수정합니다`,
    });
  } catch (error) {
    console.error("Error updating review score:", error);
    res.send({
      result: false,
      Message: "에러 발생!! 유저의 별점을 설정할 수 없습니다.",
    });
  }
};

exports.MoimSet_detory = async (req, res) => {
  if (req.session.userInfo) {
    try {
      const { user_review, moim_id, user_id } = req.body;
      await MoimSet.destroy({ where: { moim_id, user_id } });
      res.json({ result: true, Message: "모임 가입을 취소하였습니다." });
    } catch (error) {
      res.send({
        result: false,
        Message: "에러 발생!! 모임 가입을 해제할 수 없습니다.",
      });
    }
  } else {
    res.redirect("/login");
  }
};

exports.MoimSet_POST = async (req, res) => {
  if (req.session.userInfo) {
    try {
      const { moim_id } = req.body;
      MoimSet.create({ moim_id, user_id: req.session.userInfo.userid });
      res.json({
        result: true,
        Message: "모임에 가입해주신 것을 환영합니다.",
      });
    } catch (error) {
      res.json({
        result: false,
        Message: `${error} 에러 발생!! 모임에 가입할 수 없습니다.`,
      });
    }
  } else {
    req.redirect("/login");
  }
};

exports.moim_detail_UPDATE = async (req, res) => {
  try {
    const { moim_id, content, min_people } = req.body;
    await MoimDetail.update({ content, min_people }, { where: { moim_id } });
    res.send({
      result: true,
      Message: "moim 정보 업데이트에 성공하셨습니다.",
    });
  } catch (error) {}
};

exports.Moim_UPDATE = async (req, res) => {
  if (req.session.userInfo) {
    const {
      title,
      on_line,
      max_people,
      expiration_date,
      even_date,
      location,
      represent_img,
      user_id,
      moim_id,
    } = req.body;
    await Moim.update(
      {
        title,
        on_line,
        max_people,
        expiration_date,
        even_date,
        location,
        represent_img,
        user_id,
      },
      { where: { moim_id } }
    );
    res.send({
      result: true,
      Message: "moim 정보 업데이트 1단계에 성공하셨습니다.",
    });
  } else {
    res.redirect("/login");
  }
};

exports.MoimDetail_POST = async (req, res) => {
  if (req.session.userInfo) {
    const { moim_id, content, min_people } = req.body;
    try {
      await MoimDetail.create({ moim_id, content, min_people });
      res.json({ result: true });
    } catch (error) {
      console.error(error);
      await Moim.destroy({ where: { moim_id } });
      //Moim_detaill 테이블에 정보 저장이 실패하였을 때, Moim table의 이전 저장 정보를 삭제한다.
      res.send({ result: false, Message: "모임 개설에 실패하였습니다." });
    }
  } else {
    res.redirect("/login");
  }
};

exports.Moims_POST = async (req, res) => {
  if (req.session.userInfo) {
    try {
      const {
        category,
        title,
        on_line,
        max_people,
        expiration_date,
        even_date,
        location,
        represent_img,
        user_id,
      } = req.body;

      console.log(req.body);
      const date = await Moim.create({
        title,
        category,
        on_line,
        max_people,
        expiration_date,
        even_date,
        location,
        represent_img,
        user_id,
      });
      res.json({ result: true, userInfo: date });
    } catch (error) {
      console.error(error);
      res.send({
        result: false,
        Message: "모임 개설에 실패하였습니다.",
        userInfo: null,
      });
    }
  } else {
    res.redirect("/login");
  }
};

// 모임 디테일 페이지 렌더링
exports.MoimDetail_render = async (req, res) => {
  console.log(req.params.moimid);
  if (req.session.userInfo) {
    try {
      const data = await Moim.findOne(
        {
          attributes: [
            "moim_id",
            "title",
            "on_line",
            "max_people",
            "location",
            "represent_img",
            "user_id",
            "category",
            [
              sequelize.fn(
                "date_format",
                sequelize.col("expiration_date"),
                "%Y-%m-%d %H:%i"
              ),
              "expiration_date",
            ],
            [
              sequelize.fn(
                "date_format",
                sequelize.col("even_date"),
                "%Y-%m-%d %H:%i"
              ),
              "even_date",
            ],
          ],
        },
        { where: { moim_id: req.params.moimid } }
      );
      const moimset = await MoimSet.findAll(
        {
          attributes: [
            "moim_id",
            [sequelize.fn("COUNT", sequelize.col("user_id")), "moim_count"],
          ],
          group: "moim_id",
        },
        { where: { moim_id: req.params.moimid } }
      );
      let moimcount = [];
      for (let i = 0; i < moimset.length; i++) {
        moimcount.push(moimset[i].dataValues);
      }
      console.log(moimset);

      if (moimset == null) {
        console.log("ddasdf");
        res.render("moim_detail", {
          moim: data,
          moimcount: moimcount,
        });
      } else {
        console.log("dfafafd");
        const Moimdetail = await MoimDetail.findOne({
          where: { moim_id: req.params.moimid },
        });

        res.render("moim_detail", {
          moim: data,
          moimcount: moimcount,
          MoimDetail: Moimdetail,
        });
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect("/login");
  }
};

exports.Moimlist_GET = (req, res) => {
  if (req.session.userInfo) {
    try {
      let Moimlist = MoimDetail.findOne({
        where: {
          moim_id: req.params.moimid,
        },
      });
      res.json({ Moimlist: Moimlist });
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect("/login");
  }
};

exports.moimlistSelect = async (req, res) => {
  //모임리스트의 장소 관련 코드 - 적용 여부 미정
  if (req.session.userInfo) {
    try {
      let location = req.params;
      const data = await Moim.findAll(
        {
          attributes: [
            "title",
            "on_line",
            "max_people",
            "location",
            "represent_img",
            "user_id",
            "category",
            [
              sequelize.fn(
                "date_format",
                sequelize.col("expiration_date"),
                "%Y-%d-%m %H:%i"
              ),
              "expiration_date",
            ],
            [
              sequelize.fn(
                "date_format",
                sequelize.col("even_date"),
                "%Y-%d-%m %H:%i"
              ),
              "even_date",
            ],
          ],
        },
        { where: { location: location } }
      );
      const moimset = await MoimSet.findAll({
        attributes: [
          "moim_id",
          [sequelize.fn("COUNT", sequelize.col("user_id")), "moim_count"],
        ],
        group: "moim_id",
      });
      let moimcount = [];
      for (let i = 0; i < moimset.length; i++) {
        moimcount.push(moimset[i].dataValues);
      }
      if (data) {
        res.json({ moim: data, moimcount: moimcount });
      } else {
        alert("모임 리스트 출력 실패");
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect("/login");
  }
};

exports.moimlist = async (req, res) => {
  if (req.session.userInfo) {
    try {
      const data = await Moim.findAll({
        attributes: [
          "title",
          "on_line",
          "max_people",
          "location",
          "represent_img",
          "user_id",
          "category",
          [
            sequelize.fn(
              "date_format",
              sequelize.col("expiration_date"),
              "%Y-%d-%m %H:%i"
            ),
            "expiration_date",
          ],
          [
            sequelize.fn(
              "date_format",
              sequelize.col("even_date"),
              "%Y-%d-%m %H:%i"
            ),
            "even_date",
          ],
        ],
      });
      const moimset = await MoimSet.findAll({
        attributes: [
          "moim_id",
          [sequelize.fn("COUNT", sequelize.col("user_id")), "moim_count"],
        ],
        group: "moim_id",
      });
      let moimcount = [];
      for (let i = 0; i < moimset.length; i++) {
        moimcount.push(moimset[i].dataValues);
      }
      if (data) {
        res.render("moimlist", { data, moimcount });
      } else {
        alert("모임 리스트 출력 실패");
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect("/login");
  }
};
