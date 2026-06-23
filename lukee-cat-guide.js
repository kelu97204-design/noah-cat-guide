const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".hero-dot")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const searchInput = document.querySelector(".search-input");
const catGrid = document.querySelector(".cat-grid");
let cards = [];
const pagination = document.querySelector(".pagination");
const emptyState = document.querySelector(".empty-state");
const modal = document.querySelector(".cat-detail-modal");
const closeButtons = document.querySelectorAll("[data-close-modal]");
const detailMainPhoto = document.querySelector(".detail-main-photo");
const detailThumbs = document.querySelector(".detail-thumbs");
const detailTag = document.querySelector(".detail-tag");
const detailTitle = document.querySelector("#detail-title");
const detailSummary = document.querySelector(".detail-summary");
const detailIntro = document.querySelector(".detail-intro");
const detailIdentify = document.querySelector(".detail-identify");
const detailCare = document.querySelector(".detail-care");
const rankingBoard = document.querySelector(".ranking-board");
const feedbackTab = document.querySelector(".feedback-tab");
const feedbackPanel = document.querySelector(".feedback-panel");
const feedbackClose = document.querySelector(".feedback-close");
const feedbackForm = document.querySelector(".feedback-form");
const feedbackStatus = document.querySelector(".feedback-status");

const pageSize = 8;
let currentSlide = 0;
let currentFilter = "all";
let currentPage = 1;
let searchTerm = "";

const categoryNames = {
  popular: "热门猫种",
  short: "短毛猫",
  long: "长毛猫",
  beginner: "新手友好",
  active: "活泼好动"
};

