# تقرير تطبيق Ambient Glow / Mesh Gradient على موقع Shahd Mohamed

## ما تم الحفاظ عليه

تم فحص النسخة الحالية من الموقع قبل التعديل. الموقع هو Portfolio تحريري تعليمي، ويعتمد على تسلسل واضح: Hero، About، Teaching، Selected Work، Evidence، Experience، Education، Skills، ثم Contact. لذلك لم يتم تغيير المحتوى أو ترتيب الأقسام أو الخطوط أو أحجام البطاقات أو التنقل أو أي JavaScript موجود.

التغيير محصور في طبقة بصرية مستقلة وملف CSS التحسيني:

- إضافة طبقة `.ambient-glow` خلف المحتوى، لا تدخل في التخطيط ولا تلتقط النقرات.
- إضافة ثلاثة blobs كبيرة ومموهة: أخضر في أعلى اليسار، أصفر هادئ في أسفل اليمين، وأخضر ثالث منخفض الشدة للتوازن فقط.
- استخدام الألوان المطلوبة: `#4ADE80` و`#FDE047`، مع شفافية منخفضة و`blur` كبير حتى لا تظهر دوائر حادة.
- إضافة Glassmorphism خفيف ومحدود إلى بطاقات المعلومات الموجودة أصلًا: `contact-box` و`material-card` و`dev-card` و`skill-block` فقط.
- إضافة ضبط خاص للهاتف وتقليل الشدة في الوضع الفاتح.
- إضافة fallback تعبئة عادية قبل `backdrop-filter` حتى تظل القراءة سليمة في المتصفحات التي لا تدعم الزجاج.

## ما تعلمته من المراجع الاحترافية

### 1. Linear: التأثير الممتاز يترك مساحة للمحتوى

تُظهر مراجع Linear أن الإحساس premium لا يأتي من إضافة حدود وتأثيرات لكل شيء، بل من تقليل وزن العناصر الثانوية، تليين الفواصل، وترك المحتوى الرئيسي يأخذ الأولوية. كما تشرح Linear أن glass الجيد يتكوّن من طبقات قليلة: تعبئة شفافة، blur، تدرج بنيوي خفيف، edge highlight، وظل ناعم، مع تجنب refraction عندما تهدد وضوح النص.

**ما نُقل إلى الموقع:** طبقة glow ثابتة منخفضة الشدة، وعدم إضافة glass إلى كل قسم أو زر، مع الحفاظ على التباين الحالي.

