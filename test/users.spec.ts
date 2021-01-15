import test from 'japa'
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  
  test('create user', async (assert) => {
    const user = new User()
    user.email = 'lucas@teste.com'
    user.password = 'secret'
    await user.save()
 
    assert.notEqual(user.password, 'secret')
  })

  test('show user', async (assert) => {
    const user = await User.findBy('email', 'lucas@teste.com')
    assert.notEqual(user, null)
  })

  test('update user', async (assert) => {
    const userBd = await User.findBy('email', 'lucas@teste.com')
    if (userBd) {
        userBd.email = "lucas2@teste.com"
        const userRetorno =  await userBd.save()
        assert.notEqual('lucas@teste.com', userRetorno.email)
    }
  })

  test('delete user', async (assert) => {
    const user = await User.findBy('email', 'lucas2@teste.com')
    await user?.delete()
    const userBd = await User.findBy('email', 'lucas2@teste.com')
    assert.notEqual(user, userBd)
  })

  test('home page', async (assert) => {
    /**
     * Make request
     */
    const { text } = await supertest(BASE_URL).get('/').expect(200)

    assert.exists(text)
    assert.equal(text, 'Home Page')
  })

  test('create user', async (assert) => {
    const { text } = await supertest(BASE_URL).post('/api/v1/users')
        .send({ email:'lucas3@teste.com', password:'123456'}).expect(200)
    console.log(text)
    assert.notEqual(text, null)
  })

  test('find user', async (assert) => {
    const user = await User.findBy('email', 'lucas3@teste.com')
    const { text } = await supertest(BASE_URL).get('/api/v1/users/' + user?.id).expect(200)
    assert.notEqual(text, null)
  })

  test('update user', async (assert) => {
    const user = await User.findBy('email', 'lucas3@teste.com')
    const { text } = await supertest(BASE_URL).put('/api/v1/users/' + user?.id)
        .send({email:'lucas4@teste.com', password:'123456'}).expect(200)
    const userBd = await User.findBy('email', 'lucas4@teste.com')
    assert.notEqual(userBd, null)
  })

  test('delete user', async (assert) => {
    const user = await User.findBy('email', 'lucas4@teste.com')
    const { text } = await supertest(BASE_URL).delete('/api/v1/users/' + user?.id)
        .send({email:'lucas4@teste.com', password:'123456'}).expect(200)
    const userBd = await User.findBy('email', 'lucas4@teste.com')
    assert.equal(userBd, null)
  })

})