const breedCatalog = [
  { slug: "maine", name: "缅因猫", categories: ["popular", "long", "active"], summary: "大型、长毛、耳尖常有簇毛，外形很有存在感。", intro: "缅因猫体型偏大，毛发浓密，性格多半友好又好奇。它们需要更宽敞的活动空间，也适合准备结实猫爬架的家庭。", identify: ["体型明显偏大，尾巴长而蓬松", "耳朵较大，耳尖常有簇毛", "胸前和腹部毛量丰富"], care: ["定期梳理厚毛，避免打结", "准备结实的猫爬架", "用互动玩具消耗精力"], photos: ["https://cdn2.thecatapi.com/images/OCoeP14wW.jpg", "https://cdn2.thecatapi.com/images/HD4lZB6BI.jpg", "https://cdn2.thecatapi.com/images/vXb2jdNoo.jpg", "https://cdn2.thecatapi.com/images/LIQSvUemz.jpg"] },
  { slug: "ragdoll", name: "布偶猫", categories: ["popular", "long", "beginner"], summary: "蓝眼睛、柔软长毛和温顺气质，是布偶猫最吸引人的地方。", intro: "布偶猫体型偏大，常见重点色，通常亲人、温和，喜欢与人待在一起。因为是长毛猫，日常梳理比短毛猫更重要。", identify: ["蓝色眼睛很有辨识度", "毛发较长，尾巴蓬松", "脸、耳朵、四肢和尾部常有重点色"], care: ["建议隔天梳毛", "定期检查耳朵和眼周", "需要稳定陪伴，避免长期孤单"], photos: ["https://cdn2.thecatapi.com/images/bCHc9dHit.jpg", "https://cdn2.thecatapi.com/images/eF3HSMIB_.jpg", "https://cdn2.thecatapi.com/images/aWVfoSN_K.jpg", "https://cdn2.thecatapi.com/images/bju16uKfD.jpg"] },
  { slug: "persian", name: "波斯猫", categories: ["popular", "long"], summary: "长毛、圆脸、安静气质，让波斯猫像需要细心照顾的优雅伙伴。", intro: "波斯猫毛发浓密，整体性格多半安静。它们漂亮但护理要求较高，适合愿意每天梳毛、清洁眼周的人。", identify: ["长毛丰厚，尾巴蓬松", "脸部圆润，鼻梁较短", "整体气质安静柔和"], care: ["建议每日梳毛", "注意眼部分泌物清洁", "保持室内干净，减少毛发打结"], photos: ["https://cdn2.thecatapi.com/images/d_RzH-Zft.jpg", "https://cdn2.thecatapi.com/images/e7-hS3gey.jpg", "https://cdn2.thecatapi.com/images/zFm4AbO-d.jpg", "https://cdn2.thecatapi.com/images/tt01SNoSH.png"] },
  { slug: "exotic", name: "异国短毛猫", categories: ["popular", "short", "beginner"], summary: "像短毛版波斯猫，圆脸、短鼻、表情甜，是安静型家庭猫。", intro: "异国短毛猫保留了波斯猫圆润的外形，但毛发更短，日常护理压力更轻。它们通常温和安静，适合喜欢稳定节奏的人。", identify: ["圆脸和短鼻明显", "短毛但毛量扎实", "眼睛大，表情柔和"], care: ["定期擦拭眼周", "每周梳毛，换毛季增加频率", "注意呼吸和体重情况"], photos: ["https://cdn2.thecatapi.com/images/dVujvBqnu.jpg", "https://cdn2.thecatapi.com/images/khyg1KLOZ.jpg", "https://cdn2.thecatapi.com/images/m3V8x5tde.jpg", "https://cdn2.thecatapi.com/images/FZpeiLi4n.jpg"] },
  { slug: "devon", name: "德文卷毛猫", categories: ["popular", "short", "active"], summary: "大耳朵、卷曲短毛和机灵表情，让德文卷毛猫很有辨识度。", intro: "德文卷毛猫活泼、亲人、爱互动，常常像小伙伴一样参与家庭活动。它们毛发较短，但需要留意保暖和皮肤状态。", identify: ["耳朵大，脸型精灵感明显", "毛发短而卷，贴近身体", "身形轻巧，动作灵活"], care: ["注意保暖，避免受凉", "温和清洁皮肤和耳朵", "每天安排互动游戏"], photos: ["https://cdn2.thecatapi.com/images/lJHXU7DlQ.jpg", "https://cdn2.thecatapi.com/images/uUGt0UBzF.jpg", "https://cdn2.thecatapi.com/images/jnqO9lwG2.jpg", "https://cdn2.thecatapi.com/images/udJaUVCHZ.jpg"] },
  { slug: "abyssinian", name: "阿比西尼亚猫", categories: ["popular", "short", "active"], summary: "轻盈、敏捷、好奇心强，适合喜欢互动的家庭。", intro: "阿比西尼亚猫毛色有细密层次，动作灵活，喜欢攀爬和探索。它们不太适合长期单调无聊的环境。", identify: ["身形轻盈，四肢修长", "毛发有细密层次感", "脸型偏楔形，表情机警"], care: ["准备猫爬架和高处空间", "每天互动游戏", "用益智玩具满足探索欲"], photos: ["https://cdn2.thecatapi.com/images/xnzzM6MBI.jpg", "https://cdn2.thecatapi.com/images/EHG3sOpAM.jpg", "https://cdn2.thecatapi.com/images/unPP08xOZ.jpg", "https://cdn2.thecatapi.com/images/N-94oSJ5T.jpg"] },
  { slug: "british", name: "英短", categories: ["popular", "short", "beginner"], summary: "圆脸、短毛、身体结实，是很多人熟悉的稳定型猫咪。", intro: "英短整体给人的感觉圆润、稳重、安静。常见蓝灰色只是其中一种，也有银渐层、金渐层、乳色等许多花色。", identify: ["脸部和眼睛偏圆，身体结实", "毛发短而密，触感厚实", "常见蓝灰、银渐层、金渐层等颜色"], care: ["每周梳毛，换毛季增加频率", "注意体重管理", "准备稳定安静的休息空间"], photos: ["https://cdn2.thecatapi.com/images/GrPErz7EA.jpg", "https://cdn2.thecatapi.com/images/xNuSF5YWY.jpg", "https://cdn2.thecatapi.com/images/N8bl5RjPG.jpg", "https://cdn2.thecatapi.com/images/b6Co9acGP.jpg"] },
  { slug: "siamese", name: "暹罗猫", categories: ["popular", "short", "active"], summary: "重点色、蓝眼睛、细长身形和爱交流，是暹罗猫的代表印象。", intro: "暹罗猫通常很亲人，也很有表达欲。它们喜欢跟随主人，存在感强，适合能接受互动和叫声的人。", identify: ["脸、耳朵、四肢和尾巴颜色更深", "眼睛多为蓝色", "身形较细长，动作灵活"], care: ["每天留出陪伴时间", "准备互动玩具减少无聊", "注意保暖，短毛猫怕冷"], photos: ["https://cdn2.thecatapi.com/images/__tqyLW91.jpg", "https://cdn2.thecatapi.com/images/Kf-zJDHCx.jpg", "https://cdn2.thecatapi.com/images/Xwp-MBOtI.jpg", "https://cdn2.thecatapi.com/images/KCJeb66J2.jpg"] },
  { slug: "siberian", name: "西伯利亚猫", categories: ["popular", "long", "active"], summary: "厚毛、强壮和亲人气质，适合喜欢大毛量猫的人。", intro: "西伯利亚猫来自寒冷地区，毛发厚实，身体强壮。它们通常友好、适应力好，但换毛季需要更细致打理。", identify: ["半长到长毛，毛量充足", "体型结实，轮廓圆润", "尾巴蓬松，保暖感强"], care: ["换毛季增加梳毛频率", "准备高处活动空间", "注意毛球管理"], photos: ["https://cdn2.thecatapi.com/images/cs8MHOb5I.jpg", "https://cdn2.thecatapi.com/images/HNNrk-UxN.jpg", "https://cdn2.thecatapi.com/images/dv2BqDVGr.jpg", "https://cdn2.thecatapi.com/images/--ovPy5Lb.jpg"] },
  { slug: "american", name: "美国短毛猫", categories: ["popular", "short", "beginner"], summary: "体格结实、适应力好、性格稳定，是经典家庭陪伴猫。", intro: "美国短毛猫身体强壮，适应力好，性格亲人但不过分黏。银虎斑是很多人熟悉的经典花色。", identify: ["身体结实，胸部较宽", "短毛贴身，常见虎斑纹", "整体比例均衡"], care: ["每周梳毛即可", "控制饮食和体重", "准备抓板和基础玩具"], photos: ["https://cdn2.thecatapi.com/images/SCHe-SekW.jpg", "https://cdn2.thecatapi.com/images/8NdgktL3E.jpg", "https://cdn2.thecatapi.com/images/MuEGe1-Sz.jpg", "https://cdn2.thecatapi.com/images/JFPROfGtQ.jpg"] },
  { slug: "bengal", name: "孟加拉猫", categories: ["short", "active"], summary: "豹纹感花色和强烈运动感，是孟加拉猫的核心特点。", intro: "孟加拉猫通常聪明、敏捷、好奇，喜欢跳跃和探索。它们花纹有视觉冲击力，也需要足够活动和互动。", identify: ["身上常见斑点或玫瑰纹", "身体线条有肌肉感", "短毛贴身，行动敏捷"], care: ["每天安排互动游戏", "提供攀爬空间和益智玩具", "避免长期无聊导致破坏行为"], photos: ["https://cdn2.thecatapi.com/images/8ciqdpaO5.jpg", "https://cdn2.thecatapi.com/images/VZ3qFLIe3.jpg", "https://cdn2.thecatapi.com/images/iWyIaja-G.jpg", "https://cdn2.thecatapi.com/images/Rl39SPjDO.png"] },
  { slug: "russian", name: "俄罗斯蓝猫", categories: ["short", "beginner"], summary: "银蓝短毛和绿色眼睛，清冷又优雅。", intro: "俄罗斯蓝猫通常安静谨慎，熟悉环境后会与主人建立稳定关系。适合喜欢安静生活节奏的人。", identify: ["毛色呈银蓝或蓝灰色", "眼睛多为绿色", "身形修长，表情清冷"], care: ["保持环境稳定", "低频梳毛即可", "用温和互动建立信任"], photos: ["https://cdn2.thecatapi.com/images/DdmsQrCAv.jpg", "https://cdn2.thecatapi.com/images/xZysIjSqa.jpg", "https://cdn2.thecatapi.com/images/dK0max215.jpg", "https://cdn2.thecatapi.com/images/ErPMMvcv2.jpg"] },
  { slug: "sphynx", name: "斯芬克斯猫", categories: ["short", "active"], summary: "几乎无毛、皮肤触感独特，怕冷又黏人。", intro: "斯芬克斯猫外形独特，常常亲人黏人。它们没有普通毛发保护，所以更怕冷，也需要定期清洁皮肤油脂。", identify: ["几乎无毛，皮肤皱褶明显", "耳朵较大，脸型轮廓强", "身体触感温热"], care: ["注意保暖", "定期清洁皮肤油脂", "避免长时间强烈日晒"], photos: ["https://cdn2.thecatapi.com/images/h8dnuSch3.jpg", "https://cdn2.thecatapi.com/images/JKITuMU25.jpg", "https://cdn2.thecatapi.com/images/oMrk721sl.png", "https://cdn2.thecatapi.com/images/bRLzjs5nf.jpg"] },
  { slug: "norwegian", name: "挪威森林猫", categories: ["long", "active"], summary: "厚实长毛、健壮体型和自然野性，是它的魅力。", intro: "挪威森林猫毛发厚实，适应寒冷环境，喜欢攀爬和活动。外形看起来野性，但通常能与家庭建立友好关系。", identify: ["双层长毛，颈部和尾部毛量足", "体型健壮，后腿有力", "整体轮廓自然粗犷"], care: ["定期梳理双层毛", "准备可攀爬空间", "换毛季加强清理"], photos: ["https://cdn2.thecatapi.com/images/PEgob-hhL.jpg", "https://cdn2.thecatapi.com/images/JqnhXlI_b.jpg", "https://cdn2.thecatapi.com/images/wJyw82pIl.jpg", "https://cdn2.thecatapi.com/images/-ZBBqoWNQ.jpg"] },
  { slug: "scottish", name: "苏格兰折耳猫", categories: ["short", "beginner"], summary: "折耳和圆脸很容易被认出，但健康问题需要格外重视。", intro: "苏格兰折耳猫耳朵向前折，表情圆润可爱。折耳特征与骨骼健康风险相关，了解时不应只看外貌。", identify: ["耳朵向前、向下折", "脸型圆润，眼睛大", "整体外形柔和可爱"], care: ["关注关节和活动状态", "避免过度追求折耳外形", "定期体检，异常及时咨询兽医"], photos: ["https://cdn2.thecatapi.com/images/tOGSsMx5J.jpg", "https://cdn2.thecatapi.com/images/hd-zs3918.jpg", "https://cdn2.thecatapi.com/images/IOqJ6RK7L.jpg", "https://cdn2.thecatapi.com/images/Tbc8_VStM.jpg"] },
  { slug: "birman", name: "伯曼猫", categories: ["long", "beginner"], summary: "蓝眼睛、重点色和白手套，是它温柔的视觉标志。", intro: "伯曼猫性格通常温和亲人，毛发半长，重点色清晰。适合安静陪伴。", identify: ["蓝色眼睛和重点色明显", "四爪常有白色手套感", "毛发半长，整体柔和"], care: ["每周多次梳毛", "留意眼周和爪部清洁", "保持规律陪伴"], photos: ["https://cdn2.thecatapi.com/images/TzyZJUeIM.jpg", "https://cdn2.thecatapi.com/images/Dm0H1zSK1.jpg", "https://cdn2.thecatapi.com/images/xRMeDCybn.jpg", "https://cdn2.thecatapi.com/images/2LEN_GHmx.jpg"] },
  { slug: "bombay", name: "孟买猫", categories: ["short", "beginner"], summary: "黑色短毛和明亮眼睛，像小黑豹一样有气质。", intro: "孟买猫通常亲人、适应力好，黑色亮毛很有辨识度。适合喜欢短毛、低护理压力猫咪的人。", identify: ["全身黑色短毛，光泽明显", "眼睛多为金色或铜色", "身体结实但不笨重"], care: ["偶尔梳毛保持光泽", "控制饮食，避免发胖", "给予稳定互动和玩具"], photos: ["https://cdn2.thecatapi.com/images/BkksyH95Z.jpg", "https://cdn2.thecatapi.com/images/5iYq9NmT1.jpg", "https://cdn2.thecatapi.com/images/Bc0CMLOjz.jpg", "https://cdn2.thecatapi.com/images/aZii7hC77.jpg"] },
  { slug: "oriental", name: "东方短毛猫", categories: ["short", "active"], summary: "细长身形、大耳朵和外向性格，是主要特点。", intro: "东方短毛猫活泼聪明、爱交流，和暹罗猫有相似外向气质，适合喜欢强互动的家庭。", identify: ["身形细长，四肢修长", "耳朵大，脸型楔形", "花色变化多，轮廓一致"], care: ["每天陪玩和交流", "注意保暖", "提供攀爬和探索空间"], photos: ["https://cdn2.thecatapi.com/images/0eVXT8_lb.jpg", "https://cdn2.thecatapi.com/images/UYp1-LQxI.jpg", "https://cdn2.thecatapi.com/images/Mt-cUeiUY.jpg", "https://cdn2.thecatapi.com/images/6y4uxeRjW.jpg"] },
  { slug: "munchkin", name: "曼基康猫", categories: ["short", "active"], summary: "短腿是明显特征，但活动和关节状态要认真关注。", intro: "曼基康猫因短腿出名，性格多半外向亲人。了解它时不能只看可爱外表，也要留意活动能力和健康评估。", identify: ["四肢明显较短", "身体长度和普通猫接近", "走路姿态很有辨识度"], care: ["避免过高跳落", "关注脊柱和关节状态", "选择低入口猫砂盆和合适家具"], photos: ["https://cdn2.thecatapi.com/images/mZZzMlywy.jpg", "https://cdn2.thecatapi.com/images/yFqH0s2H_.jpg", "https://cdn2.thecatapi.com/images/uk0SrrBbQ.jpg", "https://cdn2.thecatapi.com/images/vDFI6jI2O.jpg"] },
  { slug: "burmese", name: "缅甸猫", categories: ["short", "beginner"], summary: "短毛、圆润、亲人，是适合陪伴的品种。", intro: "缅甸猫通常非常亲近人，喜欢参与家庭生活。毛发短，护理较轻松，但需要稳定互动。", identify: ["短毛细腻，身体紧实", "脸部柔和，眼睛圆润", "常见暖色系毛色"], care: ["多陪伴，避免长期孤单", "偶尔梳毛即可", "用游戏保持活力和体重"], photos: ["https://cdn2.thecatapi.com/images/92D9NZLs0.jpg", "https://cdn2.thecatapi.com/images/4lXnnfxac.jpg", "https://cdn2.thecatapi.com/images/hj7Oh-SRY.jpg", "https://cdn2.thecatapi.com/images/Mdr6QqID0.jpg"] },
  { slug: "snowshoe", name: "雪鞋猫", categories: ["short", "beginner"], summary: "重点色、白脚和脸部白斑，让雪鞋猫干净醒目。", intro: "雪鞋猫通常亲人、活泼但不过度吵闹。白脚像穿小鞋，是名字和外形来源。", identify: ["四脚白色明显", "脸部常见白色倒 V 或白斑", "身体有重点色特征"], care: ["每周梳毛即可", "保持爪部和白色毛发清洁", "给予稳定互动"], photos: ["https://cdn2.thecatapi.com/images/QTV5QVt_L.jpg", "https://cdn2.thecatapi.com/images/uTFc4z0wP.jpg", "https://cdn2.thecatapi.com/images/S1CN1w6Bt.jpg", "https://cdn2.thecatapi.com/images/Fcy0D9oI1.jpg"] },
  { slug: "toyger", name: "玩具虎猫", categories: ["short", "active"], summary: "虎纹感花色带来很强的视觉辨识度。", intro: "玩具虎猫条纹像缩小版老虎，性格通常外向活泼，需要游戏、探索和规律消耗精力。", identify: ["短毛上有清晰虎纹", "身体线条结实", "脸部和身体条纹协调"], care: ["每天安排活动", "提供抓板和攀爬点", "控制饮食，保持肌肉感"], photos: ["https://cdn2.thecatapi.com/images/nHrt_0PV3.jpg", "https://cdn2.thecatapi.com/images/O3F3_S1XN.jpg", "https://cdn2.thecatapi.com/images/Qjb0fsrDo.jpg", "https://cdn2.thecatapi.com/images/NoQGHgPl7.jpg"] }
];

