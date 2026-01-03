#!/usr/bin/env node

/**
 * Test script to verify blog translation saving functionality
 * This script tests the complete flow from form submission to database storage
 */

const fetch = require("node-fetch");

async function testBlogTranslationSave() {
  console.log("🧪 Testing Blog Translation Save Flow...\n");

  try {
    // Test 1: Create a new blog post with translations
    console.log("📝 Test 1: Creating blog post with translations...");

    const blogData = {
      // French (main record)
      title: "Comment aider les enfants défavorisés",
      excerpt:
        "Un guide complet pour soutenir l'éducation des enfants dans le besoin",
      content:
        "Cet article explore différentes façons d'aider les enfants défavorisés...",

      // English translation
      title_en: "How to Help Underprivileged Children",
      excerpt_en:
        "A complete guide to supporting education for children in need",
      content_en:
        "This article explores different ways to help underprivileged children...",

      // Arabic translation
      title_ar: "كيفية مساعدة الأطفال المحرومين",
      excerpt_ar: "دليل كامل لدعم تعليم الأطفال المحتاجين",
      content_ar: "تستعرض هذه المقالة طرق مختلفة لمساعدة الأطفال المحرومين...",

      // Shared fields
      slug: "help-underprivileged-children",
      category: "education",
      status: "published",
      tags: "education, children, charity",
      image: "https://example.com/image.jpg",
    };

    const createResponse = await fetch("http://localhost:3000/api/blog-posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    if (!createResponse.ok) {
      throw new Error(
        `Failed to create blog: ${createResponse.status} ${createResponse.statusText}`,
      );
    }

    const createdBlog = await createResponse.json();
    console.log("✅ Blog created successfully:", createdBlog.id);

    // Test 2: Verify translations were saved
    console.log("\n🔍 Test 2: Verifying translations were saved...");

    const translationsResponse = await fetch(
      `http://localhost:3000/api/blog-posts/${createdBlog.id}/translations`,
    );

    if (!translationsResponse.ok) {
      throw new Error(
        `Failed to fetch translations: ${translationsResponse.status} ${translationsResponse.statusText}`,
      );
    }

    const translationsData = await translationsResponse.json();
    console.log(
      "📄 Retrieved translations data:",
      JSON.stringify(translationsData, null, 2),
    );

    // Verify French data (main record)
    if (translationsData.title.fr !== blogData.title) {
      throw new Error(
        `French title mismatch: expected "${blogData.title}", got "${translationsData.title.fr}"`,
      );
    }
    console.log("✅ French translation verified");

    // Verify English translation
    if (translationsData.title.en !== blogData.title_en) {
      throw new Error(
        `English title mismatch: expected "${blogData.title_en}", got "${translationsData.title.en}"`,
      );
    }
    console.log("✅ English translation verified");

    // Verify Arabic translation
    if (translationsData.title.ar !== blogData.title_ar) {
      throw new Error(
        `Arabic title mismatch: expected "${blogData.title_ar}", got "${translationsData.title.ar}"`,
      );
    }
    console.log("✅ Arabic translation verified");

    // Test 3: Update translations
    console.log("\n🔄 Test 3: Updating translations...");

    const updateData = {
      title: {
        fr: "Comment aider les enfants défavorisés - Mise à jour",
        en: "How to Help Underprivileged Children - Updated",
        ar: "كيفية مساعدة الأطفال المحرومين - محدث",
      },
      excerpt: {
        fr: "Un guide complet mis à jour pour soutenir l'éducation",
        en: "An updated complete guide to supporting education",
        ar: "دليل كامل محدث لدعم التعليم",
      },
      content: {
        fr: "Contenu français mis à jour...",
        en: "Updated English content...",
        ar: "محتوى عربي محدث...",
      },
    };

    const updateResponse = await fetch(
      `http://localhost:3000/api/blog-posts/${createdBlog.id}/translations`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    if (!updateResponse.ok) {
      throw new Error(
        `Failed to update translations: ${updateResponse.status} ${updateResponse.statusText}`,
      );
    }

    const updateResult = await updateResponse.json();
    console.log("✅ Translations updated successfully:", updateResult);

    // Test 4: Verify updated translations
    console.log("\n🔍 Test 4: Verifying updated translations...");

    const updatedTranslationsResponse = await fetch(
      `http://localhost:3000/api/blog-posts/${createdBlog.id}/translations`,
    );
    const updatedTranslationsData = await updatedTranslationsResponse.json();

    if (updatedTranslationsData.title.fr !== updateData.title.fr) {
      throw new Error(
        `Updated French title mismatch: expected "${updateData.title.fr}", got "${updatedTranslationsData.title.fr}"`,
      );
    }
    console.log("✅ Updated French translation verified");

    if (updatedTranslationsData.title.en !== updateData.title.en) {
      throw new Error(
        `Updated English title mismatch: expected "${updateData.title.en}", got "${updatedTranslationsData.title.en}"`,
      );
    }
    console.log("✅ Updated English translation verified");

    if (updatedTranslationsData.title.ar !== updateData.title.ar) {
      throw new Error(
        `Updated Arabic title mismatch: expected "${updateData.title.ar}", got "${updatedTranslationsData.title.ar}"`,
      );
    }
    console.log("✅ Updated Arabic translation verified");

    console.log(
      "\n🎉 All tests passed! Blog translation system is working correctly.",
    );
    console.log("\n📋 Summary:");
    console.log("- ✅ Blog creation with translations");
    console.log("- ✅ Translation data retrieval");
    console.log("- ✅ Translation updates");
    console.log("- ✅ Data consistency verification");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testBlogTranslationSave();
}

module.exports = { testBlogTranslationSave };
