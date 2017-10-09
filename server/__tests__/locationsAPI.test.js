const supertest = require('supertest');

const app = require('../app');
const {LocationModel} = require('../model/database');

const agent = supertest.agent(app);
const LOCATIONS_API_URL = '/locations/';

beforeEach(() => {
    return LocationModel.remove({});
});

it('GET /locations', () => {
    const params = {
        city: 'Moscow',
        country: 'Russia'
    };

    const location = new LocationModel(params);
    return location.save().then(() =>
        agent.get(LOCATIONS_API_URL)
            .expect(response => {
                expect(response.status).toBe(200);
                expect(response.body.length).toBe(1);
                expect(response.body[0]).toMatchObject(params);
                expect(response.body[0]._id).toBeFalsy();
                expect(response.body[0].__v).toBeFalsy();
                expect(response.body[0].id).toBeTruthy();
            }));
});

it('DELETE /locations', () => {
    const params = {
        city: 'Moscow',
        country: 'Russia'
    };

    const location = new LocationModel(params);
    return location.save().then((location) =>{
        return agent.del(`${LOCATIONS_API_URL}${location._id}`)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(params);
                return LocationModel.findById(location._id)
                    .then(location => {
                        expect(location).toBeFalsy()
                    })
            })
    });
});


it('PUT /locations', () => {
    const initialParams = {
        city: 'Moscow',
        country: 'Russia'
    };

    const newParams = {
        city: "St.Petersburg"
    };

    const location = new LocationModel(initialParams);
    return location.save().then((location) =>{
        return agent.put(`${LOCATIONS_API_URL}${location._id}`)
            .send(newParams)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(newParams);
                return LocationModel.findById(location._id)
                    .then(location => {
                        expect(location.city).toBe(newParams.city);
                        expect(location.country).toBe(initialParams.country);
                    })
            })
    });
});

it('POST /locations', () => {
    const params = {
        city: 'Moscow',
        country: 'Russia'
    };
    return agent.post(`${LOCATIONS_API_URL}`)
            .send(params)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(params);
                return LocationModel.findById(response.body.id)
                    .then(location => {
                        expect(location.toObject()).toMatchObject(params);
                    })
            })
});