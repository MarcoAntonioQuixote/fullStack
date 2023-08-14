const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const port = 8000;
const app = express();

const sequelize = new Sequelize('dbtestname','postgres','postgres', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
})

const defaultModelInfo = {
    timestamps: false,
    default: { allowNull: false }
}

const Player = sequelize.define('player', {
    name: DataTypes.STRING(100),
    level: DataTypes.INTEGER
}, defaultModelInfo)

const Animal = sequelize.define('animal', {
    species: DataTypes.STRING(100),
    name: DataTypes.STRING(100),
    picture: DataTypes.STRING(255),
}, defaultModelInfo)

let aObj = {foreignKey: {name: 'pID', allowNull: false}}

Player.hasMany(Animal, aObj);
Animal.belongsTo(Player, aObj);

const makePlayer = async () => {
    let firstPlayer = {
        name: 'Mark Anthony',
        level: 100
    }

    let secondPlayer = {
        name: 'Second place',
        level: 50
    }

    let res = await Player.bulkCreate(firstPlayer,secondPlayer);
    console.log(res);
}

const makeAnimal = async () => {
    let first = {
        species: 'Tiger',
        name: 'Kitty',
        picture: 'Some URL',
        pID: 1
    }
    let second = {
        species: 'Bear',
        name: 'Barry',
        picture: 'Unique URL',
        pID: 2
    }
    let third = {
        species: 'Lion',
        name: 'King',
        picture: 'Disney IP',
        pID: 1
    }

    let animals = [first,second,third];

    try {
        let res = await Animal.bulkCreate(animals);
        console.log(res);
    } catch (error) {
        console.log(`Did not make animal`, error)
    }
}

const getUsersAnimals = async (player) => {
    let team = await player.getAnimals();
    return team;
}

const getUser = async (id) => {
    let user = await Player.findByPk(id, {include: Animal});
    return user;
}

// sequelize.sync({alter: true});

// makePlayer();

// makeAnimal();

// getAnimal();

// getUser();



app.use(cors());
app.use(express.json());

app.post('/players', async (req,res) => {
    let {id} = req.body
    console.log(`Searching for user with ID: ${id}`);
    let u = await getUser(id);
    res.json(u);
    // let team = await getUsersAnimals(u);
    // res.json({user: u, animals: team});
});

app.put('/animals/:id', async (req,res) => {
    let {id} = req.params;
    let change = req.body;
    let condition = {where: {id: id}}

    const x = await Animal.update( change, condition);
    console.log(x);
    res.json(x);
})

app.listen(port, () => {
    console.log(`Listening on port`, port);
})