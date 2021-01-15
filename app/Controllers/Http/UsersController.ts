import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'

export default class UsersController {

    public async index() {
        return await User.all()
    }

    public async store ({ request }: HttpContextContract) {
        const data = request.only(['email', 'password'])
        const user = {
            email: data.email,
            password: data.password
        }
        const userRetorno =  await User.create(user)
        Logger.info('Usuario criado com sucesso: ' + user.email)
        return userRetorno.toJSON()
    }


    public async update ({ params, request, response }: HttpContextContract) {
        const data = request.only(['email', 'password'])
        const userBd = await User.find(params.id)

        if (userBd) {
            userBd.email = data.email
            userBd.password = data.password
            const userRetorno =  await userBd.save()
            Logger.info('Usuario alterado com sucesso: ' + userBd.email)
            return userRetorno
        } else {
            Logger.info('Não foi encontrado usuario com id: ' + params.id)
            return response.status(404).send({message: 'Nenhum registro localizado'})
        }
        
    }

    public async show ({ params }: HttpContextContract) {
        return await User.find(params.id)
    }
    
    public async destroy ({ params }: HttpContextContract) {
        const user = await User.find(params.id)
        user?.delete()
        Logger.info('Usuario com id : ' + params.id + ', removido com sucesso.')
    }
}
