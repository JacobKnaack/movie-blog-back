const mockDB = require('./lib/mock-db.js');

before(mockDB.start);
after(mockDB.stop);