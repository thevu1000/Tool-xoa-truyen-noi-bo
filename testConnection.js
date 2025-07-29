import { createClient } from '@sanity/client';
import { sanityConfig } from './sanity.config.js';

const client = createClient({
  ...sanityConfig,
  useCdn: false,
});

client
  .fetch('*[_type == "mangaSeries"][0]')
  .then((res) => {
    console.log('✅ Token hoạt động, kết quả:', res);
  })
  .catch((err) => {
    console.error('❌ Token lỗi:', err.message);
    console.log('Chi tiết:', err.responseBody);
  });
