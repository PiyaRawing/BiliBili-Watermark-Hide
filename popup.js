document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
  
    // โหลดสถานะการทำงานจาก storage
    chrome.storage.local.get('enabled', (data) => {
      toggle.checked = data.enabled || false;
    });
  
    // เมื่อผู้ใช้เปลี่ยนสถานะเปิด/ปิด
    toggle.addEventListener('change', () => {
      const isEnabled = toggle.checked;
      chrome.storage.local.set({ enabled: isEnabled });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: isEnabled ? 'enable' : 'disable' });
        }
      });
    });
  });
  