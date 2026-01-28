const { addnominee, getnominees, updatenominee } = require("./nominee..service");

module.exports = {
  addNominee: (req, res) => {
    const { name, department } = req.body;
    const nimage = `/uploads/${req.file.filename}`;

    addnominee({ name, department, nimage }, (err, results) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    });
  },

  getNominees: (req, res) => {
    getnominees((err, results) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true, data: results });
    });
  },

  updateNominee: (req, res) => {
    const { id, name, department } = req.body;
    const nimage = req.file ? `/uploads/${req.file.filename}` : null;

    updatenominee({ id, name, department, nimage }, (err) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    });
  }
};
