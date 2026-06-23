const feedbackList = document.querySelector(".feedback-list");
const adminEmpty = document.querySelector(".admin-empty");
const adminFilter = document.querySelector(".admin-filter");
const adminRefresh = document.querySelector(".admin-refresh");
const adminExport = document.querySelector(".admin-export");
const adminLogin = document.querySelector(".admin-login");
const adminContent = document.querySelector(".admin-content");
const adminLoginForm = document.querySelector(".admin-login-form");
const adminPassword = document.querySelector(".admin-password");
const adminLoginStatus = document.querySelector(".admin-login-status");

let feedbacks = [];
let adminToken = sessionStorage.getItem("noah-admin-token") || "";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[character]));
}

async function loadFeedbacks() {
  try {
    const response = await fetch("/api/feedback", {
      headers: { "X-Admin-Password": adminToken }
    });

    if (response.status === 401) {
      sessionStorage.removeItem("noah-admin-token");
      adminToken = "";
      adminContent.hidden = true;
      adminLogin.hidden = false;
      adminLoginStatus.textContent = "请先输入后台密码。";
      return;
    }

    if (!response.ok) throw new Error("request failed");
    feedbacks = await response.json();
    renderFeedbacks();
  } catch {
    adminLoginStatus.textContent = "暂时无法连接后台服务，请确认网站服务正在运行。";
  }
}

async function loginAdmin(event) {
  event.preventDefault();
  adminToken = adminPassword.value.trim();
  adminLoginStatus.textContent = "";

  try {
    const response = await fetch("/api/feedback", {
      headers: { "X-Admin-Password": adminToken }
    });

    if (response.status === 401) {
      adminLoginStatus.textContent = "密码不正确，请重新输入。";
      return;
    }

    if (!response.ok) throw new Error("request failed");
    sessionStorage.setItem("noah-admin-token", adminToken);
    feedbacks = await response.json();
    adminLogin.hidden = true;
    adminContent.hidden = false;
    renderFeedbacks();
  } catch {
    adminLoginStatus.textContent = "暂时无法连接后台服务，请确认网站服务正在运行。";
  }
}

function currentFeedbacks() {
  const type = adminFilter.value;
  return type === "all" ? feedbacks : feedbacks.filter((item) => item.type === type);
}

function renderFeedbacks() {
  const items = currentFeedbacks();
  adminEmpty.hidden = items.length > 0;
  feedbackList.innerHTML = items.map((item) => {
    const date = item.createdAt ? new Date(item.createdAt).toLocaleString("zh-CN") : "未知时间";
    return `
      <article class="feedback-item">
        <div class="feedback-item-head">
          <strong>${escapeHtml(item.type || "其他")}</strong>
          <time>${escapeHtml(date)}</time>
        </div>
        <p>${escapeHtml(item.message)}</p>
        <dl>
          <div><dt>称呼</dt><dd>${escapeHtml(item.name || "匿名")}</dd></div>
          <div><dt>联系方式</dt><dd>${escapeHtml(item.contact || "未填写")}</dd></div>
          <div><dt>页面</dt><dd>${escapeHtml(item.page || "未知页面")}</dd></div>
        </dl>
      </article>
    `;
  }).join("");
}

function exportCsv() {
  const rows = [["时间", "类型", "称呼", "联系方式", "反馈内容", "页面"], ...currentFeedbacks().map((item) => [
    item.createdAt || "",
    item.type || "",
    item.name || "",
    item.contact || "",
    item.message || "",
    item.page || ""
  ])];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "noah-feedback.csv";
  link.click();
  URL.revokeObjectURL(url);
}

adminFilter.addEventListener("change", renderFeedbacks);
adminRefresh.addEventListener("click", loadFeedbacks);
adminExport.addEventListener("click", exportCsv);
adminLoginForm.addEventListener("submit", loginAdmin);

if (adminToken) {
  adminLogin.hidden = true;
  adminContent.hidden = false;
  loadFeedbacks();
}