const heatRanking = [
  { rank: 1, slug: "maine", score: 100, note: "CFA 2026榜单第1名，体型和亲人性格都很受关注。" },
  { rank: 2, slug: "ragdoll", score: 94, note: "蓝眼睛和温顺气质让布偶猫长期保持高人气。" },
  { rank: 3, slug: "persian", score: 88, note: "经典长毛猫代表，优雅外形和安静气质辨识度很高。" },
  { rank: 4, slug: "exotic", score: 82, note: "圆脸短毛，兼具波斯猫气质和更轻松的毛发护理。" },
  { rank: 5, slug: "devon", score: 76, note: "大耳朵和卷毛外形突出，是短毛品种里的高热度选择。" },
  { rank: 6, slug: "abyssinian", score: 70, note: "灵活、好奇、运动感强，适合喜欢互动的人。" },
  { rank: 7, slug: "british", score: 64, note: "圆脸、短毛、安静稳重，拥有广泛认知度。" },
  { rank: 8, slug: "siberian", score: 58, note: "厚毛和强壮体型很有吸引力，关注度持续提升。" },
  { rank: 9, slug: "american", score: 52, note: "体格结实、适应力好，是经典家庭陪伴猫。" },
  { rank: 10, slug: "russian", score: 46, note: "银蓝短毛与绿色眼睛带来清冷高级感。" }
];

