const AccountService = require('../services/account.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

exports.create =  async (req, res, next) => {
    try {
        const accountService = new AccountService(MongoDB.client);
        const emailUser = await accountService.findByEmail(req.body.email);
        if(emailUser){
            return next(new ApiError(404, "Email đã tồn tại"));
        } else {
            const document = await accountService.create(req.body);
            return res.send(document);
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

exports.login = async (req, res, next) => {
        try {
            const {email, password} = req.body
            const accountService = new AccountService(MongoDB.client);
            const document = await accountService.findByEmail(email);
          
            if (!document) {
                return next(new ApiError(404, "Email không hợp lệ"));
            }          
            if(document.password.localeCompare(password) == 0) {
                return res.send(document);
            } 
            return next(new ApiError(404, "Password không trùng khớp"));
        }
        catch(error){
            return next(
                new ApiError(
                    500,
                    `Error retrieving contact with id=${req.params.id}`
                )
            );
        }
}