المراجع: [Linear](https://linear.app/) · [Behind the latest design refresh](https://linear.app/now/behind-the-latest-design-refresh) · [Linear Liquid Glass](https://linear.app/now/linear-liquid-glass) · [Brand guidelines](https://linear.app/brand)

### 2. Vercel: اعتبر الصفحة Canvas واحدة ولا تجعل الزخرفة هدفًا

تؤكد إرشادات Vercel أن الأسطح والحدود يجب أن تعبّر عن grouping حقيقي أو حالة تفاعل، وأنه لا ينبغي تغليف كل جزء من الصفحة في card. كما تحذر صراحة من decorative glows وblobs وglass effects كحل افتراضي. هذا مهم هنا لأن الموقع لديه أصلًا بنية تحريرية قوية.

**ما نُقل إلى الموقع:** تأثير واحد على مستوى الصفحة بدل شبكة من الألواح، عدم استخدام animation مستمر أو JavaScript للخلفية، إبقاء `pointer-events:none`، واحترام `prefers-reduced-motion`.

المراجع: [Vercel Design Guidelines](https://vercel.com/design/guidelines) · [Vercel design.md](https://vercel.com/design.md) · [Vercel Speed Insights](https://vercel.com/docs/speed-insights)

### 3. Framer: اجعل الـ mesh توقيعًا محدودًا لا خلفية تنافس المحتوى

تُظهر أمثلة Framer التحريرية أن mesh gradient يمكن أن يعمل كتوقيع بصري في نقاط محددة، خصوصًا حول البداية والنهاية، بدل أن يملأ كل المساحة. وتوصي دروس التأثيرات بالتحكم في opacity وposition، clipping عند الحاجة، وفحص التباين على الخلفيات المختلفة.

**ما نُقل إلى الموقع:** blobs موضوعة خارج الحواف جزئيًا، مع تخفيض blur على الهاتف، ودون تحريك مستمر أو تغيير في أبعاد الأقسام.

المراجع: [Vence editorial portfolio template](https://www.framer.com/marketplace/templates/vence/) · [Mesh Gradient Maker](https://www.framer.com/marketplace/plugins/mesh-gradient-maker/) · [Framer light effects](https://www.framer.com/academy/lessons/light-effects) · [Framer site optimization](https://www.framer.com/help/articles/site-optimization/)

### 4. Raycast: الهدوء في السطح أهم من كثرة الزجاج

تستخدم Raycast خلفيات داكنة وواجهات عالية التباين، مع إبقاء glass أو artwork في لحظات محددة. كما توضح وثائقها أن الخلفية والتدرجات يجب أن تكون قابلة للتحكم ضمن نظام ألوان واضح، لا مجموعة ألوان عشوائية.

**ما نُقل إلى الموقع:** استخدام سطح زجاجي محدود على بطاقات معلومات فعلية، مع border منخفض الشدة وfallback شبه معتم، وترك النص والخطوط الحالية هي العنصر الأهم.

المراجع: [Raycast](https://www.raycast.com/) · [Raycast themes](https://manual.raycast.com/themes) · [Raycast UI lists](https://developers.raycast.com/api-reference/user-interface/list)

### 5. Webflow وAwwwards: glass يحتاج سببًا وظيفيًا

توضح مراجع Webflow أن glassmorphism ينجح عندما يفصل عنصرًا أماميًا عن خلفية مفهومة، باستخدام تعبئة شفافة وblur وحد رفيع. كما تظهر أمثلة Awwwards أن dark mode وglass يمكن أن يكونا جزءًا من نظام متماسك، وليس مجموعة مؤثرات مستقلة.

**ما نُقل إلى الموقع:** لم يتم جعل كل البطاقات شفافة. تم اختيار بطاقات المعلومات الموجودة أصلًا فقط، مع `rgba(255,255,255,.045)` و`blur(12px)` وborder منخفض الشدة.

المراجع: [Webflow Glassmorphism](https://webflow.com/blog/glassmorphism) · [Awwwards dark mode collection](https://www.awwwards.com/awwwards/collections/dark-mode/) · [Henning Tillmann glassmorphism example](https://www.awwwards.com/inspiration/glassmorphism-with-dark-light-theme-henning-tillmann)

## الملفات التي تغيرت

- `index.html`: إضافة عنصر DOM واحد للطبقة الزخرفية.
- `enhancements.css`: إضافة قواعد معزولة للـ glow والـ glass، دون إعادة كتابة CSS الحالي.

## فحوصات الجودة

- `git diff --check`: ناجح.
- الموقع المحلي يعيد HTTP 200.
- سطح المكتب: تم التحقق من أن عرض الصفحة لا يتغير وأن طبقة glow خلف المحتوى.
- الهاتف بعرض 390px: تم أخذ لقطة فعلية، ولم يظهر overflow أفقي أو كسر في الـ Hero أو البطاقات.
- فحص DOM: `pointer-events: none` للطبقة والـ blobs، و`z-index: 0` للطبقة، بينما المحتوى داخل `.wrap` أعلى منها.
- تم الحفاظ على `overflow-x:hidden` الموجود أصلًا دون استخدام `overflow:hidden` يمنع التمرير العمودي.

## النتيجة المقصودة

النتيجة ليست إعادة تصميم. هي نفس Portfolio التعليمي الحالي، لكن ببيئة لونية أعمق وأكثر premium: أخضر ناعم في بداية المشهد، دفء أصفر خافت في الجهة المقابلة، وطبقات معلوماتية أكثر تماسكًا دون جعل النص أو المشاريع تبدو ضبابية.
