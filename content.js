function removeWatermark() {
    const watermarks = document.querySelectorAll('div.ip-watermark');
    watermarks.forEach(watermark => watermark.remove());
    console.log("Watermark removed!");
  }
  
  let isEnabled = false; // สถานะเริ่มต้น
  
  // โหลดสถานะจาก storage
  chrome.storage.local.get('enabled', (data) => {
    isEnabled = data.enabled || false;
  
    if (isEnabled) {
      removeWatermark();
      observeDOMChanges();
    }
  });
  
  // สร้าง observer เพื่อตรวจจับการเปลี่ยนแปลงใน DOM
  let observer;
  function observeDOMChanges() {
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => {
      if (isEnabled) removeWatermark();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // รับข้อความจาก popup เพื่อเปิด/ปิด
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'enable') {
      isEnabled = true;
      removeWatermark();
      observeDOMChanges();
    } else if (message.action === 'disable') {
      isEnabled = false;
      if (observer) observer.disconnect();
      console.log("Watermark removal disabled.");
    }
  });
  