const DEMO_JOBS = [
  {id:1,title:'AI 产品运营（校招）',company:'青屿科技（虚构）',mark:'青',city:'北京',category:'产品 / 运营',salaryK:18,range:'15–22K',degree:'本科及以上',experience:'应届 / 经验不限',work:'混合办公',rating:4.6,reviewCount:28,tags:['AI应用','用户研究','校招'],match:94,reason:'方向符合 · 校招岗位 · 薪资达到偏好',review:'样例评价提及团队沟通较顺畅；也有人希望新人培养计划写得更具体。',desc:'参与智能办公产品的用户调研、需求梳理与上线运营，协同产品和算法团队推动功能迭代。',requirements:'关注生成式 AI 产品；具备数据分析或用户研究基础；能清晰表达问题与方案。'},
  {id:2,title:'数据分析师（应届生）',company:'澄明出行（虚构）',mark:'澄',city:'上海',category:'数据 / 分析',salaryK:20,range:'18–25K',degree:'本科及以上',experience:'应届毕业生',work:'现场办公',rating:4.2,reviewCount:41,tags:['数据分析','SQL','应届'],match:89,reason:'数据方向符合 · 应届可投 · 技能要求有挑战',review:'样例评价认为业务节奏较快，能接触真实项目；建议面试前确认团队工时安排。',desc:'支持业务团队搭建指标体系、分析用户与运营数据，通过实验分析为业务决策提供依据。',requirements:'熟悉 SQL 与至少一种分析工具；具备统计学基础；有课程项目或实习经历更佳。'},
  {id:3,title:'智能制造解决方案助理',company:'原点机器人（虚构）',mark:'原',city:'苏州',category:'工程 / 制造',salaryK:16,range:'13–19K',degree:'本科及以上',experience:'应届 / 经验不限',work:'现场办公',rating:4.5,reviewCount:19,tags:['智能制造','项目协作','出差少量'],match:87,reason:'制造方向相关 · 接受应届 · 薪资符合',review:'样例评价对跨部门学习机会评价较好；项目交付期可能需要短期出差。',desc:'协助梳理制造现场需求，参与视觉质检与设备预测维护方案的测试、交付和效果复盘。',requirements:'自动化、计算机、工业工程等相关专业；沟通能力强；愿意了解一线业务场景。'},
  {id:4,title:'用户研究助理（AI教育）',company:'知禾教育（虚构）',mark:'知',city:'杭州',category:'产品 / 运营',salaryK:14,range:'12–17K',degree:'本科及以上',experience:'应届毕业生',work:'混合办公',rating:4.7,reviewCount:16,tags:['用户研究','教育科技','校招'],match:91,reason:'教育方向匹配 · 校招岗位 · 可积累研究经验',review:'样例评价认可同事氛围；对岗位成长路径的信息较少，建议面试时主动了解。',desc:'参与学习产品的访谈、可用性测试和反馈整理，协助评估 AI 学习功能的实际体验。',requirements:'对教育场景有兴趣；掌握访谈或问卷基础方法；有研究报告或课程项目作品更佳。'},
  {id:5,title:'算法工程师（智能检索）',company:'云砺计算（虚构）',mark:'云',city:'深圳',category:'算法 / 研发',salaryK:27,range:'22–35K',degree:'硕士优先',experience:'应届 / 经验不限',work:'现场办公',rating:4.1,reviewCount:35,tags:['机器学习','NLP','研发'],match:78,reason:'算法方向相符 · 学历要求需确认 · 薪资较高',review:'样例评价认为技术问题有深度；面试流程轮次较多，建议提前询问安排。',desc:'参与企业知识库和智能检索系统的模型优化、离线评测与线上效果分析。',requirements:'计算机或相关专业；掌握机器学习和 NLP 基础；有论文、竞赛或项目经验优先。'},
  {id:6,title:'可持续发展数据专员',company:'青禾咨询（虚构）',mark:'禾',city:'成都',category:'数据 / 分析',salaryK:13,range:'11–16K',degree:'本科及以上',experience:'应届 / 经验不限',work:'混合办公',rating:4.4,reviewCount:12,tags:['ESG','数据整理','咨询'],match:84,reason:'数据能力可迁移 · 接受应届 · 薪资区间较稳',review:'样例反馈认为跨行业项目视野广；项目繁忙时需要协调多个客户节点。',desc:'协助企业整理可持续发展数据，开展指标分析并参与 AI 辅助报告工具的验证。',requirements:'具备数据整理能力；关注可持续发展议题；文字表达和团队协作能力较好。'}
];

