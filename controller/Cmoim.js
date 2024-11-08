const { Op } = require("sequelize");
const sequelize = require("sequelize");
const {
  Moim,
  User,
  MoimDetail,
  MoimSet,
  DibsMoim,
} = require("../models/index");

exports.MoimList_GET = async (req, res) => {
  res.render("moim_list");
};

exports.Moims_GET = async (req, res) => {
  try {
    const data = await Moim.findAll();
    console.log(data);

    res.json({ data: data });
  } catch (error) {
    res.json({
      result: false,
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

// 모임 디테일 페이지 렌더링(가입 여부 적용)
exports.MoimDetail_render = async (req, res) => {
  let userInfo = req.session.userInfo;
  console.log(userInfo);
  if (req.session.userInfo) {
    try {
      const moim = await Moim.findAll({
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
        where: { moim_id: Number(req.params.moimid) },
      });
      let { userid } = req.session.userInfo;
      if (moim !== null) {
        let moim_setup = await MoimSet.findOne({
          where: {
            user_id: userid,
            moim_id: req.params.moimid,
          },
        }); // 현재 session 사용자가 가입한 모임인지를 알아냄.
        const moimset = await MoimSet.findAll({
          attributes: [
            "moim_id",
            [sequelize.fn("COUNT", sequelize.col("user_id")), "moim_count"],
          ],
          group: "moim_id",
          where: {
            moim_id: req.params.moimid,
          },
        });
        // 현재 session 사용자가 찜한 모입인지 확인.
        let isDibs = (await DibsMoim.findOne({
          where: {
            [Op.or]: [{ moim_id: req.params.moimid }, { user_id: userid }],
          },
        }))
          ? true
          : false;
        let moimcount = [];
        for (let i = 0; i < moimset.length; i++) {
          moimcount.push(moimset[i].dataValues);
        }
        const user = { moim_id: req.params.moimid, moim_count: 0 };

        if (moimcount.length == 0) {
          console.log("모임에 정보가 없으니 0으로 출력합니다.");
          moimcount.push(user);
        }
        let detail = await MoimDetail.findAll({
          where: { moim_id: req.params.moimid },
        });
        if (moim_setup !== null) {
          console.log("모임에 가입되어 있는 사용자입니다.");
          console.log(detail);
          res.render("moim_detail", {
            moim,
            moimcount,
            detail,
            accession: true,
            user: userInfo,
            idDibs: isDibs,
          });
        } else {
          console.log("모임에 가입되지 않은 사용자입니다.");
          console.log(detail);
          res.render("moim_detail", {
            moim,
            moimcount,
            detail,
            accession: false,
            user: userInfo,
          });
        }
      } else {
        if (typeof window !== "undefined") {
          alert("현재 삭제된 모임이거나 개설되지 않은 번호 입니다.");
        }
        redirect("/moim_list");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    if (typeof window !== "undefined") {
      alert("현재 로그인이 되어 있지 않습니다.");
    }
    res.redirect("/login");
  }
};

//모임 리스트 별 장소 Select
exports.moimlistSelect = async (req, res) => {
  let moimlocation = req.params.location;

  if (req.session.userInfo) {
    try {
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
        {
          where: {
            location: moimlocation,
          },
        }
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

// 추천 moim list 출력
exports.RecommendMoim = async (req, res) => {
  if (req.session.userInfo) {
    try {
    } catch (error) {
      console.log("모임리스트 불러오는데 실패했음");
    }
  } else {
    console.log("세션정보 없음");
    res.send({ message: "로그인을 다시 확인해주세요!" });
  }
};