const catDetails = Object.fromEntries(breedCatalog.map((breed) => [breed.slug, {
  ...breed,
  tag: breed.categories.map((category) => categoryNames[category]).filter(Boolean).join(" · ")
}]));

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[character]));
}

function renderBreedCards() {
  if (!catGrid) return;
  catGrid.innerHTML = breedCatalog.map((breed) => {
    const detail = catDetails[breed.slug];
    return `
      <article class="cat-card" tabindex="0" role="button" data-slug="${escapeHtml(breed.slug)}" data-category="${escapeHtml(breed.categories.join(" "))}">
        <figure class="card-image-frame"><img src="${escapeHtml(detail.photos[0])}" alt="${escapeHtml(detail.name)}" /></figure>
        <div class="cat-card-body"><span>${escapeHtml(detail.tag)}</span><h3>${escapeHtml(detail.name)}</h3><p>${escapeHtml(detail.summary)}</p></div>
      </article>
    `;
  }).join("");
  cards = [...catGrid.querySelectorAll(".cat-card")];
  bindCardEvents();
}

function renderRanking() {
  if (!rankingBoard) return;
  rankingBoard.innerHTML = heatRanking.map((item, index) => {
    const detail = catDetails[item.slug];
    const delay = `${index * 80}ms`;
    return `
      <article class="rank-card" tabindex="0" role="button" data-slug="${escapeHtml(item.slug)}" aria-label="查看${escapeHtml(detail.name)}详情" style="--rank-width: ${item.score}%; animation-delay: ${delay};">
        <div class="rank-number">${item.rank}</div>
        <figure class="rank-photo"><img src="${escapeHtml(detail.photos[0])}" alt="${escapeHtml(detail.name)}" /></figure>
        <div class="rank-info">
          <span class="rank-source">CFA 2026 热度参考</span>
          <h3>${escapeHtml(detail.name)}</h3>
          <p>${escapeHtml(item.note)}</p>
          <span class="rank-open">查看详情</span>
        </div>
        <div class="rank-meter" aria-label="${escapeHtml(detail.name)}热度 ${item.score}">
          <div class="rank-meter-label"><span>热度指数</span><strong>${item.score}</strong></div>
          <div class="rank-track"><span class="rank-bar"></span></div>
        </div>
      </article>
    `;
  }).join("");
  bindRankingEvents();
}

