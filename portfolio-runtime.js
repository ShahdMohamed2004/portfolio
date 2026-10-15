/* =====================================================================
   EDIT YOUR CONTENT HERE
   This single object drives the whole site. Change a value below,
   save the file, and every section that uses it updates automatically.
   You can do this from a phone with any plain-text / code editor app —
   you never need to touch the HTML or CSS above.
   ===================================================================== */
const SITE = {

  name: "Shahd Mohamed",
  fullName: "Shahd Mohamed",
  title: "TEFL Graduate | Aspiring English Language Educator | Instructional & Assessment Design",
  heroNote: "exploring teaching & EdTech opportunities",
  heroHeadline: "Teaching to See, Learning to Be",
  heroLead: "TEFL graduate creating visual English lessons, practical assessments, and digital learning tools.",

  // Core links — update these once and every button across the site follows.
  links: {
    cv: "https://drive.google.com/file/d/16cr1k7iVTIZNDKl5tGr97EFSB0j0kQf6/view?usp=drivesdk",
    portfolioFolder: "https://drive.google.com/drive/folders/1_SgYq2bi8oCfyzkCNLl3ZWqLtBG197CM",
    linkedin: "https://www.linkedin.com/in/shahd-mohamed-5b2525294/",
    email: "shahdmohamed25042004@gmail.com",
    degreeCertificates: {
      en: "https://drive.google.com/file/d/1oEygDGRY-7iWa6sv3Oi2oX--IOU9Bpne/view?usp=drivesdk",
      ar: "https://drive.google.com/file/d/1VAiipDPb8_iw5ODrGcVe2RYvqtGJnufc/view?usp=drivesdk"
    }
  },

  credentials: [
    { degree: "B.A. in English Language and Translation", school: "MSA University", gpa: "3.57 / 4.00" },
    { degree: "Dual Degree", school: "University of Bedfordshire", gpa: "3.67 / 4.00" }
  ],

  about: {
    photo: "assets/about.webp", // optimized local asset, always renders without a Drive dependency
    bio: "I am a TEFL graduate and aspiring English language educator developing practical experience in English language education, instructional design, assessment, and digital learning projects. My academic and practical experience includes English teaching practice, ESP lesson design, active learning, visual instructional materials, and digital educational projects.",
  },

  whatIDo: [
    { title: "Teaching", desc: "Lesson planning, learner-centred instruction, classroom activities." },
    { title: "Assessment", desc: "Test design, rubrics, feedback, formative assessment." },
    { title: "Instructional Design", desc: "Visual learning materials and structured learning experiences." },
    { title: "EdTech", desc: "Digital tools and technology-supported language learning." }
  ],

  howITeach: [
    { num: "01", title: "Clear", desc: "Breaking complex language concepts into manageable steps." },
    { num: "02", title: "Visual", desc: "Using visual support to connect form, meaning, and use." },
    { num: "03", title: "Active", desc: "Giving learners opportunities to practise, apply, and communicate." },
    { num: "04", title: "Evidence-based", desc: "Using assessment and feedback to monitor learning." }
  ],

  projects: [
    {
      flag: "core project",
      category: "research",
      categories: ["research", "teaching", "design"],
      title: "Visual Timeline Grammar Framework",
      badges: ["Research paper", "PDF"],
      description: "A visual instructional design project exploring how timeline-based representations can make complex grammar concepts clearer and more accessible, informed by classroom practice and evidence.",
      stat: "Selected finding: 87% of students reported more active participation when timelines were used.",
      role: "Visual instructional design, grammar instruction, and evidence",
      tools: "Visual materials, lesson design, and research evidence",
      links: [
        { label: "View research paper", href: "https://drive.google.com/file/d/1pIi1WeTp2ButXIUmkPe9c7qRDW16YNRD/view?usp=drivesdk" },
        { label: "View presentation", href: "https://drive.google.com/file/d/1YrXIr2UZhCIzEGpfyUP6otY-UcJDNcRf/view?usp=drivesdk" },
      ]
    },
    {
      flag: "core project",
      category: "edtech",
      categories: ["edtech", "research", "teaching"],
      title: "Digital English Proficiency Test",
      badges: ["Interactive web app"],
      description: "A self-developed digital English proficiency assessment platform covering Reading, Listening, Writing, and Speaking. The work included assessment structure, test sections, digital implementation, user interaction, practical testing, troubleshooting, and AI-supported development.",
      stat: "",
      role: "Assessment design, digital implementation, testing, and AI-supported development",
      tools: "HTML, CSS, JavaScript, and digital assessment tools",
      links: [
        { label: "View assessment design", href: "https://drive.google.com/file/d/1BALXpg_gdcqjDVyqnIhxotggqtk6LEwM/view?usp=drivesdk" },
      ]
    },
    {
      flag: "design",
      category: "design",
      categories: ["design", "teaching"],
      title: "Magazine Design",
      badges: ["Magazine spread", "PDF"],
      description: "An editorial layout project applying visual hierarchy and typography principles to a full magazine spread, showcasing the same design instincts that shape the instructional materials above.",
      stat: "",
      role: "Layout and visual design",
      tools: "",
      links: [
        { label: "View project", href: "https://drive.google.com/file/d/13u2c-kkSqZoKD2gkwMNBxorCxDfAzR0Z/view?usp=drivesdk" }
      ]
    },
    {
      flag: "design",
      category: "design",
      categories: ["design", "teaching"],
      title: "Children's Book",
      badges: ["Illustrated book", "PDF"],
      description: "An original illustrated children's book, written and designed with the same clarity-first, visual approach used across the teaching materials.",
      stat: "",
      role: "Writing and illustration",
      tools: "",
      links: [
        { label: "View project", href: "https://drive.google.com/file/d/1k3P5Ghey9GbnXp6LlscjJw__NGehOkFB/view?usp=drivesdk" }
      ]
    },
    {
      flag: "design",
      category: "design",
      categories: ["design", "teaching"],
      title: "Storyboard",
      badges: ["Storyboard", "PDF"],
      description: "A scene-by-scene storyboard developed to plan a visual narrative before production, reflecting the same structured, sequential thinking behind the Visual Timeline framework.",
      stat: "",
      role: "Visual planning and sequencing",
      tools: "",
      links: [
        { label: "View project", href: "https://drive.google.com/file/d/1umoG5Ug0YQp3zhaUE-3iwTqhAnuFAbls/view?usp=drivesdk" }
      ]
    },
    {
      flag: "teaching demonstration",
      category: "teaching",
      categories: ["teaching", "research"],
      title: "Undergraduate Classroom Instruction",
      badges: ["Teaching Demonstration", "Classroom practice"],
      description: "Live classroom demonstration showcasing interactive instructional design, student engagement, and communicative grammar delivery.",
      stat: "",
      role: "Undergraduate classroom instruction",
      tools: "",
      video: "https://drive.google.com/file/d/1bjMdGG5RVQGelgc6v7RMqHMZYyT02hPS/preview",
      links: [
        { label: "Open teaching demonstration", href: "https://drive.google.com/file/d/1bjMdGG5RVQGelgc6v7RMqHMZYyT02hPS/preview" }
      ]
    }
  ],

  // Teaching materials — each card links straight to its own Drive folder.
  materials: [
    { title: "Certificates", href: "https://drive.google.com/drive/folders/1IlVHD_heQUisdcgzNAmCAjcgaJ_GM0nq" },
    { title: "Feedback", href: "https://drive.google.com/drive/folders/1_SgYq2bi8oCfyzkCNLl3ZWqLtBG197CM" },
    { title: "Resume (CV)", href: "https://drive.google.com/file/d/16cr1k7iVTIZNDKl5tGr97EFSB0j0kQf6/view?usp=drivesdk" },
    { title: "Research papers", href: "https://drive.google.com/drive/folders/1zHdqDdbPUsbgA7wvTLmoMu3spNnbPXPA" },
    { title: "Practical Work Videos", href: "https://drive.google.com/drive/folders/1g0XnzDUJwKrmgcFmbgFSgwUHkl_kAXGK" },
    { title: "Projects", href: "https://drive.google.com/drive/folders/1d2hgaLe5ASKrY-Op27gsmu6wMyygF70A" }
  ],
  experience: [
    {
      flag: "practicum",
      title: "English Teaching Practicum",
      place: "MSA University",
      dates: "Sep 2025 – May 2026",
      points: ["Lesson planning", "Classroom instruction", "Assessment design and administration", "Learner feedback"],
      evidence: { label: "View evidence", href: "https://drive.google.com/file/d/1bjMdGG5RVQGelgc6v7RMqHMZYyT02hPS/view?usp=drivesdk" }
    },
    {
      flag: "internship",
      title: "Teaching Internship",
      place: "Dar El Tarbiah Schools",
      dates: "Sep 2024 – May 2025",
      points: ["Classroom support", "Lesson delivery", "Learner feedback"],
      evidence: { label: "View portfolio folder", href: "https://drive.google.com/drive/folders/13a3g42U4qm-nW-uW2i9szL_il34Lo9EO" }
    }
  ],

  education: [
    {
      flag: "degree",
      title: "B.A. in English Language and Translation",
      place: "MSA University · GPA 3.57 / 4.00",
      links: [{ label: "View Egyptian degree certificate", href: "https://drive.google.com/file/d/1oEygDGRY-7iWa6sv3Oi2oX--IOU9Bpne/view?usp=drivesdk" }]
    },
    {
      flag: "degree",
      title: "Dual Degree",
      place: "University of Bedfordshire · GPA 3.67 / 4.00",
      links: []
    },
    {
      flag: "certification",
      title: "TEFL Major",
      place: "University major in Teaching English as a Foreign Language",
      links: []
    }
  ],

  development: [
    { title: "TEFL Major", place: "University major in Teaching English as a Foreign Language" },
    { title: "AI & Educational Technology", place: "Applied training in EdTech tools" },
    { title: "Presentation Skills", place: "Academic and professional presentation training" }
  ],

  skills: {
    teaching: [
      { name: "Lesson Planning" },
      { name: "Grammar Instruction" },
      { name: "Assessment" },
      { name: "Feedback" }
    ],
    soft: [
      { name: "Classroom Management" },
      { name: "Communication" },
      { name: "Adaptability" },
      { name: "Time Management" }
    ],
    hard: [
      { name: "Canva" },
      { name: "Microsoft Office" },
      { name: "AI Tools" },
      { name: "Digital Learning Tools" }
    ],
    languages: [
      { name: "Arabic", level: "Native" },
      { name: "English" },
      { name: "Spanish" }
    ]
  },

  creative: ["Photography", "Visual Storytelling", "Digital Design"],
  creativeLead: "A visual eye that carries over into the instructional design work above, from timeline diagrams to academic materials and instructional projects.",

  contact: {
    intro: "Interested in my teaching practice, educational projects, or potential opportunities in English language education? Feel free to get in touch."
  },

  footer: "Shahd Mohamed | TEFL Graduate & Aspiring English Language Educator"
};

