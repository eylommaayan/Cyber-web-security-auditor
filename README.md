# 🛡️ Web Security Posture & Header Auditor


<img width="1133" height="471" alt="image" src="https://github.com/user-attachments/assets/cf1818ee-6ffb-4874-9a05-16aca94a2d14" />

<img width="1228" height="833" alt="image" src="https://github.com/user-attachments/assets/dfb6ae07-a936-48d7-80e8-5de72e08f844" />


<img width="1245" height="863" alt="image" src="https://github.com/user-attachments/assets/4c331daa-5ba8-4c5e-a38c-d2bd23eb5221" />


> כלי לניתוח פסיבי של כותרות אבטחה (Security Headers), זיהוי פערי תצורה והערכת חשיפה למתקפות רשת נפוצות – בנוי ב-**Next.js (App Router)**, **TypeScript**, ו-**Tailwind CSS**.

---

## 🌟 סקירה כללית (Overview)

האפליקציה מאפשרת להזין כתובת URL של כל אתר אינטרנט ומבצעת בדיקה פסיבית (Passive Inspection) בלבד של כותרות ה-HTTP שהשרת מחזיר. 

על סמך ניתוח הכותרות, המערכת מחשבת ציון חוסן משוקלל (A+ עד F) ומציגה רשימה של מתקפות רשת שהאתר עלול להיות חשוף אליהן בהיעדר הגנות אלו, לצד המלצות קונקרטיות לתיקון והקשחת השרת.

---

## 🔍 מה המערכת בודקת?

המערכת בודקת 6 כותרות אבטחה קריטיות וממפה אותן למתקפות רלוונטיות:

1. **Content-Security-Policy (CSP):**
   * *חשיפה אפשרית בהיעדר הגנה:* Cross-Site Scripting (XSS), הזרקת סקריפטים וגניבת מידע.
2. **Strict-Transport-Security (HSTS):**
   * *חשיפה אפשרית בהיעדר הגנה:* מתקפות Man-in-the-Middle (MitM), שנמוך פרוטוקול (SSL Stripping).
3. **X-Frame-Options:**
   * *חשיפה אפשרית בהיעדר הגנה:* Clickjacking ו-UI Redressing בתוך `<iframe>` מתחזה.
4. **X-Content-Type-Options:**
   * *חשיפה אפשרית בהיעדר הגנה:* מתקפות MIME-Confusion והרצת קבצים סטטיים כקוד JavaScript.
5. **Referrer-Policy:**
   * *חשיפה אפשרית בהיעדר הגנה:* דליפת מידע רגיש וטוקנים בנתיב ה-URL לשירותי צד שלישי.
6. **Permissions-Policy:**
   * *חשיפה אפשרית בהיעדר הגנה:* גישה לא מורשית לחומרה רגישה (מצלמה, מיקרופון, מיקום גאוגרפי) דרך סקריפטים חיצוניים.

---

## 🛠️ טכנולוגיות (Tech Stack)

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Execution:** Server Actions (עקיפת מגבלות CORS וביצוע שאילתות מהירות ומאובטחות ישירות מהשרת)

---

## 🚀 התקנה והרצה מקומית (Getting Started)

1. **שכפול המאגר:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/web-security-auditor.git](https://github.com/YOUR_USERNAME/web-security-auditor.git)
   cd web-security-auditor
