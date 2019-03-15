import Sequelize from 'sequelize'
import Presentation from '../models/presentations'

const connectToDb = () => {
    const sequelize = new Sequelize(global.globalConfig.database, global.globalConfig.mysql_user, global.globalConfig.mysql_password, {
        host: 'localhost',
        dialect: 'mysql'
    })

    return Presentation(sequelize, Sequelize)
}


const getAll = async (req, res) => {
    try {
        const presentation = connectToDb()
        const result = await presentation.findAll()
        res.send(result)

    } catch (e) {
        console.log(e)
        res.status(500).send({
            error: 'unexpected error'
        })
    }
}


const getOne = async (req, res) => {
    try {
        const presentation = connectToDb()
        const result = await presentation.findById(req.params.id)
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send({
            error: 'unexpected error'
        })
    }
}


const update = async (req, res) => {
    try {
        const presentation = connectToDb()
        const oldPresentation = await presentation.findById(req.params.id)
        const updatedPresentation = Object.assign(oldPresentation, req.body)
        const cleanedUpPresentation = {
            id: req.params.id,
            name: updatedPresentation.name,
            speaker: updatedPresentation.speaker,
            duration: updatedPresentation.duration,
            start: updatedPresentation.start
        }

        await presentation.update({cleanedUpPresentation}, {where: {id: cleanedUpPresentation.id}})

        res.status(200).send(cleanedUpPresentation)

    } catch (e) {
        console.log(e)
        res.status(500).send({
            error: 'unexpected error'
        })
    }
}


const create = async (req, res) => {
    try {
        const presentation = connectToDb()
        let newPresentation = req.body
        let result;

        result = await presentation.create({
            name: newPresentation.name,
            speaker: newPresentation.speaker,
            duration: newPresentation.duration,
            start: newPresentation.start
        })

        return res.status(201).send(result)
        
    } catch (e) {
        console.log(e)
        res.status(500).send({
            error: 'unexpected error'
        })
    }
}


const deletePresentation = async (req, res) => {
    try {
        const presentation = connectToDb()
        const result = await presentation.findById(req.params.id)
        if(!result){
            return res.status(404).send({error: 'presentation with id ' + req.params.id + ' does not exist'});
        }
        
        const rest = await presentation.destroy({where: {id: req.params.id}, truncate: { cascade: true }})
        console.log(rest)
    } catch (e) {
        console.log(e)
        res.status(500).send({
            error: 'unexpected error'
        })
    }

}

export default {
    getAll,
    getOne,
    update,
    create,
    deletePresentation
}