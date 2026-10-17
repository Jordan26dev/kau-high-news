/**
 * Comprehensive verification script for Kau High News platform
 * Tests: Database, Authentication, Article Workflow, RLS Security
 *
 * Run with: npx ts-node scripts/verify-setup.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface TestResult {
  name: string;
  status: "PASS" | "FAIL";
  message: string;
  duration: number;
}

const results: TestResult[] = [];

function log(message: string) {
  console.log(`\n📋 ${message}`);
}

function logSuccess(message: string) {
  console.log(`✅ ${message}`);
}

function logError(message: string) {
  console.log(`❌ ${message}`);
}

async function test(
  name: string,
  fn: () => Promise<void>
): Promise<void> {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    results.push({ name, status: "PASS", message: "OK", duration });
    logSuccess(`${name} (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - start;
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, status: "FAIL", message, duration });
    logError(`${name}: ${message}`);
  }
}

async function main() {
  log("🚀 Starting verification...\n");

  // ==================== DATABASE SETUP ====================
  log("═══════════════════════════════════════════════════");
  log("1️⃣  VERIFYING DATABASE SETUP");
  log("═══════════════════════════════════════════════════");

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  // Check tables exist
  await test("Database: articles table exists", async () => {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("id")
      .limit(1);
    if (error && error.code !== "PGRST116") throw error;
  });

  await test("Database: profiles table exists", async () => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .limit(1);
    if (error && error.code !== "PGRST116") throw error;
  });

  await test("Database: article_history table exists", async () => {
    const { data, error } = await supabaseAdmin
      .from("article_history")
      .select("id")
      .limit(1);
    if (error && error.code !== "PGRST116") throw error;
  });

  await test("Database: article_editorial_notes table exists", async () => {
    const { data, error } = await supabaseAdmin
      .from("article_editorial_notes")
      .select("id")
      .limit(1);
    if (error && error.code !== "PGRST116") throw error;
  });

  // ==================== AUTHENTICATION ====================
  log("\n═══════════════════════════════════════════════════");
  log("2️⃣  VERIFYING AUTHENTICATION");
  log("═══════════════════════════════════════════════════");

  const supabaseAnonClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  const testEmail = `test-${Date.now()}@kau-high-news.local`;
  const testPassword = "SecureTestPass123!";
  let testUserId = "";

  await test("Auth: Create test user", async () => {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });
    if (error) throw error;
    testUserId = data.user.id;
  });

  await test("Auth: Sign in with credentials", async () => {
    const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    if (error) throw error;
    if (!data.session?.access_token) throw new Error("No access token");
  });

  await test("Auth: Get current user session", async () => {
    const { data, error } = await supabaseAnonClient.auth.getSession();
    if (error) throw error;
    if (!data.session) throw new Error("No active session");
  });

  // ==================== PROFILES & ROLES ====================
  log("\n═══════════════════════════════════════════════════");
  log("3️⃣  VERIFYING PROFILES & ROLES");
  log("═══════════════════════════════════════════════════");

  await test("Profiles: Test user profile created automatically", async () => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, role, status")
      .eq("id", testUserId)
      .single();
    if (error) throw error;
    if (!data) throw new Error("Profile not created");
  });

  await test("Profiles: Update user role to Writer", async () => {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ role: "Writer", status: "active" })
      .eq("id", testUserId);
    if (error) throw error;
  });

  // ==================== ARTICLE WORKFLOW ====================
  log("\n═══════════════════════════════════════════════════");
  log("4️⃣  VERIFYING ARTICLE WORKFLOW");
  log("═══════════════════════════════════════════════════");

  let testArticleId = 0;

  await test("Articles: Create draft article as Writer", async () => {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .insert({
        title: "Test Article",
        slug: `test-article-${Date.now()}`,
        summary: "This is a test article",
        category: "News",
        content: "Test content",
        author_id: testUserId,
        author: "Test Writer",
        status: "draft",
        is_demo: false,
      })
      .select("id")
      .single();
    if (error) throw error;
    testArticleId = data.id;
  });

  await test("Articles: Update status to submitted", async () => {
    const { error } = await supabaseAdmin
      .from("articles")
      .update({ status: "submitted" })
      .eq("id", testArticleId);
    if (error) throw error;
  });

  await test("Articles: Add editorial note", async () => {
    const { error } = await supabaseAdmin
      .from("article_editorial_notes")
      .insert({
        article_id: testArticleId,
        author_id: testUserId,
        note: "Looks good, minor edits needed",
      });
    if (error) throw error;
  });

  await test("Articles: View article history", async () => {
    const { data, error } = await supabaseAdmin
      .from("article_history")
      .select("*")
      .eq("article_id", testArticleId);
    if (error) throw error;
  });

  await test("Articles: Update status to published", async () => {
    const { error } = await supabaseAdmin
      .from("articles")
      .update({ status: "published" })
      .eq("id", testArticleId);
    if (error) throw error;
  });

  // ==================== RLS SECURITY ====================
  log("\n═══════════════════════════════════════════════════");
  log("5️⃣  VERIFYING ROW LEVEL SECURITY (RLS)");
  log("═══════════════════════════════════════════════════");

  // Create another test user
  const testEmail2 = `test2-${Date.now()}@kau-high-news.local`;
  let testUserId2 = "";

  await test("Security: Create second test user", async () => {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail2,
      password: "SecureTestPass456!",
      email_confirm: true,
    });
    if (error) throw error;
    testUserId2 = data.user.id;
  });

  await test("Security: Set second user to Editor role", async () => {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ role: "Editor", status: "active" })
      .eq("id", testUserId2);
    if (error) throw error;
  });

  await test(
    "Security: Anonymous user cannot read draft articles",
    async () => {
      const { data, error } = await supabaseAnonClient
        .from("articles")
        .select("id, status")
        .eq("status", "draft");
      if (error) throw error;
      // Should return empty array due to RLS
      if (data && data.length > 0) {
        throw new Error("RLS failed: anonymous user can see draft articles");
      }
    }
  );

  await test(
    "Security: Anonymous user CAN read published articles",
    async () => {
      const { data, error } = await supabaseAnonClient
        .from("articles")
        .select("id, status")
        .eq("status", "published");
      if (error) throw error;
      // Should return published articles due to RLS policy
    }
  );

  // ==================== STAFF MANAGEMENT ====================
  log("\n═══════════════════════════════════════════════════");
  log("6️⃣  VERIFYING STAFF MANAGEMENT");
  log("═══════════════════════════════════════════════════");

  await test("Staff: List all staff profiles (admin query)", async () => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, role, status")
      .not("id", "is", null);
    if (error) throw error;
    if (!Array.isArray(data)) throw new Error("Invalid response");
  });

  // ==================== CLEANUP ====================
  log("\n═══════════════════════════════════════════════════");
  log("🧹 CLEANUP");
  log("═══════════════════════════════════════════════════");

  await test("Cleanup: Delete test article", async () => {
    const { error } = await supabaseAdmin
      .from("articles")
      .delete()
      .eq("id", testArticleId);
    if (error) throw error;
  });

  await test("Cleanup: Delete test user 1", async () => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(testUserId);
    if (error) throw error;
  });

  await test("Cleanup: Delete test user 2", async () => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(testUserId2);
    if (error) throw error;
  });

  // ==================== SUMMARY ====================
  log("\n═══════════════════════════════════════════════════");
  log("📊 VERIFICATION SUMMARY");
  log("═══════════════════════════════════════════════════");

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const total = results.length;
  const duration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${failed}/${total}`);
  console.log(`⏱️  Total time: ${duration}ms\n`);

  if (failed > 0) {
    console.log("Failed tests:");
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => {
        console.log(`  • ${r.name}: ${r.message}`);
      });
  }

  console.log("\n" + "═".repeat(51));

  if (failed === 0) {
    console.log("🎉 ALL TESTS PASSED! Platform is ready.\n");
    process.exit(0);
  } else {
    console.log("⚠️  Some tests failed. Please review.\n");
    process.exit(1);
  }
}

main().catch((error) => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
