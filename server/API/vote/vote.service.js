const db = require('../../config/db');

module.exports = {
  ensureVotesTable: () => {
    const create = `CREATE TABLE IF NOT EXISTS votes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nominee VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      device_id VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    db.query(create, (err) => {
      if (err) console.error('Could not ensure votes table:', err);
    });
  },

  hasDeviceVoted: (deviceId, callback) => {
    const q = 'SELECT COUNT(*) AS cnt FROM votes WHERE device_id = ?';
    db.query(q, [deviceId], (err, results) => {
      if (err) return callback(err);
      const cnt = results && results[0] && results[0].cnt ? results[0].cnt : 0;
      callback(null, cnt > 0);
    });
  },

  recordVote: (data, callback) => {
    const q = 'INSERT INTO votes (nominee, email, device_id) VALUES (?, ?, ?)';
    db.query(q, [data.nominee, data.email, data.deviceId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
};