function openFeedback() {
  feedbackPanel?.classList.add("is-open");
  feedbackPanel?.setAttribute("aria-hidden", "false");
  feedbackTab?.setAttribute("aria-expanded", "true");
}

function closeFeedback() {
  feedbackPanel?.classList.remove("is-open");
  feedbackPanel?.setAttribute("aria-hidden", "true");
  feedbackTab?.setAttribute("aria-expanded", "false");
}

function localFeedbacks() {
  try {
    return JSON.parse(localStorage.getItem("noah-feedbacks") || "[]");
  } catch {
    return [];
  }
}

function saveLocalFeedback(feedback) {
  const feedbacks = localFeedbacks();
  feedbacks.unshift(feedback);
  localStorage.setItem("noah-feedbacks", JSON.stringify(feedbacks));
}

async function submitFeedback(event) {
  event.preventDefault();
  const data = new FormData(feedbackForm);
  const message = String(data.get("message") || "").trim();
  if (!message) {
    feedbackStatus.textContent = "请先写下反馈内容。";
    return;
  }

  const feedback = {
    id: Date.now(),
    name: String(data.get("name") || "匿名").trim() || "匿名",
    contact: String(data.get("contact") || "").trim(),
    type: String(data.get("type") || "其他"),
    message,
    page: location.href,
    createdAt: new Date().toISOString()
  };

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback)
    });
    if (!response.ok) throw new Error("request failed");
  } catch {
    saveLocalFeedback(feedback);
  }

  feedbackForm.reset();
  feedbackStatus.textContent = "已收到反馈，谢谢你的建议。";
  setTimeout(closeFeedback, 900);
}

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === currentSlide));
  dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === currentSlide));
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => showSlide(Number(dot.dataset.slide)));
});

