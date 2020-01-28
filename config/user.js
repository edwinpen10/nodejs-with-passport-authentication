const User = require('../models/User');

class getAllDoctor {
    constructor(req) {
        this.query = req.query;
    }

    async getAll() {
        
        try {
            let query = await User.find({});

            return query;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = getAllDoctor;
