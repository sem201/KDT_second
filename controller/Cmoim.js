const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("sequelize");
const multer = require("multer");
const {
  Moim,
  User,
  MoimDetail,
  MoimSet,
  DibsMoim,
} = require("../models/index");

exports.MoimList_GET = async (req, res) => {
  if (req.session.userInfo) {
    res.render("moim_list");
  } else {
    res.redirect("/");
  }
};

exports.MoimList_POST = async (req, res) => {
  try {
    const { location, category, on_line } = req.body;

    let whereConditions = {};
    if (location && location !== "*") whereConditions.location = location;
    if (category && category !== "*") whereConditions.category = category;
    if (on_line && on_line !== "*") {
      whereConditions.on_line = JSON.parse(on_line);

      console.log(typeof whereConditions.on_line);
    }

    const data = await Moim.findAll({
      attributes: [
        "moim_id",
        "title",
        "on_line",
        "max_people",
        "location",
        "represent_img",
        "nickname",
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
      where: whereConditions,
    });
    const moimset = await MoimSet.findAll({
      attributes: [
        "moim_id",
        [sequelize.fn("COUNT", sequelize.col("nickname")), "moim_count"],
      ],
      group: "moim_id",
    });
    let moimcount = [];
    for (let i = 0; i < moimset.length; i++) {
      moimcount.push(moimset[i].dataValues);
    }

    console.log("whereConditions: ", whereConditions);

    // console.log(data);
    // console.log(moimcount);

    if (data) {
      res.json({ data: data, moimcount: moimcount });
    } else {
      alert("모임 리스트 출력 실패");
      res.redirect("/");
    }
    ("");
  } catch (error) {
    res.json({
      result: false,
      Message: "모임 정보 불러오기에 실패하였습니다!!!",
    });
  }
};

exports.Moim_destory = async (req, res) => {
  const { moim_id } = req.body;
  try {
    let destroy = await Moim.destroy({
      where: { nickname: req.session.userInfo.nickname, moim_id },
    });
    res.json({ result: true });
  } catch (error) {
    res.json({ result: false, Message: "모임 정보 삭제에 실패하였습니다!!!" });
  }
};

exports.moim_insert = (req, res) => {
  if (req.session.userInfo) {
    res.render("moiminsert"); // 모임 추가 창으로 가는 코드
  } else {
    res.redirect("/");
  }
};

exports.Moimset_patch = async (req, res) => {
  try {
    const { user_review, moim_id, nickname, updatereview } = req.body;
    console.log(
      `User ID: ${nickname}, Moim ID: ${moim_id}, New Review Score: ${updatereview}`
    );
    await MoimSet.update(
      { user_review: updatereview },
      { where: { nickname, moim_id } }
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

exports.Moimset_count = async (req, res) => {
  if (req.session.userInfo) {
    try {
      const { moim_id } = req.body;
      const Set_list = await MoimSet.findAll({
        where: { moim_id: Number(moim_id) },
      });
      console.log(Set_list);
      console.log("정상송출!");
      res.json({
        result: true,
        Message: "정상적으로 정보를 송출함",
        list: Set_list,
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect("/");
  }
};

exports.MoimSet_detory = async (req, res) => {
  if (req.session.userInfo) {
    try {
      const { moim_id } = req.body;
      await MoimSet.destroy({
        where: { moim_id, nickname: req.session.userInfo.nickname },
      });
      res.json({ result: true });
    } catch (error) {
      res.send({
        result: false,
      });
    }
  } else {
    res.redirect("/");
  }
};

exports.MoimSet_POST = async (req, res) => {
  if (req.session.userInfo) {
    const { moim_id } = req.body;

    try {
      MoimSet.create({ moim_id, nickname: req.session.userInfo.nickname });
      res.json({
        result: true,
      });
    } catch (error) {
      res.json({
        result: false,
      });
    }
  } else {
    req.redirect("/");
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
  console.log(req.file);
  if (req.session.userInfo) {
    const {
      title,
      on_line,
      max_people,
      expiration_date,
      even_date,
      location,
      nickname,
      category,
      moim_id,
      content,
    } = req.body;

    let moim = await Moim.update(
      {
        title,
        on_line,
        max_people,
        expiration_date,
        even_date,
        location,
        nickname,
        category,
      },
      { where: { moim_id } }
    );

    if (moim != null) {
      let moim_detail = MoimDetail.update(
        {
          content,
        },
        {
          where: { moim_id },
        }
      );
      if (moim_detail != null) {
        res.json({
          result: true,
          Message: "moim 정보 업데이트에 성공하셨습니다.",
        });
      } else {
        res.json({
          result: false,
          Message: "content 정보가 수정되지 않았습니다. 다시 시도해주세요.",
        });
      }
    } else {
      res.json({
        result: false,
        Message: "Moim 정보 수정이 이뤄지지 않았습니다.",
      });
    }
  } else {
    res.redirect("/");
  }
};

exports.Moim_UPDATE_file = async (req, res) => {
  console.log(req.file);
  if (req.session.userInfo) {
    const {
      title,
      on_line,
      max_people,
      expiration_date,
      even_date,
      location,
      nickname,
      category,
      moim_id,
      content,
    } = req.body;

    let moim = await Moim.update(
      {
        title,
        on_line,
        max_people,
        expiration_date,
        even_date,
        location,
        nickname,
        represent_img: req.file.path,
        category,
      },
      { where: { moim_id } }
    );

    if (moim != null) {
      let moim_detail = MoimDetail.update(
        {
          content,
        },
        {
          where: { moim_id },
        }
      );
      if (moim_detail != null) {
        res.json({
          result: true,
          Message: "moim 정보 업데이트에 성공하셨습니다.",
        });
      } else {
        res.json({
          result: false,
          Message: "content 정보가 수정되지 않았습니다. 다시 시도해주세요.",
        });
      }
    } else {
      res.json({
        result: false,
        Message: "Moim 정보 수정이 이뤄지지 않았습니다.",
      });
    }
  } else {
    res.redirect("/");
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
    res.redirect("/");
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
      } = req.body;

      console.log(req.body);
      console.log(req.file);

      const date = await Moim.create({
        title,
        category,
        on_line,
        max_people,
        expiration_date,
        even_date,
        location,
        represent_img: req.file.path,
        nickname: req.session.userInfo.nickname,
      });
      console.log(date);

      if (date !== null) {
        const moimset = MoimSet.create({
          nickname: req.session.userInfo.nickname,
          moim_id: date.moim_id,
        });
        res.json({ result: true, userInfo: date });
      }
    } catch (error) {
      console.error(error);
      res.send({
        result: false,
        Message: "모임 개설에 실패하였습니다.",
        userInfo: null,
      });
    }
  } else {
    res.redirect("/");
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
          "nickname",
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
        where: { moim_id: Number(req.params.moimid) },
      });
      let { nickname } = req.session.userInfo;
      if (moim !== null) {
        let moim_setup = await MoimSet.findOne({
          where: {
            nickname,
            moim_id: req.params.moimid,
          },
        }); // 현재 session 사용자가 가입한 모임인지를 알아냄.
        const moimset = await MoimSet.findAll({
          attributes: [
            "moim_id",
            [sequelize.fn("COUNT", sequelize.col("nickname")), "moim_count"],
          ],
          group: "moim_id",
          where: {
            moim_id: req.params.moimid,
          },
        });

        // 현재 session 사용자가 찜한 모입인지 확인.
        let isDibs = (await DibsMoim.findOne({
          where: {
            [Op.or]: [
              { moim_id: req.params.moimid },
              { nickname: req.session.userInfo.nickname },
            ],
          },
        }))
          ? true
          : false;

        console.log(isDibs, "찜 상태");

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
            isDibs: isDibs,
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
            isDibs: isDibs,
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
    res.redirect("/");
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
            "nickname",
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
        {
          where: {
            location: moimlocation,
          },
        }
      );
      const moimset = await MoimSet.findAll({
        attributes: [
          "moim_id",
          [sequelize.fn("COUNT", sequelize.col("nickname")), "moim_count"],
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
    res.redirect("/");
  }
};

exports.moimlist = async (req, res) => {
  if (req.session.userInfo) {
    try {
      const data = await Moim.findAll({
        attributes: [
          "moim_id",
          "title",
          "on_line",
          "max_people",
          "location",
          "represent_img",
          "nickname",
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
      });
      const moimset = await MoimSet.findAll({
        attributes: [
          "moim_id",
          [sequelize.fn("COUNT", sequelize.col("nickname")), "moim_count"],
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
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect("/");
  }
};

// 찜한 moim list 출력
exports.DibsMoim = async (req, res) => {
  if (req.session.userInfo) {
    try {
      const data = await Moim.findAll({
        attributes: [
          "moim_id",
          "title",
          "on_line",
          "max_people",
          "location",
          "represent_img",
          "nickname",
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
        include: [
          {
            model: DibsMoim,
            where: { user_id: req.session.userInfo.userid },
          },
        ],
      });
      res.send({ data: data });
    } catch (error) {
      console.log("모임리스트 불러오는데 실패했음");
    }
  } else {
    console.log("세션정보 없음");
    res.send({ message: "로그인을 다시 확인해주세요!" });
  }
};

exports.RecommendMoim = async (req, res) => {
  try {
    const results = await db.sequelize.query(
      `
    SELECT moim.*
  FROM moim
  JOIN (
    SELECT moim_id, COUNT(*) AS participant_count
    FROM moim_set
    GROUP BY moim_id
  ) AS moim_participants ON moim.moim_id = moim_participants.moim_id
  WHERE moim_participants.participant_count = moim.max_people - 1
  `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    res.send({ results });
  } catch (error) {
    console.log("error", error);
  }
};

exports.moim_correction = async (req, res) => {
  if (req.session.userInfo) {
    let moim_id = Number(req.params.moimid);

    const moim = await Moim.findOne({
      attributes: [
        "moim_id",
        "title",
        "on_line",
        "max_people",
        "location",
        "represent_img",
        "nickname",
        "category",
        [
          sequelize.fn(
            "date_format",
            sequelize.col("expiration_date"),
            "%Y-%m-%dT%H:%i:%s"
          ),
          "expiration_date",
        ],
        [
          sequelize.fn(
            "date_format",
            sequelize.col("even_date"),
            "%Y-%m-%dT%H:%i:%s"
          ),
          "even_date",
        ],
      ],
      where: { moim_id },
    });

    if (moim) {
      console.log(req.session.userInfo.nickname);
      console.log(moim);
      if (req.session.userInfo.nickname == moim.nickname) {
        const detail = await MoimDetail.findOne({
          where: { moim_id },
        });
        console.log(detail);
        res.render("moim_correction", { moim, detail });
      } else {
        res.render("MoimNot", {
          result: false,
          Message: "해당 정보의 moim은 접근 권한이 없거나 찾을 수 없습니다.",
        });
      }
    } else {
      res.render("MoimNot", {
        result: false,
        Message: "해당 정보의 moim은 접근 권한이 없거나 찾을 수 없습니다.",
      });
    }
  } else {
    res.redirect("/");
  }
};