if (slides.length) setInterval(() => showSlide(currentSlide + 1), 5200);

function filteredCards() {
  return cards.filter((card) => {
    const categories = card.dataset.category.split(" ");
    const detail = catDetails[card.dataset.slug];
    const text = [card.textContent, detail.name, detail.tag, detail.summary, detail.intro, detail.identify.join(" "), detail.care.join(" ")].join(" ").toLowerCase();
    const matchesCategory = currentFilter === "all" || categories.includes(currentFilter);
    const matchesSearch = !searchTerm || text.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
}

function renderPage(page = 1) {
  const available = filteredCards();
  const totalPages = Math.max(1, Math.ceil(available.length / pageSize));
  currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = new Set(available.slice(start, start + pageSize));

  cards.forEach((card) => card.classList.toggle("is-hidden", !visible.has(card)));
  if (emptyState) emptyState.hidden = available.length > 0;
  if (!pagination) return;

  pagination.innerHTML = "";
  pagination.hidden = available.length === 0;
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "page-button";
    button.textContent = `第 ${pageNumber} 页`;
    button.classList.toggle("is-active", pageNumber === currentPage);
    button.addEventListener("click", () => renderPage(pageNumber));
    pagination.append(button);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderPage(1);
  });
});

searchInput?.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderPage(1);
});