/* =====================================================================
   ARABIC CONTENT — mirrors SITE field-for-field. Links stay identical
   to SITE.links; only display text is translated.
   ===================================================================== */
const SITE_AR = {
  name: "شهد محمد",
  fullName: "شهد محمد",
  title: "خريجة TEFL | معلمة لغة إنجليزية طموحة | التصميم التعليمي وتصميم التقييم",
  heroNote: "أستكشف فرص التدريس وتكنولوجيا التعليم",
  heroHeadline: "نُعلِّم لنُبصر، ونتعلَّم لنكون",
  heroLead: "خريجة TEFL أصمم دروسًا بصرية للغة الإنجليزية، وتقييمات عملية، وأدوات تعلّم رقمية.",

  links: SITE.links,

  credentials: [
    { degree: "بكالوريوس اللغة الإنجليزية والترجمة", school: "جامعة أكتوبر للعلوم الحديثة والآداب (MSA)", gpa: "3.57 / 4.00" },
    { degree: "درجة مزدوجة", school: "جامعة بيدفوردشير", gpa: "3.67 / 4.00" }
  ],

  about: {
    photo: SITE.about.photo,
    bio: "أنا خريجة TEFL وأسعى لتطوير مساري كمعلمة لغة إنجليزية، مع خبرة أكاديمية وعملية في تعليم اللغة الإنجليزية، وتصميم دروس ESP، والتعلم النشط، والمواد التعليمية البصرية، وتصميم التقييم، والمشروعات التعليمية الرقمية."
  },

  whatIDo: [
    { title: "التدريس", desc: "تخطيط الدروس، والتعليم المتمحور حول المتعلم، وأنشطة الفصل الدراسي." },
    { title: "التقييم", desc: "تصميم الاختبارات، وسلالم التقييم، والتغذية الراجعة، والتقييم التكويني." },
    { title: "التصميم التعليمي", desc: "مواد تعلّم بصرية وخبرات تعليمية منظَّمة." },
    { title: "تكنولوجيا التعليم", desc: "أدوات رقمية وتعلّم لغوي مدعوم بالتقنية." }
  ],

  howITeach: [
    { num: "01", title: "واضح", desc: "تفكيك المفاهيم اللغوية المعقّدة إلى خطوات يسهل استيعابها." },
    { num: "02", title: "بصري", desc: "استخدام الدعم البصري لربط الشكل بالمعنى والاستخدام." },
    { num: "03", title: "فعّال", desc: "منح المتعلمين فرصًا للتدرّب والتطبيق والتواصل." },
    { num: "04", title: "قائم على الأدلة", desc: "استخدام التقييم والتغذية الراجعة لمتابعة التعلّم." }
  ],

  projects: [
    {
      flag: "مشروع رئيسي",
      category: "research",
      categories: ["research", "teaching", "design"],
      title: "إطار القواعد البصري على الخط الزمني",
      badges: ["ورقة بحثية", "PDF"],
      description: "مشروع تعليمي بصري يستكشف كيف يمكن لتمثيل الأزمنة على خط زمني أن يجعل المفاهيم اللغوية المعقدة أوضح وأسهل في الوصول والفهم، بالاستناد إلى الممارسة الصفية والأدلة.",
      stat: "نتيجة مختارة: أفاد 87٪ من الطلاب بمشاركة أكثر نشاطًا عند استخدام الخطوط الزمنية.",
      role: "التصميم التعليمي البصري، وتعليم القواعد، والأدلة",
      tools: "المواد البصرية، وتصميم الدروس، والأدلة البحثية",
      links: [
        { label: "عرض الورقة البحثية", href: SITE.projects[0].links[0].href },
        { label: "عرض العرض التقديمي", href: SITE.projects[0].links[1].href },
      ]
    },
    {
      flag: "مشروع رئيسي",
      category: "edtech",
      categories: ["edtech", "research", "teaching"],
      title: "اختبار الكفاءة الرقمي في اللغة الإنجليزية",
      badges: ["تطبيق ويب تفاعلي"],
      description: "منصة تقييم رقمية خاصة تغطي القراءة والاستماع والكتابة والتحدث. شمل العمل هيكلة التقييم وأقسام الاختبار والتنفيذ الرقمي وتفاعل المستخدم والاختبار العملي واستكشاف الأخطاء وإصلاحها والتطوير المدعوم بالذكاء الاصطناعي.",
      stat: "",
      role: "تصميم التقييم والتنفيذ الرقمي والاختبار والتطوير المدعوم بالذكاء الاصطناعي",
      tools: "HTML وCSS وJavaScript وأدوات التقييم الرقمي",
      links: [
        { label: "عرض تصميم التقييم", href: SITE.projects[1].links[0].href }
      ]
    },
    {
      flag: "تصميم",
      category: "design",
      categories: ["design", "teaching"],
      title: "تصميم مجلة",
      badges: ["تصميم صفحات مجلة", "PDF"],
      description: "مشروع تصميم تحريري يطبّق مبادئ التسلسل البصري والطباعة على صفحات مجلة كاملة، بنفس الحس التصميمي الذي يشكّل المواد التعليمية أعلاه.",
      stat: "",
      role: "التخطيط والتصميم البصري",
      tools: "",
      links: [ { label: "عرض المشروع", href: SITE.projects[2].links[0].href } ]
    },
    {
      flag: "تصميم",
      category: "design",
      categories: ["design", "teaching"],
      title: "كتاب أطفال",
      badges: ["كتاب مصوَّر", "PDF"],
      description: "كتاب أطفال مصوَّر أصلي، كُتب وصُمِّم بنفس النهج البصري الواضح المستخدَم في المواد التعليمية.",
      stat: "",
      role: "الكتابة والرسم",
      tools: "",
      links: [ { label: "عرض المشروع", href: SITE.projects[3].links[0].href } ]
    },
    {
      flag: "تصميم",
      category: "design",
      categories: ["design", "teaching"],
      title: "لوحة قصصية",
      badges: ["لوحة قصصية", "PDF"],
      description: "لوحة قصصية مشهدًا بمشهد لتخطيط سرد بصري قبل الإنتاج، تعكس نفس التفكير المنظَّم والمتسلسل وراء إطار الخط الزمني البصري.",
      stat: "",
      role: "التخطيط البصري والتسلسل",
      tools: "",
      links: [ { label: "عرض المشروع", href: SITE.projects[4].links[0].href } ]
    },
    {
      flag: "عرض تدريسي",
      category: "teaching",
      categories: ["teaching", "research"],
      title: "التدريس الصفي لطلاب المرحلة الجامعية",
      badges: ["عرض تدريسي", "ممارسة صفية"],
      description: "عرض تدريسي صفي يوضح تصميمًا تعليميًا تفاعليًا، ومشاركة المتعلمين، وتقديم القواعد بطريقة تواصلية.",
      stat: "",
      role: "تدريس صفي لطلاب المرحلة الجامعية",
      tools: "",
      video: "https://drive.google.com/file/d/1bjMdGG5RVQGelgc6v7RMqHMZYyT02hPS/preview",
      links: [
        { label: "فتح العرض التدريسي", href: "https://drive.google.com/file/d/1bjMdGG5RVQGelgc6v7RMqHMZYyT02hPS/preview" }
      ]
    }
  ],

  materials: [
    { title: "الشهادات", href: "https://drive.google.com/drive/folders/1IlVHD_heQUisdcgzNAmCAjcgaJ_GM0nq" },
    { title: "التغذية الراجعة", href: "https://drive.google.com/drive/folders/1_SgYq2bi8oCfyzkCNLl3ZWqLtBG197CM" },
    { title: "السيرة الذاتية (CV)", href: "https://drive.google.com/file/d/16cr1k7iVTIZNDKl5tGr97EFSB0j0kQf6/view?usp=drivesdk" },
    { title: "الأبحاث", href: "https://drive.google.com/drive/folders/1zHdqDdbPUsbgA7wvTLmoMu3spNnbPXPA" },
    { title: "فيديوهات العمل الميداني", href: "https://drive.google.com/drive/folders/1g0XnzDUJwKrmgcFmbgFSgwUHkl_kAXGK" },
    { title: "المشاريع", href: "https://drive.google.com/drive/folders/1d2hgaLe5ASKrY-Op27gsmu6wMyygF70A" }
  ],

  experience: [
    {
      flag: "تدريب عملي",
      title: "التدريب العملي في تدريس اللغة الإنجليزية",
      place: "جامعة أكتوبر للعلوم الحديثة والآداب (MSA)",
      dates: "سبتمبر 2025 – مايو 2026",
      points: ["تخطيط الدروس", "التدريس الصفي", "تصميم التقييم وتطبيقه", "تغذية راجعة للمتعلمين"],
      evidence: { label: "عرض الأدلة", href: SITE.experience[0].evidence.href }
    },
    {
      flag: "تدريب",
      title: "تدريب في التدريس",
      place: "مدارس دار التربية",
      dates: "سبتمبر 2024 – مايو 2025",
      points: ["دعم داخل الفصل", "تنفيذ الدروس", "تغذية راجعة للمتعلمين"],
      evidence: { label: "عرض مجلد الأعمال", href: SITE.experience[1].evidence.href }
    }
  ],

  education: [
    { flag: "درجة علمية", title: "بكالوريوس اللغة الإنجليزية والترجمة", place: "جامعة MSA · معدل تراكمي 3.57 / 4.00", links: [{ label: "عرض شهادة التخرج المصرية", href: "https://drive.google.com/file/d/1VAiipDPb8_iw5ODrGcVe2RYvqtGJnufc/view?usp=drivesdk" }]  },
    { flag: "درجة علمية", title: "درجة مزدوجة", place: "جامعة بيدفوردشير · معدل تراكمي 3.67 / 4.00", links: [] },
    { flag: "تخصص جامعي", title: "تخصص تدريس اللغة الإنجليزية (TEFL)", place: "تدريس اللغة الإنجليزية كلغة أجنبية", links: [] }
  ],

  development: [
    { title: "تخصص تدريس اللغة الإنجليزية (TEFL)", place: "تدريس اللغة الإنجليزية كلغة أجنبية" },
    { title: "الذكاء الاصطناعي وتكنولوجيا التعليم", place: "تدريب تطبيقي على أدوات تكنولوجيا التعليم" },
    { title: "مهارات العرض والتقديم", place: "تدريب أكاديمي ومهني على العرض والتقديم" }
  ],

  skills: {
    teaching: [
      { name: "تخطيط الدروس" },
      { name: "التدريس القواعدي" },
      { name: "التقييم" },
      { name: "التغذية الراجعة" }
    ],
    soft: [
      { name: "إدارة الفصل الدراسي" },
      { name: "التواصل" },
      { name: "المرونة" },
      { name: "إدارة الوقت" }
    ],
    hard: [
      { name: "Canva" },
      { name: "Microsoft Office" },
      { name: "أدوات الذكاء الاصطناعي" },
      { name: "أدوات التعلّم الرقمي" }
    ],
    languages: [
      { name: "العربية", level: "اللغة الأم" },
      { name: "الإنجليزية" },
      { name: "الإسبانية" }
    ]
  },

  creative: ["التصوير الفوتوغرافي", "السرد البصري", "التصميم الرقمي"],
  creativeLead: "عين بصرية تنعكس في المشروعات التعليمية والأكاديمية أعلاه، من الرسوم البيانية للخط الزمني إلى المواد التعليمية.",

  contact: {
    intro: "هل تهتمين بالتعرف على ممارستي التدريسية أو مشاريعي التعليمية أو فرص التطور في تعليم اللغة الإنجليزية؟ لا تترددي في التواصل."
  },

  footer: "Shahd Mohamed | خريجة TEFL وتسعى لتطوير مسارها كمعلمة لغة إنجليزية"
};

