const db = require("../../config/db");
const { get } = require("./vote.route");

module.exports = {
  addVote: (req, res) => {
    const { nominee_id, email, device_id } = req.body;

    if (!nominee_id || !email || !device_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check voting status
    db.query(
      "SELECT active FROM voting_status WHERE id=1",
      (err, statusRes) => {
        if (err) return res.status(500).json({ success: false });

        if (!statusRes[0].active) {
          return res.status(403).json({
            success: false,
            message: "Voting is closed!",
          });
        }

        // Check email/device voting
        db.query(
          "SELECT * FROM votes WHERE email=? OR device_id=?",
          [email, device_id],
          (err, existing) => {
            if (err) return res.status(500).json({ success: false });

            if (existing.length > 0) {
              return res.status(400).json({
                success: false,
                message: "You have already voted!",
              });
            }

            // Insert vote
            db.query(
              "INSERT INTO votes (nominee_id, email, device_id) VALUES (?, ?, ?)",
              [nominee_id, email, device_id],
              (err) => {
                if (err) return res.status(500).json({ success: false });

                // 🔥 Emit real-time vote update
                global.io.emit("voteUpdate");

                res.json({
                  success: true,
                  message: "Vote recorded successfully!",
                });
              }
            );
          }
        );
      }
    );
  },
  getVotes: (req, res) => {
    const sql = `
      SELECT nominee_id, COUNT(*) AS totalVotes 
      FROM votes 
      GROUP BY nominee_id
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true, data: results });
    });
  },
  getStatus: (req, res) => {
    db.query("SELECT active FROM voting_status WHERE id=1", (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ success: false });}
      res.json({ success: true, active: result[0].active });
    });
  },
  toggleStatus: (req, res) => {
    console.log("request is coming");
    const { active } = req.body;
    db.query(
      "UPDATE voting_status SET active=? WHERE id=1",
      [active],
      (err) => {
        if (err) return res.status(500).json({ success: false });

        // 🔥 Emit voting status change to all clients
        global.io.emit("votingStatusChanged", { active });

        res.json({ success: true, active });
      }
    );
  },
  getVoteByDeviceId: (req, res) => {
    const { deviceId } = req.params;
    db.query(
      "SELECT * FROM votes WHERE device_id=?",
      [deviceId],
      (err, results) => {
        if (err) return res.status(500).json({ success: false });
        console.log("voted");
        return res.json({ success: true, hasVoted: results.length > 0 });

      }
    );
  },
};
