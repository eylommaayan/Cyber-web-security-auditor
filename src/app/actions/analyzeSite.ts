"use server";

export interface SecurityCheckResult {
  header: string;
  name: string;
  present: boolean;
  value: string | null;
  severity: "high" | "medium" | "low";
  vulnerabilities: string[];
  description: string;
  recommendation: string;
}

export interface AnalysisResponse {
  url: string;
  score: number; // 0 - 100
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  checks: SecurityCheckResult[];
  error?: string;
}

const SECURITY_HEADERS = [
  {
    header: "content-security-policy",
    name: "Content-Security-Policy (CSP)",
    severity: "high" as const,
    weight: 25,
    vulnerabilities: [
      "Cross-Site Scripting (XSS)",
      "Data Injection Attacks",
      "Malicious Script Execution",
    ],
    description: "מגדיר מאילו מקורות מותר לטעון סקריפטים, עיצובים ותמונות.",
    recommendation:
      "הגדר כותרת CSP המגבילה מקורות מהימנים בלבד, למשל: default-src 'self'",
  },
  {
    header: "strict-transport-security",
    name: "Strict-Transport-Security (HSTS)",
    severity: "high" as const,
    weight: 20,
    vulnerabilities: [
      "Man-in-the-Middle (MitM)",
      "SSL Stripping",
      "Eavesdropping on Unencrypted Traffic",
    ],
    description: "מחייב את הדפדפן לתקשר אך ורק דרך הצפנת HTTPS.",
    recommendation: "הוסף: max-age=31536000; includeSubDomains; preload",
  },
  {
    header: "x-frame-options",
    name: "X-Frame-Options",
    severity: "medium" as const,
    weight: 15,
    vulnerabilities: ["Clickjacking", "UI Redressing"],
    description: "מונע הטמעה של האתר בתוך iframe באתרים חיצוניים מתחזים.",
    recommendation: "הגדר: DENY או SAMEORIGIN",
  },
  {
    header: "x-content-type-options",
    name: "X-Content-Type-Options",
    severity: "medium" as const,
    weight: 15,
    vulnerabilities: [
      "MIME Sniffing",
      "Cross-Site Script Execution via Malformed Content",
    ],
    description: "מונע מהדפדפן לנסות לפענח סוגי קבצים מעבר למה שהשרת הגדיר.",
    recommendation: "הגדר: nosniff",
  },
  {
    header: "referrer-policy",
    name: "Referrer-Policy",
    severity: "low" as const,
    weight: 15,
    vulnerabilities: [
      "Information Leakage",
      "Sensitive Token/Path Exposure in URLs",
    ],
    description: "שולט על כמות המידע שנשלחת בכותרת Referer לאתרים חיצוניים.",
    recommendation: "הגדר: strict-origin-when-cross-origin",
  },
  {
    header: "permissions-policy",
    name: "Permissions-Policy",
    severity: "low" as const,
    weight: 10,
    vulnerabilities: [
      "Unauthorized Hardware Access (Camera, Mic, Geolocation) via 3rd Party Scripts",
    ],
    description: "מגביל גישה ליכולות חומרה רגישות של הדפדפן.",
    recommendation:
      "הגדר הרשאות קשיחות, למשל: camera=(), microphone=(), geolocation=()",
  },
];

export async function analyzeSite(inputUrl: string): Promise<AnalysisResponse> {
  let targetUrl = inputUrl.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = "https://" + targetUrl;
  }

  try {
    const urlObj = new URL(targetUrl);
    // שליחת בקשה פסיבית לקריאת כותרות בלבד
    const response = await fetch(urlObj.href, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent": "SecurityPostureInspector/1.0",
      },
    });

    const headers = response.headers;
    let totalScore = 0;
    const checks: SecurityCheckResult[] = [];

    for (const item of SECURITY_HEADERS) {
      const headerVal = headers.get(item.header);
      const isPresent = Boolean(headerVal);

      if (isPresent) {
        totalScore += item.weight;
      }

      checks.push({
        header: item.header,
        name: item.name,
        present: isPresent,
        value: headerVal,
        severity: item.severity,
        vulnerabilities: item.vulnerabilities,
        description: item.description,
        recommendation: item.recommendation,
      });
    }

    // חישוב ציון ואות דירוג
    let grade: AnalysisResponse["grade"] = "F";
    if (totalScore >= 90) grade = "A+";
    else if (totalScore >= 80) grade = "A";
    else if (totalScore >= 70) grade = "B";
    else if (totalScore >= 50) grade = "C";
    else if (totalScore >= 30) grade = "D";

    return {
      url: urlObj.origin,
      score: totalScore,
      grade,
      checks,
    };
  } catch (err: unknown) {
    return {
      url: targetUrl,
      score: 0,
      grade: "F",
      checks: [],
      error: "לא ניתן היה לגשת לכתובת המבוקשת. ודא שהאתר פעיל ושהכתובת תקינה.",
    };
  }
}
