const logos = {
    1: { color: '#e03a3e', logo: 'https://i.imgur.com/EDfF8gG.png' }, // Hawks
    2: { color: '#007a33', logo: 'https://i.imgur.com/FFN5zhd.png' }, // Celtics
    3: { color: '#1d428a', logo: 'https://i.imgur.com/kUsVxzh.png' }, // Nets
    // ... weitere Teams nach Bedarf hinzufügen
  };
  
const container = document.getElementById('games');
const dateInput = document.getElementById('datePicker');

// Initialisiere mit heutigem Datum
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

async function fetchGames(date) {
    showSpinner();
    try {
      const res = await fetch(`https://www.balldontlie.io/api/v1/games?dates[]=${date}`);
      const data = await res.json();
      container.innerHTML = '';
  
      if (data.data.length === 0) {
        container.textContent = 'Keine Spiele an diesem Tag.';
        return;
      }
  
      data.data.forEach(game => {
        const div = document.createElement('div');
        div.className = 'game';
  
        const home = game.home_team;
        const visitor = game.visitor_team;
  
        const homeInfo = logos[home.id] || {};
        const visitorInfo = logos[visitor.id] || {};
  
        div.style.borderLeft = `5px solid ${homeInfo.color || '#457b9d'}`;
  
        div.innerHTML = `
          <div class="game-header">
            <img class="logo" src="${homeInfo.logo || ''}" alt="" />
            <strong>${home.full_name}</strong>
            <span style="margin: 0 10px;">vs</span>
            <strong>${visitor.full_name}</strong>
            <img class="logo" src="${visitorInfo.logo || ''}" alt="" />
          </div>
          <div>Stand: ${game.home_team_score} - ${game.visitor_team_score}</div>
          <div class="status">Status: ${game.status}</div>
        `;
        container.appendChild(div);
      });
    } catch (err) {
      container.textContent = 'Fehler beim Laden der Daten.';
      console.error(err);
    }
  }
  

function refresh() {
  fetchGames(dateInput.value);
}

function showSpinner() {
    container.innerHTML = '<div class="spinner"></div>';
  }
  
  function hideSpinner() {
    const spinner = container.querySelector('.spinner');
    if (spinner) spinner.remove();
  }
  

// Event: Datumsauswahl
dateInput.addEventListener('change', refresh);

// Auto-Refresh alle 60 Sekunden
setInterval(refresh, 60000);

// Initialer Aufruf
refresh();
