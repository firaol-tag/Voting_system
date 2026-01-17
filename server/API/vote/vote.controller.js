const db = require("../../config/db"); // your MySQL or other db connection

module.exports = {
  addVote: (req, res) => {
    const { nominee_id, device_id, email } = req.body;

    // Check if device has already voted
    const checkQuery = "SELECT * FROM vote WHERE device_id = ?";
    db.query(checkQuery, [device_id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "DB error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "This device has already voted" });
      }

      // Optional: check email if you want to track nominators
      let nominator_id = null;
      if (email) {
        const nominatorQuery = "SELECT id FROM nominator WHERE email = ?";
        db.query(nominatorQuery, [email], (err2, nominatorResult) => {
          if (err2) return res.status(500).json({ success: false });
          if (nominatorResult.length > 0) nominator_id = nominatorResult[0].id;
          insertVote();
        });
      } else {
        insertVote();
      }

      function insertVote() {
        const insertQuery =
          "INSERT INTO vote (nominee_id, nominator_id, device_id) VALUES (?, ?, ?)";
        db.query(insertQuery, [nominee_id, nominator_id, device_id], (err3) => {
          if (err3) {
            console.log(err3);
            return res.status(500).json({ success: false, message: "Vote failed" });
          }
          return res.json({ success: true, message: "Vote recorded!" });
        });
      }
    });
  },

  getVotes: (req, res) => {
    const query = "SELECT nominee_id, COUNT(*) as vote_count FROM vote GROUP BY nominee_id";
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "DB error" });
      }
      const votes = {};
      results.forEach((row) => {
        votes[row.nominee_id] = row.vote_count;
      });
      return res.json({ success: true, votes });
    });
  },
};
