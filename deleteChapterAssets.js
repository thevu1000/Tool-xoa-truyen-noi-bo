import { createClient } from '@sanity/client';
import readline from 'readline';
import { sanityConfig } from './sanity.config.js';

const client = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  token: sanityConfig.token,
  useCdn: false,
  apiVersion: sanityConfig.apiVersion,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function deleteChapterImages(assetRefs) {
  console.log(`🔍 Tìm thấy ${assetRefs.length} ảnh cần xoá...`);
  for (const assetRef of assetRefs) {
    try {
      await client.delete(assetRef);
      console.log(`✅ Đã xoá asset: ${assetRef}`);
    } catch (err) {
      console.warn(`⚠️ Không thể xoá asset ${assetRef}: ${err.message}`);
    }
  }
}

async function deleteUnreferencedAssets() {
  console.log(`🧹 Đang tìm các ảnh không còn được reference...`);
  const unreferencedAssets = await client.fetch(`
    *[_type == "sanity.imageAsset" && count(*[references(^._id)]) == 0] {
      _id,
      url
    }
  `);

  if (!unreferencedAssets.length) {
    console.log("✅ Không có ảnh mồ côi nào.");
    return;
  }

  for (const asset of unreferencedAssets) {
    try {
      await client.delete(asset._id);
      console.log(`🗑️ Đã xoá ảnh mồ côi: ${asset._id}`);
    } catch (err) {
      console.warn(`⚠️ Lỗi xoá ảnh ${asset._id}: ${err.message}`);
    }
  }
  console.log("🎉 Đã xoá toàn bộ ảnh mồ côi.");
}

async function run() {
  const docId = await ask('🔍 Nhập ID hoặc slug của mangaSeries: ');
  const chapterNumberStr = await ask('📘 Nhập Chapter Number cần xoá: ');
  const chapterNumber = parseFloat(chapterNumberStr);

  if (isNaN(chapterNumber)) {
    console.error('❌ Chapter number không hợp lệ!');
    rl.close();
    return;
  }

  const doc = await client.fetch(
    `*[_type == "mangaSeries" && (_id == $id || slug.current == $id)][0]`,
    { id: docId }
  );

  if (!doc) {
    console.error('❌ Không tìm thấy mangaSeries!');
    rl.close();
    return;
  }

  console.log(`📚 Tên truyện: ${doc.title || '(Không có tiêu đề)'}`);

  const chapterToDelete = doc.chapters?.find(
    (ch) => ch.chapterNumber === chapterNumber
  );

  if (!chapterToDelete) {
    console.error('❌ Không tìm thấy chapter với số chương đó!');
    rl.close();
    return;
  }

  const assetRefs =
    chapterToDelete.pages?.map((img) => img.asset?._ref).filter(Boolean) || [];

  // Step 1: Xoá chapter khỏi doc
  const newChapters = doc.chapters.filter(
    (ch) => ch.chapterNumber !== chapterNumber
  );

  await client.patch(doc._id).set({ chapters: newChapters }).commit();
  console.log(`✅ Đã xoá chapter ${chapterNumber} khỏi truyện`);

  // Step 2: Cố gắng xoá ảnh từ chương vừa xoá
  await deleteChapterImages(assetRefs);

  // Step 3: Xoá toàn bộ ảnh mồ côi còn sót lại
  await deleteUnreferencedAssets();

  rl.close();
}

run();
