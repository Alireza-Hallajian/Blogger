const User = require("../models/user.js");


const intialization = async function() 
{
    try 
    {
        //find Admin if exists
        const EXIST_ADMIN = await User.findOne({role: 'admin'});
        
        //if Admin exists
        if (EXIST_ADMIN) {
            return console.log('Admin already created.');
        };
        
        
        //create Admin and save to data base
        await User.create({
            firstName: 'Alireza',
            lastName: 'Hallajian',
            userName: 'Alireza.HN',
            mobile: '09190360972',
            sex: 'male',
            role: 'admin',
            password: '12345678'
        });

        
        console.log('Admin created.\n');

    } catch (err) {
        console.log('Error in intialization function: ' + err);
    };
};





module.exports = intialization;