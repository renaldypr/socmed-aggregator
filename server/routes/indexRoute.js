const router = require('express').Router();
const { showStarredRepo, searchByName, createRepo, searchByUsername, unstarRepo, loginFB } = require('../controller/controller');

router.get('/', showStarredRepo);
router.post('/', searchByName);
router.post('/create', createRepo);
router.get('/:username', searchByUsername);
router.delete('/:username/:repo', unstarRepo);
router.post('/login', loginFB)

module.exports = router;