/* =====================================================================
   RENDERING — you shouldn't need to edit anything below this line.
   ===================================================================== */
(function(){

  const externalIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>';
  const SAFE_EXTERNAL_HOSTS = new Set([
    'drive.google.com', 'mail.google.com', 'www.linkedin.com', 'linkedin.com',
    'www.instagram.com', 'instagram.com', 'shahdmohamed2004.github.io'
  ]);
  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>'"]/g, character => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
    }[character]));
  }
  function safeExternalUrl(value, fallback = '#'){
    try{
      const url = new URL(String(value), window.location.origin);
      if(url.protocol !== 'https:' || !SAFE_EXTERNAL_HOSTS.has(url.hostname)) return fallback;
      return url.href;
    }catch(_){ return fallback; }
  }
  function safeAssetUrl(value){
    const candidate = String(value || '');
    return /^assets\/[a-z0-9._-]+$/i.test(candidate) ? candidate : 'assets/about.webp';
  }
  function safeEmbedUrl(value){
    const url = safeExternalUrl(value, '');
    return url && new URL(url).hostname === 'drive.google.com' ? url : '';
  }

  function accordionCard(item, extra='', index=0){
    const bodyId = `what-i-do-body-${index}`;
    return `<details class="accordion-card reveal-item"><summary class="expandable-summary" aria-controls="${bodyId}" aria-expanded="false">${escapeHtml(item.title)}</summary><div class="accordion-body" id="${bodyId}"><p>${escapeHtml(item.desc)}</p>${extra}</div></details>`;
  }

  function projectLink(l){
    return `<a class="proj-link" href="${safeExternalUrl(l.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}${externalIcon}</a>`;
  }

  // Header / mobile menu CV + LinkedIn + Portfolio (language-independent)
  document.getElementById('cvLinkDesktop').href = safeExternalUrl(SITE.links.cv);
  document.getElementById('cvLinkMobile').href = safeExternalUrl(SITE.links.cv);
  document.getElementById('linkedinLinkDesktop').href = safeExternalUrl(SITE.links.linkedin);
  document.getElementById('linkedinLinkMobile').href = safeExternalUrl(SITE.links.linkedin);
  document.getElementById('mobileLinkedinDock').href = safeExternalUrl(SITE.links.linkedin);
  const gmailComposeUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(SITE.links.email);
  document.getElementById('mobileEmailDock').href = gmailComposeUrl;
  document.getElementById('mobileEmailDock').target = '_blank';
  document.getElementById('mobileEmailDock').rel = 'noopener noreferrer';
  document.getElementById('portfolioLinkDesktop').href = safeExternalUrl(SITE.links.portfolioFolder);
  document.getElementById('portfolioLinkMobile').href = safeExternalUrl(SITE.links.portfolioFolder);
  document.getElementById('materialsPortfolioLink').href = safeExternalUrl(SITE.links.portfolioFolder);
  document.getElementById('btnCV').href = safeExternalUrl(SITE.links.cv);
  document.getElementById('btnLinkedin').href = safeExternalUrl(SITE.links.linkedin);
  // Open Gmail compose with the existing portfolio address in the To field.
  const contactEmailBtn = document.getElementById('contactEmailBtn');
  contactEmailBtn.href = safeExternalUrl(gmailComposeUrl);
  contactEmailBtn.target = '_blank';
  contactEmailBtn.rel = 'noopener noreferrer';
  contactEmailBtn.title = 'Open Gmail compose';
  document.getElementById('contactLinkedinBtn').href = safeExternalUrl(SITE.links.linkedin);
  document.getElementById('contactCvBtn').href = safeExternalUrl(SITE.links.cv);
  // Everything below depends on which language is active.
  const SKILL_LABELS = {
    en: { teaching: "Instructional Design", soft: "Classroom Practice", hard: "Educational Technology", languages: "Languages" },
    ar: { teaching: "التصميم التعليمي", soft: "الممارسة الصفية", hard: "تكنولوجيا التعليم", languages: "اللغات" }
  };

  let contentRevision = 0;
  let activeProjectFilterState = 'all';
  function renderContent(data, lang){
    const openProjectIndexes = [...document.querySelectorAll('#workSpine .project-details')]
      .map((details, index) => details.open ? index : -1).filter(index => index >= 0);
    const openWhatIndexes = [...document.querySelectorAll('#whatIDoGrid > details')].map((details, index) => details.open ? index : -1).filter(index => index >= 0);
    const openHowIndexes = [...document.querySelectorAll('#howITeachGrid > details')].map((details, index) => details.open ? index : -1).filter(index => index >= 0);
    const openExperienceIndexes = [...document.querySelectorAll('#experienceSpine .timeline-detail')].map((details, index) => details.open ? index : -1).filter(index => index >= 0);
    const openEducationIndexes = [...document.querySelectorAll('#educationSpine .timeline-detail')].map((details, index) => details.open ? index : -1).filter(index => index >= 0);
    const openDevelopmentIndexes = [...document.querySelectorAll('#developmentGrid > details')].map((details, index) => details.open ? index : -1).filter(index => index >= 0);
    const activeProjectFilter = activeProjectFilterState;
    // Hero
    document.getElementById('heroNote').textContent = data.heroNote;
    const heroHeadline = document.getElementById('heroHeadline');
    if(lang === 'ar'){
      heroHeadline.innerHTML = '<span>نُعلِّم <em>لنُبصر</em>،</span><span>ونتعلّم <em>لنكون</em></span>';
    }else{
      heroHeadline.innerHTML = '<span>Teaching to <em>See</em>,</span><span>Learning to <em>Be</em></span>';
    }
    heroHeadline.setAttribute('data-shimmer', data.heroHeadline);
    document.getElementById('heroLead').textContent = data.heroLead;

    document.getElementById('credentialStrip').innerHTML = data.credentials.map(c => `
      <div class="cred">
        <span class="credential-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65"><path d="m3 8 9-4 9 4-9 4-9-4Z"/><path d="M7 10.2V14c2.8 2.2 7.2 2.2 10 0v-3.8M21 9v5"/></svg></span>
        <div class="cred-copy"><div class="deg">${escapeHtml(c.degree)}</div>
        <div class="school">${escapeHtml(c.school)}</div>
        <div class="gpa"><span class="gpa-label">${lang === 'ar' ? 'المعدل' : 'GPA'}</span> <bdi dir="ltr">${escapeHtml(c.gpa)}</bdi></div></div>
      </div>
    `).join('');

    // About
    document.getElementById('aboutName').textContent = data.fullName;
    document.getElementById('aboutRole').textContent = data.title;
    document.getElementById('aboutBio').textContent = data.about.bio;
    if(data.about.photo){
      document.getElementById('aboutPhoto').innerHTML = `<img src="${safeAssetUrl(data.about.photo)}" alt="${escapeHtml(lang === 'ar' ? 'صورة شهد محمد' : 'Photo of Shahd Mohamed')}" width="1087" height="1447" loading="lazy" decoding="async">`;
    }

    // What I do
    document.getElementById('whatIDoGrid').innerHTML = data.whatIDo.map((item, index) => `
      ${accordionCard(item, '', index)}
    `).join('');

    // How I teach
      document.getElementById('howITeachGrid').innerHTML = data.howITeach.map(item => `
      <details class="accordion-card reveal-item"><summary class="expandable-summary" aria-controls="how-i-teach-${escapeHtml(item.num)}" aria-expanded="false"><span class="num">${escapeHtml(item.num)}</span>${escapeHtml(item.title)}</summary><div class="accordion-body" id="how-i-teach-${escapeHtml(item.num)}"><p>${escapeHtml(item.desc)}</p></div></details>
    `).join('');
    document.querySelectorAll('#whatIDoGrid > details').forEach((details, index) => { details.open = openWhatIndexes.includes(index); });
    document.querySelectorAll('#howITeachGrid > details').forEach((details, index) => { details.open = openHowIndexes.includes(index); });

    // Selected work — filterable on desktop, swipeable chips on mobile.
    const projectCategories = lang === 'ar'
      ? { all: 'كل الأعمال', research: 'بحث', edtech: 'EdTech', design: 'تصميم', teaching: 'تدريس' }
      : { all: 'All work', research: 'Research', edtech: 'EdTech', design: 'Design', teaching: 'Teaching' };
    const getProjectCategories = p => {
      const raw = Array.isArray(p.categories) ? p.categories : [p.category || 'design'];
      const valid = raw.filter(category => ['research','edtech','design','teaching'].includes(category));
      return [...new Set(valid.length ? valid : ['design'])];
    };
    document.getElementById('workFilters').innerHTML = Object.entries(projectCategories).map(([key, label], index) => `<button class="work-filter" type="button" data-filter="${key}" aria-pressed="${key === 'all'}" aria-label="${escapeHtml(label)}"><span class="filter-number">${String(index + 1).padStart(2, '0')}</span><span class="filter-label">${escapeHtml(label)}</span></button>`).join('');
    document.getElementById('workSpine').innerHTML = data.projects.map((p, i) => {
      const categories = getProjectCategories(p);
      return `
      <div class="entry reveal-item" data-step="${i + 1}" data-categories="${escapeHtml(categories.join(' '))}">
        <details class="project-details" id="projectDetails-${i}" data-project-index="${i}">
          <summary class="project-summary expandable-summary" aria-controls="projectDetailsBody-${i}" aria-expanded="false" aria-label="${lang === 'ar' ? 'عرض تفاصيل المشروع والروابط' : 'View project details & links'}">
            <div class="entry-preview">
              <span class="entry-flag ${SITE.projects[i].flag === 'core project' ? 'core' : ''}">${escapeHtml(p.flag)}</span>
              <h3>${escapeHtml(p.title)}</h3>
              <div class="badges">${p.badges.map(b => `<span class="badge">${escapeHtml(b)}</span>`).join('')}</div>
            </div>
          </summary>
          <div class="project-details-body" id="projectDetailsBody-${i}">
            ${i === 0 ? `
            <div class="featured-case embedded-case-study is-open" aria-labelledby="graduationCaseTitle">
              <div class="featured-case-content">
                <div class="featured-case-content-inner">
                  <div class="featured-case-copy">
                    <span class="section-tag">${lang === 'ar' ? 'مشروع التخرج' : 'Graduation project'}</span>
                    <h3 id="graduationCaseTitle">${escapeHtml(p.title)}</h3>
                    <p class="project-description">${escapeHtml(p.description)}</p>
                    <dl class="project-facts">
                      <div><dt>${lang === 'ar' ? 'الدور' : 'Role'}</dt><dd>${escapeHtml(p.role)}</dd></div>
                      ${p.tools ? `<div><dt>${lang === 'ar' ? 'الأدوات' : 'Tools'}</dt><dd>${escapeHtml(p.tools)}</dd></div>` : ''}
                    </dl>
                    ${p.stat ? `<div class="project-finding"><strong>${lang === 'ar' ? 'نتيجة موثقة' : 'Documented finding'}</strong><span>${escapeHtml(p.stat)}</span></div>` : ''}
                    <div class="proj-links">${p.links.map(projectLink).join('')}</div>
            <div class="ownership-note">${lang === 'ar' ? 'عمل أصلي بواسطة شهد محمد.' : 'Original work by Shahd Mohamed.'}</div>
                  </div>
                </div>
              </div>
            </div>` : `
            ${p.video && safeEmbedUrl(p.video) ? `<div class="teaching-video" aria-label="${lang === 'ar' ? 'فيديو العرض التدريسي' : 'Teaching demonstration video'}"><iframe src="${safeEmbedUrl(p.video)}" title="${lang === 'ar' ? 'فيديو العرض التدريسي' : 'Teaching Demonstration video'}" loading="lazy" referrerpolicy="no-referrer" allow="autoplay; fullscreen" allowfullscreen></iframe></div>` : ''}
            ${p.stat ? `<div class="stat-line">${escapeHtml(p.stat)}</div>` : ''}
            <p>${escapeHtml(p.description)}</p>
            ${p.role ? `<div class="meta-row"><span class="meta-label">${lang === 'ar' ? 'الدور' : 'Role'}</span>${escapeHtml(p.role)}</div>` : ''}
            ${p.tools ? `<div class="meta-row"><span class="meta-label">${lang === 'ar' ? 'الأدوات' : 'Tools'}</span>${escapeHtml(p.tools)}</div>` : ''}
            <div class="proj-links">${p.links.map(projectLink).join('')}</div>
            <div class="ownership-note">${lang === 'ar' ? 'عمل أصلي بواسطة شهد محمد.' : 'Original work by Shahd Mohamed.'}</div>`}
          </div>
        </details>
      </div>`;
    }).join('');
    // Keep every expandable card independent. Native <details> owns the open
    // state of each instance; no group-level boolean or sibling-closing logic
    // is allowed to leak state between cards.
    const setupIndependentDetails = (selector) => {
      const cards = [...document.querySelectorAll(selector)];
      const syncState = details => {
        const summary = details.querySelector(':scope > summary');
        if(summary) summary.setAttribute('aria-expanded', String(details.open));
      };
      cards.forEach((details, index) => {
        details.addEventListener('toggle', () => syncState(details));
        if(selector === '#workSpine .project-details' && openProjectIndexes.includes(index)) details.open = true;
        syncState(details);
      });
    };
    setupIndependentDetails('#workSpine .project-details');
    setupIndependentDetails('#whatIDoGrid > details');
    setupIndependentDetails('#howITeachGrid > details');
    setupIndependentDetails('#developmentGrid > details');
    // Keep every rendered summary's accessibility state tied to native details state.
    document.querySelectorAll('details > summary.expandable-summary').forEach(summary => {
      const details = summary.parentElement;
      const sync = () => summary.setAttribute('aria-expanded', String(details.open));
      details.addEventListener('toggle', sync);
      sync();
    });
    const updateProjectFilter = (filter = 'all', shouldScroll = true) => {
      const allowedFilters = new Set(['all','research','edtech','design','teaching']);
      if(!allowedFilters.has(filter)) filter = 'all';
      const filterChanged = activeProjectFilterState !== filter;
      activeProjectFilterState = filter;
      const filterBar = document.getElementById('workFilters');
      const filterButtons = [...filterBar.querySelectorAll('.work-filter')];
      filterButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter)));
      const activeButton = filterButtons.find(btn => btn.dataset.filter === filter) || filterButtons[0];
      if(activeButton){
        const activeIndex = Math.max(0, filterButtons.indexOf(activeButton));
        filterBar.style.setProperty('--filter-index', activeIndex);
        filterBar.style.setProperty('--filter-progress', `${filterButtons.length > 1 ? activeIndex / (filterButtons.length - 1) : 0}`);
      }
      const entries = [...document.querySelectorAll('#workSpine .entry')];
      let visible = 0;
      entries.forEach(entry => {
        const categories = (entry.dataset.categories || '').split(/\s+/).filter(Boolean);
        const show = filter === 'all' || categories.includes(filter);
        entry.classList.toggle('is-filtered', !show);
        entry.hidden = false;
        entry.setAttribute('aria-hidden', String(!show));
        entry.setAttribute('tabindex', show ? '0' : '-1');
        if(show) visible++;
      });
      document.getElementById('workCount').textContent = lang === 'ar' ? (visible === 0 ? 'لا توجد أعمال' : visible === 1 ? 'عمل واحد' : visible === 2 ? 'عملان' : `${visible} أعمال`) : `${visible} ${visible === 1 ? 'project' : 'projects'}`;
    };
    document.querySelectorAll('#workFilters .work-filter').forEach(btn => {
      const activate = () => updateProjectFilter(btn.dataset.filter);
      btn.addEventListener('pointerdown', event => {
        if(event.pointerType === 'touch' || event.pointerType === 'pen'){
          btn.setPointerCapture?.(event.pointerId);
          btn.dataset.pointerPending = 'true';
        }
      }, {passive:true});
      btn.addEventListener('pointerup', event => {
        if(event.pointerType === 'touch' || event.pointerType === 'pen'){
          event.preventDefault();
          btn.dataset.pointerHandled = 'true';
          delete btn.dataset.pointerPending;
          activate();
        }
      });
      btn.addEventListener('click', event => {
        if(btn.dataset.pointerHandled === 'true'){
          delete btn.dataset.pointerHandled;
          return;
        }
        activate();
      });
    });
    updateProjectFilter(activeProjectFilter, false);

    // Teaching materials
    document.getElementById('materialsGrid').innerHTML = data.materials.map(m => `
      <a class="material-card reveal-item" href="${safeExternalUrl(m.href || SITE.links.portfolioFolder)}" target="_blank" rel="noopener noreferrer">
        <span class="mname">${escapeHtml(m.title)}</span>
        <span class="arrow">${externalIcon}</span>
      </a>
    `).join('');

    // Experience
    document.getElementById('experienceSpine').innerHTML = data.experience.map(e => `
      <div class="entry"><details class="timeline-detail"><summary class="expandable-summary"><span class="entry-flag">${escapeHtml(e.flag)}</span><h3>${escapeHtml(e.title)}</h3></summary>
        <div class="place"><bdi class="place-name mixed-content" dir="auto">${escapeHtml(e.place)}</bdi><span class="place-separator" aria-hidden="true"> · </span><bdi class="dates mixed-content" dir="${lang === 'ar' ? 'auto' : 'ltr'}">${escapeHtml(e.dates)}</bdi></div>
        <ul class="point-list">${e.points.map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}</ul>
        ${e.evidence ? `<div class="proj-links">${projectLink(e.evidence)}</div>` : ''}
      </details></div>
    `).join('');

    // Education
    document.getElementById('educationSpine').innerHTML = data.education.map((ed, index) => {
      const bodyId = `education-body-${index}`;
      return `
      <div class="entry"><details class="timeline-detail education-card" data-education-index="${index}">
        <summary class="expandable-summary" aria-controls="${bodyId}" aria-expanded="false">
          <span class="entry-flag">${escapeHtml(ed.flag)}</span><h3>${escapeHtml(ed.title)}</h3>
        </summary>
        <div class="education-card-body" id="${bodyId}">
          ${ed.place ? `<div class="place"><bdi class="mixed-content" dir="auto">${escapeHtml(ed.place)}</bdi></div>` : ''}
          ${ed.links && ed.links.length ? `<div class="proj-links">${ed.links.map(projectLink).join('')}</div>` : ''}
        </div>
      </details></div>`;
    }).join('');

    // Professional development
    document.getElementById('developmentGrid').innerHTML = data.development.map((d, i) => `
      <details class="accordion-card reveal-item" data-accordion-id="development-${i}"><summary class="expandable-summary" aria-controls="developmentBody-${i}" aria-expanded="false">${escapeHtml(d.title)}</summary><div class="accordion-body" id="developmentBody-${i}"><div class="place">${escapeHtml(d.place)}</div>${SITE.development[i].href ? `<div>${projectLink({label: lang === 'ar' ? 'عرض الشهادة' : 'View certificate', href: SITE.development[i].href})}</div>` : ''}</div></details>
    `).join('');
    document.querySelectorAll('#experienceSpine .timeline-detail').forEach((details, index) => { details.open = openExperienceIndexes.includes(index); });
    document.querySelectorAll('#educationSpine .timeline-detail').forEach((details, index) => { details.open = openEducationIndexes.includes(index); });
    document.querySelectorAll('#developmentGrid > details').forEach((details, index) => { details.open = openDevelopmentIndexes.includes(index); });

    // Skills + languages
    const sl = SKILL_LABELS[lang];
    document.getElementById('skillsGrid').innerHTML = `
      <div class="skill-block skills-block reveal-item">
        <h3>${lang === 'ar' ? 'المهارات' : 'Skills'}</h3>
        <div class="skill-group">
          <h4>${escapeHtml(sl.teaching)}</h4>
          <ul>${data.skills.teaching.map(s => `<li><span>${escapeHtml(s.name)}</span></li>`).join('')}</ul>
        </div>
        <div class="skill-group">
          <h4>${escapeHtml(sl.soft)}</h4>
          <ul>${data.skills.soft.map(s => `<li><span>${escapeHtml(s.name)}</span></li>`).join('')}</ul>
        </div>
        <div class="skill-group">
          <h4>${escapeHtml(sl.hard)}</h4>
          <ul>${data.skills.hard.map(s => `<li><span>${escapeHtml(s.name)}</span></li>`).join('')}</ul>
        </div>
      </div>
      <div class="skill-block languages-block reveal-item">
        <h3>${escapeHtml(sl.languages)}</h3>
        <div class="skill-group">
          <ul>${data.skills.languages.map(l => `<li><span>${escapeHtml(l.name)}</span>${l.level ? `<span class="lvl">${escapeHtml(l.level)}</span>` : ''}</li>`).join('')}</ul>
        </div>
      </div>
    `;

    // Creative dimension
    const creativeIcons = [
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7.5a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z"/><circle cx="9" cy="10" r="2"/><path d="m4 16 4.5-4 3.2 2.8 2.3-2 6 5.2"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 5.5h5.2A2.8 2.8 0 0 1 13 8.3v10.2a2.8 2.8 0 0 0-2.8-2.8H5v-10.2Z"/><path d="M19 5.5h-5.2A2.8 2.8 0 0 0 11 8.3v10.2a2.8 2.8 0 0 1 2.8-2.8H19v-10.2Z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="m7 16 3.2-4 2.2 2.6 1.6-1.8L17 16"/><circle cx="9" cy="8.5" r="1.2"/></svg>'
    ];
    document.getElementById('creativeRow').innerHTML = data.creative.map((c, i) => {
      const item = `<span class="creative-icon">${creativeIcons[i] || creativeIcons[0]}</span><span>${escapeHtml(c)}</span>`;
      return i === 0
        ? `<a class="creative-item reveal-item" href="${safeExternalUrl('https://www.instagram.com/shahd_mohamed__2004')}" target="_blank" rel="noopener noreferrer" aria-label="${lang === 'ar' ? 'التصوير الفوتوغرافي على Instagram' : 'Photography on Instagram'}">${item}<span class="creative-external" aria-hidden="true">↗</span></a>`
        : `<span class="creative-item reveal-item">${item}</span>`;
    }).join('');
    document.getElementById('creativeLead').textContent = data.creativeLead;
    document.getElementById('creativeLead').classList.add('creative-lead');

    // Availability strip
    const availability = lang === 'ar' ? {tag:'أستكشف حاليًا', heading:'مجالات أستطيع أن أساهم فيها', teaching:'فرص تدريس اللغة الإنجليزية', design:'تصميم دروس ESP والتقييم', edtech:'مشروعات تكنولوجيا التعليم والتعلّم الرقمي'} : {tag:'currently exploring', heading:'Where I can contribute', teaching:'English Language Teaching opportunities', design:'ESP Lesson & Assessment Design', edtech:'EdTech & Digital Learning Projects'};
    document.getElementById('availabilityTag').textContent = availability.tag;
    document.getElementById('availabilityHeading').textContent = availability.heading;
    document.getElementById('availabilityTeaching').textContent = availability.teaching;
    document.getElementById('availabilityDesign').textContent = availability.design;
    document.getElementById('availabilityEdtech').textContent = availability.edtech;
    document.getElementById('availability').querySelector('.availability-strip').setAttribute('aria-label', availability.heading);
    // Contact
    document.getElementById('contactIntro').textContent = data.contact.intro;

    const ownership = document.getElementById('footerOwnership');
    if(ownership) ownership.textContent = lang === 'ar' ? '© 2026 شهد محمد. جميع الحقوق محفوظة. العمل الأصلي محمي.' : '© 2026 Shahd Mohamed. All rights reserved. Original work protected.';
    contentRevision += 1;
    observeRevealTargets();
  }

  // Static UI text (nav, section headers, buttons) — not part of SITE/SITE_AR
  const NAV_LABELS = {
    about: ["About", "نبذة عني"], teaching: ["Teaching", "طريقة تدريسي"],
    work: ["Work", "أعمالي"], experience: ["Experience", "خبرتي"],
    credentials: ["Credentials", "المؤهلات"], contact: ["Contact", "تواصل"]
  };
  const RAIL_LABELS = {
    home: ["Home", "الرئيسية"], about: ["About", "نبذة عني"],
    "what-i-do": ["What I do", "ماذا أفعل"], teaching: ["How I teach", "طريقة تدريسي"],
    work: ["Work", "الأعمال"], materials: ["Materials", "المواد التعليمية"],
    experience: ["Experience", "الخبرة"], credentials: ["Education", "التعليم"],
    development: ["Development", "التطوير المهني"], skills: ["Skills", "المهارات"],
    creative: ["Creative", "اهتمامات أخرى"], contact: ["Contact", "تواصل"]
  };
  const RAIL_EXTRA = {
    railCv: ["CV", "السيرة الذاتية"], railPortfolio: ["Portfolio", "ملف الأعمال"], railLinkedin: ["LinkedIn", "LinkedIn"],
    railLangToggle: ["العربية", "English"], railThemeToggle: ["Light mode", "الوضع الفاتح"]
  };
  const WHERE_LABELS = {
    home: ['HOME','الرئيسية'], about: ['ABOUT','نبذة عني'], 'what-i-do': ['WHAT I DO','ماذا أفعل'],
    teaching: ['TEACHING','التدريس'], work: ['WORK','الأعمال'], materials: ['MATERIALS','المواد'],
    experience: ['EXPERIENCE','الخبرة'], credentials: ['EDUCATION','التعليم'], development: ['DEVELOPMENT','التطوير'],
    skills: ['SKILLS','المهارات'], creative: ['CREATIVE','اهتمامات'], contact: ['CONTACT','تواصل']
  };
  const SECTION_TEXT = {
    about: { tag: ["About", "نبذة عني"], heading: ["About", "نبذة عني"] },
    "what-i-do": { tag: ["day to day", "يوميًا"], heading: ["What I do", "ماذا أفعل"] },
    teaching: { tag: ["approach", "المنهجية"], heading: ["How I teach", "طريقة تدريسي"] },
    work: { tag: ["what I build", "ما أبنيه"], heading: ["Selected work", "أعمال مختارة"] },
    materials: { tag: ["evidence", "دليل"], heading: ["Teaching materials", "المواد التعليمية"],
      lead: ["Certificates, feedback, CV, research, videos, and project files, organised in Drive folders.", "شهادات، وتغذية راجعة، وسيرة ذاتية، وأبحاث، وفيديوهات، وملفات مشاريع، منظَّمة في مجلدات على Drive."] },
    experience: { tag: ["in the classroom", "داخل الفصل"], heading: ["Teaching experience", "الخبرة التدريسية"] },
    credentials: { tag: ["qualifications", "المؤهلات"], heading: ["Education", "التعليم"] },
    development: { tag: ["always learning", "تعلّم مستمر"], heading: ["Professional development", "التطوير المهني"] },
    skills: { tag: ["toolkit", "الأدوات"], heading: ["Skills & languages", "المهارات واللغات"] },
    creative: { tag: ["beyond the classroom", "خارج الفصل"], heading: ["Also into", "اهتمامات أخرى"] },
    contact: { tag: ["get in touch", "تواصل معي"], heading: ["Let's connect", "لنتواصل"] }
  };
  const BUTTON_TEXT = {
    btnWork: ["View featured project", "عرض المشروع المميز"],
    portfolioLinkDesktop: ["Portfolio", "ملف الأعمال"], portfolioLinkMobile: ["Portfolio", "ملف الأعمال"],
    materialsPortfolioLink: ["View full portfolio", "عرض ملف الأعمال الكامل"],
    cvLinkDesktop: ["Download CV", "تحميل السيرة الذاتية"], cvLinkMobile: ["Download CV", "تحميل السيرة الذاتية"],
    btnCV: ["Download CV", "تحميل السيرة الذاتية"],
    btnLinkedin: ["LinkedIn", "LinkedIn"],
    contactEmailBtn: ["Email", "البريد الإلكتروني"],
    contactCvBtn: ["Download CV", "تحميل السيرة الذاتية"]
  };
  const ABOUT_TEXT = {
    aboutKicker: ["A little about me", "نبذة صغيرة عني"],
    aboutTagOne: ["TEFL", "TEFL"],
    aboutTagTwo: ["Learning design", "تصميم التعلّم"],
    aboutTagThree: ["EdTech", "التقنية التعليمية"]
  };

  function applyStaticText(lang){
    const i = lang === 'ar' ? 1 : 0;
    document.querySelectorAll('[data-nav]').forEach(a => {
      const pair = NAV_LABELS[a.getAttribute('data-nav')];
      if(!pair) return;
      const label = a.querySelector(':scope > span:not(.mobile-nav-index)');
      if(label) label.textContent = pair[i];
      else a.textContent = pair[i];
    });
    document.querySelectorAll('.nav-links a[data-nav]').forEach(a => {
      const pair = RAIL_LABELS[a.getAttribute('data-nav')];
      const label = a.querySelector('.rail-label');
      if(pair && label) label.textContent = pair[i];
    });
    Object.keys(RAIL_EXTRA).forEach(id => {
      const el = document.getElementById(id);
      const label = el && el.querySelector('.rail-label');
      if(label) label.textContent = RAIL_EXTRA[id][i];
    });
    Object.keys(SECTION_TEXT).forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if(!section) return;
      const t = SECTION_TEXT[sectionId];
      const tagEl = section.querySelector('.section-tag');
      const headEl = section.querySelector('.section-head h2');
      const leadEl = section.querySelector('.section-head .section-lead');
      if(tagEl) tagEl.textContent = t.tag[i];
      if(headEl) headEl.textContent = t.heading[i];
      if(leadEl && t.lead) leadEl.textContent = t.lead[i];
    });
    Object.keys(BUTTON_TEXT).forEach(id => {
      const el = document.getElementById(id);
      if(!el) return;
      const label = el.querySelector('.button-label, .utility-label');
      if(label) label.textContent = BUTTON_TEXT[id][i];
      else el.textContent = BUTTON_TEXT[id][i];
    });
    Object.keys(ABOUT_TEXT).forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = ABOUT_TEXT[id][i];
    });
    document.getElementById('linkedinLinkDesktop').querySelector('.utility-label').textContent = 'LinkedIn';
    document.getElementById('linkedinLinkMobile').textContent = 'LinkedIn';
    document.getElementById('contactLinkedinBtn').textContent = 'LinkedIn';
    document.querySelector('.skip-link').textContent = lang === 'ar' ? 'تخطَّ إلى المحتوى الرئيسي' : 'Skip to main content';
    document.getElementById('backToTop').setAttribute('aria-label', lang === 'ar' ? 'العودة للأعلى' : 'Back to top');
    document.getElementById('mobileMenuCloseLabel').textContent = lang === 'ar' ? 'إغلاق القائمة' : 'Close menu';
    document.getElementById('mobileMenuClose').setAttribute('aria-label', lang === 'ar' ? 'إغلاق القائمة' : 'Close menu');
    document.getElementById('whereAmI').setAttribute('aria-label', lang === 'ar' ? 'موقعك الحالي في الصفحة' : 'Current section');
    const aboutPhotoEl = document.getElementById('aboutPhoto');
    if(aboutPhotoEl) aboutPhotoEl.setAttribute('aria-label', lang === 'ar' ? 'فتح صورة شهد محمد' : "Open Shahd's photo");
    const tagsEl = document.querySelector('#about .about-tags');
    if(tagsEl) tagsEl.setAttribute('aria-label', lang === 'ar' ? 'مجالات الاهتمام' : 'Areas of interest');
    const lightboxClose = document.getElementById('photoLightboxClose');
    if(lightboxClose) lightboxClose.setAttribute('aria-label', lang === 'ar' ? 'إغلاق الصورة' : 'Close photo');
    const mobileMenu = document.getElementById('mobileMenu');
    if(mobileMenu) mobileMenu.setAttribute('aria-label', lang === 'ar' ? 'قائمة التنقل' : 'Mobile navigation');
    const drawerSmall = document.querySelector('.mobile-drawer-brand-copy small');
    if(drawerSmall) drawerSmall.innerHTML = lang === 'ar' ? '<bdi dir="ltr">Portfolio · 2026</bdi>' : 'Portfolio · 2026';
    const emailButton = document.getElementById('contactEmailBtn');
    if(emailButton){ emailButton.setAttribute('aria-label', lang === 'ar' ? 'فتح رسالة جديدة في Gmail' : 'Open Gmail compose'); emailButton.title = lang === 'ar' ? 'فتح رسالة جديدة في Gmail' : 'Open Gmail compose'; }
    const timelineLabels = lang === 'ar'
      ? {past:'الماضي', pastDetail:'درّستُ', present:'الحاضر', presentDetail:'أدرّس', future:'المستقبل', futureDetail:'سأدرّس', scroll:'مرّر للاستكشاف'}
      : {past:'Past', pastDetail:'had taught', present:'Present', presentDetail:'teaches', future:'Future', futureDetail:'will teach', scroll:'Scroll to explore'};
    [['timelinePast','past'],['timelinePastDetail','pastDetail'],['timelinePresent','present'],['timelinePresentDetail','presentDetail'],['timelineFuture','future'],['timelineFutureDetail','futureDetail'],['heroScrollCueLabel','scroll']].forEach(([id,key]) => { const el=document.getElementById(id); if(el) el.textContent=timelineLabels[key]; });
    const localizedAria = lang === 'ar' ? {portfolio:'ملف الأعمال', cv:'تحميل السيرة الذاتية', filters:'مرشحات المشاريع'} : {portfolio:'Portfolio', cv:'Download CV', filters:'Project filters'};
    [['portfolioLinkDesktop',localizedAria.portfolio],['portfolioLinkMobile',localizedAria.portfolio],['cvLinkDesktop',localizedAria.cv],['cvLinkMobile',localizedAria.cv]].forEach(([id,label]) => { const el=document.getElementById(id); if(el){ el.setAttribute('aria-label',label); el.title=label; } });
    const workToolbar=document.getElementById('workToolbar'); if(workToolbar) workToolbar.setAttribute('aria-label', localizedAria.filters);
  }

  function normalizeLocalePunctuation(lang){
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while((node = walker.nextNode())){
      if(node.parentElement && !node.parentElement.closest('script,style')) textNodes.push(node);
    }
    textNodes.forEach(textNode => {
      textNode.nodeValue = lang === 'ar'
        ? textNode.nodeValue.replace(/,/g, '،')
        : textNode.nodeValue.replace(/،/g, ',');
    });
  }

  // Language toggle
  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  function applyLanguage(lang){
    lang = lang === 'ar' ? 'ar' : 'en';
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.body.classList.toggle('is-rtl', lang === 'ar');
    renderContent(lang === 'ar' ? SITE_AR : SITE, lang);
    applyStaticText(lang);
    window.requestAnimationFrame(() => updateTimeline());
    const nextLabel = lang === 'ar' ? 'English' : 'العربية';
    langToggle.textContent = nextLabel;
    langToggle.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'Switch to Arabic');
    langToggleMobile.textContent = nextLabel;
    langToggleMobile.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'Switch to Arabic');
    const themeIsLight = document.documentElement.getAttribute('data-theme') === 'light';
    const themeLabel = themeIsLight ? (lang === 'ar' ? 'التبديل إلى الوضع الداكن' : 'Switch to dark mode') : (lang === 'ar' ? 'التبديل إلى الوضع الفاتح' : 'Switch to light mode');
    document.getElementById('themeToggle')?.setAttribute('aria-label', themeLabel);
    document.getElementById('themeToggleMobile')?.setAttribute('aria-label', themeLabel);
    const localeThemeLabel = document.querySelector('#themeToggleMobile .tt-label');
    if(localeThemeLabel) localeThemeLabel.textContent = themeIsLight ? (lang === 'ar' ? 'الوضع الداكن' : 'Dark mode') : (lang === 'ar' ? 'الوضع الفاتح' : 'Light mode');
    normalizeLocalePunctuation(lang);
    try{ localStorage.setItem('siteLang', lang); }catch(e){}
  }
  function toggleLanguage(){
    const current = document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
    const next = current === 'ar' ? 'en' : 'ar';
    const finish = () => {
      applyLanguage(next);
      // Never leave a direction-sensitive drawer in an inconsistent state.
      const menu = document.getElementById('mobileMenu');
      const backdrop = document.getElementById('menuBackdrop');
      const menuButton = document.getElementById('hamburgerBtn');
      if(menu){ menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true'); menu.classList.remove('is-swiping'); menu.style.removeProperty('--swipe-x'); }
      if(backdrop) backdrop.classList.remove('open');
      document.body.classList.remove('menu-open');
      if(menuButton) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', document.documentElement.lang === 'ar' ? 'فتح القائمة' : 'Open menu');
        if(document.activeElement && menu && menu.contains(document.activeElement)) requestAnimationFrame(() => menuButton.focus({preventScroll:true}));
      }
    };
    if(reducedMQ.matches){ finish(); return; }
    const content = document.getElementById('main-content');
    // Keep the locale update synchronous: delaying it inside View Transition
    // made the whole page feel heavy, especially on mobile browsers.
    content.classList.add('language-switching');
    if(document.startViewTransition && !reducedMQ.matches){
      document.startViewTransition(finish);
    } else {
      finish();
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        content.classList.remove('language-switching');
        // Rendering Arabic/English can change document height while the user
        // is mid-scroll. Recompute all scroll-linked chrome against the new
        // geometry instead of leaving a stale progress width or button state.
        requestScrollUpdate();
          });
    });
  }
  langToggle.addEventListener('click', toggleLanguage);
  langToggleMobile.addEventListener('click', toggleLanguage);

  let startLang = 'en';
  try{ startLang = localStorage.getItem('siteLang') || 'en'; }catch(e){}
  applyLanguage(startLang === 'ar' ? 'ar' : 'en');

  /* ---------- interactivity ---------- */

  // shared refs used by the scroll work below
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu a[data-nav]');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const sceneSections = Array.from(document.querySelectorAll('main > section'));
  const pillNav = document.querySelector('.nav-links');
  let sectionOffsets = [];
  let sectionOffsetsDirty = true;
  let sectionLanguage = document.documentElement.lang;
  let activeSection = null;
  let railSection = null;
  let railVisible = false;
  let scrollNodesDirty = true;
  let timelineNode = null;
  let timelinePath = null;
  let timelineGlow = null;
  let timelineTravelLight = null;
  let timelinePoints = [];
  let projectSpines = [];
  let scrollNodesRevision = -1;
  const whereAmI = document.getElementById('whereAmI');
  const whereAmINumber = document.getElementById('whereAmINumber');
  const whereAmILabel = document.getElementById('whereAmILabel');
  function refreshSectionOffsets(){
    sectionOffsets = sections.map(section => ({section, top:section.offsetTop}));
    sectionOffsetsDirty = false;
  }
  function refreshScrollNodes(){
    timelineNode = document.getElementById('tenseDiagram');
    timelinePath = timelineNode?.querySelector('.spine-path') || null;
    timelineGlow = timelineNode?.querySelector('.spine-glow') || null;
    timelineTravelLight = timelineNode?.querySelector('.timeline-travel-light') || null;
    timelinePoints = timelineNode ? [...timelineNode.querySelectorAll('[data-point]')] : [];
    projectSpines = [...document.querySelectorAll('.spine')].map(spine => ({
      spine,
      entries:[...spine.querySelectorAll(':scope > .entry')]
    }));
    scrollNodesDirty = false;
    scrollNodesRevision = contentRevision;
  }
  let pillNavTarget = null;
  function movePillNav(target, immediate = false){
    if(!pillNav || !target) return;
    pillNavTarget = target;
    pillNav.style.setProperty('--nav-pill-x', `${target.offsetLeft}px`);
    pillNav.style.setProperty('--nav-pill-width', `${target.offsetWidth}px`);
    pillNav.style.setProperty('--nav-pill-opacity', '1');
    const hasPosition = pillNav.dataset.pillReady === 'true';
    if(!hasPosition || immediate){
      pillNav.classList.add('pill-nav-instant');
      requestAnimationFrame(() => {
        pillNav.classList.remove('pill-nav-instant');
        pillNav.dataset.pillReady = 'true';
      });
    }else{
      pillNav.dataset.pillReady = 'true';
    }
  }
  if(pillNav){
    pillNav.addEventListener('pointerover', event => {
      const target = event.target.closest('a');
      if(target) movePillNav(target);
    }, {passive:true});
    pillNav.addEventListener('pointerleave', () => {
      const active = pillNav.querySelector('a.active') || pillNav.querySelector('a');
      if(active) movePillNav(active);
    }, {passive:true});
    window.addEventListener('resize', () => {
      const active = pillNavTarget || pillNav.querySelector('a.active') || pillNav.querySelector('a');
      if(active) movePillNav(active, true);
    }, {passive:true});
  }
  [...navLinks, ...mobileNavLinks].forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if(!target) return;
      event.preventDefault();
      const behavior = reducedMQ.matches ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });
      const href = link.getAttribute('href');
      navLinks.forEach(item => {
        const selected = item.getAttribute('href') === href;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-current', selected ? 'location' : 'false');
      });
      mobileNavLinks.forEach(item => item.classList.toggle('active', item.getAttribute('href') === href));
      const desktopTarget = [...navLinks].find(item => item.getAttribute('href') === href);
      if(desktopTarget) movePillNav(desktopTarget);
      if(history.replaceState) history.replaceState(null, '', href);
    });
  });
  const backToTop = document.getElementById('backToTop');
  const aboutPhotoImg = document.querySelector('.about-photo img');
  const desktopMQ = window.matchMedia('(min-width:768px)');
  const mobileMQ = window.matchMedia('(max-width:767px)');
  const reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Personal photo: accessible lightbox on every device, subtle pointer tilt on desktop only.
  const aboutPhoto = document.getElementById('aboutPhoto');
  const photoLightbox = document.getElementById('photoLightbox');
  const photoLightboxImage = document.getElementById('photoLightboxImage');
  const photoLightboxClose = document.getElementById('photoLightboxClose');
  let photoBeforeOpen = null;
  function currentPhotoImage(){ return aboutPhoto ? aboutPhoto.querySelector('img') : null; }
  function openPhotoLightbox(){
    const image = currentPhotoImage();
    if(!image || !photoLightbox) return;
    photoLightboxImage.src = image.currentSrc || image.src;
    photoLightboxImage.alt = image.alt || 'Photo of Shahd Mohamed';
    photoLightbox.hidden = false;
    document.body.classList.add('photo-lightbox-open');
    photoBeforeOpen = document.activeElement;
    photoLightboxClose.focus();
  }
  function closePhotoLightbox(){
    if(!photoLightbox || photoLightbox.hidden) return;
    photoLightbox.hidden = true;
    photoLightboxImage.removeAttribute('src');
    document.body.classList.remove('photo-lightbox-open');
    if(photoBeforeOpen && photoBeforeOpen.focus) photoBeforeOpen.focus(); else if(aboutPhoto) aboutPhoto.focus();
  }
  if(aboutPhoto){
    aboutPhoto.addEventListener('click', openPhotoLightbox);
    aboutPhoto.addEventListener('keydown', (event) => { if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPhotoLightbox(); } });
  }
  photoLightboxClose.addEventListener('click', closePhotoLightbox);
  photoLightbox.querySelectorAll('[data-photo-close]').forEach(el => el.addEventListener('click', closePhotoLightbox));
  document.addEventListener('keydown', (event) => { if(event.key === 'Escape') closePhotoLightbox(); });
  if(aboutPhoto && desktopMQ.matches && !reducedMQ.matches){
    aboutPhoto.addEventListener('pointermove', (event) => {
      const rect = aboutPhoto.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      aboutPhoto.style.setProperty('--photo-tilt-x', `${(-y * 3).toFixed(2)}deg`);
      aboutPhoto.style.setProperty('--photo-tilt-y', `${(x * 4).toFixed(2)}deg`);
    }, {passive:true});
    aboutPhoto.addEventListener('pointerleave', () => { aboutPhoto.style.removeProperty('--photo-tilt-x'); aboutPhoto.style.removeProperty('--photo-tilt-y'); });
  }
  // mobile menu

  // mobile menu
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('menuBackdrop');
  let menuBeforeOpen = null;
  const menuFocusables = () => [...mobileMenu.querySelectorAll('a,button')].filter(el => !el.hasAttribute('disabled'));
  function closeMenu(){
    mobileMenu.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', document.documentElement.lang === 'ar' ? 'فتح القائمة' : 'Open menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if(menuBeforeOpen && typeof menuBeforeOpen.focus === 'function') requestAnimationFrame(() => menuBeforeOpen.focus());
  }
  hamburger.addEventListener('click', function(){
    const open = mobileMenu.classList.toggle('open');
    backdrop.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? (document.documentElement.lang === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (document.documentElement.lang === 'ar' ? 'فتح القائمة' : 'Open menu'));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    if(open){
      menuBeforeOpen = document.activeElement;
      requestAnimationFrame(() => document.getElementById('mobileMenuClose').focus());
    }
  });
  backdrop.addEventListener('click', closeMenu);
  document.getElementById('mobileMenuClose').addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.addEventListener('keydown', (event) => {
    if(!mobileMenu.classList.contains('open')) return;
    if(event.key === 'Escape'){ event.preventDefault(); closeMenu(); return; }
    if(event.key !== 'Tab') return;
    const items = menuFocusables();
    if(!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if(event.shiftKey && document.activeElement === first){ event.preventDefault(); last.focus(); }
    else if(!event.shiftKey && document.activeElement === last){ event.preventDefault(); first.focus(); }
  });
  let menuTouchStartX = 0, menuTouchStartY = 0, menuTouchAxis = null;
  mobileMenu.addEventListener('touchstart', (event) => {
    if(event.touches.length !== 1 || !mobileMenu.classList.contains('open')) return;
    menuTouchStartX = event.touches[0].clientX;
    menuTouchStartY = event.touches[0].clientY;
    menuTouchAxis = null;
    mobileMenu.style.setProperty('--swipe-x', '0px');
  }, {passive:true});
  mobileMenu.addEventListener('touchmove', (event) => {
    if(!menuTouchStartX || event.touches.length !== 1) return;
    const deltaX = event.touches[0].clientX - menuTouchStartX;
    const deltaY = event.touches[0].clientY - menuTouchStartY;
    if(!menuTouchAxis && (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8)) menuTouchAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
    const rtl = document.documentElement.dir === 'rtl';
    const outward = (!rtl && deltaX > 0) || (rtl && deltaX < 0);
    if(menuTouchAxis === 'x' && outward){
      event.preventDefault();
      const resisted = deltaX * .72;
      mobileMenu.classList.add('is-swiping');
      mobileMenu.style.setProperty('--swipe-x', `${resisted}px`);
    }
  }, {passive:false});
  mobileMenu.addEventListener('touchend', (event) => {
    if(!menuTouchStartX || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - menuTouchStartX;
    const deltaY = event.changedTouches[0].clientY - menuTouchStartY;
    const rtl = document.documentElement.dir === 'rtl';
    const outward = (!rtl && deltaX > 72) || (rtl && deltaX < -72);
    const downward = deltaY > 88 && mobileMenu.scrollTop <= 2;
    mobileMenu.classList.remove('is-swiping');
    mobileMenu.style.removeProperty('--swipe-x');
    if(outward || downward) closeMenu();
    menuTouchStartX = 0;
    menuTouchStartY = 0;
    menuTouchAxis = null;
  }, {passive:true});
  mobileMenu.addEventListener('touchcancel', () => {
    mobileMenu.classList.remove('is-swiping');
    mobileMenu.style.removeProperty('--swipe-x');
    menuTouchStartX = 0;
    menuTouchStartY = 0;
    menuTouchAxis = null;
  }, {passive:true});

  // subtle cursor-reactive glow in the hero (desktop pointers only)
  const heroEl = document.querySelector('.hero');
  const fineMQ = window.matchMedia('(pointer:fine)');
  if(heroEl && fineMQ.matches && !reducedMQ.matches){
    heroEl.addEventListener('mouseenter', () => heroEl.classList.add('mouse-glow'));
    heroEl.addEventListener('mouseleave', () => heroEl.classList.remove('mouse-glow'));
    heroEl.addEventListener('mousemove', (e) => {
      const r = heroEl.getBoundingClientRect();
      heroEl.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      heroEl.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
    let glowFrame = 0;
    document.addEventListener('pointermove', (e) => {
      if(glowFrame) return;
      glowFrame = requestAnimationFrame(() => {
        document.body.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.body.style.setProperty('--cursor-y', `${e.clientY}px`);
        document.body.classList.add('cursor-glow');
        glowFrame = 0;
      });
    }, {passive:true});
    document.addEventListener('pointerleave', () => document.body.classList.remove('cursor-glow'));
  }

  // Desktop interaction system: one delegated pointer field for all tactile surfaces.
  // It is intentionally disabled for touch and reduced-motion contexts.
  const desktopInteractionMQ = window.matchMedia('(min-width:768px) and (hover:hover) and (pointer:fine)');
  if(desktopInteractionMQ.matches && !reducedMQ.matches){
    const interactiveSelector = '.approach-card, .accordion-card, .material-card, .availability-item, .dev-card, .skill-block, .contact-box, .credential-strip .cred, .project-details';
    let pointerFrame = 0;
    let pendingPointer = null;
    document.addEventListener('pointermove', (event) => {
      if (reducedMQ.matches || !desktopInteractionMQ.matches) return;
      const surface = event.target.closest(interactiveSelector);
      pendingPointer = surface ? { surface, x:event.clientX, y:event.clientY } : null;
      if(pointerFrame || !pendingPointer) return;
      pointerFrame = requestAnimationFrame(() => {
        if(pendingPointer){
          const rect = pendingPointer.surface.getBoundingClientRect();
          pendingPointer.surface.style.setProperty('--card-x', `${pendingPointer.x - rect.left}px`);
          pendingPointer.surface.style.setProperty('--card-y', `${pendingPointer.y - rect.top}px`);
        }
        pointerFrame = 0;
      });
    }, {passive:true});
    document.addEventListener('pointerout', (event) => {
      const surface = event.target.closest(interactiveSelector);
      if(surface && !surface.contains(event.relatedTarget)){
        surface.style.removeProperty('--card-x');
        surface.style.removeProperty('--card-y');
      }
    }, {passive:true});
  }

  // reveal on scroll (timeline dots, section heads, and every card)
  var revealObserver = null;
  function observeRevealTargets(){
    const revealTargets = document.querySelectorAll('.entry, .tense-diagram, .reveal, .reveal-item');
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const revealPassedTargets = (targets) => targets.forEach(el => {
      const rect = el.getBoundingClientRect();
      // A language switch rebuilds dynamic sections in place. Anything that
      // has already passed the viewport must not wait for an intersection that
      // can never happen again at the current scroll position.
      if(rect.bottom <= viewportHeight * 1.08) el.classList.add('in-view');
    });
    if(revealObserver){
      revealTargets.forEach(el => revealObserver.observe(el));
      revealPassedTargets(revealTargets);
      return;
    }
    if('IntersectionObserver' in window){
      revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealTargets.forEach(el => revealObserver.observe(el));
      revealPassedTargets(revealTargets);
    } else {
    // no IntersectionObserver support: show everything immediately, no motion lost
    revealTargets.forEach(el => el.classList.add('in-view'));
    }
  }
  observeRevealTargets();

  // ---- all continuous scroll-position work batched into one rAF tick ----
  let parallaxActive = desktopMQ.matches && !reducedMQ.matches && !!aboutPhotoImg;
  let lastMobileProjectTimelineScrollY = -1;
  let lastMobileHeroTimelineScrollY = -1;
  let mobileVisualScrollTimer = 0;

  function updateHeaderAndProgress(){
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight);
    const scrolled = Math.max(0, Math.min(100, (doc.scrollTop / maxScroll) * 100));
    progress.style.transform = `scaleX(${scrolled / 100})`;
    header.classList.toggle('scrolled', doc.scrollTop > 40);
  }

  function updateSpy(){
    if(sectionLanguage !== document.documentElement.lang){ sectionLanguage = document.documentElement.lang; sectionOffsetsDirty = true; }
    if(sectionOffsetsDirty || sectionOffsets.length !== sections.length) refreshSectionOffsets();
    let current = sectionOffsets[0]?.section || sections[0];
    const y = window.scrollY + 120;
    sectionOffsets.forEach(item => { if(item.top <= y) current = item.section; });
    if(current && current !== activeSection){
      activeSection = current;
      navLinks.forEach(a => {
        const selected = a.getAttribute('href') === '#' + current.id;
        a.classList.toggle('active', selected);
        a.setAttribute('aria-current', selected ? 'location' : 'false');
      });
      mobileNavLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
      const active = [...navLinks].find(a => a.classList.contains('active'));
      if(active && pillNav && !pillNav.matches(':hover')) movePillNav(active);
    }
  }

  function updateRailSpy(){
    if(sectionOffsetsDirty || sectionOffsets.length !== sections.length) refreshSectionOffsets();
    let current = sectionOffsets[0]?.section || sections[0];
    const y = window.scrollY + 150;
    sectionOffsets.forEach(item => { if(item.top <= y) current = item.section; });
    if(current){
      const whereIndex = sections.indexOf(current);
      const labels = WHERE_LABELS[current.id] || ['SECTION','قسم'];
      const nextVisible = window.scrollY > 180;
      if(whereAmI && whereAmINumber && whereAmILabel && (current !== railSection || nextVisible !== railVisible)){
        whereAmINumber.textContent = String(Math.max(1, whereIndex + 1)).padStart(2,'0');
        whereAmILabel.textContent = labels[document.documentElement.lang === 'ar' ? 1 : 0];
        whereAmI.classList.toggle('is-visible', nextVisible);
        railSection = current;
        railVisible = nextVisible;
      }
    }
  }

  function updateBackToTop(){
    const shouldShow = window.scrollY > 420;
    if(backToTop.classList.contains('show') !== shouldShow) backToTop.classList.toggle('show', shouldShow);
  }

  function updateAboutParallax(){
    // Language rendering replaces the image; resolve the current node per update.
    const image = currentPhotoImage();
    if(!parallaxActive || !image?.parentElement) return;
    const rect = image.parentElement.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const center = rect.top + rect.height / 2;
    let offset = (center - vh / 2) * 0.035;
    offset = Math.max(Math.min(offset, 6), -6);
    image.style.setProperty('--photo-parallax', `${offset}px`);
  }

  function updateSectionScenes(){
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const focusY = vh * 0.52;
    sceneSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const active = rect.top < focusY && rect.bottom > focusY;
      section.classList.toggle('section-active', active);
    });
  }

  function updateProjectTimelines(force = false){
    if(mobileMQ.matches && !force){
      const scrollY = window.scrollY || 0;
      if(lastMobileProjectTimelineScrollY >= 0 && Math.abs(scrollY - lastMobileProjectTimelineScrollY) < 10) return;
      lastMobileProjectTimelineScrollY = scrollY;
    }
    if(scrollNodesDirty || scrollNodesRevision !== contentRevision) refreshScrollNodes();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const focusY = vh * 0.52;
    projectSpines.forEach(({spine, entries:allEntries}) => {
      const entries = allEntries.filter(entry => !entry.classList.contains('is-filtered') && entry.getClientRects().length);
      if(!entries.length) return;
      let activeIndex = 0;
      let closestDistance = Infinity;
      entries.forEach((entry, index) => {
        const rect = entry.getBoundingClientRect();
        const center = rect.top + Math.min(rect.height, 120) / 2;
        const distance = Math.abs(center - focusY);
        if(rect.top <= focusY && distance < closestDistance){ activeIndex = index; closestDistance = distance; }
      });
      const spineRect = spine.getBoundingClientRect();
      const activeRect = entries[activeIndex].getBoundingClientRect();
      const nodeCenter = mobileMQ.matches ? 24.5 : 8.5;
      const dotY = activeRect.top + nodeCenter - spineRect.top;
      const targetProgress = activeIndex === entries.length - 1
        ? 100
        : Math.max(0, Math.min(100, (dotY / Math.max(1, spineRect.height - 12)) * 100));
      spine.dataset.spineProgress = String(targetProgress);
      spine.style.setProperty('--spine-progress', String(targetProgress));
      allEntries.forEach(entry => {
        const index = entries.indexOf(entry);
        entry.classList.toggle('timeline-active', index === activeIndex);
        entry.classList.toggle('timeline-completed', index < activeIndex);
      });
    });
  }

  function updateTimeline(force = false){
    if(mobileMQ.matches && !force){
      const scrollY = window.scrollY || 0;
      if(lastMobileHeroTimelineScrollY >= 0 && Math.abs(scrollY - lastMobileHeroTimelineScrollY) < 24) return;
      lastMobileHeroTimelineScrollY = scrollY;
    }
    if(scrollNodesDirty || scrollNodesRevision !== contentRevision) refreshScrollNodes();
    const diagram = timelineNode;
    if(!diagram) return;
    const rect = diagram.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const pageAtBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
    const targetProgress = reducedMQ.matches || pageAtBottom
      ? 1
      : Math.max(0, Math.min(1, (vh * 0.84 - rect.top) / (vh * 0.72)));
    // Apply the scroll target in the same frame as native scrolling. CSS owns
    // the subtle interpolation; JavaScript does not chase the target with a
    // second recursive animation loop.
    const progress = targetProgress;
    if(window.timelinePhysics){
      window.timelinePhysics.setScrollProgress(progress);
      diagram.dataset.timelineProgress = String(progress);
      diagram.classList.toggle('in-view', progress > 0.02);
      return;
    }
    // Progress is one semantic state in both locales. Arabic changes the
    // reading layout, but must not reverse Past → Present → Future or make
    // the line appear to grow from the Future when scrolling upward.
    const pathData = 'M10,68 H630';
    const dash = 1 - progress;
    if(timelinePath) timelinePath.style.strokeDashoffset = String(dash);
    if(timelineGlow) timelineGlow.style.strokeDashoffset = String(dash);
    if(timelineTravelLight){
      const x = 10 + (620 * progress);
      timelineTravelLight.setAttribute('cx', x.toFixed(2));
      timelineTravelLight.setAttribute('cy', '68');
    }
    diagram.dataset.timelineProgress = String(progress);
    diagram.dataset.timelineVelocity = '0';
    diagram.classList.toggle('in-view', progress > 0.02);
    timelinePoints.forEach((el) => {
      const point = Number(el.getAttribute('data-point')) / 2;
      el.classList.toggle('active', progress >= point - 0.04);
    });
  }

  function scheduleMobileVisualUpdates(){
    if(!mobileMQ.matches) return;
    clearTimeout(mobileVisualScrollTimer);
    mobileVisualScrollTimer = setTimeout(() => {
      updateSpy();
      updateRailSpy();
      updateTimeline(true);
      updateProjectTimelines(true);
    }, 110);
  }

  let scrollTicking = false;
  function onScrollFrame(){
    updateHeaderAndProgress();
    // Mobile keeps native scrolling. The timeline is intentionally updated here
    // as it is a visible scroll-linked component, while heavier scene/parallax
    // work remains desktop-only for a calmer touch experience.
    if(mobileMQ.matches){
      updateBackToTop();
      scheduleMobileVisualUpdates();
      scrollTicking = false;
      return;
    }
    updateSpy();
    updateRailSpy();
    updateBackToTop();
    updateAboutParallax();
    updateTimeline();
    updateSectionScenes();
    updateProjectTimelines();
    scrollTicking = false;
  }
  function requestScrollUpdate(){
    if(!scrollTicking){
      window.requestAnimationFrame(onScrollFrame);
      scrollTicking = true;
    }
  }
  window.addEventListener('scroll', requestScrollUpdate, {passive:true});
  window.addEventListener('resize', () => {
    sectionOffsetsDirty = true;
    parallaxActive = desktopMQ.matches && !reducedMQ.matches && !!aboutPhotoImg;
    if(!parallaxActive && aboutPhotoImg){ aboutPhotoImg.style.removeProperty('--photo-parallax'); }
    requestScrollUpdate();
  }, {passive:true});
  onScrollFrame(); // run once on load so everything starts in the right state
  // Hero entrance: a calm editorial reveal, skipped for reduced-motion users.
  const heroIntro = document.querySelector('.hero');
  if(heroIntro){
    requestAnimationFrame(() => heroIntro.classList.add('hero-ready'));
  }
  // Header scroll styling is owned by updateHeaderAndProgress above.
  // light / dark mode toggle
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const mobileLabel = themeToggleMobile.querySelector('.tt-label');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme){
    if(theme === 'light'){
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    const isLight = theme === 'light';
    if(themeColorMeta) themeColorMeta.setAttribute('content', isLight ? '#F7F2EC' : '#152825');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggleMobile.setAttribute('aria-pressed', String(isLight));
    const isArabic = document.documentElement.lang === 'ar';
    const nextThemeLabel = isLight ? (isArabic ? 'التبديل إلى الوضع الداكن' : 'Switch to dark mode') : (isArabic ? 'التبديل إلى الوضع الفاتح' : 'Switch to light mode');
    themeToggleMobile.setAttribute('aria-label', nextThemeLabel);
    themeToggle.setAttribute('aria-label', nextThemeLabel);
    mobileLabel.textContent = isLight ? (isArabic ? 'الوضع الداكن' : 'Dark mode') : (isArabic ? 'الوضع الفاتح' : 'Light mode');
  }

  function toggleTheme(){
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    const updateTheme = () => applyTheme(next);
    if(document.startViewTransition && !reducedMQ.matches){
      document.startViewTransition(updateTheme);
    } else {
      updateTheme();
    }
    try{ localStorage.setItem('siteTheme', next); }catch(e){}
  }

  themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile.addEventListener('click', toggleTheme);
  let initialTheme = 'dark';
  try{ initialTheme = localStorage.getItem('siteTheme') === 'light' ? 'light' : 'dark'; }catch(e){}
  applyTheme(initialTheme);

  backToTop.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: reducedMQ.matches ? 'auto' : 'smooth' });
  });

})();
