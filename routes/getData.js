var express = require('express'),
    url = require('url'),
    fs = require('fs'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('./public/database/gridData.db'),
    file = './public/database/gridData.db',
    exists = fs.existsSync(file),
    router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    function randomIntInc(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    function randomLinkInc() {
        return 'http://' + (0 | Math.random() * 9e6).toString(36) + '.com';
    }

    function randomFloatInc(low, high) {
        return Math.random() * (high - low + 1) + low;
    }

    db.serialize(function () {
        if (!exists) {
            db.run("CREATE TABLE grid_data(negativeNumbers INTEGER,links VARCHAR(50),floatNumbers FLOAT,integerNumbers INTEGER,booleanNumbers INTEGER)");
            var stmt = db.prepare("INSERT INTO grid_data (negativeNumbers,links, floatNumbers, integerNumbers, booleanNumbers) VALUES (?, ?, ?, ?, ?)");
            for (var i = 0; i < 100000; i++) {
                stmt.run(randomIntInc(-1000, 1000), randomLinkInc(), randomFloatInc(3, 10), randomIntInc(1, 1000), randomIntInc(0, 1))
            }
            stmt.finalize();
        }
        var queryData = url.parse(req.url, true).query,
            sord = queryData.sord,
            sidx = queryData.sidx,
            startRow = (JSON.parse(queryData.page) * 20) - 19,
            sqliteSelect = 'SELECT * FROM grid_data ORDER BY ' + sidx + ' ' + sord + ' LIMIT' + ' ' + startRow + ',20;';

        db.all(sqliteSelect, function (err, row) {
            if (err !== null) {
                next(err);
                console.log(err);
            }
            else {
                db.all("SELECT * FROM grid_data;", function (err, gridData) {
                    var queryData = url.parse(req.url, true).query,
                        dataLenght = gridData.length;
                    res.send(JSON.stringify({
                        rows: row,
                        records: dataLenght,
                        page: JSON.parse(queryData.page),
                        total: dataLenght / 20
                    }));
                });
            }
        });
    });
});
module.exports = router;