const $ = s => document.querySelector(s);
const JOBS_KEY = 'career-bosshunter-jobs-v1';
let importedJobs = loadImportedJobs();
let jobs = importedJobs.length ? importedJobs : DEMO_JOBS;
let isImported = importedJobs.length > 0;
let saved;
try { saved = new Set(JSON.parse(localStorage.getItem('career-saved') || '[]').map(String)); }
catch { saved = new Set(); }
const city = $('#city');
const category = $('#category');

function loadImportedJobs() {
  try {
    const data = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]');
    return Array.isArray(data) ? data.filter(j => j && j.imported === true) : [];
  } catch { return []; }
}
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function safeJobURL(value) {
  try {
    const url = new URL(String(value || ''));
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || !(host === 'zhipin.com' || host.endsWith('.zhipin.com') || host === '51job.com' || host.endsWith('.51job.com'))) return '';
    return url.href;
  } catch { return ''; }
}
function syncFilterOptions() {
  const keepCity = city.value;
  const keepCategory = category.value;
  const fill = (select, label, values, keep) => {
    select.replaceChildren(new Option(label, ''));
    [...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-CN')).forEach(value => {
      const option = new Option(value, value);
      select.add(option);
    });
    if ([...select.options].some(option => option.value === keep)) select.value = keep;
  };
  fill(city, '全部城市', jobs.map(j => j.city), keepCity);
  fill(category, '全部方向', jobs.map(j => j.category), keepCategory);
}
function parseCSV(text) {
  const rows=[]; let row=[]; let field=''; let quoted=false;
  text = text.replace(/^\uFEFF/, '');
  for (let i=0; i<text.length; i++) {
    const ch=text[i];
    if (quoted) {
      if (ch === '"' && text[i+1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted=false;
      else field += ch;
    } else if (ch === '"' && field.length === 0) quoted=true;
    else if (ch === ',') { row.push(field); field=''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i+1] === '\n') i++;
      row.push(field); rows.push(row); row=[]; field='';
    } else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => String(cell).trim() !== ''));
}
function parseSalaryK(raw) {
  const value=String(raw || '').replace(/,/g,'').trim();
  if (!value || /面议|保密|不限/i.test(value)) return 0;
  const first=value.match(/(\d+(?:\.\d+)?)\s*(万|w|k|千)/i);
  if (!first) return 0;
  let amount=Number(first[1]);
  const unit=first[2].toLowerCase();
  if (unit === '万' || unit === 'w') amount *= 10;
  if (value.includes('年') && !value.includes('月')) amount /= 12;
  return Number.isFinite(amount) ? amount : 0;
}
function inferCategory(text) {
  if (/算法|研发|开发|工程师|后端|前端|测试|软件|硬件|技术/.test(text)) return '算法 / 研发';
  if (/数据|分析|统计|商业智能|BI/.test(text)) return '数据 / 分析';
  if (/产品|运营|用户研究|市场|内容/.test(text)) return '产品 / 运营';
  if (/制造|自动化|机械|工艺|质量|设备/.test(text)) return '工程 / 制造';
  return '其他 / 未分类';
}
function importBossHunterCSV(text) {
  const rows=parseCSV(text);
  if (rows.length < 2) throw new Error('CSV 没有职位记录。');
  const headers=rows[0].map(h=>String(h).trim().replace(/^\uFEFF/,''));
  const index=new Map(headers.map((h,i)=>[h.toLowerCase(),i]));
  const get=(cells,...names)=>{
    for (const name of names) {
      const i=index.get(name.toLowerCase());
      if (i !== undefined) return String(cells[i] || '').trim();
    }
    return '';
  };
  const titleColumn=['职位','title','岗位名称','job title'].some(h=>index.has(h));
  const companyColumn=['公司','company','公司名称'].some(h=>index.has(h));
  if (!titleColumn || !companyColumn) throw new Error('找不到 BossHunter CSV 的“职位”和“公司”列。');
  const imported=[];
  for (const cells of rows.slice(1)) {
    const title=get(cells,'职位','title','岗位名称','job title');
    const company=get(cells,'公司','company','公司名称');
    if (!title && !company) continue;
    const salary=get(cells,'薪资','salary');
    const cityName=get(cells,'城市','city','工作城市');
    const jd=get(cells,'JD','岗位描述','职位描述','description');
    const degree=get(cells,'学历要求','学历','education');
    const experience=get(cells,'工作经验','经验要求','experience');
    const source=get(cells,'来源平台','平台','source_platform_label','source platform') || 'BossHunter 导出';
    const sourceJobId=get(cells,'来源岗位 ID','来源职位 ID','source_job_id','source job id');
    const url=get(cells,'岗位链接','职位链接','url','job url');
    const safeUrl=safeJobURL(url);
    const idx=imported.length;
    imported.push({
      id:`bh-${String(sourceJobId || idx+1).replace(/[^\w-]/g,'').slice(0,60) || idx+1}-${idx}`,
      imported:true,
      title, company, mark:Array.from(company)[0] || '职', city:cityName || '未标注城市',
      category:inferCategory(`${title} ${jd}`), salaryK:parseSalaryK(salary), range:salary || '薪资面议',
      degree:degree || '未标注学历', experience:experience || '未标注经验', work:'以原职位页面为准',
      tags:[source,'本机导入'], match:null, reason:'来自本机 BossHunter 导出 · 未计算偏好匹配',
      review:'文件未提供授权的企业评价数据。', rating:null, reviewCount:0,
      desc:jd || '导出文件未包含 JD。请打开原职位链接核实。',
      requirements:[degree,experience].filter(Boolean).join(' · ') || '请以原职位页面为准。',
      source, url:safeUrl, sourceJobId
    });
    if (imported.length >= 1000) break;
  }
  if (!imported.length) throw new Error('CSV 中没有可识别的职位记录。');
  return imported;
}
function render() {
  syncFilterOptions();
  const kw=$('#keyword').value.trim().toLowerCase();
  const c=city.value, cat=category.value, minSalary=Number($('#salary').value), sort=$('#sort').value;
  const savedMode=$('#saved-nav').dataset.mode==='saved';
  let list=jobs.filter(j=>(!savedMode||saved.has(String(j.id))) && (!kw||[j.title,j.company,j.category,j.desc,j.requirements,...(j.tags||[])].join(' ').toLowerCase().includes(kw)) && (!c||j.city===c) && (!cat||j.category===cat) && (Number(j.salaryK||0)>=minSalary));
  if (sort==='salary') list.sort((a,b)=>(b.salaryK||0)-(a.salaryK||0));
  if (sort==='rating') list.sort((a,b)=>(b.rating??-1)-(a.rating??-1));
  if (sort==='match') list.sort((a,b)=>(b.match??-1)-(a.match??-1));
  $('#result-count').textContent=list.length;
  $('#saved-count').textContent=saved.size;
  $('#empty-state').hidden=list.length>0;
  $('#job-list').innerHTML=list.map(j=>{
    const tags=[j.degree,j.experience,j.work,...(j.tags||[])].filter(Boolean).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('');
    const indicator=j.imported
      ? '<span class="fit-badge">本机导入</span><span>未计算偏好匹配 · 请核实原职位</span><span class="review-mini">未导入企业评价</span>'
      : `<span class="fit-badge">条件相似度 ${escapeHTML(j.match)}%</span><span>${escapeHTML(j.reason)}</span><span class="review-mini">口碑样例 <strong>★ ${escapeHTML(j.rating)}</strong> · ${escapeHTML(j.reviewCount)} 条</span>`;
    return `<article class="job-card"><div class="job-top"><div class="company-mark">${escapeHTML(j.mark)}</div><div><div class="job-title">${escapeHTML(j.title)}</div><div class="company">${escapeHTML(j.company)} · ${escapeHTML(j.city)}</div></div></div><div class="salary">${escapeHTML(j.range)}<div class="company">薪资 · ${j.imported?'来源文件':'演示样例'}</div></div><div class="job-meta">${tags}</div><div class="job-actions"><button class="button" data-detail="${escapeHTML(j.id)}">岗位详情</button><button class="button primary" data-save="${escapeHTML(j.id)}">${saved.has(String(j.id))?'★ 已收藏':'☆ 收藏'}</button></div><div class="fit">${indicator}</div></article>`;
  }).join('');
  $('#active-filters').innerHTML=[kw&&`关键词：${kw}`,c&&`城市：${c}`,cat&&`方向：${cat}`,minSalary&&`薪资：${minSalary}K+`].filter(Boolean).map(x=>`<span class="chip">${escapeHTML(x)}</span>`).join('');
  $('#clear-imported').hidden=!isImported;
  $('#import-status').textContent=isImported
    ? `当前只在此浏览器显示 ${jobs.length} 条导入职位；数据保存在本机浏览器，不会上传到网站。`
    : '当前显示课程演示样例。BossHunter 导出文件只在本机浏览器读取。';
}

