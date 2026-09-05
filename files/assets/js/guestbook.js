(function () {
  'use strict';

  const firebaseConfig = {
    apiKey: "AIzaSyAzwBm0cb5ZrwwhipxWe2dvQ3olS6j0Oh4",
    authDomain: "samar-wedding.firebaseapp.com",
    databaseURL: "https://samar-wedding-default-rtdb.firebaseio.com",
    projectId: "samar-wedding",
    storageBucket: "samar-wedding.firebasestorage.app",
    messagingSenderId: "660807295042",
    appId: "1:660807295042:web:2291dbad191596c55ecddb"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const database = firebase.database();
  const wishesRef = database.ref('wedding_wishes');

  const wishForm = document.getElementById('wishForm');
  const guestNameInput = document.getElementById('wishName');
  const guestMessageInput = document.getElementById('wishMessage');
  const submitBtn = document.querySelector('#wishForm button[type="submit"]');
  const messagesVitrine = document.getElementById('vitrine');

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = guestNameInput.value.trim();
      const message = guestMessageInput.value.trim();
      if (!name || !message) return;

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>جاري الإرسال...</span>';
      submitBtn.disabled = true;

      wishesRef.push({
        name: name,
        message: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        wishForm.reset();
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>تم الإرسال بنجاح!</span>';
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }, 3000);
      }).catch((error) => {
        submitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span>فشل الإرسال</span>';
        console.error("Error saving message: - guestbook.js:50", error);
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }, 3000);
      });
    });
  }

  if (messagesVitrine) {
    wishesRef.orderByChild('timestamp').on('value', (snapshot) => {
      messagesVitrine.innerHTML = ''; 
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push(childSnapshot.val());
      });
      messages.reverse();

      if (messages.length === 0) {
        messagesVitrine.innerHTML = '<div style="text-align:center; color:var(--c-text-muted); padding:20px;">كن أول من يهنئ العروسين! 💍</div>';
        return;
      }

      messages.forEach((data) => {
        const card = document.createElement('div');
        card.className = 'wish-card reveal-up is-visible'; 
        card.innerHTML = `
          <p class="wish-card-name"><i class="fa-solid fa-heart" style="color:var(--c-primary); margin-left:5px;"></i> ${escapeHTML(data.name)}</p>
          <p class="wish-card-message">${escapeHTML(data.message).replace(/\n/g, '<br>')}</p>
        `;
        messagesVitrine.appendChild(card);
      });
    }, (error) => {
      messagesVitrine.innerHTML = `<div style="text-align:center; color:#A85759; padding:20px;">عذراً، حدث خطأ في قاعدة البيانات: <br> ${error.message}</div>`;
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
      }[tag] || tag)
    );
  }
})();