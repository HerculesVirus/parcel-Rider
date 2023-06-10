const mongoose = require('mongoose');
const globalServices = require('../../services/index');

const models = require('../../model');

module.exports = {
    getFaqList: async (req, res) =>{
        try{
            let { limit, page } = req.query;

            page = page !== undefined && page !== '' ? parseInt(page) : 1
            limit = limit !== undefined && limit !== '' ? parseInt(limit) : 5
            const queryLimit = parseInt(limit);

            let total = await models.Faq.countDocuments({})

            console.log("total : ",total)

            if (page > Math.ceil(total / limit) && total > 0)
                page = Math.ceil(total / limit)

          let faqs = await models.Faq
            .find({})
            .sort({ createdAt: -1 })
            .skip(queryLimit * (page - 1))
            .limit(queryLimit);

            


            if(faqs){
                globalServices.global.returnResponse(
                    res,
                    200,
                    false,
                    'Faq list!',
                    {
                        faqs ,
                        pagination: {
                            page, limit, total,
                            pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                        }
                      }
                  );
            }
            else{
                globalServices.global.returnResponse(
                    res,
                    404,
                    true,
                    'Faq not found!',
                    {}
                  );
            }

        }
        catch(error){
            res.status(500).json(error);
        }
        

    },
}