function fillList(list, items) {
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  });
}

function setDetailPhoto(src, name) {
  detailMainPhoto.src = src;
  detailMainPhoto.alt = `${name}照片`;
  [...detailThumbs.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("is-active", button.dataset.photo === src);
  });
}

function openDetail(slug) {
  const detail = catDetails[slug];
  if (!detail || !modal) return;

  detailTag.textContent = detail.tag;
  detailTitle.textContent = detail.name;
  detailSummary.textContent = detail.summary;
  detailIntro.textContent = detail.intro;
  fillList(detailIdentify, detail.identify);
  fillList(detailCare, detail.care);

  detailThumbs.innerHTML = "";
  detail.photos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.photo = photo;
    button.classList.toggle("is-active", index === 0);
    button.innerHTML = `<img src="${escapeHtml(photo)}" alt="${escapeHtml(detail.name)}照片 ${index + 1}">`;
    button.addEventListener("click", () => setDetailPhoto(photo, detail.name));
    detailThumbs.append(button);
  });
  setDetailPhoto(detail.photos[0], detail.name);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  modal?.classList.remove("is-open");
  modal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function bindCardEvents() {
  cards.forEach((card) => {
    card.addEventListener("click", () => openDetail(card.dataset.slug));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetail(card.dataset.slug);
      }
    });
  });
}