['keyword','city','category','salary','sort'].forEach(id=>$('#'+id).addEventListener(id==='keyword'?'input':'change',render));
$('#reset-filters').onclick=()=>{$('#keyword').value='';city.value='';category.value='';$('#salary').value='0';render()};
$('#saved-nav').onclick=()=>{const savedMode=$('#saved-nav').dataset.mode!=='saved';$('#saved-nav').dataset.mode=savedMode?'saved':'';$('#saved-nav span').textContent=savedMode?'查看全部':'收藏';render()};
$('#boss-file').addEventListener('change',async event=>{
  const file=event.target.files?.[0];
  event.target.value='';
  if (!file) return;
  if (file.size>10*1024*1024) { $('#import-status').textContent='文件超过 10 MB，请在 BossHunter 中缩小导出范围。'; return; }
  try {
    const records=importBossHunterCSV(await file.text());
    jobs=records; isImported=true;
    try { localStorage.setItem(JOBS_KEY,JSON.stringify(records)); }
    catch { $('#import-status').textContent='已导入本页，但浏览器未能保存；刷新后将恢复演示样例。'; }
    $('#keyword').value='';city.value='';category.value='';$('#salary').value='0';
    $('#saved-nav').dataset.mode='';$('#saved-nav span').textContent='收藏';
    render();
  } catch (error) {
    $('#import-status').textContent=`导入失败：${error instanceof Error?error.message:'无法读取 CSV 文件'}`;
  }
});
$('#clear-imported').onclick=()=>{
  localStorage.removeItem(JOBS_KEY); jobs=DEMO_JOBS; isImported=false;
  $('#keyword').value='';city.value='';category.value='';$('#salary').value='0';
  render();
};
document.addEventListener('click',event=>{
  const detailButton=event.target.closest('[data-detail]');
  const saveButton=event.target.closest('[data-save]');
  if (saveButton) {
    const id=String(saveButton.dataset.save);
    saved.has(id)?saved.delete(id):saved.add(id);
    localStorage.setItem('career-saved',JSON.stringify([...saved]));
    render();
  }
  if (detailButton) {
    const job=jobs.find(j=>String(j.id)===String(detailButton.dataset.detail));
    if (!job) return;
    const sourceLink=job.imported&&safeJobURL(job.url)
      ? `<a href="${escapeHTML(safeJobURL(job.url))}" target="_blank" rel="noopener noreferrer">打开来源职位页面 ↗</a>`
      : '';
    const match=job.imported
      ? '<span class="fit-badge">本机导入</span><span>未计算偏好匹配</span>'
      : `<span class="fit-badge">条件相似度 ${escapeHTML(job.match)}%</span><span>${escapeHTML(job.reason)}</span>`;
    const review=job.imported
      ? '<div class="detail-block"><h3>企业评价</h3><p>BossHunter 导出文件未提供评价。此页面不会采集或展示求职者评论。</p></div>'
      : `<div class="detail-block"><h3>企业评价摘要 <span class="rating-large">★ ${escapeHTML(job.rating)}</span></h3><p>${escapeHTML(job.review)}</p><p>评价数：${escapeHTML(job.reviewCount)}（虚构演示数据）</p></div>`;
    $('#detail-content').innerHTML=`<div class="eyebrow">${job.imported?'BossHunter 本机导入':'岗位详情 / 演示样例'}</div><h2>${escapeHTML(job.title)}</h2><div class="detail-company">${escapeHTML(job.company)} · ${escapeHTML(job.city)} · ${escapeHTML(job.work)}</div><div class="detail-salary">${escapeHTML(job.range)}${job.imported?'':' / 月'}</div><div class="fit">${match}</div><div class="detail-block"><h3>工作内容 / JD</h3><p class="job-description">${escapeHTML(job.desc)}</p></div><div class="detail-block"><h3>要求</h3><p>${escapeHTML(job.requirements)}</p></div>${review}<p class="company">${job.imported?'导入字段只保留职位、公司、薪资、地区、经验、学历、JD 和平台职位链接；HR 姓名、简历路径、招呼语和 AI 分数会被丢弃。数据仅存当前浏览器。':'虚构样例，不代表真实招聘信息或真实评价。'}</p>${sourceLink}`;
    $('#detail-dialog').showModal();
  }
});
$('.dialog-close').onclick=()=>$('#detail-dialog').close();
$('#detail-dialog').addEventListener('click',event=>{if(event.target===$('#detail-dialog'))$('#detail-dialog').close()});
render();
