//node_modules
const bcrypt = require('bcrypt');

const general_tools = {
    encrypt: encrypt_with_bcrypt,
    format_date
}


//******************************************************************************** */
//                              format date to standard
//******************************************************************************** */

function format_date(date) 
{
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();


    if (month.length < 2) {
        month = '0' + month;
    }
        
    if (day.length < 2) {
        day = '0' + day;
    }
        
    return [year, month, day].join('/');
}


//******************************************************************************** */
//                               Encrypt a String
//******************************************************************************** */

function encrypt_with_bcrypt(string) 
{
    let promise = new Promise(async (resolve, reject) =>
    {
        // hash the password along with salt(10)
        await bcrypt.hash(string, 10, (err, hash) => 
        {
            if (err) reject (new Error(err));

            resolve (hash);
        });
    });

    return promise;
}




module.exports = general_tools;