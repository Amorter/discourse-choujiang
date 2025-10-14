import { apiInitializer } from "discourse/lib/api";

export default apiInitializer(api => {
  api.decorateCooked($elem => {
    const rawHtml = $elem.html();
    const match = rawHtml.match(/\[抽奖\]([\s\S]*?)\[\/抽奖\]/);
    if (!match) return;
    const content = match[1].replace(/<br>/g, '\n').replace(/<\/?[^>]+>/g, "");
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);
    let fields = {};
    lines.forEach(line => {
      let m = line.match(/^([^：:]+)[：:](.*)$/);
      if (m) fields[m[1].trim()] = m[2].trim();
    });
    let html = `
      <div class="choujiang-card">
        <div class="cj-title">🎉 抽奖活动：${fields["抽奖名称"] || ""}</div>
        <ul>
          <li><span>活动奖品：</span>${fields["活动奖品"] || ""}</li>
          <li><span>获奖人数：</span>${fields["获奖人数"] || ""}</li>
          <li><span>开奖时间：</span>${fields["开奖时间"] || ""}</li>
          <li><span>最低积分：</span>${fields["最低积分"] || ""}</li>
          <li><span>简单说明：</span>${fields["简单说明"] || ""}</li>
        </ul>
        <div class="cj-footer">欢迎参与，祝大家好运！ <a href="/t/topic/204" target="_blank">抽奖活动说明及发布方法</a></div>
      </div>
    `;
    // 只替换第一个[抽奖]块
    $elem.html(rawHtml.replace(/\[抽奖\][\s\S]*?\[\/抽奖\]/, html));
  });
});
