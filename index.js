// index.js

// Фиксированный хедер при скролле
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Куки-баннер
const cookieBanner = document.getElementById('cookieBanner');
const acceptBtn = document.getElementById('acceptCookies');
if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1000);
}
acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieBanner.classList.remove('show');
});

// Плашка бронирования (появляется при скролле)
const bookingSticky = document.getElementById('bookingSticky');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        bookingSticky.classList.add('show');
    } else {
        bookingSticky.classList.remove('show');
    }
});

// ==== Улучшенный выбор дат с flatpickr ====
const dateInput = document.getElementById('dateRange');
let selectedDates = { checkin: '', checkout: '' };

const fp = flatpickr(dateInput, {
    mode: "range",
    locale: "ru",
    dateFormat: "d.m.Y",
    minDate: "today",
    showMonths: 2,
    onClose: function(selectedDatesArr, dateStr, instance) {
        if (selectedDatesArr.length === 2) {
            // Форматируем для отображения
            const start = instance.formatDate(selectedDatesArr[0], "d.m.Y");
            const end = instance.formatDate(selectedDatesArr[1], "d.m.Y");
            dateInput.value = `${start} – ${end}`;
            // Сохраняем в машиночитаемом формате для передачи
            selectedDates.checkin = instance.formatDate(selectedDatesArr[0], "Y-m-d");
            selectedDates.checkout = instance.formatDate(selectedDatesArr[1], "Y-m-d");
        } else {
            selectedDates.checkin = '';
            selectedDates.checkout = '';
        }
    },
    // По умолчанию placeholder
    onReady: function(selectedDatesArr, dateStr, instance) {
        dateInput.placeholder = "Выберите даты";
    }
});

// Гости
const bookingGuests = document.getElementById('bookingGuests');
const guestsDropdown = document.getElementById('guestsDropdown');
bookingGuests.addEventListener('click', (e) => {
    e.stopPropagation();
    guestsDropdown.classList.toggle('active');
});

let adults = 2, children = 0;
document.querySelectorAll('.guest-incr').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.dataset.type;
        if (type === 'adults') adults++;
        if (type === 'children') children++;
        updateGuests();
    });
});
document.querySelectorAll('.guest-decr').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.dataset.type;
        if (type === 'adults' && adults > 1) adults--;
        if (type === 'children' && children > 0) children--;
        updateGuests();
    });
});
function updateGuests() {
    document.getElementById('adultsCount').textContent = adults;
    document.getElementById('childrenCount').textContent = children;
    document.querySelector('#bookingGuests span').textContent = `${adults + children} гост${adults+children === 1 ? 'ь' : 'я'}`;
}

// Закрытие дропдауна гостей при клике вне
document.addEventListener('click', () => {
    guestsDropdown.classList.remove('active');
});

// Переход на страницу бронирования с параметрами
const bookingBtn = document.getElementById('bookingBtn');
bookingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDates.checkin) params.append('checkin', selectedDates.checkin);
    if (selectedDates.checkout) params.append('checkout', selectedDates.checkout);
    params.append('adults', adults);
    params.append('children', children);
    window.location.href = 'booking.html?' + params.toString();
});

// FAQ аккордеон
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
    });
});

// Модальные окна (заглушки для юридических документов)
function openModal(id) {
    alert('Документ откроется в новой вкладке (здесь заглушка)');
}
document.querySelectorAll('#openOffer, #footerOffer').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); openModal('offer'); });
});
document.querySelectorAll('#openPolicy, #footerPolicy').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); openModal('policy'); });
});
document.getElementById('openCookies')?.addEventListener('click', (e) => {
    e.preventDefault(); openModal('cookies');
});

// Мобильное меню (простое решение)
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
mobileBtn.addEventListener('click', () => {
    if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
    } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.backgroundColor = 'rgba(13, 31, 19, 0.98)';
        navMenu.style.padding = '30px';
        navMenu.style.zIndex = '999';
    }
});

// При загрузке проверяем параметры URL (если перешли с уже выбранными датами с другой страницы)
(function initFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const checkin = urlParams.get('checkin');
    const checkout = urlParams.get('checkout');
    const adultsParam = urlParams.get('adults');
    const childrenParam = urlParams.get('children');

    if (checkin && checkout) {
        // Установить даты в flatpickr
        fp.setDate([new Date(checkin), new Date(checkout)], false);
        // Отобразить в поле
        const start = checkin.split('-').reverse().join('.');
        const end = checkout.split('-').reverse().join('.');
        dateInput.value = `${start} – ${end}`;
        selectedDates.checkin = checkin;
        selectedDates.checkout = checkout;
    }
    if (adultsParam) {
        adults = parseInt(adultsParam);
        document.getElementById('adultsCount').textContent = adults;
    }
    if (childrenParam) {
        children = parseInt(childrenParam);
        document.getElementById('childrenCount').textContent = children;
    }
    updateGuests();
})();