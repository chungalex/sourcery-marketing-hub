import { useState, useEffect } from "react";

export type Language = "en" | "vi" | "zh";

const STORAGE_KEY = "sourcery_language";

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  return { lang, setLang };
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Factory onboarding
    "welcome.title": "Your account is ready.",
    "welcome.body": "Set up your factory profile in a few minutes and start managing orders with your brands — all in one place, with a full record of every order.",
    "welcome.cta": "Set up my profile",
    "welcome.bullet1.title": "Messages can be translated",
    "welcome.bullet1.sub": "Communicate in your language",
    "welcome.bullet2.title": "Every order has a paper trail",
    "welcome.bullet2.sub": "Specs, revisions, and payments all in one place",
    "welcome.bullet3.title": "Payments released only when you deliver",
    "welcome.bullet3.sub": "Milestone-based, protected for both sides",
    "welcome.bullet4.title": "Your performance score builds over time",
    "welcome.bullet4.sub": "More orders, better reputation",
    // Profile step
    "profile.title": "Your factory",
    "profile.sub": "This is what brands see first. Be specific.",
    "profile.desc.label": "About your factory",
    "profile.desc.placeholder": "What does your factory make? How many workers? What are you best at? A few sentences is enough.",
    "profile.year.label": "Year established",
    "profile.employees.label": "Total employees",
    "profile.website.label": "Website (optional)",
    "profile.phone.label": "WhatsApp / phone",
    // Capabilities
    "cap.title": "What you make",
    "cap.sub": "Brands filter by category. Be accurate.",
    "cap.categories.label": "Categories",
    "cap.moq.label": "Minimum order (units)",
    "cap.lead.label": "Lead time (weeks)",
    "cap.certs.label": "Certifications (optional)",
    // SLA
    "sla.title": "Response times",
    "sla.sub": "How quickly you respond is how brands choose between factories.",
    "sla.inquiries": "New inquiries",
    "sla.inquiries.time": "Within 24 hours",
    "sla.inquiries.note": "Brands move fast. A quick reply means they choose you.",
    "sla.messages": "Messages on active orders",
    "sla.messages.time": "Within 12 hours",
    "sla.messages.note": "Quick replies build trust. Slow replies cause worry.",
    "sla.samples": "Sample delivery",
    "sla.samples.time": "On the date you commit to",
    "sla.samples.note": "If something changes, tell the brand early. They can work with it.",
    "sla.cta": "Go to my dashboard",
    // Common
    "back": "Back",
    "continue": "Continue",
    "skip": "Skip for now",
    "done": "Done",
    "save": "Save profile",
  },
  vi: {
    // Factory onboarding
    "welcome.title": "Tài khoản của bạn đã sẵn sàng.",
    "welcome.body": "Thiết lập hồ sơ xưởng trong vài phút và bắt đầu quản lý đơn hàng với các thương hiệu — tất cả ở một nơi, với hồ sơ đầy đủ cho mọi đơn hàng.",
    "welcome.cta": "Thiết lập hồ sơ",
    "welcome.bullet1.title": "Tin nhắn có thể được dịch",
    "welcome.bullet1.sub": "Giao tiếp bằng ngôn ngữ của bạn",
    "welcome.bullet2.title": "Mọi đơn hàng đều có hồ sơ đầy đủ",
    "welcome.bullet2.sub": "Thông số, sửa đổi và thanh toán ở một nơi",
    "welcome.bullet3.title": "Thanh toán chỉ được giải phóng khi bạn giao hàng",
    "welcome.bullet3.sub": "Theo từng cột mốc, được bảo vệ cho cả hai bên",
    "welcome.bullet4.title": "Điểm hiệu suất của bạn tăng theo thời gian",
    "welcome.bullet4.sub": "Nhiều đơn hàng hơn, uy tín tốt hơn",
    // Profile
    "profile.title": "Xưởng của bạn",
    "profile.sub": "Đây là điều thương hiệu nhìn thấy đầu tiên. Hãy cụ thể.",
    "profile.desc.label": "Về xưởng của bạn",
    "profile.desc.placeholder": "Xưởng bạn sản xuất gì? Có bao nhiêu công nhân? Điểm mạnh là gì? Vài câu là đủ.",
    "profile.year.label": "Năm thành lập",
    "profile.employees.label": "Tổng số nhân viên",
    "profile.website.label": "Website (tùy chọn)",
    "profile.phone.label": "WhatsApp / điện thoại",
    // Capabilities
    "cap.title": "Bạn sản xuất gì",
    "cap.sub": "Thương hiệu lọc theo danh mục. Hãy chính xác.",
    "cap.categories.label": "Danh mục",
    "cap.moq.label": "Đơn hàng tối thiểu (đơn vị)",
    "cap.lead.label": "Thời gian sản xuất (tuần)",
    "cap.certs.label": "Chứng nhận (tùy chọn)",
    // SLA
    "sla.title": "Thời gian phản hồi",
    "sla.sub": "Tốc độ phản hồi của bạn là cách thương hiệu lựa chọn giữa các xưởng.",
    "sla.inquiries": "Yêu cầu mới",
    "sla.inquiries.time": "Trong vòng 24 giờ",
    "sla.inquiries.note": "Thương hiệu hành động nhanh. Phản hồi nhanh có nghĩa là họ chọn bạn.",
    "sla.messages": "Tin nhắn trong đơn hàng đang hoạt động",
    "sla.messages.time": "Trong vòng 12 giờ",
    "sla.messages.note": "Phản hồi nhanh tạo niềm tin. Phản hồi chậm gây lo lắng.",
    "sla.samples": "Giao mẫu",
    "sla.samples.time": "Đúng ngày đã cam kết",
    "sla.samples.note": "Nếu có thay đổi, hãy thông báo sớm cho thương hiệu. Họ có thể xử lý được.",
    "sla.cta": "Đến bảng điều khiển của tôi",
    // Common
    "back": "Quay lại",
    "continue": "Tiếp tục",
    "skip": "Bỏ qua",
    "done": "Xong",
    "save": "Lưu hồ sơ",
  },
  zh: {
    // Factory onboarding
    "welcome.title": "您的账户已准备好。",
    "welcome.body": "几分钟内设置您的工厂档案，开始与品牌一起管理订单——所有信息集中在一个地方，每个订单都有完整记录。",
    "welcome.cta": "设置我的档案",
    "welcome.bullet1.title": "消息可以翻译",
    "welcome.bullet1.sub": "用您的语言沟通",
    "welcome.bullet2.title": "每个订单都有完整记录",
    "welcome.bullet2.sub": "规格、修改和付款集中在一处",
    "welcome.bullet3.title": "仅在交货后释放付款",
    "welcome.bullet3.sub": "按里程碑付款，双方都受保护",
    "welcome.bullet4.title": "您的绩效评分随时间增长",
    "welcome.bullet4.sub": "更多订单，更好的声誉",
    // Profile
    "profile.title": "您的工厂",
    "profile.sub": "这是品牌首先看到的内容。请具体说明。",
    "profile.desc.label": "关于您的工厂",
    "profile.desc.placeholder": "您的工厂生产什么？有多少工人？您最擅长什么？几句话就够了。",
    "profile.year.label": "成立年份",
    "profile.employees.label": "员工总数",
    "profile.website.label": "网站（可选）",
    "profile.phone.label": "微信/手机",
    // Capabilities
    "cap.title": "您生产什么",
    "cap.sub": "品牌按类别筛选。请如实填写。",
    "cap.categories.label": "类别",
    "cap.moq.label": "最低起订量（件）",
    "cap.lead.label": "交货周期（周）",
    "cap.certs.label": "认证（可选）",
    // SLA
    "sla.title": "响应时间",
    "sla.sub": "您的响应速度是品牌选择工厂的方式。",
    "sla.inquiries": "新询价",
    "sla.inquiries.time": "24小时内",
    "sla.inquiries.note": "品牌行动迅速。快速回复意味着他们选择您。",
    "sla.messages": "活跃订单消息",
    "sla.messages.time": "12小时内",
    "sla.messages.note": "快速回复建立信任。慢速回复引起担忧。",
    "sla.samples": "样品交付",
    "sla.samples.time": "在承诺的日期",
    "sla.samples.note": "如有变化，尽早告知品牌。他们可以处理。",
    "sla.cta": "前往我的仪表板",
    // Common
    "back": "返回",
    "continue": "继续",
    "skip": "跳过",
    "done": "完成",
    "save": "保存档案",
  },
};

export function t(lang: Language, key: string): string {
  return translations[lang][key] || translations["en"][key] || key;
}
