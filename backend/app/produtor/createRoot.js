const Model = require('./model');
const config = require('../../config');
const mongoose = require('mongoose');
const to = require('../../core/to');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

(async function start(){
    console.log('cadastrar primeiro user');

    let rootExists = await Model.findOne({login: 'fundacao'});
    if( rootExists) {
        console.log('user root ja existe');
    } else {
        var model = new Model({
            login: 'fundacao',
            password: '123',
            cpfcnpj: '07109372960', 
            saldo: 100000, // posteriormente buscaria do banco essa informação
            name: 'Thiago',
            email: 'fundacao@teste.com',
        });

        const [err, data] = await to(model.save());
        console.log(err);
        if (!err && data) {
            console.log('user root cadastrado ')
        } else {
            console.log('ocorreu um erro ao cadastrar o root');
        }
    }
})();