# 🧾 HƯỚNG DẪN XOÁ CHAPTER + ẢNH TRONG SANITY

> ⚠️ **Chức năng:**  
> Script này sẽ:  
> 1. Xoá chapter bạn chỉ định khỏi truyện.  
> 2. Tự xoá luôn các ảnh trong chapter đó.  
> 3. Nếu ảnh không thể xoá liền vì đang bị "giữ lại" → script sẽ đợi sau khi chapter xoá xong rồi tự quét lại toàn bộ media, xoá các ảnh "mồ côi" không còn sử dụng nữa.

---

## 🛠️ 1. CHUẨN BỊ TRƯỚC

### 📁 Tải về file mã nguồn
Bạn cần có thư mục chứa các file sau:

```
delete-chapter-assets/
│
├─ deleteChapterWithOrphanCleanup.js     ✅ File script chính
├─ sanity.config.js                      ✅ Thông tin kết nối Sanity
├─ package.json                          ✅ Cấu hình chạy node
└─ node_modules/                         ✅ (Tự sinh khi cài đặt)
```

### ⚙️ Mở file `sanity.config.js` và điền:
```js
export const sanityConfig = {
  projectId: 'your_project_id',
  dataset: 'production',
  token: 'your_sanity_token',
  apiVersion: '2024-06-01',
};
```

> **Lưu ý:** 
> - Token này không được hết hạn, và phải có quyền "Editor" trở lên.
> - **Để lấy token và project ID, vui lòng liên hệ chủ tool.**

---

## 🧪 2. CÀI ĐẶT VÀ CHẠY LẦN ĐẦU

### ✅ Cài thư viện node
Mở Terminal hoặc CMD (dùng VS Code cũng được):

```bash
npm install
```

---

## 🚀 3. CÁCH SỬ DỤNG

### 👉 Chạy lệnh:
```bash
npm start
```

### ✍️ Sau đó làm theo hướng dẫn:

#### 🔍 Nhập ID hoặc slug của mangaSeries:
- Ví dụ: `yuru-fuwa-noka` hoặc `_id` của truyện bạn muốn chỉnh sửa.

#### 📘 Nhập Chapter Number cần xoá:
- Ví dụ: `3` → nó sẽ xoá chương 3 và tất cả hình ảnh trong chương đó.

---

## 📦 4. KẾT QUẢ SAU KHI CHẠY

Bạn sẽ thấy các dòng như:

```
📚 Tên truyện: Yuru Fuwa Noka No Moji Bake Skill
✅ Đã xoá chapter 3 khỏi truyện
✅ Đã xoá asset: image-xxx
🧹 Đang tìm các ảnh không còn được reference...
🗑️ Đã xoá ảnh mồ côi: image-yyy
🎉 Đã xoá toàn bộ ảnh mồ côi.
```

---

## ⚠️ 5. LƯU Ý QUAN TRỌNG

| Vấn đề                       | Giải pháp                                                     |
|-----------------------------|---------------------------------------------------------------|
| Token bị lỗi "Unauthorized" | Kiểm tra lại token trong `sanity.config.js`                  |
| Không tìm thấy chapter      | Nhập sai số chương hoặc truyện không có chapter đó           |
| Không xoá được ảnh          | Script sẽ xử lý tự động sau khi chapter xoá xong             |

---

## ✅ GỢI Ý DÀNH CHO NGƯỜI DÙNG KHÔNG CODE

Nếu bạn **chỉ cần xoá vài chương mỗi lần**, hãy:

1. Ghi trước `_id` hoặc slug của truyện.
2. Biết chắc **số chương cần xoá** (số nguyên hoặc 4.5 cũng được).
3. Gửi list cho người kỹ thuật hoặc chạy script theo hướng dẫn này.
