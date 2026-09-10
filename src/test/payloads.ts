// One corpus of hostile strings, reused by every suite so a payload added
// here is immediately exercised against every sink the tests cover
export const XSS_PAYLOADS = [
    "<script>window.__xss = 1</script>",
    '<img src=x onerror="window.__xss = 1">',
    '<svg onload="window.__xss = 1">',
    '<body onload="window.__xss = 1">',
    '<iframe src="javascript:window.__xss = 1"></iframe>',
    '<a href="javascript:window.__xss = 1">click</a>',
    '<div onclick="window.__xss = 1">click</div>',
    '"><script>window.__xss = 1</script>',
    "'><img src=x onerror=window.__xss=1>",
    "</textarea><script>window.__xss = 1</script>",
    "<style>@import 'https://evil.example/x.css'</style>",
    '<object data="javascript:window.__xss = 1"></object>',
    "<math><mtext><script>window.__xss = 1</script></mtext></math>",
    "<template><script>window.__xss = 1</script></template>",
    '<noscript><p title="</noscript><img src=x onerror=window.__xss=1>">',
];

// The same intent wrapped in the encodings a filter that only looks for a
// literal "<script" tends to miss
export const ENCODED_XSS_PAYLOADS = [
    "%3Cscript%3Ewindow.__xss=1%3C/script%3E",
    "%253Cscript%253Ewindow.__xss=1%253C/script%253E",
    "&lt;script&gt;window.__xss=1&lt;/script&gt;",
    "&amp;lt;script&amp;gt;window.__xss=1&amp;lt;/script&amp;gt;",
    "&#60;script&#62;window.__xss=1&#60;/script&#62;",
    "&#x3c;script&#x3e;window.__xss=1&#x3c;/script&#x3e;",
    "\\u003cscript\\u003ewindow.__xss=1\\u003c/script\\u003e",
    "<scr<script>ipt>window.__xss=1</scr</script>ipt>",
    "<SCRIPT>window.__xss=1</SCRIPT>",
    "<ScRiPt>window.__xss=1</ScRiPt>",
];

export const UNICODE_PAYLOADS = [
    "\u202egnp.exe",
    "null\u0000byte",
    "\ufeffzero width",
    "\u{1FA78}\u{1F480} emoji name",
    "ＪＡＶＡＳＣＲＩＰＴ:alert(1)",
    "\u{1D400}\u{1D401} math bold",
    "á́́́ combining",
    "İstanbul",
    "\u2028 line separator",
    "\u2029 paragraph separator",
    "\t\n\r whitespace",
];

// Anything that must never survive as a navigable url
export const DANGEROUS_URLS = [
    "javascript:window.__xss = 1",
    "JaVaScRiPt:window.__xss = 1",
    "  javascript:window.__xss = 1",
    "java\tscript:window.__xss = 1",
    "java\nscript:window.__xss = 1",
    "java\rscript:window.__xss = 1",
    "\u0000javascript:window.__xss = 1",
    "data:text/html;base64,PHNjcmlwdD53aW5kb3cuX194c3M9MTwvc2NyaXB0Pg==",
    "data:text/html,<script>window.__xss = 1</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "blob:https://evil.example/1234",
    "about:blank",
    "chrome://settings",
];

// Off site destinations an open redirect would hand a visitor to
export const EXTERNAL_URLS = [
    "https://evil.example",
    "https://evil.example/path?a=b",
    "http://evil.example",
    "//evil.example",
    "///evil.example",
    "\\\\evil.example",
    "/\\evil.example",
    "https:evil.example",
    "https:/evil.example",
    "%2f%2fevil.example",
    "%68%74%74%70%73%3a%2f%2fevil.example",
    "https://user:pass@evil.example",
    "https://trusted.example@evil.example",
    "https://evil.example#https://trusted.example",
];

export const PATH_TRAVERSAL_PAYLOADS = [
    "../../../etc/passwd",
    "..%2f..%2f..%2fetc%2fpasswd",
    "....//....//etc/passwd",
    "..\\..\\windows\\system32",
    "/etc/passwd",
    "%2e%2e%2f%2e%2e%2fsecret",
    "a/../../../secret",
    ".",
    "..",
];

export const MALFORMED_VALUES = [
    "",
    " ",
    "   \t\n  ",
    "null",
    "undefined",
    "NaN",
    "Infinity",
    "-Infinity",
    "0x10",
    "1e3",
    "-1",
    "1.5",
    "999999999999999999999999",
    "%",
    "%zz",
    "%E0%A4%A",
];

export const HUGE_STRING = "A".repeat(200_000);