function bindRankingEvents() {
  rankingBoard?.querySelectorAll(".rank-card").forEach((card) => {
    card.addEventListener("click", () => openDetail(card.dataset.slug));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetail(card.dataset.slug);
      }
    });
  });
}

function createPawTrail(event) {
  if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
  const now = performance.now();
  if (createPawTrail.lastTime && now - createPawTrail.lastTime < 58) return;
  createPawTrail.lastTime = now;

  const paw = document.createElement("span");
  const color = Math.random() > 0.5 ? "rgba(116, 166, 198, 0.62)" : "rgba(213, 123, 69, 0.48)";
  const driftX = (Math.random() - 0.5) * 26;
  const driftY = -16 - Math.random() * 18;
  const rotate = -24 + Math.random() * 48;
  paw.className = "paw-trail";
  paw.style.setProperty("--paw-x", `${event.clientX - 14}px`);
  paw.style.setProperty("--paw-y", `${event.clientY - 12}px`);
  paw.style.setProperty("--paw-end-x", `${event.clientX - 14 + driftX}px`);
  paw.style.setProperty("--paw-end-y", `${event.clientY - 12 + driftY}px`);
  paw.style.setProperty("--paw-rotate", `${rotate}deg`);
  paw.style.setProperty("--paw-color", color);
  paw.innerHTML = "<span></span><span></span>";
  document.body.append(paw);
  paw.addEventListener("animationend", () => paw.remove(), { once: true });
}

closeButtons.forEach((button) => button.addEventListener("click", closeDetail));
feedbackTab?.addEventListener("click", openFeedback);
feedbackClose?.addEventListener("click", closeFeedback);
feedbackForm?.addEventListener("submit", submitFeedback);
document.addEventListener("pointermove", createPawTrail, { passive: true });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDetail();
    closeFeedback();
  }
});

renderRanking();
renderBreedCards();
renderPage(1);
