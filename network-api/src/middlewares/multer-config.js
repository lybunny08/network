const multer = require('multer');

// les fichiers prisent en compte
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/x-msvideo': 'avi',
};

// generer le nom du fichier et sa destination
const storage = multer.diskStorage({
  // definition de la destination
  destination: (req, file, callback) => {
    callback(null, 'files'); // destination
  },
  // generation du nom du fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // on renplace les epaces par des '_' du nom
    const extension = MIME_TYPES[file.mimetype]; // recupération de l'extention en fonction du mime type
    callback(null, name + Date.now() + '.' + extension); // création du fichier
  }
});

module.exports = multer({storage: storage}).single('file'); // le 'file correspon au clé du formulaire du front-end