const University = require('../models/university');
const axios = require('axios');
exports.create = async (university) => {
    const newUniversity = await University.create(university);
    return newUniversity;
}
exports.getLogo = async (req, res, next) => {
    const name = req.params.name.replace('_', ' ').replace('_', ' ').replace('_', ' ').replace('_', ' ').replace('_', ' ').replace('_', ' ').replace('_', ' ');
    console.log(name)
    const university = await University.findOne({
        name: { $regex: name, $options: 'i' },
    });
    console.log(university)
    if (university) {
        if(!university.logo||university.logo==""){
            try{
                const response = await axios.get(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${req.params.name}`,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                console.log(response.data)
                let img=response.data.originalimage.source
                university.logo=img
                await university.save()
                // Get the URL for the logo
                res.send(response.data.originalimage.source)
            }catch{
                res.send("")
            }
        }else
        res.send(university.logo);
    }
}
