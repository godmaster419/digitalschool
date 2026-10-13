/**
 * End-to-End HTTP Testing against Live Running Next.js Server
 */

const BASE_URL = process.env.TARGET_URL || "https://digitalschool-neon.vercel.app";

interface TestReport {
  test: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const reports: TestReport[] = [];

async function testEndpoint(
  testName: string,
  path: string,
  options: RequestInit = {},
  validator: (res: Response, text: string) => boolean,
  expectedDesc: string
) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      redirect: "manual", // Don't follow redirects automatically so we can assert on 307/308
      ...options,
    });
    const text = await res.text();
    const passed = validator(res, text);
    const actualDesc = `Status ${res.status}${res.headers.get("location") ? ` -> Location: ${res.headers.get("location")}` : ""}`;

    reports.push({
      test: testName,
      expected: expectedDesc,
      actual: actualDesc,
      passed,
    });

    console.log(`${passed ? "✓ PASS" : "✗ FAIL"}: ${testName} (${actualDesc})`);
  } catch (err: any) {
    reports.push({
      test: testName,
      expected: expectedDesc,
      actual: `Error: ${err.message}`,
      passed: false,
    });
    console.log(`✗ FAIL: ${testName} (Error: ${err.message})`);
  }
}

async function runAllTests() {
  console.log("\n=======================================================");
  console.log("DIGITAL SCHOOL — E2E LIVE HTTP VERIFICATION RUN");
  console.log("=======================================================\n");

  console.log("--- PART 1: PUBLIC WEBSITE ROUTES ---");

  // 1. Homepage
  await testEndpoint(
    "Public Homepage (/) renders successfully",
    "/",
    {},
    (res, text) => res.status === 200 && text.includes("Digital School") && text.includes("Class 3"),
    "HTTP 200 with Digital School & Class 3"
  );

  // 2. Classes Index
  await testEndpoint(
    "Classes Index (/classes) renders active curriculum",
    "/classes",
    {},
    (res, text) => res.status === 200 && text.includes("Class 3") && text.includes("Class 8"),
    "HTTP 200 with Class 3 to 8"
  );

  // 3. Class Page
  await testEndpoint(
    "Class 3 Page (/classes/class-3) renders subjects",
    "/classes/class-3",
    {},
    (res, text) => res.status === 200 && text.includes("Mathematics"),
    "HTTP 200 with Mathematics"
  );

  // 4. Class Subject Page
  await testEndpoint(
    "Class 3 Math (/classes/class-3/mathematics) renders topics",
    "/classes/class-3/mathematics",
    {},
    (res, text) => res.status === 200 && text.includes("Multiplication"),
    "HTTP 200 with Multiplication topic"
  );

  // 5. Topic Detail Page
  await testEndpoint(
    "Topic Page (/classes/class-3/mathematics/multiplication-basics) renders educational content",
    "/classes/class-3/mathematics/multiplication-basics",
    {},
    (res, text) => res.status === 200 && text.includes("Multiplication") && (text.includes("Notes") || text.includes("Overview")),
    "HTTP 200 with Notes content"
  );

  // 6. Aggregate Resources Pages
  await testEndpoint(
    "Books Catalog (/books) renders textbooks",
    "/books",
    {},
    (res, text) => res.status === 200 && (text.includes("Books") || text.includes("Textbook")),
    "HTTP 200"
  );

  await testEndpoint(
    "Videos Catalog (/videos) renders educational videos",
    "/videos",
    {},
    (res, text) => res.status === 200 && text.includes("Video"),
    "HTTP 200"
  );

  await testEndpoint(
    "Worksheets Catalog (/worksheets) renders worksheets",
    "/worksheets",
    {},
    (res, text) => res.status === 200 && text.includes("Worksheet"),
    "HTTP 200"
  );

  await testEndpoint(
    "About Page (/about) renders platform info",
    "/about",
    {},
    (res, text) => res.status === 200 && text.includes("About"),
    "HTTP 200"
  );

  await testEndpoint(
    "Search Page (/search) renders search interface",
    "/search",
    {},
    (res, _text) => res.status === 200,
    "HTTP 200"
  );

  // 7. SEO endpoints
  await testEndpoint(
    "Robots.txt (/robots.txt) serves crawlers config",
    "/robots.txt",
    {},
    (res, text) => res.status === 200 && text.includes("Disallow: /admin/"),
    "HTTP 200 containing Disallow: /admin/"
  );

  await testEndpoint(
    "Sitemap.xml (/sitemap.xml) serves XML sitemap",
    "/sitemap.xml",
    {},
    (res, text) => res.status === 200 && text.includes("urlset"),
    "HTTP 200 containing urlset"
  );

  console.log("\n--- PART 2: ADMIN CMS ROUTE PROTECTION (UNAUTHENTICATED) ---");

  const protectedAdminRoutes = [
    "/admin",
    "/admin/classes",
    "/admin/subjects",
    "/admin/topics",
    "/admin/notes",
    "/admin/videos",
    "/admin/worksheets",
    "/admin/books",
    "/admin/settings",
  ];

  for (const route of protectedAdminRoutes) {
    await testEndpoint(
      `Unauthenticated ${route} redirects to login`,
      route,
      {},
      (res) => (res.status === 307 || res.status === 308) && (res.headers.get("location")?.includes("/admin/login") || false),
      "HTTP 307/308 redirect to /admin/login"
    );
  }

  // Admin login page directly
  await testEndpoint(
    "Admin Login Page (/admin/login) is accessible to unauthenticated users",
    "/admin/login",
    {},
    (res, text) => res.status === 200 && (text.includes("Loading Admin Portal") || text.includes("Sign In")),
    "HTTP 200 with Admin Portal"
  );

  console.log("\n--- PART 3: ADMIN CMS AUTHENTICATED ACCESS ---");

  // With active session cookie
  await testEndpoint(
    "Authenticated /admin route opens dashboard when session cookie present",
    "/admin",
    {
      headers: {
        Cookie: "ds_admin_session=active",
      },
    },
    (res, text) => res.status === 200 && text.includes("Admin"),
    "HTTP 200 with Admin Dashboard"
  );

  await testEndpoint(
    "Authenticated user visiting /admin/login redirects to /admin",
    "/admin/login",
    {
      headers: {
        Cookie: "ds_admin_session=active",
      },
    },
    (res) => (res.status === 307 || res.status === 308) && res.headers.get("location")?.endsWith("/admin") === true,
    "HTTP 307/308 redirect to /admin"
  );

  console.log("\n=======================================================");
  const total = reports.length;
  const passed = reports.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`E2E SUMMARY: Total Tests: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
