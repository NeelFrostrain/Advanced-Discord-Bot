let currentGuild = null;

// Load user guilds
async function loadGuilds() {
  try {
    const response = await fetch('/api/guilds');
    const guilds = await response.json();

    const container = document.getElementById('guilds-list');
    
    if (guilds.length === 0) {
      container.innerHTML = '<p>No servers found where you have manage permissions.</p>';
      return;
    }

    container.innerHTML = guilds.map(guild => `
      <div class="guild-card" onclick="selectGuild('${guild.id}', '${guild.name}')">
        <h3>${guild.name}</h3>
        <p>Click to view details</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load guilds:', error);
  }
}

// Select a guild
async function selectGuild(guildId, guildName) {
  currentGuild = guildId;
  document.getElementById('guild-details').style.display = 'block';
  
  await loadStats(guildId);
  await showLeaderboard('levels');
}

// Load guild stats
async function loadStats(guildId) {
  try {
    const response = await fetch(`/api/stats/${guildId}`);
    const stats = await response.json();

    const container = document.getElementById('stats');
    container.innerHTML = `
      <div class="stat-card">
        <h3>${stats.users}</h3>
        <p>Active Users</p>
      </div>
      <div class="stat-card">
        <h3>${stats.totalCoins.toLocaleString()}</h3>
        <p>Total Coins</p>
      </div>
      <div class="stat-card">
        <h3>${stats.totalXP.toLocaleString()}</h3>
        <p>Total XP</p>
      </div>
      <div class="stat-card">
        <h3>${stats.avgLevel}</h3>
        <p>Average Level</p>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Show leaderboard
async function showLeaderboard(type) {
  if (!currentGuild) return;

  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  try {
    const response = await fetch(`/api/leaderboard/${currentGuild}/${type}`);
    const leaderboard = await response.json();

    const container = document.getElementById('leaderboard');
    
    if (leaderboard.length === 0) {
      container.innerHTML = '<p>No data available yet.</p>';
      return;
    }

    container.innerHTML = leaderboard.map((user, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      const value = type === 'levels' 
        ? `Level ${user.level} (${user.xp.toLocaleString()} XP)`
        : `${user.balance.toLocaleString()} coins`;

      return `
        <div class="leaderboard-item">
          <span>${medal} User ${user.id}</span>
          <span>${value}</span>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
  }
}

// Load guilds on page load
if (document.getElementById('guilds-list')) {
  loadGuilds();
}
