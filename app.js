const stops = [
  { day: 1, time: '10:20', name: '新千歳空港', note: '到着後、JRで札幌へ', lat: 42.7752, lng: 141.6923 },
  { day: 1, time: '12:10', name: '回転寿し トリトン 円山店', note: '北海道の新鮮なネタでランチ', lat: 43.0541, lng: 141.3098 },
  { day: 1, time: '15:00', name: '大通公園 ビアガーデン', note: '夏だけの、札幌の風物詩', lat: 43.0604, lng: 141.3488 },
  { day: 1, time: '18:00', name: 'サッポロビール園', note: 'ジンギスカンと生ビール', lat: 43.0709, lng: 141.3745 },
  { day: 1, time: '20:30', name: '藻岩山（時間が合えば）', note: '札幌の夜景を一望', lat: 43.0223, lng: 141.3217 },
  { day: 2, time: '10:30', name: '青塚食堂', note: '祝津で豪快な海鮮ランチ', lat: 43.2297, lng: 141.0071 },
  { day: 2, time: '13:00', name: '小樽散策・小樽運河', note: 'オルゴール堂、ガラス工房を巡る', lat: 43.1987, lng: 141.0036 },
  { day: 2, time: '18:00', name: 'えびそば 一幻 新千歳空港店', note: '旅の最後に濃厚えびラーメン', lat: 42.7752, lng: 141.6923 }
];
const hotels = [
  { name: 'ザ ロイヤルパーク キャンバス 札幌大通公園', area: '大通公園まで徒歩1分', rating: '★ 4.5', price: '¥12,800', url: 'https://travel.rakuten.co.jp/' },
  { name: 'JRタワーホテル日航札幌', area: '札幌駅直結・空港アクセス抜群', rating: '★ 4.6', price: '¥18,200', url: 'https://www.booking.com/' },
  { name: 'ホテルノルド小樽', area: '小樽運河を望むクラシックホテル', rating: '★ 4.3', price: '¥10,500', url: 'https://travel.rakuten.co.jp/' }
];
let map, markers = [], line;
function renderTimeline() {
  const root = document.getElementById('timeline'); root.innerHTML = '';
  [1, 2].forEach(day => { const section = document.createElement('section'); section.className = 'day';
    const title = day === 1 ? 'DAY 1 <span>札幌を味わう</span>' : 'DAY 2 <span>小樽をめぐる</span>';
    section.innerHTML = `<div class="day-title">${title}</div>`;
    stops.filter(s => s.day === day).forEach(stop => { const index = stops.indexOf(stop); const item = document.createElement('article'); item.className = 'stop'; item.innerHTML = `<span class="stop-number">${index + 1}</span><div class="stop-content"><div class="stop-time">${stop.time}</div><div class="stop-name">${stop.name}</div><p class="stop-description">${stop.note}</p></div>`; item.addEventListener('click', () => focusStop(index)); section.appendChild(item); }); root.appendChild(section);
  });
}
function renderHotels() { document.getElementById('hotelList').innerHTML = hotels.map(h => `<article class="hotel-card"><div class="hotel-top"><div class="hotel-name">${h.name}</div><span class="hotel-rating">${h.rating}</span></div><div class="hotel-area">${h.area}</div><div class="hotel-footer"><div class="hotel-price">${h.price} <small>〜 / 1泊</small></div><a class="reserve" target="_blank" rel="noopener" href="${h.url}">予約を見る ↗</a></div></article>`).join(''); }
function icon(number) { return L.divIcon({ className: 'custom-pin', html: `<div class="pin">${number}</div>`, iconSize: [25,25], iconAnchor: [12,12] }); }
function initMap() { map = L.map('map', { zoomControl: false }).setView([43.11, 141.23], 9); L.control.zoom({ position: 'bottomright' }).addTo(map); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map); markers = stops.map((stop, i) => L.marker([stop.lat, stop.lng], { icon: icon(i + 1) }).addTo(map).bindPopup(`<strong>${stop.name}</strong><br><span>${stop.note}</span>`).on('click', () => updateMapCard(i))); line = L.polyline(stops.map(s => [s.lat, s.lng]), { color: '#1e7772', weight: 3, opacity: .7, dashArray: '6 8' }).addTo(map); }
function updateMapCard(index) { const s = stops[index]; document.getElementById('mapCard').innerHTML = `<span class="number-badge">${index + 1}</span><div><strong>${s.name}</strong><p>${s.note}</p></div>`; }
function focusStop(index) { const s = stops[index]; map.flyTo([s.lat, s.lng], index === 0 || index === stops.length - 1 ? 10 : 14, { duration: .65 }); markers[index].openPopup(); updateMapCard(index); }
function toast(message) { const element = document.getElementById('toast'); element.textContent = message; element.classList.add('show'); setTimeout(() => element.classList.remove('show'), 2500); }
document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => chip.classList.toggle('active')));
document.getElementById('plannerForm').addEventListener('submit', event => { event.preventDefault(); const style = [...document.querySelectorAll('.chip.active')].map(el => el.dataset.style).join('・') || '自由気まま'; const request = document.getElementById('request').value; document.getElementById('aiNote').innerHTML = `<span>✦</span><p><strong>AIが旅程を調整しました</strong><br />${style}旅に合わせ、${request ? 'ご希望を反映して' : ''}各スポットの滞在時間と移動を最適化しました。</p>`; toast('AIが旅程を調整しました'); });
document.getElementById('recenter').addEventListener('click', () => map.fitBounds(line.getBounds(), { padding: [35, 35] }));
document.getElementById('saveTrip').addEventListener('click', event => { event.currentTarget.textContent = '♥ 保存済み'; toast('この旅程を保存しました'); });
document.getElementById('addStop').addEventListener('click', () => toast('次回はAIに立ち寄り先を提案してもらえます'));
renderTimeline(); renderHotels(); initMap();
